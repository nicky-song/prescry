// Copyright 2022 Prescryptive Health, Inc.

export const setAppElementStyling = (
  element: HTMLElement,
  showHeader = false
): void => {
  showHeader
    ? (element.style.marginTop = '80px')
    : (element.style.marginTop = '0px');
};
