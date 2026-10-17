// Web has no native advertising SDK. Never simulate a successful ad reward.
export const rewardedAdService = {
  available: false,
  async show(_signal: AbortSignal, _onShowing: () => void): Promise<boolean> {
    throw new Error('Rewarded ads require a native development build.');
  },
};
