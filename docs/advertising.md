# Rewarded advertising prototype

## Current scope

The Practice tab offers an optional comparison of the Fool and the Magician after a completed rewarded ad. The existing catalog, card meanings and ordinary practice remain free and unchanged. The comparison stays unlocked while the catalog is mounted, including switching tabs and opening/returning from card details. Restarting the app ends this prototype entitlement.

This is **test-only**, not a production monetization rollout:

- Native development builds use Google's public sample App IDs and `TestIds.REWARDED`, with non-personalized requests. No publisher account or real inventory is used.
- Release builds hide the bonus placement and reject all ad requests. There is no runtime switch or production ad-unit ID.
- Web and Expo Go show an unavailable explanation; they never fake a watched ad or grant a reward.
- The SDK is imported and initialized only after the user chooses to watch. Native automatic measurement is delayed in app configuration.
- Only the SDK's earned-reward event grants access after dismissal. Early dismissal, load errors, cancellation and timeouts do not. Requests cannot overlap. Loading in the background does not trigger an unexpected presentation.

## Implementation

`src/modules/rewardedPractice` owns the SDK service, comparison content, hook and UI. External code uses its `public` entry. The existing catalog hook retains the bonus state across tabs. Existing artwork, buttons, theme tokens and tarot meanings are reused; the rest of the legacy app was not relocated.

`react-native-google-mobile-ads` is pinned to 16.5.0 for the existing React Native 0.81 / Expo 54 app. Current v17 requires a newer React Native baseline; do not upgrade it independently of Expo. `expo-dev-client` provides the native development build. Generated `ios/` and `android/` remain ignored by Git.

## Running

```sh
npm install
npm run ios
# or npm run android
npm run test:ads
npm run lint
npx tsc --noEmit
npx expo-doctor
```

Native dependency and plugin changes require a rebuild; Expo Go cannot load the ad SDK. The local bundle identifier `com.valeriatorgonina.xxii` is a development choice and does not register an App Store or Play Store listing.

On the installed Xcode 27, dependency resource bundles declare unsupported iOS 12 deployment targets. For local simulator builds, pass `IPHONEOS_DEPLOYMENT_TARGET=15.1` to `xcodebuild` for all targets. This avoids hand-editing generated Pods. Expo CLI also expects Simulator.app while this Xcode supplies DeviceHub; simulator installation and launch can be performed with `simctl`.

## Before real ads

The owner needs to create an AdMob account, add each platform, and provide its App ID and Rewarded ad-unit ID. These identifiers are configuration, not account passwords. Then:

1. Configure Privacy & messaging in AdMob and implement the UMP consent flow before SDK initialization or requests; provide the required privacy-options entry. A non-personalized request alone is not a substitute for consent requirements.
2. Decide whether any cross-app tracking is needed; configure ATT only for the actual tracking behavior. Complete store privacy disclosures and a privacy policy for the final SDK configuration.
3. Define durable reward rules, offline behavior, eligible audience, placement frequency and production error monitoring. This prototype unlocks one fixed exercise for the current session.
4. Replace sample IDs through explicit production configuration, register physical test devices, test consent/denial and rewards on both platforms, and only then enable production placement.
5. Complete AdMob/store readiness and app-ads.txt requirements as applicable to the publisher account. No production submission has been performed here.

## Checks

Eight deterministic service tests cover earned rewards, early dismissal, concurrent taps, failure/retry, cancellation, loading timeout, background presentation and release/Expo Go guards. They mock the native SDK and do not prove live ad delivery. Lint, TypeScript, Expo Doctor (18 checks) and the module's circular-import check passed. Web correctly displays the native-build explanation without requesting an ad.

Mobile review: new module boundaries, platform fallback, listener cleanup and async state handling checked using `mobile-review`; no outstanding high-severity findings in the prototype. The task journal does not apply on this repository's main branch. No separate security-review skill was available or claimed. Existing `widgets/`, `features/`, `shared/` and `lib/` layout remains migration debt outside this change.

### iOS verification — 2026-10-17

The native Debug build compiled successfully with the Xcode deployment-target override described above. It was installed and launched on iPhone 16 Pro / iOS 18.3.1. The actual Google test rewarded ad (marked "Test mode") loaded through the bonus button. After the SDK displayed its reward confirmation and the ad was dismissed, the comparison unlocked. "Check yourself" revealed the explanation; both images and the full text were inspected in the scrolling layout. Switching to Learn and back retained the unlocked comparison and its answer. No mocked reward or manual state injection was used for this verification.

Evidence: `output/design-qa/rewarded-ios-ad.png` and `output/design-qa/rewarded-ios-comparison.png`. Lint, TypeScript, all eight service tests and `git diff --check` were rerun successfully. Early dismissal, timeout and cancellation are covered by mocked service tests; those cases were not exercised against an actual Google ad on this simulator. Android and physical-device ad delivery remain unverified. Production consent collection and paid ad inventory are not enabled.

## Sources

- [Pinned v16 integration guide](https://github.com/invertase/react-native-google-mobile-ads/blob/v16.5.0/docs/index.mdx)
- [Pinned v16 ad formats](https://github.com/invertase/react-native-google-mobile-ads/blob/v16.5.0/docs/displaying-ads.mdx)
- [Expo 54 development client](https://docs.expo.dev/versions/v54.0.0/sdk/dev-client/)
- [Google test ads](https://developers.google.com/admob/ios/test-ads)
- [Consent guidance](https://docs.page/invertase/react-native-google-mobile-ads/european-user-consent)
