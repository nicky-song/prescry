// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentEvent } from '../../../models/appointment-event';
import { IAppointmentListItem } from '@phx/common/src/models/api-response/appointment.response';
import { ApiConstants } from '../../../constants/api-constants';
import { splitAppointmentDateAndTime } from '../../provider-location/helpers/appointment-time.helper';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { IConfiguration } from '../../../configuration';
import { encodeAscii } from '@phx/common/src/utils/base-64-helper';

export async function buildAppointmentListItem(
  appointmentDetails: IAppointmentEvent,
  configuration: IConfiguration
): Promise<IAppointmentListItem | undefined> {
  const providerLocationResponse = await getProviderLocationByIdAndServiceType(
    configuration,
    appointmentDetails.eventData.appointment.locationId
  );
  const location = providerLocationResponse.location;

  if (location) {
    const appointmentDateTime = splitAppointmentDateAndTime(
      appointmentDetails.eventData.appointment.start,
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT
    );

    const appointmentLink = encodeAscii(
      `${appointmentDetails.eventData.orderNumber} ${appointmentDetails.eventData.appointment.customerPhone}`
    );

    return {
      customerName: appointmentDetails.eventData.appointment.customerName,
      orderNumber: appointmentDetails.eventData.orderNumber,
      locationName: location.providerInfo.providerName,
      date: appointmentDateTime.date,
      time: appointmentDateTime.time,
      serviceDescription:
        appointmentDetails.eventData.appointment.serviceDescription,
      bookingStatus: appointmentDetails.eventData.bookingStatus,
      startInUtc: appointmentDetails.eventData.appointment.startInUtc,
      serviceType: appointmentDetails.eventData.serviceType,
      appointmentLink,
    };
  }
  return undefined;
}
