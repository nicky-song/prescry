// Copyright 2022 Prescryptive Health, Inc.

import { getCollapsedButtonElement } from './get-collapsed-button-element';
import { getTalkativeEngageElement } from './get-talkative-engage-element';
import { setTalkativeWidgetView } from './set-talkative-widget-view';

const querySelectorMock = jest.fn();
global.document.querySelector = querySelectorMock;

jest.mock('./get-talkative-engage-element');
const getTalkativeEngageElementMock = getTalkativeEngageElement as jest.Mock;

jest.mock('./get-collapsed-button-element');
const getCollapsedButtonElementMock = getCollapsedButtonElement as jest.Mock;

describe('setTalkativeWidgetView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Button element is null when function getTalkativeEngageElement does NOT return an element', () => {
    getTalkativeEngageElementMock.mockReturnValue(null);
    const buttonElement = setTalkativeWidgetView('.query-selector-mock');
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(getCollapsedButtonElementMock).not.toHaveBeenCalled();
    expect(buttonElement).toBeNull();
  });

  it('Button element is null when the 1st querySelector function does NOT return the widgetIcon element', () => {
    const parentShadowRootHTML =
      '<!doctype html><html><body><div id="talkative-engage"></div></body></html>';
    const childShadowRootHTML =
      '<div id="app"><div class="fixed"><div><button></button></div></div></div>';

    document.body.innerHTML = parentShadowRootHTML;
    let talkativeEngageElement = document.getElementById('talkative-engage');
    const shadowRoot = talkativeEngageElement?.attachShadow({ mode: 'open' });
    if (shadowRoot) {
      shadowRoot.innerHTML = childShadowRootHTML;
    }
    talkativeEngageElement = document.getElementById('talkative-engage');

    getTalkativeEngageElementMock.mockReturnValue(talkativeEngageElement);
    const buttonElement = setTalkativeWidgetView('.class-value-mock');
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(getCollapsedButtonElementMock).not.toHaveBeenCalled();
    expect(buttonElement).toBeNull();
  });

  it('Button element is null when getCollapsedButtonElement function does NOT return the button element', () => {
    const parentShadowRootHTML =
      '<!doctype html><html><body><div id="talkative-engage"></div></body></html>';
    const childShadowRootHTML = '<div class="class-value-mock"></div>';

    document.body.innerHTML = parentShadowRootHTML;
    let talkativeEngageElement = document.getElementById('talkative-engage');
    const shadowRoot = talkativeEngageElement?.attachShadow({ mode: 'open' });
    if (shadowRoot) {
      shadowRoot.innerHTML = childShadowRootHTML;
    }
    talkativeEngageElement = document.getElementById('talkative-engage');

    getTalkativeEngageElementMock.mockReturnValue(talkativeEngageElement);
    const buttonElement = setTalkativeWidgetView('.class-value-mock');
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(getCollapsedButtonElementMock).toHaveBeenCalledTimes(1);
    expect(getCollapsedButtonElementMock).toHaveBeenNthCalledWith(
      1,
      expect.any(HTMLElement)
    );
    expect(buttonElement).toBeNull();
  });

  it('Button element is NOT null when the button element is clicked and the other necessary elements are defined', () => {
    const parentShadowRootHTML =
      '<!doctype html><html><body><div id="talkative-engage"></div></body></html>';
    const childShadowRootHTML =
      '<div class="class-value-mock"></div><div id="app"><div class="fixed"><div><button></button></div></div></div>';

    document.body.innerHTML = parentShadowRootHTML;
    let talkativeEngageElement = document.getElementById('talkative-engage');
    const shadowRoot = talkativeEngageElement?.attachShadow({ mode: 'open' });
    if (shadowRoot) {
      shadowRoot.innerHTML = childShadowRootHTML;
    }
    talkativeEngageElement = document.getElementById('talkative-engage');

    getTalkativeEngageElementMock.mockReturnValue(talkativeEngageElement);
    const mockButtonElement = document.createElement('button');
    getCollapsedButtonElementMock.mockReturnValue(mockButtonElement);
    const buttonElement = setTalkativeWidgetView('.class-value-mock');
    expect(getTalkativeEngageElementMock).toHaveBeenCalled();
    expect(getCollapsedButtonElementMock).toHaveBeenCalledTimes(1);
    expect(getCollapsedButtonElementMock).toHaveBeenNthCalledWith(
      1,
      talkativeEngageElement
    );
    expect(buttonElement).not.toBeNull();
  });
});
