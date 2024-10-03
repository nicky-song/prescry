// Copyright 2022 Prescryptive Health, Inc.

import { getCollapsedButtonElement } from './get-collapsed-button-element';

describe('getCollapsedButtonElement', () => {
  it('getTalkativeEngageElement should return an element with id talkative-engage', () => {
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
    const buttonElement = getCollapsedButtonElement(talkativeEngageElement);
    expect(buttonElement).not.toBeNull();
  });
});
