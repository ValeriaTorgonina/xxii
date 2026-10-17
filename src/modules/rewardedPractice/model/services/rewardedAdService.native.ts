import Constants, { ExecutionEnvironment } from 'expo-constants';
import { AppState } from 'react-native';

const LOAD_TIMEOUT_MS = 30_000;
let busy = false;
let initialization: Promise<unknown> | undefined;

// This integration is deliberately test-only. Live ads need an AdMob account and
// a configured UMP consent flow before initialization. Release builds cannot load ads.
export const rewardedAdService = {
  available: __DEV__ && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient,
  async show(signal: AbortSignal, onShowing: () => void): Promise<boolean> {
    if (!rewardedAdService.available || busy || signal.aborted) {
      throw new Error('Rewarded ad is unavailable.');
    }
    busy = true;
    try {
      return await new Promise<boolean>((resolve, reject) => {
        let finished = false;
        let earned = false;
        const subscriptions: (() => void)[] = [];
        const finish = (error?: Error) => {
          if (finished) return;
          finished = true;
          clearTimeout(timeout);
          signal.removeEventListener('abort', abort);
          subscriptions.forEach(unsubscribe => unsubscribe());
          if (error) reject(error);
          else resolve(earned);
        };
        const abort = () => finish(new Error('Ad request cancelled.'));
        const timeout = setTimeout(() => finish(new Error('Ad loading timed out.')), LOAD_TIMEOUT_MS);
        signal.addEventListener('abort', abort, { once: true });
        void (async () => {
          // Dynamic import keeps Expo Go usable and initializes only after opt-in.
          const sdk = await import('react-native-google-mobile-ads');
          if (finished) return;
          initialization ??= (async () => {
            await sdk.default().setRequestConfiguration({ testDeviceIdentifiers: ['EMULATOR'] });
            return sdk.default().initialize();
          })().catch(error => { initialization = undefined; throw error; });
          await initialization;
          if (finished) return;
          const ad = sdk.RewardedAd.createForAdRequest(sdk.TestIds.REWARDED, {
            requestNonPersonalizedAdsOnly: true,
          });
          subscriptions.push(
            ad.addAdEventListener(sdk.RewardedAdEventType.LOADED, () => {
              if (finished) return;
              if (AppState.currentState !== 'active') {
                finish(new Error('The app is no longer active.'));
                return;
              }
              clearTimeout(timeout);
              onShowing();
              void ad.show().catch(error => finish(error));
            }),
            ad.addAdEventListener(sdk.RewardedAdEventType.EARNED_REWARD, () => { earned = true; }),
            ad.addAdEventListener(sdk.AdEventType.CLOSED, () => finish()),
            ad.addAdEventListener(sdk.AdEventType.ERROR, error => finish(error)),
          );
          ad.load();
        })().catch(error => finish(error));
      });
    } finally {
      busy = false;
    }
  },
};
