// Copyright 2022 Prescryptive Health, Inc.

import { TransPerfectConstants } from '../../../models/transperfect';
import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { protectTalkativeEngageElement } from './protect-talkative-engage-element';

describe('protectTalkativeEngageElement', () => {
  it('Make sure the class value is setup correctly on div tag with ID of value talkative-engage', () => {
    const htmlMock =
      '<!doctype html><html><body><div id="talkative-engage"></div></body></html>';
    document.body.innerHTML = htmlMock;
    protectTalkativeEngageElement();
    const talkativeEngageElement = getTalkativeEngageElement();
    expect(talkativeEngageElement?.getAttribute('class')).toEqual(
      TransPerfectConstants.excludeClass
    );
  });
});
