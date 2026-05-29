import reelsMock from "./fixture.json";
import { initReels } from "./reels.js";

export function initReelsDemo() {
  return initReels(reelsMock);
}
