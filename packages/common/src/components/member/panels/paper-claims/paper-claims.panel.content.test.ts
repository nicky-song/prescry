// Copyright 2022 Prescryptive Health, Inc.

import {
  IPaperClaimsPanelContent,
  paperClaimsPanelContent,
} from './paper-claims.panel.content';

describe('paperClaimPanelContent', () => {
  it('has expected content', () => {
    const expectedContent: IPaperClaimsPanelContent = {
      title: 'Mail paper claims to',
      phx: 'Prescryptive Health, Inc.',
      attention: 'Attention: Member Services',
      postalBox: 'PO Box 403',
      cityStateZip: 'Redmond, WA 98073',
    };

    expect(paperClaimsPanelContent).toEqual(expectedContent);
  });
});
