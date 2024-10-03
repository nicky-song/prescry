// Copyright 2022 Prescryptive Health, Inc.

import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { setHtmlElementStyleDisplay } from './set-html-element-style-display';

export const hideTalkativeElementStyleDisplay = (): void => {
  const talkativeEngageElement = getTalkativeEngageElement();

  if (talkativeEngageElement) {
    setHtmlElementStyleDisplay(talkativeEngageElement, 'none');
  }
};
