// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '@phx/common/src/models/language';
import { IPatientAccountFavorite } from './patient-account-favorite';
import { IPatientAccountFeature } from './patient-account-feature';
import { IPatientAccountNotification } from './patient-account-notification';

export interface IPatientAccountUserPreferences {
  favorites?: IPatientAccountFavorite[];
  notifications?: IPatientAccountNotification[];
  features?: IPatientAccountFeature[];
  language?: LanguageCode;
}
