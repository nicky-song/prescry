// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  getPrescriptionsEndpointHelper,
  IGetPrescriptionsHelperResponse,
} from './get-prescriptions-endpoint.helper';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
} from '../../prescription/mock/get-mock-fhir-object';
import { getBlockchainPrescriptionsEndpointHelper } from './get-blockchain-prescriptions-endpoint.helper';
import { getPrescriptionsByMemberRxIds } from './get-prescriptions-by-member-rx-ids.helper';

jest.mock('./get-prescriptions-endpoint.helper');
const getPrescriptionsEndpointHelperMock =
  getPrescriptionsEndpointHelper as jest.Mock;
jest.mock('./get-blockchain-prescriptions-endpoint.helper');
const getBlockchainPrescriptionsEndpointHelperMock =
  getBlockchainPrescriptionsEndpointHelper as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getPrescriptionsByMemberRxIds', () => {
  it.each([[true], [false]])(
    'return expected response when called with loggedInMemberIds and loggedInMasterIds when blockchain %p',
    async (blockchainMock: boolean) => {
      const clientPatientId = 'id-1';
      const loggedInMemberIdsMock = [clientPatientId];

      const masterId = 'id-1';
      const loggedInMasterIdsMock = [masterId];

      getPrescriptionsEndpointHelperMock.mockReturnValueOnce({
        prescriptions: [prescriptionFhirMock],
      });

      if (blockchainMock) {
        getBlockchainPrescriptionsEndpointHelperMock.mockReturnValueOnce({
          prescriptions: [prescriptionBlockchainFhirMock],
        });
      }

      const actual = await getPrescriptionsByMemberRxIds(
        loggedInMemberIdsMock,
        configurationMock,
        true,
        blockchainMock ? loggedInMasterIdsMock : undefined
      );
      expect(getPrescriptionsEndpointHelperMock).toHaveBeenCalledWith(
        clientPatientId,
        configurationMock,
        true
      );
      expect(getPrescriptionsEndpointHelperMock).toHaveBeenCalledTimes(1);
      if (blockchainMock) {
        expect(
          getBlockchainPrescriptionsEndpointHelperMock
        ).toHaveBeenCalledWith(masterId, configurationMock);
        expect(getPrescriptionsEndpointHelperMock).toHaveBeenCalledTimes(1);
      }

      const prescriptions = [prescriptionFhirMock];

      const blockchainPrescriptions = blockchainMock
        ? [prescriptionBlockchainFhirMock]
        : [];

      const expectedResponse: IGetPrescriptionsHelperResponse = {
        prescriptions,
        blockchainPrescriptions,
      };

      expect(actual).toEqual(expectedResponse);
    }
  );
  it('return expected response when called with empty loggedInMemberIds', async () => {
    const loggedInMemberIdsMockEmpty = [] as string[];

    const actual = await getPrescriptionsByMemberRxIds(
      loggedInMemberIdsMockEmpty,
      configurationMock,
      true
    );
    expect(getPrescriptionsEndpointHelperMock).not.toHaveBeenCalled();

    expect(actual).toEqual({ prescriptions: [], blockchainPrescriptions: [] });
  });
  it('return expected response when called with multiple loggedInMemberIds', async () => {
    const clientPatientId1 = 'id-1';
    const clientPatientId2 = 'id-2';
    const loggedInMemberIdsMock = [clientPatientId1, clientPatientId2];
    getPrescriptionsEndpointHelperMock.mockReturnValueOnce({
      prescriptions: [prescriptionFhirMock],
    });
    getPrescriptionsEndpointHelperMock.mockReturnValueOnce({
      prescriptions: [prescriptionFhirMockNoZip],
    });

    const actual = await getPrescriptionsByMemberRxIds(
      loggedInMemberIdsMock,
      configurationMock,
      true
    );
    expect(getPrescriptionsEndpointHelperMock).toHaveBeenNthCalledWith(
      1,
      clientPatientId1,
      configurationMock,
      true
    );
    expect(getPrescriptionsEndpointHelperMock).toHaveBeenNthCalledWith(
      2,
      clientPatientId2,
      configurationMock,
      true
    );
    expect(getPrescriptionsEndpointHelperMock).toHaveBeenCalledTimes(2);
    expect(actual).toEqual({
      prescriptions: [prescriptionFhirMock, prescriptionFhirMockNoZip],
      blockchainPrescriptions: [],
    });
  });
});
