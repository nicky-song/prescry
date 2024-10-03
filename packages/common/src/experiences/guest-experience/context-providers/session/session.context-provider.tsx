// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useEffect, useReducer } from 'react';
import { SessionContext } from './session.context';
import {
  sessionReducer,
  SessionReducer,
} from '../../state/session/session.reducer';
import {
  defaultSessionState,
  ISessionState,
} from '../../state/session/session.state';
import { getDrugFormsDispatch } from '../../state/session/dispatch/get-drug-forms.dispatch';
import { useConfigContext } from '../config/use-config-context.hook';
import { IGetUserLocationAsyncActionArgs } from '../../state/session/async-actions/get-user-location.async-action';
import { useReduxContext } from '../redux/use-redux-context.hook';
import {
  getLastZipCodeFromSettings,
  getUserLocationFromSettings,
} from '../../../../utils/session.helper';
import { getUserLocationAndCachePharmaciesDispatch } from '../../state/session/dispatch/get-user-location-and-cache-pharmacies.dispatch';
import { setCurrentLanguageDispatch } from '../../state/session/dispatch/set-current-language.dispatch';
import { useMembershipContext } from '../membership/use-membership-context.hook';
import { getContentLanguage } from '../../../../utils/translation/get-content-language.helper';
import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';
import { getCurrentDeviceLanguageDispatch } from '../../state/session/dispatch/get-current-device-language.dispatch';
import { defaultLanguage, LanguageCodeMap } from '../../../../models/language';
import { updateURLWithFeatureFlagsAndLanguage } from '../../store/navigation/update-url-with-feature-flags-and-language';
import { useFlags } from 'launchdarkly-react-client-sdk';

export interface ISessionContextProviderProps {
  isUnauthExperience?: boolean;
  isUserAuthenticated?: boolean;
  injectedSessionState?: ISessionState;
}

export const SessionContextProvider: FunctionComponent<ISessionContextProviderProps> =
  ({
    children,
    isUnauthExperience,
    isUserAuthenticated,
    injectedSessionState = defaultSessionState,
  }) => {
    const initialSessionState: ISessionState = {
      ...injectedSessionState,
      isUnauthExperience,
      isUserAuthenticated,
    };

    const [state, dispatch] = useReducer<SessionReducer>(
      sessionReducer,
      initialSessionState
    );

    const { configState } = useConfigContext();

    const { dispatch: reduxDispatch, getState: reduxGetState } =
      useReduxContext();

    const { membershipState } = useMembershipContext();

    const queryLanguage = getQueryLanguage(location.search);

    const { usetrans } = useFlags();

    useEffect(() => {
      const userLocationSettings = getUserLocationFromSettings(reduxGetState);
      const lastZipCode = getLastZipCodeFromSettings(reduxGetState);

      const handleGetUserLocation = async () => {
        const getUserLocationAsyncActionArgs: IGetUserLocationAsyncActionArgs =
          {
            sessionDispatch: dispatch,
            reduxDispatch,
            reduxGetState,
          };

        if (userLocationSettings) {
          getUserLocationAsyncActionArgs.location = userLocationSettings;
        } else if (lastZipCode && lastZipCode !== 'unknown') {
          getUserLocationAsyncActionArgs.location = { zipCode: lastZipCode };
        }
        try {
          await getUserLocationAndCachePharmaciesDispatch(
            getUserLocationAsyncActionArgs
          );
          // eslint-disable-next-line no-empty
        } catch {}
      };

      handleGetUserLocation();

      if (state.drugFormMap.size > 0) {
        return;
      }

      (async () => {
        await getDrugFormsDispatch(dispatch, configState);
      })();

      getCurrentDeviceLanguageDispatch(dispatch);
    }, []);

    useEffect(() => {
      state.isUnauthExperience = isUnauthExperience;
    }, [isUnauthExperience]);

    useEffect(() => {
      state.isUserAuthenticated = isUserAuthenticated;
    }, [isUserAuthenticated]);

    useEffect(() => {
      if (isUserAuthenticated) {
        if (queryLanguage) {
          setCurrentLanguageDispatch(dispatch, queryLanguage);
          return;
        }
        if (membershipState.account.languageCode) {
          setCurrentLanguageDispatch(
            dispatch,
            getContentLanguage(membershipState.account.languageCode)
          );
        }
      }
    }, [isUserAuthenticated, membershipState.account.languageCode]);

    useEffect(() => {
      if (state.currentLanguage === defaultLanguage) {
        return;
      }

      const sessionLanguageCode = LanguageCodeMap.get(state.currentLanguage);

      if (!queryLanguage && sessionLanguageCode) {
        updateURLWithFeatureFlagsAndLanguage(
          location.pathname,
          sessionLanguageCode
        );

        if (usetrans) {
          window.location.reload();
        }
      }
    }, [state.currentLanguage]);

    return (
      <SessionContext.Provider
        value={{
          sessionState: state,
          sessionDispatch: dispatch,
        }}
      >
        {children}
      </SessionContext.Provider>
    );
  };
