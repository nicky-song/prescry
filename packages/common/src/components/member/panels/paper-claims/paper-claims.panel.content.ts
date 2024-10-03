// Copyright 2022 Prescryptive Health, Inc.

export interface IPaperClaimsPanelContent {
  title: string;
  phx: string;
  attention: string;
  postalBox: string;
  cityStateZip: string;
}

export const paperClaimsPanelContent: IPaperClaimsPanelContent = {
  title: 'Mail paper claims to',
  phx: 'Prescryptive Health, Inc.',
  attention: 'Attention: Member Services',
  postalBox: 'PO Box 403',
  cityStateZip: 'Redmond, WA 98073',
};
