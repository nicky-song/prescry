// Copyright 2020 Prescryptive Health, Inc.

import { ITransferPrescriptionRequestBody } from '../../../models/api-request-body/transfer-prescription.request-body';
import { IApiResponse, IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensurePrescriptionTransferResponse } from './ensure-api-response/ensure-prescription-transfer-response';
import { withRefreshToken } from './with-refresh-token';

export const transferPrescription = async (
  config: IApiConfig,
  transferPrescriptionRequestBody: ITransferPrescriptionRequestBody,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<IApiResponse> => {
  const url = buildUrl(config, 'prescriptionTransfer', {});

  const response: Response = await call(
    url,
    transferPrescriptionRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensurePrescriptionTransferResponse(responseJson)) {
    return withRefreshToken<IApiResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorTransferPrescription,
    APITypes.TRANSFER_PRESCRIPTION,
    errorResponse.code,
    errorResponse
  );
};
