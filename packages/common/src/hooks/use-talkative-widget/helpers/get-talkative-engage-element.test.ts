// Copyright 2022 Prescryptive Health, Inc.

import { getTalkativeEngageElement } from './get-talkative-engage-element';

const getElementByIdMock = jest.fn();
global.document.getElementById = getElementByIdMock;

describe('getTalkativeEngageElement', () => {
  it('getTalkativeEngageElement should return an element with id talkative-engage', () => {
    const talkativeEngageDivId = 'talkative-engage';
    const talkativeEngageDivElement = document.createElement('div');
    talkativeEngageDivElement.setAttribute('id', talkativeEngageDivId);
    getElementByIdMock.mockReturnValue(talkativeEngageDivElement);
    const talkativeEngageElement = getTalkativeEngageElement();
    expect(talkativeEngageElement?.id).toEqual(talkativeEngageDivId);
  });
});
