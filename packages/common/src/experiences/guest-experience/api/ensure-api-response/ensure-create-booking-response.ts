// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ICreateBookingResponse } from '../../../../models/api-response/create-booking-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureCreateBookingResponse = (
  responseJson: unknown
): ICreateBookingResponse => {
  const response = responseJson as ICreateBookingResponse;

  if (!response.data) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  const data = response.data;
  if (
    !data.appointment ||
    !data.appointment.address1 ||
    !data.appointment.city ||
    !data.appointment.date ||
    !data.appointment.locationName ||
    !data.appointment.orderNumber ||
    !data.appointment.serviceName ||
    !data.appointment.state ||
    !data.appointment.time ||
    !data.appointment.zip
  ) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  const payment = data.payment;
  if (
    payment &&
    (!payment.clientReferenceId ||
      !payment.isPriceActive ||
      !payment.productPriceId ||
      !payment.publicKey ||
      !payment.sessionId ||
      !payment.unitAmountDecimal ||
      payment.unitAmount === undefined ||
      payment.unitAmount === null ||
      isNaN(payment.unitAmount) ||
      (payment.paymentStatus !== 'no_payment_required' &&
        payment.paymentStatus !== 'paid' &&
        payment.paymentStatus !== 'unpaid'))
  ) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
