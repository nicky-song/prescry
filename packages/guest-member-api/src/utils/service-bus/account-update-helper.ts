// Copyright 2018 Prescryptive Health, Inc.

import { LanguageCode } from '@phx/common/src/models/language';
import { ACTION_UPDATE_ACCOUNT } from '../../constants/service-bus-actions';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../models/terms-and-conditions-acceptance-info';
import { senderForUpdateAccount } from './service-bus-helper';

export interface IAccountUpdate {
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  accountKey?: string;
  pinHash?: string;
  recoveryEmail?: string;
  termsAndConditionsAcceptances?: ITermsAndConditionsWithAuthTokenAcceptance;
  favoritedPharmacies?: string[];
  isFavoritedPharmaciesFeatureKnown?: boolean;
  masterId?: string;
  accountId?: string;
  languageCode?: LanguageCode;
  recentlyUpdated?: boolean;
}

export const publishAccountUpdateMessage = async (data: IAccountUpdate) => {
  await senderForUpdateAccount.send({
    body: {
      action: ACTION_UPDATE_ACCOUNT,
      data,
    },
  });
};
