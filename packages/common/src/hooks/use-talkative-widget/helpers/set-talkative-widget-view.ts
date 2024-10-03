// Copyright 2022 Prescryptive Health, Inc.

import { getCollapsedButtonElement } from './get-collapsed-button-element';
import { getTalkativeEngageElement } from './get-talkative-engage-element';

export const setTalkativeWidgetView = (
  querySelector: string
): HTMLElement | null => {
  const talkativeEngageElement = getTalkativeEngageElement();
  if (talkativeEngageElement) {
    const widgetIcon =
      talkativeEngageElement.shadowRoot?.querySelector(querySelector);
    if (widgetIcon) {
      const button = getCollapsedButtonElement(talkativeEngageElement);
      if (button) {
        button.click();
        return button;
      }
    }
  }
  return null;
};
