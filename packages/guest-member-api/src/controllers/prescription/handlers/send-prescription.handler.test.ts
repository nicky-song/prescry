// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { buildPharmacyResource } from '../../prescription/helpers/build-pharmacy-resource';
import {
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../../prescription/helpers/get-prescription-by-id';
import { getPharmacyDetailsByNcpdp } from '../../prescription/helpers/get-pharmacy-details-by-ncpdp';
import { updatePrescriptionById } from '../../prescription/helpers/update-prescription-by-id';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  prescriptionBlockchainFhirMock,
  prescriptionBlockchainNoMasterIdFhirMock,
  prescriptionBlockchainWithPharmacyIdFhirMock,
  prescriptionFhirMock,
  prescriptionWithPharmacyFhirMock,
} from '../../prescription/mock/get-mock-fhir-object';
import { IPerson } from '@phx/common/src/models/person';

import { sendPrescriptionHandler } from './send-prescription.handler';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { Twilio } from 'twilio';
import { getCouponIfEligible } from '../../prescription/helpers/get-coupon-if-eligible';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { assignPharmacyToBlockchainPrescription } from '../helpers/assign-pharmacy-to-blockchain-prescription';
import {
  buildSendToPharmacyResponse,
  IBuildSendToPharmacyResponseArgs,
} from '../helpers/build-send-to-pharmacy-response';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import { ICoupon } from '../../../models/coupon';
import { sendTextMessages } from '../helpers/send-text-messages';
import { EndpointVersion } from '../../../models/endpoint-version';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

jest.mock('../../../utils/fhir/prescriber-npi.helper');
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/build-pharmacy-resource');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../helpers/get-prescription-by-id');
jest.mock('../helpers/get-pharmacy-details-by-ncpdp');
jest.mock('../helpers/update-prescription-by-id');
jest.mock('../../../utils/external-api/get-and-publish-prescription-price');
jest.mock('../helpers/get-coupon-if-eligible');
jest.mock('../../../utils/request/get-request-query');
jest.mock('../helpers/get-prescription-info-for-smart-contract-address.helper');
jest.mock('../helpers/assign-pharmacy-to-blockchain-prescription');
jest.mock('../helpers/build-send-to-pharmacy-response');
jest.mock('../../../utils/get-person-for-blockchain-prescription.helper');
jest.mock('../helpers/send-text-messages');

const findPrescriberNPIForPrescriptionFhirMock =
  findPrescriberNPIForPrescriptionFhir as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const buildPharmacyResourceMock = buildPharmacyResource as jest.Mock;
const getPrescriptionByIdMock = getPrescriptionById as jest.Mock;
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;
const updatePrescriptionByIdMock = updatePrescriptionById as jest.Mock;
const getCouponIfEligibleMock = getCouponIfEligible as jest.Mock;
const getRequestQueryMock = getRequestQuery as jest.Mock;
const getPrescriptionInfoForSmartContractAddressMock =
  getPrescriptionInfoForSmartContractAddress as jest.Mock;
const isMasterIdValidForUserAndDependentsMock =
  isMasterIdValidForUserAndDependents as jest.Mock;
const assignPharmacyToBlockchainPrescriptionMock =
  assignPharmacyToBlockchainPrescription as jest.Mock;
const buildSendToPharmacyResponseMock =
  buildSendToPharmacyResponse as jest.Mock;
const getPersonForBlockchainPrescriptionMock =
  getPersonForBlockchainPrescription as jest.Mock;
const sendTextMessagesMock = sendTextMessages as jest.Mock;

const personPhoneNumberMock = 'person-phone-number-mock';
const mockPerson = {
  rxGroupType: 'SIE',
  firstName: 'first',
  lastName: 'last',
  dateOfBirth: '01/01/2000',
  primaryMemberRxId: 'id-1',
  masterId: 'master-id-mock',
  phoneNumber: personPhoneNumberMock,
} as IPerson;

const mockPersonNoMasterId = {
  rxGroupType: 'SIE',
  firstName: 'first',
  lastName: 'last',
  dateOfBirth: '01/01/2000',
  primaryMemberRxId: 'MYRX-ID',
  rxSubGroup: 'SOMEGROUP',
  phoneNumber: personPhoneNumberMock,
} as IPerson;

const mockPersonList = [mockPerson];
const mockPersonListValid = [mockPersonNoMasterId];
const mockPersonListCash = [
  {
    rxGroupType: 'CASH',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'MYRX-ID',
    rxSubGroup: 'CASH01',
    phoneNumber: personPhoneNumberMock,
  } as IPerson,
];
const twilioClient = {} as Twilio;
const prescriberNpiMock = 'prescriber-npi-mock';

const mockPharmacyDetailsResponse = {
  address: {
    city: 'BELLEVUE',
    distance: '5',
    lineOne: '10116 NE 8TH STREET',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  hours: [
    {
      closes: {
        hours: 7,
        minutes: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 7,
        minutes: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
    },
  ],
  name: 'BARTELL DRUGS #40',
  ncpdp: 'mock-ncpdp',
  twentyFourHours: false,
} as IPrescriptionPharmacy;
const mockPharmacyResource = {
  resource: {
    resourceType: 'Organization',
    id: '4929432', // ncpdp
    identifier: [
      {
        type: {
          coding: [
            {
              system: 'http://hl7.org/fhir/ValueSet/identifier-type',
              code: 'NCPDP',
              display: "Pharmacy's NCPDP",
            },
          ],
        },
        value: '4929432',
      },
    ],
    name: 'Prescryptive Pharmacy',
    alias: ['Selected Pharmacy'],
    contact: [
      {
        telecom: [
          {
            system: 'phone',
            value: '555555555',
          },
          {
            system: 'fax',
            value: '888888888',
          },
          {
            system: 'email',
            value: 'test@prescryptivepharmacy.com',
          },
        ],
        address: {
          line: ['Test 1', 'Line 2'],
          city: 'Redmond',
          state: 'OR',
          postalCode: '123456',
        },
      },
    ],
  },
} as ResourceWrapper;

const versionMock = 'v1' as EndpointVersion;

describe('sendPrescriptionHandler', () => {
  describe('failure cases', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(
        prescriberNpiMock
      );
      getRequestQueryMock.mockReturnValue(undefined);
    });

    it('returns error if not mock prescription and no person profile exists', async () => {
      const responseMock = {
        locals: {
          personList: [],
          features: {},
        },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValue(expected);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
      expect(getPrescriptionByIdMock).not.toBeCalled();
    });

    it('returns error if get prescription by id api returns error', async () => {
      const responseMock = {
        locals: { personList: mockPersonList, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        errorCode: 404,
      });
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        404,
        ErrorConstants.INTERNAL_SERVER_ERROR
      );
      expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    });
    it('returns error if member id does not match', async () => {
      const responseMock = {
        locals: { personList: mockPersonList, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: prescriptionFhirMock,
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(false);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.UNAUTHORIZED_ACCESS
      );
      expect(getPharmacyDetailsByNcpdpMock).not.toBeCalled();
    });
    it('return error when prescription already have pharmacy', async () => {
      const responseMock = {
        locals: { personList: mockPersonListValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: prescriptionWithPharmacyFhirMock,
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PHARMACY_ID_ALREADY_EXISTS
      );
      expect(getPharmacyDetailsByNcpdpMock).not.toBeCalled();
    });
    it('return error when ncpdp sent is not found by pharmacy search API', async () => {
      const responseMock = {
        locals: { personList: mockPersonListValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: prescriptionFhirMock,
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(undefined);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.PHARMACY_NOT_FOUND
      );
      expect(buildPharmacyResourceMock).not.toBeCalled();
    });
    it('return error when update pharmacy API returns error', async () => {
      const responseMock = {
        locals: { personList: mockPersonListValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: JSON.parse(JSON.stringify(prescriptionFhirMock)),
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );
      buildPharmacyResourceMock.mockReturnValueOnce(mockPharmacyResource);
      updatePrescriptionByIdMock.mockReturnValueOnce({
        success: false,
        errorCode: 404,
      });
      const updatedPrescription = JSON.parse(
        JSON.stringify(prescriptionFhirMock)
      );
      updatedPrescription.entry.push(mockPharmacyResource);
      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2000-01-01T00:00:00.000Z');

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
        'mock-ncpdp',
        configurationMock
      );
      expect(buildPharmacyResourceMock).toBeCalledTimes(1);
      expect(buildPharmacyResourceMock).toBeCalledWith(
        mockPharmacyDetailsResponse
      );
      expect(updatePrescriptionByIdMock).toBeCalledWith(
        updatedPrescription,
        configurationMock
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        404,
        ErrorConstants.INTERNAL_SERVER_ERROR
      );
      expect(buildSendToPharmacyResponseMock).not.toBeCalled();
    });

    it('Calls smartprice API for prices to publish from sendPrescriptionHandler if there is no error', async () => {
      const responseMock = {
        locals: { personList: mockPersonListCash, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      buildSendToPharmacyResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: JSON.parse(JSON.stringify(prescriptionFhirMock)),
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);

      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );
      buildPharmacyResourceMock.mockReturnValueOnce(mockPharmacyResource);
      updatePrescriptionByIdMock.mockReturnValueOnce({
        success: true,
      });
      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2000-01-01T00:00:00.000Z');
      const updatedPrescription = JSON.parse(
        JSON.stringify(prescriptionFhirMock)
      );
      updatedPrescription.entry.push(mockPharmacyResource);

      successResponseMock.mockReturnValueOnce(expected);

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
        'mock-ncpdp',
        configurationMock
      );
      expect(buildPharmacyResourceMock).toBeCalledWith(
        mockPharmacyDetailsResponse
      );
      expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
        configurationMock,
        true,
        '00186077660',
        50,
        'mock-ncpdp'
      );

      const twilioClientMock = {} as Twilio;

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
      const isSmartPriceEligibleMock = true;

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
          person: mockPersonListCash[0],
          isSmartPriceEligible: isSmartPriceEligibleMock,
          prescriberNpi: prescriberNpiMock,
          isRTPB: responseMock.locals.features.usertpb,
        };

      expect(buildSendToPharmacyResponseMock).toHaveBeenCalledWith(
        expectedBuildSendToPharmacyResponseArgs
      );

      expect(updatePrescriptionByIdMock).toBeCalledWith(
        updatedPrescription,
        configurationMock
      );
      expect(knownFailureResponseMock).not.toBeCalled();
    });

    it('returns error from sendPrescriptionHandler if any exception occurs', async () => {
      const responseMock = {
        locals: { personList: mockPersonListValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      unknownFailureResponseMock.mockReturnValueOnce(expected);
      const error = { message: 'internal error' };
      getPrescriptionByIdMock.mockImplementation(() => {
        throw error;
      });
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(unknownFailureResponseMock).toBeCalledTimes(1);
      expect(unknownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        error
      );
      expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    });

    it('should pass "" as rxSubGroup if not exists for groupPlanCode to pricing API', async () => {
      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2000-01-01T00:00:00.000Z');
      const mockPersonListInValid = [
        {
          rxGroupType: 'SIE',
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'MYRX-ID',
        } as IPerson,
      ];
      const responseMock = {
        locals: { personList: mockPersonListInValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: JSON.parse(JSON.stringify(prescriptionFhirMock)),
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );
      buildPharmacyResourceMock.mockReturnValueOnce(mockPharmacyResource);
      updatePrescriptionByIdMock.mockReturnValueOnce({
        success: true,
      });
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );
      expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
        configurationMock,
        false,
        '00186077660',
        50,
        'mock-ncpdp'
      );
    });
    it('returns error if master id is missing', async () => {
      getRequestQueryMock.mockReturnValue('true');

      const responseMock = {
        locals: { personList: mockPersonList, features: {} },
      } as unknown as Response;
      const requestMock = {
        query: { blockchain: 'true' },
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);

      const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
        prescription: prescriptionBlockchainNoMasterIdFhirMock,
      };

      getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
        prescriptionApiResponseMock
      );

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
      );
      expect(getPersonForBlockchainPrescriptionMock).not.toBeCalled();
      expect(isMasterIdValidForUserAndDependentsMock).not.toBeCalled();
    });

    it('returns error if master id does not match', async () => {
      getRequestQueryMock.mockReturnValue('true');

      const responseMock = {
        locals: { personList: mockPersonList, features: {} },
      } as unknown as Response;
      const requestMock = {
        query: { blockchain: 'true' },
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPersonForBlockchainPrescriptionMock.mockReturnValue(mockPerson);

      const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
        prescription: prescriptionBlockchainFhirMock,
      };

      getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
        prescriptionApiResponseMock
      );

      isMasterIdValidForUserAndDependentsMock.mockReturnValue(false);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.UNAUTHORIZED_ACCESS
      );
      expect(getPersonForBlockchainPrescriptionMock).not.toBeCalled();
      expect(getPharmacyDetailsByNcpdpMock).not.toBeCalled();
      expect(assignPharmacyToBlockchainPrescriptionMock).not.toBeCalled();
    });

    it('return error when blockchain prescription already have pharmacy', async () => {
      getRequestQueryMock.mockReturnValue('true');

      const responseMock = {
        locals: { personList: mockPersonListValid, features: {} },
      } as unknown as Response;
      const requestMock = {
        query: { blockchain: 'true' },
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPersonForBlockchainPrescriptionMock.mockReturnValue(
        mockPersonNoMasterId
      );

      const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
        prescription: prescriptionBlockchainWithPharmacyIdFhirMock,
      };

      getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
        prescriptionApiResponseMock
      );

      isMasterIdValidForUserAndDependentsMock.mockReturnValue(true);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        '101010110'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PHARMACY_ID_ALREADY_EXISTS
      );
      expect(getPersonForBlockchainPrescriptionMock).not.toBeCalled();
      expect(getPharmacyDetailsByNcpdpMock).not.toBeCalled();
      expect(assignPharmacyToBlockchainPrescriptionMock).not.toBeCalled();
    });

    it('returns error if member id is missing in person for blockchain prescription', async () => {
      getRequestQueryMock.mockReturnValue('true');

      const masterIdMock = 'MYRX-ID';

      const mockPersonNoMemberId = {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        masterId: 'master-id-mock',
      } as IPerson;

      const mockPersonNoMemberIdList = [mockPersonNoMemberId];

      const responseMock = {
        locals: { personList: mockPersonNoMemberIdList, features: {} },
      } as unknown as Response;
      const requestMock = {
        query: { blockchain: 'true' },
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      knownFailureResponseMock.mockReturnValueOnce(expected);
      getPersonForBlockchainPrescriptionMock.mockReturnValue(
        mockPersonNoMemberId
      );

      const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
        prescription: prescriptionBlockchainFhirMock,
      };

      getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
        prescriptionApiResponseMock
      );

      isMasterIdValidForUserAndDependentsMock.mockReturnValue(true);

      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PRESCRIPTION_PERSON_FOR_MASTER_ID_MISSING
      );
      expect(getPersonForBlockchainPrescriptionMock).toHaveBeenCalledWith(
        mockPersonNoMemberIdList,
        masterIdMock
      );
      expect(assignPharmacyToBlockchainPrescriptionMock).not.toBeCalled();
    });

    it.each([[400], [undefined]])(
      'returns error when response from assign to pharmacy is not success for blockchain prescription when response errorCode is %p and message is %p',
      async (errorCodeMock?: number) => {
        getRequestQueryMock.mockReturnValue('true');

        const prescriptionIdMock = 'id-1';

        const masterIdMock = 'MYRX-ID';

        const ncpdpMock = 'mock-ncpdp';

        const mockPersonValidMasterId = {
          rxGroupType: 'SIE',
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
          masterId: masterIdMock,
        } as IPerson;

        const mockPersonValidMasterIdList = [mockPersonValidMasterId];

        const responseMock = {
          locals: { personList: mockPersonValidMasterIdList, features: {} },
        } as unknown as Response;
        const requestMock = {
          query: { blockchain: 'true' },
          body: { identifier: prescriptionIdMock, ncpdp: ncpdpMock },
        } as unknown as Request;
        const expected = {};
        knownFailureResponseMock.mockReturnValueOnce(expected);
        getPersonForBlockchainPrescriptionMock.mockReturnValue(
          mockPersonValidMasterId
        );

        const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
          prescription: prescriptionBlockchainFhirMock,
        };

        getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
          prescriptionApiResponseMock
        );

        isMasterIdValidForUserAndDependentsMock.mockReturnValue(true);

        getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
          mockPharmacyDetailsResponse
        );

        assignPharmacyToBlockchainPrescriptionMock.mockReturnValueOnce({
          success: false,
          errorCode: errorCodeMock,
        });

        await sendPrescriptionHandler(
          requestMock,
          responseMock,
          configurationMock,
          twilioClient
        );

        expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
          responseMock,
          masterIdMock
        );
        expect(knownFailureResponseMock).toHaveBeenCalledWith(
          responseMock,
          errorCodeMock
            ? HttpStatusCodes.BAD_REQUEST
            : HttpStatusCodes.INTERNAL_SERVER_ERROR,
          ErrorConstants.INTERNAL_SERVER_ERROR
        );
        expect(getPersonForBlockchainPrescriptionMock).toHaveBeenCalledWith(
          mockPersonValidMasterIdList,
          masterIdMock
        );
        expect(assignPharmacyToBlockchainPrescriptionMock).toHaveBeenCalledWith(
          prescriptionIdMock,
          masterIdMock,
          ncpdpMock,
          configurationMock
        );
      }
    );

    it('sends expected messages and returns success response when pharmacy is assigned to blockchain prescription', async () => {
      const thisCouponMock = {} as ICoupon;
      getCouponIfEligibleMock.mockReset();
      getCouponIfEligibleMock.mockReturnValue(thisCouponMock);
      getRequestQueryMock.mockReturnValue('true');

      const prescriptionIdMock = 'id-1';

      const masterIdMock = 'MYRX-ID';

      const ncpdpMock = 'mock-ncpdp';

      const personPhoneNumberMock = 'person-phone-number-mock';

      const mockPersonValidMasterId = {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        masterId: masterIdMock,
        rxSubGroup: 'SOMEGROUP',
        phoneNumber: personPhoneNumberMock,
      } as IPerson;

      const mockPersonValidMasterIdList = [mockPersonValidMasterId];

      const responseMock = {
        locals: {
          personList: mockPersonValidMasterIdList,
          features: {},
        },
      } as unknown as Response;
      const requestMock = {
        query: { blockchain: 'true' },
        body: { identifier: prescriptionIdMock, ncpdp: ncpdpMock },
      } as unknown as Request;

      const twilioClientMock = {} as Twilio;

      const ndcMock = '59746017210';
      const quantityMock = 24;
      const supplyMock = 6;
      const patientIdMock = 'id-1';
      const groupPlanCodeMock = 'SOMEGROUP';
      const refillNumberMock = '2';
      const bundleIdMock = 'id-1';
      const rxNumberMock = '';
      const typeMock = 'prescription';
      const isSmartPriceEligibleMock = false;

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
          coupon: thisCouponMock,
          twilioClient: twilioClientMock,
          person: mockPersonValidMasterId,
          version: versionMock,
          isSmartPriceEligible: isSmartPriceEligibleMock,
          isRTPB: responseMock.locals.features.usertpb,
        };

      const expected = {};
      buildSendToPharmacyResponseMock.mockReturnValueOnce(expected);
      getPersonForBlockchainPrescriptionMock.mockReturnValue(
        mockPersonValidMasterId
      );

      const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
        prescription: prescriptionBlockchainFhirMock,
      };
      getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
        prescriptionApiResponseMock
      );

      isMasterIdValidForUserAndDependentsMock.mockReturnValue(true);

      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );

      assignPharmacyToBlockchainPrescriptionMock.mockReturnValueOnce({
        success: true,
      });

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        masterIdMock
      );
      expect(getPersonForBlockchainPrescriptionMock).toHaveBeenCalledWith(
        mockPersonValidMasterIdList,
        masterIdMock
      );
      expect(assignPharmacyToBlockchainPrescriptionMock).toHaveBeenCalledWith(
        prescriptionIdMock,
        masterIdMock,
        ncpdpMock,
        configurationMock
      );

      expect(buildSendToPharmacyResponseMock).toHaveBeenCalledWith({
        ...expectedBuildSendToPharmacyResponseArgs,
        prescriberNpi: prescriberNpiMock,
      });
      expect(knownFailureResponseMock).not.toBeCalled();
    });
  });

  describe('success cases', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(
        prescriberNpiMock
      );
      getRequestQueryMock.mockReturnValue(undefined);
    });

    it('returns success when identifier starts with mock', async () => {
      const responseMock = {
        locals: {
          personList: mockPersonList,
          features: {
            usertpb: true,
          },
        },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'mock', ncpdp: 'mock-ncpdp' },
      } as unknown as Request;
      const expected = {};
      sendTextMessagesMock.mockResolvedValueOnce({});
      successResponseMock.mockReturnValueOnce(expected);
      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );
      expect(successResponseMock).toHaveBeenCalledWith(
        responseMock,
        SuccessConstants.SUCCESS_OK
      );
      expect(knownFailureResponseMock).not.toBeCalled();

      expect(sendTextMessagesMock).toHaveBeenCalledTimes(1);
      expect(sendTextMessagesMock).toHaveBeenNthCalledWith(
        1,
        configurationMock,
        twilioClient,
        responseMock,
        true,
        undefined,
        mockPerson,
        versionMock
      );
    });

    it('returns success from sendPrescriptionHandler if there is no error', async () => {
      const responseMock = {
        locals: {
          personList: mockPersonListValid,
          features: { usertpb: true },
        },
      } as unknown as Response;
      const requestMock = {
        body: { identifier: 'id-1', ncpdp: 'mock-ncpdp', language: 'English' },
      } as unknown as Request;
      const expected = {};
      buildSendToPharmacyResponseMock.mockReturnValueOnce(expected);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: JSON.parse(JSON.stringify(prescriptionFhirMock)),
      });
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
        mockPharmacyDetailsResponse
      );
      buildPharmacyResourceMock.mockReturnValueOnce(mockPharmacyResource);
      updatePrescriptionByIdMock.mockReturnValueOnce({
        success: true,
      });
      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValueOnce('2000-01-01T00:00:00.000Z');
      const updatedPrescription = JSON.parse(
        JSON.stringify(prescriptionFhirMock)
      );
      updatedPrescription.entry.push(mockPharmacyResource);

      await sendPrescriptionHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioClient
      );

      expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
      expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
        responseMock,
        'MYRX-ID'
      );
      expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
        'mock-ncpdp',
        configurationMock
      );
      expect(buildPharmacyResourceMock).toBeCalledWith(
        mockPharmacyDetailsResponse
      );
      expect(getCouponIfEligibleMock).toHaveBeenCalledWith(
        configurationMock,
        false,
        '00186077660',
        50,
        'mock-ncpdp'
      );

      const twilioClientMock = {} as Twilio;

      const ndcMock = '00186077660';
      const quantityMock = 50;
      const supplyMock = 5;
      const ncpdpMock = 'mock-ncpdp';
      const patientIdMock = 'MYRX-ID';
      const groupPlanCodeMock = 'SOMEGROUP';
      const refillNumberMock = '1';
      const bundleIdMock = 'mock';
      const rxNumberMock = 'MOCK-RXNUMBER';
      const typeMock = 'prescription';
      const couponMock = undefined;
      const isSmartPriceEligibleMock = false;

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
          person: mockPersonListValid[0],
          prescriberNpi: prescriberNpiMock,
          isSmartPriceEligible: isSmartPriceEligibleMock,
          isRTPB: responseMock.locals.features.usertpb,
        };

      expect(buildSendToPharmacyResponseMock).toHaveBeenCalledWith(
        expectedBuildSendToPharmacyResponseArgs
      );

      expect(updatePrescriptionByIdMock).toBeCalledWith(
        updatedPrescription,
        configurationMock
      );
      expect(knownFailureResponseMock).not.toBeCalled();
    });
  });
});
