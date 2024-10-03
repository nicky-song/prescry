// Copyright 2020 Prescryptive Health, Inc.

import {
  ISupportContactContainerContent,
  supportContactContainerContent,
} from './support-contact-container.content';

describe('supportContactContainerContent', () => {
  it('has expected content', () => {
    const expectedContent: ISupportContactContainerContent = {
      memberPortalLinkLabel: 'Member Portal',
      memberPortalText: 'For questions about your pharmacy benefits visit',
      supportText: 'For support contact us at',
      contactEmailLink: expect.any(Function),
    };

    expect(supportContactContainerContent).toEqual(expectedContent);

    const emailAddressMock = 'email-address';
    expect(
      supportContactContainerContent.contactEmailLink(emailAddressMock)
    ).toEqual(`mailto:${emailAddressMock}`);
  });
});
