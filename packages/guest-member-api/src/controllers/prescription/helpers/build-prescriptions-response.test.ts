// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { SuccessResponse } from '../../../utils/response-helper';
import { buildPrescriptionsResponse } from './build-prescriptions-response';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { SuccessConstants } from '../../../constants/response-messages';
import { IFhir } from '../../../models/fhir/fhir';
import { buildwhitefishAndBlockchainPrescriptions } from './build-whitefish-and-blockchain-prescriptions';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
} from '../mock/get-mock-fhir-object';
const successResponseMock = SuccessResponse as jest.Mock;
const buildwhitefishAndBlockchainPrescriptionsMock =
  buildwhitefishAndBlockchainPrescriptions as jest.Mock;

jest.mock('../../../utils/response-helper');
jest.mock('./build-whitefish-and-blockchain-prescriptions');
beforeEach(() => {
  jest.clearAllMocks();
});

const mockPersonList = [
  {
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
    zip: '12345',
  } as IPerson,
];

const prescriptionInfo: IPrescriptionInfo = {
  drugName: 'MODERNA COVID-19',
  form: 'INJ',
  ndc: '80777027310',
  prescriptionId: 'mock',
  primaryMemberRxId: 'MYRX-ID',
  refills: 0,
  strength: '0',
  quantity: 20,
  unit: '.47-0.27-0.11-',
  zipCode: '11801',
  orderNumber: '11222',
};

const prescriptionsMock: IPrescriptionInfo[] = [];

const prescriptionsIFhirMock: IFhir[] = [];

prescriptionsIFhirMock.push(prescriptionFhirMock);

prescriptionsMock.push(prescriptionInfo);

const pageMock = 1;

describe('buildPrescriptionInfoResponse', () => {
  it('should build prescriptions', () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildwhitefishAndBlockchainPrescriptionsMock.mockReturnValueOnce(
      prescriptionsMock
    );

    const actual = buildPrescriptionsResponse(
      pageMock,
      responseMock,
      prescriptionsIFhirMock,
      mockPersonList,
      [prescriptionBlockchainFhirMock]
    );
    expect(actual).toBe(expected);
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionsMock
    );
    expect(buildwhitefishAndBlockchainPrescriptionsMock).toBeCalledWith(
      pageMock,
      mockPersonList,
      prescriptionsIFhirMock,
      [prescriptionBlockchainFhirMock]
    );
  });
});
