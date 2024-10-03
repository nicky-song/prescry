// Copyright 2018 Prescryptive Health, Inc.

import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { appointmentReducer } from './appointment/appointment.reducer';
import { configStateReducer } from './config/config-state-reducer';
import { editMemberProfileReducer } from './edit-member-profile/edit-member-profile-reducer';
import { featuresStateReducer } from './features/features-state.reducer';
import { feedReducer } from './feed/feed.reducer';
import { immunizationRecordReducer } from './immunization-record/immunization-record.reducer';
import { memberListInfoReducer } from './member-list-info/member-list-info-reducer';
import { memberLoginReducer } from './member-login/member-login-reducer';
import { phoneNumberLoginReducer } from './phone-number-login/phone-number-login.reducer';
import { phoneNumberVerificationReducer } from './phone-number-verification/phone-number-verification-reducer';
import { prescribedMemberReducer } from './prescribed-member/prescribed-member-reducer';
import { prescriptionsReducer } from './prescriptions/prescriptions-reducer';
import { providerLocationsReducer } from './provider-locations/provider-locations.reducer';
import { securePinReducer } from './secure-pin/secure-pin-reducer';
import { settingsReducer } from './settings/settings-reducer';
import { supportErrorScreenReducer } from './support-error/support-error.reducer';
import { telemetryReducer } from './telemetry/telemetry-reducer';
import { testResultReducer } from './test-result/test-result.reducer';
import { serviceTypeReducer } from './service-type/service-type.reducer';
import { drugInformationReducer } from './drug-information/drug-information.reducer';
import { waitlistReducer } from './waitlist/waitlist.reducer';
import { identityVerificationReducer } from './identity-verification/identity-verification.reducer';
import { memberProfileReducer } from './member-profile/member-profile-reducer';
import { loadingReducer } from './loading/loading.reducer';

export const rootReducer = combineReducers({
  // please try to keep this list in alphabetical order
  appointment: appointmentReducer,
  config: configStateReducer,
  drugInformation: drugInformationReducer,
  editMemberProfile: editMemberProfileReducer,
  features: featuresStateReducer,
  feed: feedReducer,
  identityVerification: identityVerificationReducer,
  immunizationRecord: immunizationRecordReducer,
  loading: loadingReducer,
  memberListInfo: memberListInfoReducer,
  memberLogin: memberLoginReducer,
  memberProfile: memberProfileReducer,
  phoneLogin: phoneNumberLoginReducer,
  phoneVerification: phoneNumberVerificationReducer,
  prescribedMember: prescribedMemberReducer,
  prescription: prescriptionsReducer,
  providerLocations: providerLocationsReducer,
  securePin: securePinReducer,
  serviceType: serviceTypeReducer,
  settings: settingsReducer,
  supportError: supportErrorScreenReducer,
  telemetry: telemetryReducer,
  testResult: testResultReducer,
  waitlist: waitlistReducer,
});

export type RootState = Readonly<StateType<typeof rootReducer>>;
