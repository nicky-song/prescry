// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { getAndPublishPrescriptionPrice } from '../../../utils/external-api/get-and-publish-prescription-price';
import { SuccessResponse } from '../../../utils/response-helper';
import {
  buildSendToPharmacyResponse,
  IBuildSendToPharmacyResponseArgs,
} from './build-send-to-pharmacy-response';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { Twilio } from 'twilio';
import { sendTextMessages } from './send-text-messages';
import { EndpointVersion } from '../../../models/endpoint-version';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/external-api/get-and-publish-prescription-price');
jest.mock('./send-text-messages');

const successResponseMock = SuccessResponse as jest.Mock;
const getAndPublishPrescriptionPriceMock =
  getAndPublishPrescriptionPrice as jest.Mock;
const sendTextMessagesMock = sendTextMessages as jest.Mock;

const isRTPBMock = true;
const prescriberNpiMock = 'prescriber-npi';

describe('buildSendToPharmacyResponse', () => {
  it('Calls smartprice API for prices to publish', async () => {
    const mockPersonList = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        masterId: 'master-id-mock',
      } as IPerson,
    ];

    const requestMock = { body: { language: 'English' } } as Request;
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;

    const twilioClientMock = {} as Twilio;

    const expected = {};
    successResponseMock.mockReturnValueOnce(expected);

    const ndcMock = '00186077660';
    const quantityMock = 50;
    const supplyMock = 5;
    const ncpdpMock = 'mock-ncpdp';
    const patientIdMock = 'MYRX-ID';
    const groupPlanCodeMock = 'CASH01';
    const refillNumberMock = '1';
    const bundleIdMock = 'mock';
    const rxNumberMock = 'MOCK-RXNUMBER';
    const typeMock = 'prescription';
    const couponMock = undefined;
    const personMock = {} as IPerson;
    const versionMock = 'v1' as EndpointVersion;
    const isSmartPriceEligibleMock = true;
    const useTestThirdPartyPricingMock = false;

    const expectedBuildSendToPharmacyResponseArgs: IBuildSendToPharmacyResponseArgs =
      {
        request: requestMock,
        response: responseMock,
        ndc: ndcMock,
        quantity: quantityMock,
        supply: supplyMock,
        ncpdp: ncpdpMock,
        configuration: configurationMock,
        patientId: patientIdMock,
        groupPlanCode: groupPlanCodeMock,
        refillNumber: refillNumberMock,
        bundleId: bundleIdMock,
        rxNumber: rxNumberMock,
        type: typeMock,
        coupon: couponMock,
        twilioClient: twilioClientMock,
        person: personMock,
        version: versionMock,
        isRTPB: isRTPBMock,
        prescriberNpi: prescriberNpiMock,
        isSmartPriceEligible: isSmartPriceEligibleMock,
        useTestThirdPartyPricing: useTestThirdPartyPricingMock,
      };

    const actual = await buildSendToPharmacyResponse(
      expectedBuildSendToPharmacyResponseArgs
    );

    expect(actual).toBe(expected);

    expect(getAndPublishPrescriptionPriceMock).toHaveBeenCalledWith(
      ndcMock,
      quantityMock,
      supplyMock,
      ncpdpMock,
      configurationMock,
      patientIdMock,
      groupPlanCodeMock,
      refillNumberMock,
      bundleIdMock,
      rxNumberMock,
      typeMock,
      couponMock,
      isRTPBMock,
      prescriberNpiMock,
      isSmartPriceEligibleMock,
      useTestThirdPartyPricingMock
    );

    expect(sendTextMessagesMock).toHaveBeenCalledTimes(1);
    expect(sendTextMessagesMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClientMock,
      responseMock,
      false,
      couponMock,
      personMock,
      versionMock
    );
  });
});
