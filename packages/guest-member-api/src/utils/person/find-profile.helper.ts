// Copyright 2022 Prescryptive Health, Inc.

import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { IPerson } from '@phx/common/src/models/person';

export const findCashProfile = (
  personList: IPerson[] = []
): IPerson | undefined => findProfileOfType(personList, RxGroupTypesEnum.CASH);

export const findPbmProfile = (personList: IPerson[] = []) =>
  findProfileOfType(personList, RxGroupTypesEnum.SIE);

const findProfileOfType = (
  personList: IPerson[] = [],
  rxGroupType: RxGroupTypesEnum
): IPerson | undefined => personList.find((x) => x.rxGroupType === rxGroupType);
