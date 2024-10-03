// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import {
  getPrescriptionsEndpointHelper,
  IGetPrescriptionsHelperResponse,
} from './get-prescriptions-endpoint.helper';
import { getBlockchainPrescriptionsEndpointHelper } from './get-blockchain-prescriptions-endpoint.helper';

export const getPrescriptionsByMemberRxIds = async (
  loggedInMemberIds: string[],
  configuration: IConfiguration,
  retry: boolean,
  loggedInMasterIds?: string[]
): Promise<IGetPrescriptionsHelperResponse> => {
  const proccessedResults: IGetPrescriptionsHelperResponse = {};
  proccessedResults.prescriptions = [];
  proccessedResults.blockchainPrescriptions = [];
  for (const loggedInMemberId of loggedInMemberIds) {
    const prescriptionApiResponse: IGetPrescriptionsHelperResponse =
      await getPrescriptionsEndpointHelper(
        loggedInMemberId,
        configuration,
        retry
      );
    const { prescriptions, errorCode, message } = prescriptionApiResponse;

    if (prescriptions) {
      proccessedResults.prescriptions = [
        ...proccessedResults.prescriptions,
        ...prescriptions,
      ];
    }

    proccessedResults.errorCode = errorCode;
    proccessedResults.message = message;
  }

  if (loggedInMasterIds?.length) {
    for (const loggedInMasterId of loggedInMasterIds) {
      const prescriptionApiResponse: IGetPrescriptionsHelperResponse =
        await getBlockchainPrescriptionsEndpointHelper(
          loggedInMasterId,
          configuration
        );
      const {
        prescriptions: blockchainPrescriptions,
        errorCode: blockchainErrorCode,
        message: blockchainMessage,
      } = prescriptionApiResponse;

      if (blockchainPrescriptions) {
        proccessedResults.blockchainPrescriptions = [
          ...proccessedResults.blockchainPrescriptions,
          ...blockchainPrescriptions,
        ];
      }

      proccessedResults.errorCode = blockchainErrorCode;
      proccessedResults.message = blockchainMessage;
    }
  }

  return proccessedResults;
};
