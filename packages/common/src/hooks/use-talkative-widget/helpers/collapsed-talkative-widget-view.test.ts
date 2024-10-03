// Copyright 2022 Prescryptive Health, Inc.

import { collapsedTalkativeWidgetView } from './collapsed-talkative-widget-view';
import { setTalkativeWidgetView } from './set-talkative-widget-view';

jest.mock('./set-talkative-widget-view');
const setTalkativeWidgetViewMock = setTalkativeWidgetView as jest.Mock;

describe('collapsedTalkativeWidgetView', () => {
  it('Make sure function collapsedTalkativeWidgetView calls function setTalkativeWidgetView with parameter value .fixed.font-sans.inset-0', () => {
    setTalkativeWidgetViewMock.mockImplementation(() => {
      return;
    });
    collapsedTalkativeWidgetView();
    expect(setTalkativeWidgetViewMock).toHaveBeenCalledTimes(1);
    expect(setTalkativeWidgetViewMock).toHaveBeenCalledWith(
      '.fixed.font-sans.inset-0'
    );
  });
});
