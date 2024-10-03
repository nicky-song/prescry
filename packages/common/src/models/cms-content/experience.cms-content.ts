// Copyright 2022 Prescryptive Health, Inc.

export enum CMSExperienceEnum {
  MYRX = 'MyRx',
  MYRX_COBRANDING = 'MyRxCobranding',
}

export type CMSExperience =
  | CMSExperienceEnum.MYRX
  | CMSExperienceEnum.MYRX_COBRANDING;
