// Copyright 2022 Prescryptive Health, Inc.

export enum CmsSmsGroupKeysEnum {
  myRxApi = 'myrx-api',
}

export enum CmsApiFieldKeysEnum {
  inviteTextMessage = 'invite-text-message',
}

const cmsApiFieldKeyValues = new Map<CmsApiFieldKeysEnum, string>([
  [
    CmsApiFieldKeysEnum.inviteTextMessage,
    'Register your phone with Prescryptive™: ',
  ],
]);

export const cmsApiValueConstants = new Map<
  CmsSmsGroupKeysEnum,
  Map<CmsApiFieldKeysEnum, string>
>([[CmsSmsGroupKeysEnum.myRxApi, cmsApiFieldKeyValues]]);
