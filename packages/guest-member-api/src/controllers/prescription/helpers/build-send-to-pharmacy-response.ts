// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { SuccessConstants } from '../../../constants/response-messages';
import { ICoupon } from '../../../models/coupon';
import { EndpointVersion } from '../../../models/endpoint-version';
import {
  getAndPublishPrescriptionPrice,
  PrescriptionType,
} from '../../../utils/external-api/get-and-publish-prescription-price';
import { SuccessResponse } from '../../../utils/response-helper';
import { sendTextMessages } from './send-text-messages';
export interface IBuildSendToPharmacyResponseArgs {
  request: Request;
  response: Response;
  ndc: string;
  quantity: number;
  supply: number;
  ncpdp: string;
  configuration: IConfiguration;
  patientId: string;
  groupPlanCode: string;
  refillNumber: string;
  bundleId: string;
  rxNumber: string;
  type: PrescriptionType;
  twilioClient: Twilio;
  coupon?: ICoupon;
  person?: IPerson;
  version?: EndpointVersion;
  isRTPB?: boolean;
  prescriberNpi?: string;
  isSmartPriceEligible?: boolean;
  useTestThirdPartyPricing?: boolean;
}

export const buildSendToPharmacyResponse = async (
  args: IBuildSendToPharmacyResponseArgs
) => {
  const {
    response,
    ndc,
    quantity,
    supply,
    ncpdp,
    configuration,
    patientId,
    groupPlanCode,
    refillNumber,
    bundleId,
    rxNumber,
    type,
    coupon,
    twilioClient,
    person,
    version,
    isRTPB,
    prescriberNpi,
    isSmartPriceEligible,
    useTestThirdPartyPricing
  } = args;

  await getAndPublishPrescriptionPrice(
    ndc,
    quantity,
    supply,
    ncpdp,
    configuration,
    patientId,
    groupPlanCode,
    refillNumber,
    bundleId,
    rxNumber,
    type,
    coupon,
    isRTPB,
    prescriberNpi,
    isSmartPriceEligible,
    useTestThirdPartyPricing
  );

  await sendTextMessages(
    configuration,
    twilioClient,
    response,
    false,
    coupon,
    person,
    version
  );

  return SuccessResponse(response, SuccessConstants.SEND_PRESCRIPTION_SUCCESS);
};
