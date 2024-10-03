// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { InternalServerRequestError } from '../../../errors/request-errors/internal-server.request-error';
import { RequestError } from '../../../errors/request-errors/request.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPatientMock } from '../../../mock-data/patient-account.mock';
import { IPatientLink } from '../../../models/fhir/patient/patient-link';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { updatePatientAccount } from '../../../utils/external-api/patient-account/update-patient-account';
import {
  addMembershipPlan,
  hasMatchingCoverage,
} from './add-membership-link.helper';
import { getActiveCoveragesOfPatient } from '../../../utils/fhir-patient/get-active-coverages-of-patient';
import { getPatientCoverageByQuery } from '../../../utils/external-api/coverage/get-patient-coverage-by-query';
import { ICoverage } from '../../../models/fhir/patient-coverage/coverage';
import {
  coverageMock1,
  coverageMock2,
  cashCoveragePrimaryMock,
} from '../../../mock-data/fhir-coverage.mock';
import { getPatientCoverageByMemberId } from '../../../utils/coverage/get-patient-coverage-by-member-id';

jest.mock('../../../utils/external-api/patient-account/update-patient-account');
const updatePatientAccountMock = updatePatientAccount as jest.Mock;

jest.mock('../../../utils/external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

jest.mock('../../../utils/response-helper');
const pbmMasterIdMock = 'master-id';
const pbmMemberIdMock = 'sie-member-id';

jest.mock('../../../utils/fhir-patient/get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

jest.mock('../../../utils/coverage/get-patient-coverage-by-member-id');
const getPatientCoverageByMemberIdMock =
  getPatientCoverageByMemberId as jest.Mock;

jest.mock('../../../utils/external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

describe('AddMembershipLinkHelper', () => {
  describe('hasMatchingCoverage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('returns false matching rxGroup with patientCoverages is empty', async () => {
      getPatientCoverageByQueryMock.mockResolvedValue([]);
      getActiveCoveragesOfPatientMock.mockReturnValue([
        coverageMock1 as ICoverage,
        coverageMock2 as ICoverage,
      ]);
      const result = await hasMatchingCoverage(
        configurationMock,
        patientAccountPrimaryWithPatientMock,
        ''
      );
      expect(result).toBeFalsy();
    });

    it('returns true matching rxGroup when patientCoverages is not empty', async () => {
      getPatientCoverageByQueryMock.mockResolvedValue([]);
      getActiveCoveragesOfPatientMock.mockReturnValue([
        cashCoveragePrimaryMock,
        coverageMock2 as ICoverage,
      ]);
      const result = await hasMatchingCoverage(
        configurationMock,
        patientAccountPrimaryWithPatientMock,
        'family-id'
      );
      expect(result).toBeTruthy();
    });

    it('returns false when patientCoverages is empty', async () => {
      getPatientCoverageByQueryMock.mockResolvedValue(undefined);
      const result = await hasMatchingCoverage(
        configurationMock,
        patientAccountPrimaryWithPatientMock,
        ''
      );
      expect(result).toBeFalsy();
    });
  });

  describe('addMembershipPlan', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getPatientCoverageByMemberIdMock.mockResolvedValue(undefined);
    });

    it('throws exception if patient id is missing in the patient parameter', async () => {
      const patientMock = {
        ...patientAccountPrimaryWithPatientMock.patient,
        id: undefined,
      };
      try {
        await addMembershipPlan(
          patientAccountPrimaryWithPatientMock,
          patientMock,
          pbmMasterIdMock,
          configurationMock,
          pbmMemberIdMock
        );
        fail('Expected exception but none thrown!');
      } catch (error) {
        const expectedError = new InternalServerRequestError(
          ErrorConstants.PATIENT_ID_MISSING
        );
        expect(error).toEqual(expectedError);
      }
    });

    it('throws exception if member id is part of multiple pbm tenants', async () => {
      const patientMock = {
        ...patientAccountPrimaryWithPatientMock.patient,
      };
      getPatientCoverageByMemberIdMock.mockResolvedValue([
        coverageMock1 as ICoverage,
        coverageMock2 as ICoverage,
      ]);
      getActiveCoveragesOfPatientMock.mockReturnValue([
        coverageMock1 as ICoverage,
        coverageMock2 as ICoverage,
      ]);
      try {
        await addMembershipPlan(
          patientAccountPrimaryWithPatientMock,
          patientMock,
          pbmMasterIdMock,
          configurationMock,
          pbmMemberIdMock
        );
        fail('Expected exception but none thrown!');
      } catch (error) {
        expect(updatePatientAccountMock).toHaveBeenCalledWith(
          configurationMock,
          {
            ...patientAccountPrimaryWithPatientMock,
            reference: ['phone-hash', 'cash-member-id'],
          }
        );
        const expectedError = new RequestError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          ErrorConstants.COVERAGE_INVALID_DATA
        );
        expect(error).toEqual(expectedError);
      }
    });

    it('activates membership by adding link to the cash patient', async () => {
      const patientMock = {
        ...patientAccountPrimaryWithPatientMock.patient,
      };
      const patientAccountMock = {
        ...patientAccountPrimaryWithPatientMock,
        reference: ['phone-hash', 'cash-member-id'],
      };

      const expectedPatientLink: IPatientLink = {
        other: {
          reference: `patient/${pbmMasterIdMock}`,
        },
        type: 'seealso',
      };

      const expectedUpdatedPatientMock = {
        ...patientMock,
        link: [expectedPatientLink],
      };
      await addMembershipPlan(
        patientAccountMock,
        patientMock,
        pbmMasterIdMock,
        configurationMock,
        pbmMemberIdMock
      );
      expect(updatePatientByMasterIdMock).toHaveBeenCalledWith(
        patientMock.id,
        expectedUpdatedPatientMock,
        configurationMock
      );
      expect(updatePatientAccountMock).toHaveBeenCalledWith(
        configurationMock,
        patientAccountPrimaryWithPatientMock
      );
    });
  });
});
