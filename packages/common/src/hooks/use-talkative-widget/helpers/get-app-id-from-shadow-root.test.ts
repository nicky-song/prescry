// Copyright 2022 Prescryptive Health, Inc.

import { getAppIdFromShadowRoot } from './get-app-id-from-shadow-root';

describe('getAppIdFromShadowRoot', () => {
  it('getAppIdFromShadowRoot should return an element with id app', () => {
    class CustomElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
          const outerDiv = document.createElement('div');
          outerDiv.setAttribute('id', 'main-app');
          const innerDiv = document.createElement('div');
          innerDiv.setAttribute('id', 'app');
          outerDiv.appendChild(innerDiv);
          this.shadowRoot.appendChild(outerDiv);
        }
      }
    }

    window.customElements.define('custom-element', CustomElement);
    const defaultElement = document.createElement('custom-element');
    const appElement = getAppIdFromShadowRoot(defaultElement);
    expect(appElement?.id).toEqual('app');
  });
});
