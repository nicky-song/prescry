// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  getAllDependentsForPrimaryProfile,
  getLoggedInUserProfileForRxGroupType,
} from '../../../utils/person/get-dependent-person.helper';
import { fetchRequestHeader } from '../../../utils/request-helper';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { setMembersTelemetryIds } from '../../../utils/telemetry-helper';
import {
  RxGroupTypes,
  RxGroupTypesEnum,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { getMemberInfoBasedOnProfileType } from '../helpers/get-member-info-by-profile-type.helper';
import { mapAccountDetails } from '../../../utils/person/person-helper';
import { IMemberInfoResponseData } from '@phx/common/src/models/api-response/member-info-response';
import {
  IPatientDependentsResponse,
  IPatientProfileResponse,
} from '@phx/common/src/models/patient-profile/patient-profile';
import {
  IPatientDependents,
  IPatientProfile,
} from '../../../models/patient-profile';
import { getPatientAndDependentsInfo } from '../../../utils/fhir-patient/patient.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function getMembersHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
) {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';

  let newMemberInfoRequestId;

  const patientDependentsFhir = [] as IPatientDependents[];
  const patientListFhir = [] as IPatientProfile[];

  const patientDependents = [] as IPatientDependentsResponse[];
  const patientList = [] as IPatientProfileResponse[];

  if (isV2Endpoint) {
    const dependents = getResponseLocal(response, 'patientDependents') || [];
    const patientProfiles = getResponseLocal(response, 'patientProfiles') || [];

    patientDependentsFhir.push(...dependents);
    patientListFhir.push(...patientProfiles);
  }

  const profileList = [];
  const dependentsInfo = getResponseLocal(response, 'dependents') || [];
  const accountInfo = await getRequiredResponseLocal(response, 'account');

  for (const type in RxGroupTypesEnum) {
    if (isNaN(Number(type))) {
      const primaryProfile = getLoggedInUserProfileForRxGroupType(
        response,
        type as RxGroupTypes
      );
      if (primaryProfile) {
        if (primaryProfile.rxGroupType !== 'CASH') {
          const getAllDependents = await getAllDependentsForPrimaryProfile(
            database,
            primaryProfile,
            dependentsInfo
          );
          profileList.push(
            getMemberInfoBasedOnProfileType(
              primaryProfile,
              getAllDependents,
              primaryProfile.rxGroupType as RxGroupTypes,
              configuration.childMemberAgeLimit
            )
          );
        } else {
          profileList.push(
            getMemberInfoBasedOnProfileType(
              primaryProfile,
              dependentsInfo,
              primaryProfile.rxGroupType as RxGroupTypes,
              configuration.childMemberAgeLimit
            )
          );
        }
      }
    }
  }

  if (isV2Endpoint) {
    const { patients, dependents } = getPatientAndDependentsInfo(
      patientListFhir,
      patientDependentsFhir
    );

    patientDependents.push(...dependents);
    patientList.push(...patients);
  }

  const memberInfoRequestId = fetchRequestHeader(request, 'request-id');
  if (memberInfoRequestId) {
    newMemberInfoRequestId = setMembersTelemetryIds(memberInfoRequestId);
  }

  return SuccessResponse<IMemberInfoResponseData>(
    response,
    null,
    {
      account: mapAccountDetails(accountInfo),
      profileList,
      ...(isV2Endpoint && { patientDependents, patientList }),
    },
    newMemberInfoRequestId
  );
}
