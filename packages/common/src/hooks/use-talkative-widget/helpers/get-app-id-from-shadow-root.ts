// Copyright 2022 Prescryptive Health, Inc.

export const getAppIdFromShadowRoot = (
  talkativeEngageElement: HTMLElement
): HTMLElement | null | undefined => {
  return talkativeEngageElement.shadowRoot?.getElementById('app');
};
