// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyMembershipRequestBody } from '../../../../../models/api-request-body/verify-membership.request-body';
import { verifyMembership } from '../../../api/api-v1.verify-membership';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { RootState } from '../../root-reducer';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const verifyMembershipDispatch = async (
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  verifyMembershipRequestBody: IVerifyMembershipRequestBody
): Promise<boolean> => {
  try {
    const { config } = getState();

    const api = config.apis.guestExperienceApi;
    await verifyMembership(api, verifyMembershipRequestBody);
    return true;
  } catch (error) {
    if (error instanceof ErrorInternalServer) {
      internalErrorDispatch(navigation, error as Error);
      return false;
    }

    throw error;
  }
};
