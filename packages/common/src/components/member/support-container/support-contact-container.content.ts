// Copyright 2020 Prescryptive Health, Inc.

export interface ISupportContactContainerContent {
  memberPortalLinkLabel: string;
  memberPortalText: string;
  supportText: string;
  contactEmailLink: (emailAddress: string) => string;
}

export const supportContactContainerContent: ISupportContactContainerContent = {
  memberPortalLinkLabel: 'Member Portal',
  memberPortalText: 'For questions about your pharmacy benefits visit',
  supportText: 'For support contact us at',
  contactEmailLink: (emailAddress: string) => `mailto:${emailAddress}`,
};
