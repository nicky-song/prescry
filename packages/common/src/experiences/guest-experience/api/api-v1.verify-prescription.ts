// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { IPrescriptionVerificationResponse } from '../../../models/api-response/prescription-verification-response';
import { IVerifyPrescriptionRequestBody } from '../../../models/api-request-body/verify-prescription.request-body';
import { ensureVerifyPrescriptionResponse } from './ensure-api-response/ensure-verify-prescription-response';

export const verifyPrescription = async (
  config: IApiConfig,
  verifyPrescriptionRequestBody: IVerifyPrescriptionRequestBody,
  prescriptionId?: string
): Promise<IPrescriptionVerificationResponse> => {
  const url = buildUrl(config, 'verifyPrescription', {
    ':prescriptionId': prescriptionId ?? '',
  });

  const response: Response = await call(
    url,
    verifyPrescriptionRequestBody,
    'POST',
    buildCommonHeaders(config)
  );

  const responseJson = await response.json();
  if (response.ok && ensureVerifyPrescriptionResponse(responseJson)) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInVerifyingPrescription,
    APITypes.VERIFY_MEMBERSHIP,
    errorResponse.code,
    errorResponse
  );
};
