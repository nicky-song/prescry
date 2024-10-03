// Copyright 2022 Prescryptive Health, Inc.

import { collapsedTalkativeWidgetView } from './collapsed-talkative-widget-view';
import { expandedTalkativeWidgetView } from './expanded-talkative-widget-view';
import { getAppIdFromShadowRoot } from './get-app-id-from-shadow-root';
import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { setAppElementStyling } from './set-app-element-styling';
import { setHtmlElementStyleDisplay } from './set-html-element-style-display';

export interface IShowTalkativeElementStyleDisplay {
  showHeader?: boolean;
  forceExpandedView?: boolean;
}

export const showTalkativeElementStyleDisplay = ({
  showHeader,
  forceExpandedView,
}: IShowTalkativeElementStyleDisplay): void => {
  const talkativeEngageElement = getTalkativeEngageElement();

  if (talkativeEngageElement) {
    switch (forceExpandedView) {
      case false:
        collapsedTalkativeWidgetView();
        break;
      default:
        expandedTalkativeWidgetView();
    }
    setHtmlElementStyleDisplay(talkativeEngageElement, 'block');
    const appElement = getAppIdFromShadowRoot(talkativeEngageElement);
    if (appElement) {
      setAppElementStyling(appElement, showHeader);
    }
  }
};
