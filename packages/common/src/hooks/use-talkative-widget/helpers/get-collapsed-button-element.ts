// Copyright 2022 Prescryptive Health, Inc.

export const getCollapsedButtonElement = (
  talkativeEngageElement: HTMLElement | null | undefined
): HTMLElement | null | undefined => {
  return talkativeEngageElement?.shadowRoot?.querySelector(
    '#app > div.fixed > div > button'
  );
};
