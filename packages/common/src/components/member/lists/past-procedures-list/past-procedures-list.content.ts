// Copyright 2020 Prescryptive Health, Inc.

export interface IPastProceduresListContent {
  latestHeading: string;
  pastHeading: string;
  pastProcedureDateLabel: string;
  serviceNameLabel: string;
}

export const pastProceduresListContent: IPastProceduresListContent = {
  latestHeading: 'Latest',
  pastHeading: 'Past',
  pastProcedureDateLabel: 'Date',
  serviceNameLabel: 'Service',
};
