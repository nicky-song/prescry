// Copyright 2018 Prescryptive Health, Inc.

import { handleRedirectSuccessResponse } from '../../../api/api-v1-helper';
import { updateTelemetryId } from '../../../guest-experience-logger.middleware';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';
import {
  getMemberInfoDispatch,
  MemberInfoDataResponseLogger,
} from './get-member-info.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';

export const loadMemberDataDispatch = async (
  dispatch: Dispatch<IDispatchContactInfoActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  memberInfoResponseDataLogger?: MemberInfoDataResponseLogger
) => {
  const state = getState();
  if (!state.settings.token) {
    await handleAuthenticationErrorAction(dispatch, navigation);
    return true;
  }

  updateTelemetryId(state.telemetry.memberInfoRequestId);

  const response = await getMemberInfoDispatch(
    dispatch,
    getState,
    undefined,
    memberInfoResponseDataLogger
  );
  if (response.responseCode) {
    await handleRedirectSuccessResponse(response, dispatch, navigation);
    return true;
  }

  return false;
};
