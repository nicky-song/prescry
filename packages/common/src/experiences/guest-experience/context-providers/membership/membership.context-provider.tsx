// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useEffect, useReducer } from 'react';
import { IMemberInfoResponseData } from '../../../../models/api-response/member-info-response';
import { setMembershipDispatch } from '../../state/membership/dispatch/set-membership.dispatch';
import {
  membershipReducer,
  MembershipReducer,
} from '../../state/membership/membership.reducer';
import { defaultMembershipState } from '../../state/membership/membership.state';
import { setMemberProfileDispatch } from '../../store/member-profile/dispatch/set-member-profile.dispatch';
import {
  defaultMemberProfileState,
  IMemberProfileState,
} from '../../store/member-profile/member-profile-reducer';
import { useReduxContext } from '../redux/use-redux-context.hook';
import { MembershipContext } from './membership.context';
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';
import { LDUser } from 'launchdarkly-js-client-sdk';
import { getHighestPriorityProfile } from '../../../../utils/profile.helper';
import { ILaunchDarklyCustomUserAttributes } from '../../../../models/launch-darkly/launch-darkly-custom-user-attributes';
import { IPrimaryProfile } from '../../../../models/member-profile/member-profile-info';
import {
  defaultLanguageCode,
  LanguageCodeMap,
} from '../../../../models/language';
import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';
import { useSessionContext } from '../session/use-session-context.hook';
import { languageCodeAsyncAction } from '../../store/language-code/async-actions/language-code.async-action';
import { updateURLWithFeatureFlagsAndLanguage } from '../../store/navigation/update-url-with-feature-flags-and-language';
import { setCurrentLanguageDispatch } from '../../state/session/dispatch/set-current-language.dispatch';
import { getContentLanguage } from '../../../../utils/translation/get-content-language.helper';
import { AutomationNameSuffix } from '../../../../models/automation-name-suffix-constants';

export type IMembershipContextProviderProps = {
  memberProfileState?: IMemberProfileState;
};

export const MembershipContextProvider: FunctionComponent<IMembershipContextProviderProps> =
  ({ children, memberProfileState }) => {
    const [state, dispatch] = useReducer<MembershipReducer>(
      membershipReducer,
      defaultMembershipState
    );

    const { dispatch: reduxDispatch, getState: reduxGetState } =
      useReduxContext();
    const { sessionState, sessionDispatch } = useSessionContext();
    const { usetrans } = useFlags();

    const launchDarklyClient = useLDClient();

    const isFavoritedPharmaciesUpdated = () => {
      if (
        !memberProfileState?.account.favoritedPharmacies ||
        !state.account?.favoritedPharmacies
      ) {
        return false;
      }

      return (
        memberProfileState?.account.favoritedPharmacies.length !==
        state.account.favoritedPharmacies.length
      );
    };

    const queryLanguage = getQueryLanguage(location.search);
    const queryLanguageCode =
      queryLanguage && LanguageCodeMap.get(queryLanguage);

    const fallbackLanguageCode =
      queryLanguageCode ??
      LanguageCodeMap.get(sessionState.currentLanguage) ??
      defaultLanguageCode;

    const isLanguageCodeUpdated = () => {
      if (
        !memberProfileState?.account.languageCode ||
        !state.account?.languageCode
      ) {
        return false;
      }

      if (
        queryLanguageCode &&
        memberProfileState.account.languageCode !== queryLanguageCode
      ) {
        state.account.languageCode = queryLanguageCode;
      }
      return (
        memberProfileState.account.languageCode !== state.account.languageCode
      );
    };

    useEffect(() => {
      if (isFavoritedPharmaciesUpdated() || isLanguageCodeUpdated()) {
        const memberInfoResponseData: IMemberInfoResponseData = {
          account: state.account,
          profileList: state.profileList,
        };
        setMemberProfileDispatch(reduxDispatch, memberInfoResponseData);
      }
    }, [state]);

    useEffect(() => {
      if (memberProfileState) {
        setMembershipDispatch(
          dispatch,
          memberProfileState as IMemberInfoResponseData
        );

        const profile = getHighestPriorityProfile(
          memberProfileState.profileList
        );

        if (profile) {
          if (profile.primary.firstName.endsWith(AutomationNameSuffix)) return;
          const user = buildLaunchDarklyUser(profile.primary);
          launchDarklyClient?.identify(user);
        }

        if (
          !memberProfileState.account.languageCode &&
          memberProfileState !== defaultMemberProfileState
        ) {
          void languageCodeAsyncAction({
            languageCode: fallbackLanguageCode,
            membershipDispatch: dispatch,
            reduxDispatch,
            reduxGetState,
          });
        }
        if (
          memberProfileState.account.languageCode &&
          queryLanguageCode &&
          queryLanguageCode !== memberProfileState.account.languageCode
        ) {
          setCurrentLanguageDispatch(
            sessionDispatch,
            getContentLanguage(memberProfileState.account.languageCode)
          );
          updateURLWithFeatureFlagsAndLanguage(
            location.pathname,
            memberProfileState.account.languageCode,
            true
          );
          if (usetrans) {
            window.location.reload();
          }
        }
        if (queryLanguage) {
          return;
        }
        if (memberProfileState.account.languageCode) {
          setCurrentLanguageDispatch(
            sessionDispatch,
            getContentLanguage(memberProfileState.account.languageCode)
          );
          if (memberProfileState.account.languageCode !== defaultLanguageCode) {
            updateURLWithFeatureFlagsAndLanguage(
              location.pathname,
              memberProfileState.account.languageCode
            );
            if (usetrans) {
              window.location.reload();
            }
          }
        }
      }
    }, [memberProfileState]);

    return (
      <MembershipContext.Provider
        value={{
          membershipState: state,
          membershipDispatch: dispatch,
        }}
      >
        {children}
      </MembershipContext.Provider>
    );
  };

const buildLaunchDarklyUser = (primaryProfile: IPrimaryProfile): LDUser => {
  const {
    identifier,
    firstName,
    lastName,
    rxGroup = '',
    rxSubGroup,
    rxGroupType,
    brokerAssociation = '',
    state = '',
  } = primaryProfile;

  const customAttributes: ILaunchDarklyCustomUserAttributes = {
    rxGroup,
    rxSubGroup,
    rxGroupType,
    brokerAssociation,
    state,
  };

  return {
    key: identifier,
    firstName,
    lastName,
    custom: customAttributes,
  };
};
