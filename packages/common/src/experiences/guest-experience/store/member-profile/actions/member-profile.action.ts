// Copyright 2021 Prescryptive Health, Inc.

export enum MemberProfileActionKeysEnum {
  SET_MEMBER_PROFILE = 'SET_MEMBER_PROFILE',
}

export type MemberProfileActionKeys = keyof typeof MemberProfileActionKeysEnum;

export interface IMemberProfileAction<T extends MemberProfileActionKeys, P> {
  readonly type: T;
  readonly payload: P;
}
