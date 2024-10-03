// Copyright 2022 Prescryptive Health, Inc.

import { expandedTalkativeWidgetView } from './expanded-talkative-widget-view';
import { setTalkativeWidgetView } from './set-talkative-widget-view';

jest.mock('./set-talkative-widget-view');
const setTalkativeWidgetViewMock = setTalkativeWidgetView as jest.Mock;

describe('expandedTalkativeWidgetView', () => {
  it('Make sure function expandedTalkativeWidgetView calls function setTalkativeWidgetView with parameter value .bottom-app-safe', () => {
    setTalkativeWidgetViewMock.mockImplementation(() => {
      return;
    });
    expandedTalkativeWidgetView();
    expect(setTalkativeWidgetViewMock).toHaveBeenCalledTimes(1);
    expect(setTalkativeWidgetViewMock).toHaveBeenCalledWith('.bottom-app-safe');
  });
});
