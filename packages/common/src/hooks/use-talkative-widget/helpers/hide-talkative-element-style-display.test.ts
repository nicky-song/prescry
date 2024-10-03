// Copyright 2022 Prescryptive Health, Inc.

import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { hideTalkativeElementStyleDisplay } from './hide-talkative-element-style-display';
import { setHtmlElementStyleDisplay } from './set-html-element-style-display';

jest.mock('./get-talkative-engage-element');
const getTalkativeEngageElementMock = getTalkativeEngageElement as jest.Mock;

jest.mock('./set-html-element-style-display');
const setHtmlElementStyleDisplayMock = setHtmlElementStyleDisplay as jest.Mock;

describe('setHtmlElementStyleDisplay', () => {
  it('Make sure function setAppElementStyling is NOT called if the talkative engage element does NOT exist', () => {
    getTalkativeEngageElementMock.mockReturnValue(null);
    hideTalkativeElementStyleDisplay();
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(setHtmlElementStyleDisplayMock).not.toHaveBeenCalled();
  });

  it('Make sure function setAppElementStyling is called with the correct parameters if the talkative engage element does exist', () => {
    const HTMLElementMock = HTMLElement;
    getTalkativeEngageElementMock.mockReturnValue(HTMLElementMock);
    hideTalkativeElementStyleDisplay();
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(setHtmlElementStyleDisplayMock).toHaveBeenCalledTimes(1);
    expect(setHtmlElementStyleDisplayMock).toHaveBeenCalledWith(
      HTMLElementMock,
      'none'
    );
  });
});
