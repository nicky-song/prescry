// Copyright 2022 Prescryptive Health, Inc.

import { TransPerfectConstants } from '../../../models/transperfect';
import { getTalkativeEngageElement } from './get-talkative-engage-element';

export const protectTalkativeEngageElement = (): HTMLElement | null => {
  const talkativeEngageElement = getTalkativeEngageElement();
  if (talkativeEngageElement) {
    talkativeEngageElement.classList.add(TransPerfectConstants.excludeClass);
  }
  return null;
};
