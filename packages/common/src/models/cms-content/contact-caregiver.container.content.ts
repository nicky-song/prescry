// Copyright 2022 Prescryptive Health, Inc.

export interface IContactCaregiverContainerContent {
  title: string;
  titleDescription: string;
  subTitle: string;
  subItems: IContactCaregiverSubItems[];
  helpLinkTitle: string;
  helpLinkText: string;
  helpLinkInfo: string;
  providedBy: string;
}

export interface IContactCaregiverSubItems {
  id: string;
  title?: string;
  info: string;
}
