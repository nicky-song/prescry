// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { RxGroupTypes } from '@phx/common/src/models/member-profile/member-profile-info';
import {
  getFirstValueByFeatureSwitch,
  rxGroupTypeFeatureMap,
} from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { IPerson } from '@phx/common/src/models/person';

export const featureSwitchOverrideRxGroupType = (
  response: Response,
  memberList?: IPerson[]
): RxGroupTypes | undefined => {
  const isTestMembership = memberList?.find((p) => p.isTestMembership) || false;
  if (isTestMembership) {
    const rxGroupType = getFirstValueByFeatureSwitch<RxGroupTypes>(
      response.locals.features,
      rxGroupTypeFeatureMap
    );
    if (rxGroupType) {
      return rxGroupType;
    }
  }
  return undefined;
};
