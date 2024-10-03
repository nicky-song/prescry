// Copyright 2021 Prescryptive Health, Inc.

import { FavoritingAction } from '../../../../components/buttons/favorite-icon/favorite-icon.button';
import { FavoritingStatus } from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { IAddConsent } from '../../../../models/air/add-consent.response';
import { IValidateIdentity } from '../../../../models/air/validate-identity.response';
import {
  ILimitedAccount,
  IProfile,
} from '../../../../models/member-profile/member-profile-info';
import {
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '../../../../models/patient-profile/patient-profile';

export interface IMembershipState {
  account: ILimitedAccount;
  profileList: IProfile[];
  favoritingStatus: FavoritingStatus;
  favoritingAction?: FavoritingAction;
  favoritePharmacyNcpdp?: string;
  patientDependents?: IPatientDependentsResponse[];
  patientList?: IPatientProfileResponse[];
  validateIdentity?: IValidateIdentity;
  addConsent?: IAddConsent;
}

export const defaultMembershipState: IMembershipState = {
  account: { phoneNumber: '', favoritedPharmacies: [] },
  profileList: [],
  favoritingStatus: 'none',
  patientDependents: [],
  patientList: [],
  validateIdentity: {
    success: false,
    error: '',
  },
  addConsent: {
    success: false,
    error: '',
  },
};
