// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureCreateBookingResponse } from './ensure-create-booking-response';
import { ICreateBookingResponseData } from '../../../../models/api-response/create-booking-response';
import { IAppointmentItem } from '../../../../models/api-response/appointment.response';

describe('ensureCreateBookingResponse()', () => {
  const payment = {
    clientReferenceId: 'x',
    isPriceActive: true,
    paymentStatus: 'unpaid',
    productPriceId: 'x',
    publicKey: 'x',
    sessionId: 'x',
    unitAmount: 123,
    unitAmountDecimal: '123.00',
  };
  const appointment: IAppointmentItem = {
    serviceName: 'mock-name',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: 'ordernumber',
    locationName: 'provider-name',
    address1: 'mock-addr1',
    address2: 'mock-addr2',
    city: 'fake-city',
    zip: 'fake-zip',
    state: 'fake-state',
    additionalInfo: undefined,
    date: 'Tuesday, June 23rd',
    time: '6:00 pm',
    providerTaxId: 'dummy Tax Id',
    paymentStatus: 'no_payment_required',
    procedureCode: 'procedure-code',
    serviceDescription: 'service-description',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentLink',
  };
  const error = ErrorConstants.errorInternalServer();

  it('should throw error if response data.appointment does not exists is invalid', () => {
    const mockResponseJson = {} as Partial<ICreateBookingResponseData>;
    expect(() => ensureCreateBookingResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return ICreateBookingResponse if payment is undefined', () => {
    const mockResponseJson = {
      data: {
        appointment,
        payment: undefined,
      },
    };
    expect(ensureCreateBookingResponse(mockResponseJson)).toEqual(
      mockResponseJson
    );
  });

  it('should return typed response if data.payment is valid', () => {
    const mockResponseJson = {
      data: {
        appointment,
        payment,
      },
    };
    const result = ensureCreateBookingResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });

  it('should throw exception if data.payment is missing clientReferenceId', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            clientReferenceId: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing sessionId', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            sessionId: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing paymentStatus', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            paymentStatus: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing isPriceActive', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            isPriceActive: false,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing productPriceId', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            productPriceId: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing publicKey', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            publicKey: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing unitAmountDecimal', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            unitAmountDecimal: undefined,
          },
        },
      })
    ).toThrowError(error);
  });
  it('should throw exception if data.payment is missing unitAmount', () => {
    expect(() =>
      ensureCreateBookingResponse({
        data: {
          appointment,
          payment: {
            ...payment,
            unitAmount: null,
          },
        },
      })
    ).toThrowError(error);
  });
});
