// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IConfiguration } from '../../../configuration';
import { IFhir } from '../../../models/fhir/fhir';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { getLoggedInMemberRxIds } from '../../../utils/person/person-helper';
import { ApiConstants } from '../../../constants/api-constants';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
} from '../mock/get-mock-fhir-object';
import { getPrescriptionsByMemberRxIds } from '../helpers/get-prescriptions-by-member-rx-ids.helper';
import { buildPrescriptionsResponse } from '../helpers/build-prescriptions-response';

export async function getPrescriptionsByPatientIdHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const personList = getResponseLocal(response, 'personList');
    const features = getRequiredResponseLocal(response, 'features');
    const switches = fetchRequestHeader(request, RequestHeaders.switches);
    const useTestCabinet =
      features.usetestcabinet || switches
        ? switches?.indexOf('usetestcabinet:1') !== -1
        : false;
    const prescriptionsMock = [] as IFhir[];
    prescriptionsMock.push(prescriptionFhirMock);

    const page =
      Number(request.query.page) ?? ApiConstants.MEDICINE_CABINET_DEFAULT_PAGE;

    if (!personList) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
    }

    if (useTestCabinet) {
      return buildPrescriptionsResponse(
        page,
        response,
        [...prescriptionsMock, prescriptionBlockchainFhirMock],
        personList ?? [],
        []
      );
    }

    const loggedInMemberRxIds = getLoggedInMemberRxIds(response);
    const loggedInMasterIds = getResponseLocal(response, 'masterIds') ?? [];

    const { prescriptions, blockchainPrescriptions } =
      await getPrescriptionsByMemberRxIds(
        loggedInMemberRxIds,
        configuration,
        true,
        loggedInMasterIds
      );

    return buildPrescriptionsResponse(
      page,
      response,
      prescriptions ?? [],
      personList,
      blockchainPrescriptions ?? []
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
