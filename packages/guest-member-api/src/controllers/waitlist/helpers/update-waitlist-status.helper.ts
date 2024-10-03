// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { IConfiguration } from '../../../configuration';
import { getRecentWaitlistForPhone } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IServiceTypeDetailsResponse } from '../../../models/pharmacy-portal/get-service-by-service-type.response';
import { IWaitlistRemoveOperationResult } from '../../../models/twilio-web-hook/remove-waitlist-request.body';
import { IWaitList } from '../../../models/wait-list';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export const updateWaitlistStatus = async (
  phoneNumber: string,
  database: IDatabase,
  configuration: IConfiguration
): Promise<IWaitlistRemoveOperationResult> => {
  const mostRecentWaitlistItem: IWaitList | null =
    await getRecentWaitlistForPhone(database, phoneNumber);
  if (mostRecentWaitlistItem) {
    const serviceTypeDetailsResponse: IServiceTypeDetailsResponse =
      await getServiceDetailsByServiceType(
        configuration,
        mostRecentWaitlistItem.serviceType
      );
    const serviceTypeDetails = serviceTypeDetailsResponse.service;
    if (
      mostRecentWaitlistItem.status === null ||
      mostRecentWaitlistItem.status === 'invited'
    ) {
      const token: string = await generateBearerToken(
        configuration.pharmacyPortalApiTenantId,
        configuration.pharmacyPortalApiClientId,
        configuration.pharmacyPortalApiClientSecret,
        configuration.pharmacyPortalApiScope
      );
      const apiResponse: Response = await getDataFromUrl(
        configuration.pharmacyPortalApiUrl +
          '/waitlist/' +
          mostRecentWaitlistItem.identifier,
        null,
        'DELETE',
        { Authorization: `Bearer ${token}` },
        undefined,
        undefined,
        defaultRetryPolicy
      );
      if (apiResponse.ok) {
        return {
          success: true,
          firstName: mostRecentWaitlistItem.firstName,
          lastName: mostRecentWaitlistItem.lastName,
          serviceType: mostRecentWaitlistItem.serviceType,
          serviceName: serviceTypeDetails?.serviceNameMyRx ?? '',
          identifier: mostRecentWaitlistItem.identifier,
        };
      }
      return {
        success: false,
        firstName: mostRecentWaitlistItem.firstName,
        lastName: mostRecentWaitlistItem.lastName,
        serviceType: mostRecentWaitlistItem.serviceType,
        serviceName: serviceTypeDetails?.serviceNameMyRx ?? '',
        identifier: mostRecentWaitlistItem.identifier,
        failureType: 'WaitlistError',
      };
    }
    if (
      mostRecentWaitlistItem.status === 'canceled' ||
      mostRecentWaitlistItem.status === 'cancelled'
    ) {
      return {
        success: false,
        firstName: mostRecentWaitlistItem.firstName,
        lastName: mostRecentWaitlistItem.lastName,
        serviceType: mostRecentWaitlistItem.serviceType,
        serviceName: serviceTypeDetails?.serviceNameMyRx ?? '',
        identifier: mostRecentWaitlistItem.identifier,
        failureType: 'WaitlistCanceled',
      };
    }
    if (mostRecentWaitlistItem.status === 'fulfilled') {
      return {
        success: false,
        firstName: mostRecentWaitlistItem.firstName,
        lastName: mostRecentWaitlistItem.lastName,
        serviceType: mostRecentWaitlistItem.serviceType,
        serviceName: serviceTypeDetails?.serviceNameMyRx ?? '',
        identifier: mostRecentWaitlistItem.identifier,
        failureType: 'WaitlistFulfilled',
      };
    }
  }
  return {
    success: false,
    firstName: '',
    lastName: '',
    serviceType: '',
    serviceName: '',
    identifier: '',
    failureType: 'NoWaitlistForPhone',
  };
};
