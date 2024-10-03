// Copyright 2022 Prescryptive Health, Inc.

import { setHtmlElementStyleDisplay } from './set-html-element-style-display';
import { showTalkativeElementStyleDisplay } from './show-talkative-element-style-display';
import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { collapsedTalkativeWidgetView } from './collapsed-talkative-widget-view';
import { expandedTalkativeWidgetView } from './expanded-talkative-widget-view';
import { getAppIdFromShadowRoot } from './get-app-id-from-shadow-root';
import { setAppElementStyling } from './set-app-element-styling';

jest.mock('./get-talkative-engage-element');
const getTalkativeEngageElementMock = getTalkativeEngageElement as jest.Mock;

jest.mock('./expanded-talkative-widget-view');
const expandedTalkativeWidgetViewMock =
  expandedTalkativeWidgetView as jest.Mock;

jest.mock('./collapsed-talkative-widget-view');
const collapsedTalkativeWidgetViewMock =
  collapsedTalkativeWidgetView as jest.Mock;

jest.mock('./get-app-id-from-shadow-root');
const getAppIdFromShadowRootMock = getAppIdFromShadowRoot as jest.Mock;

jest.mock('./set-app-element-styling');
const setAppElementStylingMock = setAppElementStyling as jest.Mock;

jest.mock('./set-html-element-style-display');
const setHtmlElementStyleDisplayMock = setHtmlElementStyleDisplay as jest.Mock;

describe('showTalkativeElementStyleDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    [false, true],
    [true, true],
    [false, false],
    [true, false],
  ])(
    `Make sure the correct functions are called when function getTalkativeEngageElement does NOT return an element (showHeader: %p; forceExpandedView: %p)`,
    (showHeader: boolean, forceExpandedView: boolean) => {
      getTalkativeEngageElementMock.mockReturnValue(null);
      showTalkativeElementStyleDisplay({ showHeader, forceExpandedView });
      expect(getTalkativeEngageElementMock).toHaveBeenCalled();
      expect(collapsedTalkativeWidgetViewMock).not.toHaveBeenCalled();
      expect(expandedTalkativeWidgetViewMock).not.toHaveBeenCalled();
      expect(setHtmlElementStyleDisplayMock).not.toHaveBeenCalled();
      expect(getAppIdFromShadowRootMock).not.toHaveBeenCalled();
      expect(setAppElementStylingMock).not.toHaveBeenCalled();
    }
  );

  it('Make sure function setAppElementStyling does not get called when the app id element does not exist', () => {
    getTalkativeEngageElementMock.mockReturnValue(HTMLElement);
    getAppIdFromShadowRootMock.mockReturnValue(null);
    showTalkativeElementStyleDisplay({});
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(getAppIdFromShadowRootMock).toHaveBeenCalled();
    expect(setAppElementStylingMock).not.toHaveBeenCalled();
  });

  it.each([[true], [false]])(
    `Make sure the correct functions are called when function getTalkativeEngageElement does return an element (forceExpandedView: %p)`,
    (forceExpandedView: boolean) => {
      getTalkativeEngageElementMock.mockReturnValue(HTMLElement);
      getAppIdFromShadowRootMock.mockReturnValue(HTMLElement);
      showTalkativeElementStyleDisplay({ forceExpandedView });
      expect(getTalkativeEngageElementMock).toHaveBeenCalled();
      if (!forceExpandedView) {
        expect(collapsedTalkativeWidgetViewMock).toHaveBeenCalled();
        expect(expandedTalkativeWidgetViewMock).not.toHaveBeenCalled();
      } else {
        expect(collapsedTalkativeWidgetViewMock).not.toHaveBeenCalled();
        expect(expandedTalkativeWidgetViewMock).toHaveBeenCalled();
      }
      expect(setHtmlElementStyleDisplayMock).toHaveBeenCalled();
      expect(getAppIdFromShadowRootMock).toHaveBeenCalled();
      expect(setAppElementStylingMock).toHaveBeenCalled();
    }
  );
});
