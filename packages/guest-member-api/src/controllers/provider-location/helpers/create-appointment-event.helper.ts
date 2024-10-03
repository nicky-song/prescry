// Copyright 2020 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';

import { appointmentContent } from '../../../content/appointment.content';
import { IAppointmentDateTime } from './appointment-time.helper';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';
import { IServices } from '../../../models/services';

export function createAcceptanceTextMessage(
  appointmentDateTime: IAppointmentDateTime,
  location: IProviderLocation,
  orderNumber: string,
  phoneNumber: string,
  cancelAppointmentWindowExpiryTimeInHours: number,
  experienceBaseUrl: string,
  service: IServices
): string {
  const address = location.address2
    ? `${location.address1}, ${location.address2}`
    : location.address1;
  const parameterMap = new Map<string, string>([
    ['providerName', location.providerInfo.providerName],
    ['appointmentDate', appointmentDateTime.date],
    ['appointmentTime', appointmentDateTime.time],
    ['address', address],
    ['city', location.city],
    ['state', location.state],
    ['zip', location.zip],
    [
      'cancellationSupport',
      createCancelLink(
        encodeAscii(orderNumber + ' ' + phoneNumber),
        experienceBaseUrl
      ),
    ],
    ['cancellation-policy', service.cancellationPolicyMyRx || ''],
    [
      'cancel-window-hours',
      cancelAppointmentWindowExpiryTimeInHours.toString(),
    ],
  ]);
  return StringFormatter.format(
    appointmentContent.appointmentAcceptText(),
    parameterMap
  );
}

function createCancelLink(
  orderNumber: string,
  experienceBaseUrl: string
): string {
  const map = new Map<string, string>([
    ['ordernumber', orderNumber],
    ['baseUrl', experienceBaseUrl],
  ]);
  return StringFormatter.format(
    ApiConstants.CANCEL_APPOINTMENT_REQUEST_URL,
    map
  );
}
