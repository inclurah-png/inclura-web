import {
  defaultAccessibility,
} from "./accessibilitySettings";

class AccessibilityEngine {

  constructor() {
    this.settings =
      defaultAccessibility;
  }

  load(settings) {
    this.settings = {
      ...this.settings,
      ...settings,
    };
  }

  getSettings() {
    return this.settings;
  }

  enable(feature) {
    this.settings[feature] = true;
  }

  disable(feature) {
    this.settings[feature] = false;
  }

}

const accessibility =
  new AccessibilityEngine();

export default accessibility;
