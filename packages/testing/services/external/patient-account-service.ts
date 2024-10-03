// Copyright 2023 Prescryptive Health, Inc.

import { PatientAccount } from '../../types';
import { Auth0IdentityConstants } from '../../utilities/api/auth0-identity-constants';
import { getDataFromUrlWithAuth0 } from '../../utilities/api/get-data-from-url-with-auth0';
import {
  GEARS_API_SUBSCRIPTION_KEY,
  PLATFORM_GEARS_API_URL,
} from '../../utilities/settings';

const patientAccountUrl = `${PLATFORM_GEARS_API_URL}${Auth0IdentityConstants.GEARS_ACCOUNT_PATH}`;

export class PatientAccountService {
  public static async create(
    patientAccount: PatientAccount
  ): Promise<PatientAccount> {
    const apiResponse = await getDataFromUrlWithAuth0(
      patientAccountUrl,
      patientAccount,
      'POST',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
      },
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );

    if (apiResponse.status !== 200) {
      throw new Error(
        `Unexpected patient account creation status ${
          apiResponse.status
        } and text ${
          apiResponse.statusText
        } and body ${await apiResponse.text()}`
      );
    }
    return apiResponse.json();
  }

  public static getByMasterId = async (
    masterId: string
  ): Promise<PatientAccount | null> => {
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientAccountUrl}/${masterId}`,
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
      `Unexpected patient account get by master id status ${apiResponse.status} and text ${apiResponse.statusText} and body ${apiResponse.text}`
    );
  };

  public static async getByReference(
    reference: string
  ): Promise<PatientAccount[]> {
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientAccountUrl}?sourceReference=${reference}`,
      null,
      'GET',
      {
        [Auth0IdentityConstants.PLATFORM_API_HEADER_KEY]:
          GEARS_API_SUBSCRIPTION_KEY,
      },
      Auth0IdentityConstants.DEFAULT_API_TIMEOUT
    );

    if (apiResponse.status !== 200) {
      throw new Error(
        `Unexpected get patient account by reference status ${
          apiResponse.status
        } and text ${
          apiResponse.statusText
        } and body ${await apiResponse.text()}`
      );
    }
    return apiResponse.json();
  }

  public static async reset(patientAccount: PatientAccount) {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    if (patientAccount.reference) {
      patientAccount.reference[0] = timestamp.toString();
      await this.update(patientAccount);
    }
  }

  public static async update(patientAccount: PatientAccount) {
    const accountId = patientAccount.accountId;
    if (!accountId) {
      throw new Error('Missing account id in update patient account');
    }
    const apiResponse = await getDataFromUrlWithAuth0(
      `${patientAccountUrl}/${accountId}`,
      patientAccount,
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
      `Unexpected update patient account status ${
        apiResponse.status
      } and text ${apiResponse.statusText} and body ${await apiResponse.text()}`
    );
  }
}
