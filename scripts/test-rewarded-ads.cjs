const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/modules/rewardedPractice/model/services/rewardedAdService.native.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;

function harness({ development = true, environment = 'standalone', appState = 'active' } = {}) {
  const listeners = new Map();
  let shows = 0;
  let loads = 0;
  let timeout;
  const ad = {
    addAdEventListener(event, listener) { listeners.set(event, listener); return () => listeners.delete(event); },
    load() { loads++; },
    show() { shows++; return Promise.resolve(); },
  };
  const sdk = {
    __esModule: true,
    default: () => ({ setRequestConfiguration: async () => {}, initialize: async () => {} }),
    TestIds: { REWARDED: 'official-test-id' },
    RewardedAd: { createForAdRequest(id, options) { assert.equal(id, 'official-test-id'); assert.equal(options.requestNonPersonalizedAdsOnly, true); return ad; } },
    RewardedAdEventType: { LOADED: 'loaded', EARNED_REWARD: 'earned' },
    AdEventType: { CLOSED: 'closed', ERROR: 'error' },
  };
  const context = {
    exports: {}, __DEV__: development,
    setTimeout: callback => { timeout = callback; return 1; }, clearTimeout: () => { timeout = undefined; },
    require(name) {
      if (name === 'react-native') return { AppState: { currentState: appState } };
      if (name === 'expo-constants') return { __esModule: true, default: { executionEnvironment: environment }, ExecutionEnvironment: { StoreClient: 'storeClient' } };
      if (name === 'react-native-google-mobile-ads') return sdk;
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(code, context);
  return {
    service: context.exports.rewardedAdService,
    emit: (event, value) => listeners.get(event)?.(value),
    tick: () => new Promise(resolve => setImmediate(resolve)),
    expire: () => timeout?.(),
    get shows() { return shows; }, get loads() { return loads; }, get listeners() { return listeners.size; },
  };
}

test('only an earned reward unlocks the comparison after dismissal', async () => {
  const h = harness();
  const result = h.service.show(new AbortController().signal, () => {});
  await h.tick(); h.emit('loaded'); h.emit('earned'); h.emit('closed');
  assert.equal(await result, true); assert.equal(h.shows, 1); assert.equal(h.listeners, 0);
});
test('early dismissal does not grant a reward', async () => {
  const h = harness();
  const result = h.service.show(new AbortController().signal, () => {});
  await h.tick(); h.emit('loaded'); h.emit('closed');
  assert.equal(await result, false);
});
test('concurrent taps load only one ad', async () => {
  const h = harness();
  const result = h.service.show(new AbortController().signal, () => {});
  await assert.rejects(h.service.show(new AbortController().signal, () => {}), /unavailable/);
  await h.tick(); h.emit('closed'); await result;
  assert.equal(h.loads, 1);
});
test('failure cleans up and permits retry', async () => {
  const h = harness();
  const result = h.service.show(new AbortController().signal, () => {});
  const rejection = assert.rejects(result, /no fill/);
  await h.tick(); h.emit('error', new Error('no fill')); await rejection;
  assert.equal(h.listeners, 0);
  const retry = h.service.show(new AbortController().signal, () => {});
  await h.tick(); h.emit('loaded'); h.emit('earned'); h.emit('closed');
  assert.equal(await retry, true);
});
test('cancellation prevents late loading and presentation', async () => {
  const h = harness(); const controller = new AbortController();
  const result = h.service.show(controller.signal, () => {});
  const rejection = assert.rejects(result, /cancelled/);
  controller.abort(); await rejection; await h.tick(); h.emit('loaded');
  assert.equal(h.shows, 0); assert.equal(h.listeners, 0);
});
test('loading timeout rejects and removes listeners', async () => {
  const h = harness();
  const result = h.service.show(new AbortController().signal, () => {});
  const rejection = assert.rejects(result, /timed out/);
  await h.tick(); h.expire(); await rejection;
  assert.equal(h.listeners, 0);
});
test('an ad that loads in the background is not presented', async () => {
  const h = harness({ appState: 'background' });
  const result = h.service.show(new AbortController().signal, () => {});
  const rejection = assert.rejects(result, /no longer active/);
  await h.tick(); h.emit('loaded'); await rejection; assert.equal(h.shows, 0);
});
test('Expo Go and release builds cannot request ads', async () => {
  for (const options of [{ development: false }, { environment: 'storeClient' }]) {
    const h = harness(options); assert.equal(h.service.available, false);
    await assert.rejects(h.service.show(new AbortController().signal, () => {}), /unavailable/);
    assert.equal(h.loads, 0);
  }
});
