// Copyright 2022 Prescryptive Health, Inc.

import { IFaxPanelContent, faxPanelContent } from './fax.panel.content';

describe('faxPanelContent', () => {
  it('has expected content', () => {
    const expectedContent: IFaxPanelContent = {
      label: 'Fax',
      faxNumber: '855-708-4808',
    };

    expect(faxPanelContent).toEqual(expectedContent);
  });
});
