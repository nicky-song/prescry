// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IPerson } from '@phx/common/src/models/person';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  getResponseLocal,
  getRequiredResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { publishPersonUpdateAddressMessage } from '../../../utils/service-bus/person-update-helper';
import { transferPrescriptionHandler } from './transfer-prescription.handler';
import { getPharmacyDetailsByNcpdp } from '../helpers/get-pharmacy-details-by-ncpdp';
import { getDrugInfoByNdc } from '../helpers/get-prescription-drug-info-by-ndc';
import { buildTransferPrescriptionResource } from '../helpers/build-transfer-prescription-resource';
import { transferPrescriptionEndpointHelper } from '../helpers/transfer-prescription-endpoint.helper';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import {
  presPayloadWithMemberAddress,
  presPayloadWithOutPrescriptionNumber,
} from '../mock/transfer-prescription-fhir-mock';
import { publishPrescriptionPriceEvent } from '../helpers/publish-prescription-price-event';
import { getAndPublishPrescriptionPrice } from '../../../utils/external-api/get-and-publish-prescription-price';
import { Twilio } from 'twilio';
import { getCouponIfEligible } from '../helpers/get-coupon-if-eligible';
import { ICoupon } from '../../../models/coupon';
import { sendTextMessages } from '../helpers/send-text-messages';
import { EndpointVersion } from '../../../models/endpoint-version';
import { IPatientProfile } from '../../../models/patient-profile';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('../../../utils/fhir/prescriber-npi.helper');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../helpers/get-pharmacy-details-by-ncpdp');
jest.mock('../helpers/get-prescription-drug-info-by-ndc');
jest.mock('../helpers/build-transfer-prescription-resource');
jest.mock('../helpers/transfer-prescription-endpoint.helper');
jest.mock('../helpers/publish-prescription-price-event');
jest.mock('../../../utils/external-api/get-and-publish-prescription-price');
jest.mock('../helpers/get-coupon-if-eligible');
jest.mock('../helpers/send-text-messages');
jest.mock('../../../utils/external-api/identity/update-patient-by-master-id');

const findPrescriberNPIForPrescriptionFhirMock =
  findPrescriberNPIForPrescriptionFhir as jest.Mock;
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const publishPersonUpdateAddressMessageMock =
  publishPersonUpdateAddressMessage as jest.Mock;
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;
const getDrugInfoByNdcMock = getDrugInfoByNdc as jest.Mock;
const buildTransferPrescriptionResourceMock =
  buildTransferPrescriptionResource as jest.Mock;
const transferPrescriptionEndpointHelperMock =
  transferPrescriptionEndpointHelper as jest.Mock;
const publishPrescriptionPriceEventMock =
  publishPrescriptionPriceEvent as jest.Mock;
const getAndPublishPrescriptionPriceMock =
  getAndPublishPrescriptionPrice as jest.Mock;
const getCouponIfEligibleMock = getCouponIfEligible as jest.Mock;
const sendTextMessagesMock = sendTextMessages as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

const mockPatientList = [
  {
    rxGroupType: 'CASH',
    primary: {
      address: [
        {
          line: ['PERSONADDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'master-id-mock',
    },
  } as IPatientProfile,
];
const mockPersonList = [
  {
    rxGroupType: 'CASH',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
    identifier: 'identifier',
    address1: 'address',
    state: 'state',
    city: 'city',
    zip: '12345',
    rxSubGroup: 'CASH01',
    phoneNumber: 'person-cash-phone-number-mock',
  } as IPerson,
];
const mockPersonListSie = [
  {
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
    identifier: 'identifier',
    address1: 'address',
    state: 'state',
    city: 'city',
    zip: '12345',
    rxSubGroup: 'SOEMGROUP',
    phoneNumber: 'person-sie-phone-number-mock',
  } as IPerson,
];

const sourcePharmacyDetailsResponseMock = {
  address: {
    city: 'city',
    distance: '5',
    lineOne: 'line-one',
    lineTwo: '',
    state: 'state',
    zip: '98004',
  },
  name: 'source-pharmacy-name',
  ncpdp: 'source-mock-ncpdp',
  twentyFourHours: false,
} as IPrescriptionPharmacy;

const destinationPharmacyDetailsResponseMock = {
  address: {
    city: 'city2',
    distance: '25',
    lineOne: 'address-line-one',
    lineTwo: '',
    state: 'state2',
    zip: '98052',
  },
  name: 'dest-pharmacy-name',
  ncpdp: 'dest-mock-ncpdp',
  twentyFourHours: false,
} as IPrescriptionPharmacy;

const drugInfoMock = {
  success: true,
  name: 'LiProZonePak',
  genericName: 'Lidocaine-Prilocaine',
  ndc: '69665061001',
  formCode: 'KIT',
  strength: '2.5-2.5',
  strengthUnit: '%',
  multiSourceCode: 'Y',
  brandNameCode: 'T',
  packageTypeCode: 'BX',
  packageQuantity: 1,
  isGeneric: true,
};
const twilioClient = {} as Twilio;
const versionMock = 'v1' as EndpointVersion;
const v1: EndpointVersion = 'v1';
const v2: EndpointVersion = 'v2';
const usertpbMock = true;
const useTestThirdPartyPricingMock = false;
const prescriberNpiMock = 'prescriber-npi-mock';

beforeEach(() => {
  jest.clearAllMocks();

  sendTextMessagesMock.mockResolvedValue(true);

  getRequiredResponseLocalMock.mockReturnValue({
    usertpb: usertpbMock,
    useTestThirdPartyPricing: useTestThirdPartyPricingMock,
  });

  findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(prescriberNpiMock);
});

describe('transferPrescriptionHandler', () => {
  it('should throw NO_MEMBERSHIP_FOUND error when personList doesnt exist', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = { locals: {} } as unknown as Response;
    getResponseLocalMock.mockReturnValueOnce(undefined);
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NO_MEMBERSHIP_FOUND
    );
  });

  it('throws MISSING_ADDRESS error when address is not passed in the query and doesnt exist in person collection', async () => {
    const personList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList },
    } as unknown as Response;

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    getResponseLocalMock.mockReturnValueOnce(personList);
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.MISSING_ADDRESS
    );
  });

  it.each([v1, v2])(
    'updates address only if passed in the query and user doesnt have PBM profile',
    async (endpointVersionMock: EndpointVersion) => {
      const responseMock = {
        locals: { personList: mockPersonList },
      } as unknown as Response;

      const requestMock = {
        body: {
          sourceNcpdp: 'source-mock-ncpdp',
          destinationNcpdp: 'dest-mock-ncpdp',
          ndc: 'mock-ndc',
          daysSupply: 30,
          quantity: 5,
          memberAddress: {
            address1: 'address',
            state: 'state',
            city: 'city',
            zip: '11111',
          } as IMemberAddress,
        },
        headers: {
          [RequestHeaders.apiVersion]: endpointVersionMock,
        },
      } as unknown as Request;

      if (endpointVersionMock === 'v2') {
        getResponseLocalMock
          .mockReturnValueOnce(mockPersonList)
          .mockReturnValueOnce(mockPatientList);
      } else {
        getResponseLocalMock.mockReturnValueOnce(mockPersonList);
      }
      await transferPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient,
      );

      expect(publishPersonUpdateAddressMessageMock).toBeCalledWith(
        'identifier',
        'ADDRESS',
        '',
        'CITY',
        'STATE',
        '11111'
      );

      if (endpointVersionMock === 'v2') {
        expect(updatePatientByMasterIdMock).toBeCalledWith(
          'master-id-mock',
          {
            address: [
              {
                line: ['ADDRESS'],
                city: 'CITY',
                state: 'STATE',
                postalCode: '11111',
                use: 'home',
                type: 'physical',
              },
            ],
            id: 'master-id-mock',
          },
          configurationMock
        );
      }
    }
  );

  it('shouldnt update address if passed in the query and user has PBM profile', async () => {
    const personListMock = [
      ...mockPersonList,
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'T1234501',
        identifier: 'identifier2',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: personListMock },
    } as unknown as Response;

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
        memberAddress: {
          address1: 'address',
          state: 'state',
          city: 'city',
          zip: '11111',
        } as IMemberAddress,
      },
    } as unknown as Request;

    getResponseLocalMock.mockReturnValueOnce(personListMock);
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );

    expect(publishPersonUpdateAddressMessageMock).not.toBeCalled();
  });

  it('should throw PHARMACY_NOT_FOUND error when pharmacy doesnt exist for given ncpdp', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(undefined);
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.PHARMACY_NOT_FOUND
    );
  });

  it('throws error when drug data API returns error', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue({
      success: false,
      errorCode: 404,
      message: 'some-error',
    });
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      404,
      'some-error'
    );
    expect(buildTransferPrescriptionResourceMock).not.toBeCalled();
    expect(transferPrescriptionEndpointHelperMock).not.toBeCalled();
  });

  it('throws error when transfer prescription endpoint returns error', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);
    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithOutPrescriptionNumber
    );
    transferPrescriptionEndpointHelperMock.mockReturnValue({
      success: false,
      errorMessage: 'some-error',
    });
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(buildTransferPrescriptionResourceMock).toBeCalled();
    expect(transferPrescriptionEndpointHelperMock).toBeCalled();
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      500,
      'some-error'
    );
    expect(publishPrescriptionPriceEventMock).not.toBeCalled();
  });

  it('Shouldnt throw error when pricing endpoint does not return prices and transfer prescription process is successful', async () => {
    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonListSie },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonListSie);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);

    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithOutPrescriptionNumber
    );
    transferPrescriptionEndpointHelperMock.mockReturnValue({
      success: true,
      bundleId: 'bundleID',
    });

    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(buildTransferPrescriptionResourceMock).toBeCalled();

    expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
      configurationMock,
      false,
      requestMock.body.ndc,
      requestMock.body.quantity,
      destinationPharmacyDetailsResponseMock.ncpdp
    );
    expect(getAndPublishPrescriptionPriceMock).toHaveBeenCalledWith(
      requestMock.body.ndc,
      requestMock.body.quantity,
      requestMock.body.daysSupply,
      destinationPharmacyDetailsResponseMock.ncpdp,
      configurationMock,
      'id-1',
      'SOEMGROUP',
      '1',
      'bundleID',
      '',
      'transferRequest',
      undefined,
      usertpbMock,
      prescriberNpiMock,
      false,
      useTestThirdPartyPricingMock
    );
    expect(transferPrescriptionEndpointHelperMock).toBeCalled();
    expect(publishPrescriptionPriceEventMock).not.toBeCalled();
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.TRANSFER_PRESCRIPTION_SUCCESS
    );
  });

  it('returns success when transfer prescription is sent successfully:CASH User', async () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);

    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithOutPrescriptionNumber
    );
    const prescriptionTransferSuccessResponseMesage = 'bundleId';

    transferPrescriptionEndpointHelperMock.mockReturnValue({
      success: true,
      bundleId: prescriptionTransferSuccessResponseMesage,
    });
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
      configurationMock,
      true,
      requestMock.body.ndc,
      requestMock.body.quantity,
      destinationPharmacyDetailsResponseMock.ncpdp
    );
    expect(getAndPublishPrescriptionPriceMock).toHaveBeenCalledWith(
      requestMock.body.ndc,
      requestMock.body.quantity,
      requestMock.body.daysSupply,
      destinationPharmacyDetailsResponseMock.ncpdp,
      configurationMock,
      'id-1',
      'CASH01',
      '1',
      'bundleId',
      '',
      'transferRequest',
      undefined,
      usertpbMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );

    expect(buildTransferPrescriptionResourceMock).toBeCalled();
    expect(transferPrescriptionEndpointHelperMock).toBeCalled();
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.TRANSFER_PRESCRIPTION_SUCCESS
    );
  });

  it('returns success when transfer prescription is sent successfully:PBM user', async () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
    } as unknown as Request;

    const responseMock = {
      locals: { personList: mockPersonListSie },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonListSie);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);

    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithOutPrescriptionNumber
    );
    const prescriptionTransferSuccessResponseMesage = 'bundleId';

    transferPrescriptionEndpointHelperMock.mockReturnValue({
      success: true,
      bundleId: prescriptionTransferSuccessResponseMesage,
    });

    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );
    expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
      configurationMock,
      false,
      requestMock.body.ndc,
      requestMock.body.quantity,
      destinationPharmacyDetailsResponseMock.ncpdp
    );
    expect(getAndPublishPrescriptionPriceMock).toHaveBeenCalledWith(
      requestMock.body.ndc,
      requestMock.body.quantity,
      requestMock.body.daysSupply,
      destinationPharmacyDetailsResponseMock.ncpdp,
      configurationMock,
      'id-1',
      'SOEMGROUP',
      '1',
      'bundleId',
      '',
      'transferRequest',
      undefined,
      usertpbMock,
      prescriberNpiMock,
      false,
      useTestThirdPartyPricingMock
    );
    expect(buildTransferPrescriptionResourceMock).toBeCalled();
    expect(transferPrescriptionEndpointHelperMock).toBeCalled();
    expect(successResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.TRANSFER_PRESCRIPTION_SUCCESS
    );
  });

  it('should include member address in the transfer prescription payload if exists in the profile', async () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
        memberAddress: {
          address1: 'address-line1',
          city: 'city',
          state: 'state',
          zip: '12345',
        },
        prescriptionNumber: '123456',
      },
    } as unknown as Request;

    const mockPersonListCash = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        rxSubGroup: 'CASH01',
      } as IPerson,
    ];

    const expectedPatientInfo = {
      rxGroupType: 'CASH',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      identifier: 'identifier',
      rxSubGroup: 'CASH01',
      address1: 'ADDRESS-LINE1',
      city: 'CITY',
      state: 'STATE',
      zip: '12345',
      phoneNumber: 'person-cash-phone-number-mock',
    };
    const responseMock = {
      locals: { personList: mockPersonListCash },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);

    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithMemberAddress
    );
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );

    expect(buildTransferPrescriptionResourceMock).toBeCalled();
    expect(buildTransferPrescriptionResourceMock).toHaveBeenCalledWith(
      sourcePharmacyDetailsResponseMock,
      destinationPharmacyDetailsResponseMock,
      expectedPatientInfo,
      drugInfoMock,
      requestMock.body.daysSupply,
      requestMock.body.quantity,
      requestMock.body.prescriptionNumber
    );
  });

  it('Sends expected information text message on success', async () => {
    const couponMock = {} as ICoupon;

    getCouponIfEligibleMock.mockReset();
    getCouponIfEligibleMock.mockReturnValue(couponMock);

    const requestMock = {
      body: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
        language: 'English',
      },
    } as unknown as Request;

    const responseMock = {
      locals: {
        personList: mockPersonListSie,
      },
    } as unknown as Response;

    getResponseLocalMock.mockReturnValueOnce(mockPersonListSie);

    getPharmacyDetailsByNcpdpMock
      .mockReturnValueOnce(sourcePharmacyDetailsResponseMock)
      .mockReturnValue(destinationPharmacyDetailsResponseMock);
    getDrugInfoByNdcMock.mockReturnValue(drugInfoMock);
    buildTransferPrescriptionResourceMock.mockReturnValue(
      presPayloadWithOutPrescriptionNumber
    );
    transferPrescriptionEndpointHelperMock.mockReturnValue({
      success: true,
      bundleId: 'bundleID',
    });
    await transferPrescriptionHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClient,
    );

    expect(sendTextMessagesMock).toHaveBeenCalledTimes(1);
    expect(sendTextMessagesMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      twilioClient,
      responseMock,
      false,
      couponMock,
      mockPersonListSie[0],
      versionMock
    );
  });
});
