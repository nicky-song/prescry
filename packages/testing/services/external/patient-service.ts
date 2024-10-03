// Copyright 2023 Prescryptive Health, Inc.

import {
  GEARS_API_SUBSCRIPTION_KEY,
  PLATFORM_GEARS_API_URL,
} from '../../utilities/settings';
import { getDataFromUrlWithAuth0 } from '../../utilities/api/get-data-from-url-with-auth0';
import { TenantHeaders, TenantType } from '../../utilities/tenant-headers';
import { Auth0IdentityConstants } from '../../utilities/api/auth0-identity-constants';
import { type Patient } from 'fhir/r4';

const patientUrl = `${PLATFORM_GEARS_API_URL}${Auth0IdentityConstants.GEARS_PATIENT_PATH}`;

type createResponseType = { id: string };

export class PatientService {
  public static readonly create = async (
    patient: Patient,
    tenant?: TenantType
  ): Promise<createResponseType> => {
    let headers = {
      [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
        GEARS_API_SUBSCRIPTION_KEY,
    };
    if (tenant) {
      headers = { ...headers, ...TenantHeaders[tenant] };
    }
    const apiResponse = await getDataFromUrlWithAuth0(
      patientUrl,
      patient,
      'POST',
      headers,
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );
    if (apiResponse.status !== 201) {
      throw new Error(
        `Unexpected patient creation status ${apiResponse.status} and text ${apiResponse.statusText} and body ${apiResponse.text}`
      );
    }
    return apiResponse.json();
  };

  public static getByMasterId = async (
    masterId: string
  ): Promise<Patient | null> => {
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientUrl}/${masterId}`,
      undefined,
      'GET',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
      },
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );

    if (apiResponse.ok) {
      return await apiResponse.json();
    }
    if (apiResponse.status === 400) {
      return null;
    }

    throw new Error(
      `Unexpected patient get by master id status ${apiResponse.status} and text ${apiResponse.statusText} and body ${apiResponse.text}`
    );
  };

  public static queryByPhoneNumber = async (
    phoneNumberPatient: string
  ): Promise<{ entry: {id: string, resource: Patient}[] }> => {
    const data = { phoneNumber: phoneNumberPatient };
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientUrl}/query?allTenants=true`,
      data,
      'POST',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
      },
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );

    if (apiResponse.ok) {
      return await apiResponse.json();
    }

    throw new Error(
      `Unexpected patient get by phone number status ${apiResponse.status} and text ${apiResponse.statusText} and body ${apiResponse.text}`
    );
  };

  public static update = async (
    masterId: string,
    patient: Patient
  ): Promise<void> => {
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientUrl}/${masterId}?allTenants=true`,
      patient,
      'PUT',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
      },
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );

    if (apiResponse.ok) {
      return;
    }

    throw new Error(
      `Unexpected patient update status ${apiResponse.status} and text ${apiResponse.statusText} and body ${apiResponse.text}`
    );
  };

  public static reset = async (masterId: string, patient: Patient) => {
    if (patient && patient.identifier && patient.name) {
      patient.identifier[0].value = '000-000-0000';
      patient.name[0].family = 'XXXX';
    }
    if (patient && patient.telecom) {
      patient.telecom.filter((obj) => {
        if (obj.system && obj.system === 'phone') {
          obj.value = '000-000-0000';
        }
      });
    }
    await this.update(masterId, patient);
  };
}
