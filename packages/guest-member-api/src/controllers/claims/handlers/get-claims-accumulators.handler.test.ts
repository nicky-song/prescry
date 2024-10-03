// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

import { getClaimsAccumulatorsHandler } from './get-claims-accumulators.handler';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { isMemberIdValidForUserAndDependents } from '../../../utils/person/get-dependent-person.helper';
import { buildAccumulators } from '../helpers/build-accumulators';
import { IAccumulators } from '@phx/common/src/models/accumulators';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IPerson } from '@phx/common/src/models/person';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import {
  getCmsPlanContent,
  IGetCmsPlanContentResponse,
  IPlanDataResponse,
} from '../../../utils/external-api/cms-api-content/get-cms-plan-content';
import {
  getAccumulators,
  IAccumulatorsResponse,
  IGetAccumulatorsResponse,
} from '../../../utils/external-api/accumulators/get-accumulators';
import { ICmsFileContent } from '../../../models/cms/cms-file-content';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/person/get-dependent-person.helper');
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;

jest.mock('../../../utils/external-api/accumulators/get-accumulators');
const getAccumulatorsMock = getAccumulators as jest.Mock;

jest.mock('../../../utils/external-api/cms-api-content/get-cms-plan-content');
const getCmsPlanContentMock = getCmsPlanContent as jest.Mock;

jest.mock('../helpers/build-accumulators');
const buildAccumulatorsMock = buildAccumulators as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getResponseLocalMock = getResponseLocal as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

describe('getClaimsAccumulatorsHandler', () => {
  const responseMock = {} as Response;

  const personListNoPbmMock: IPerson[] = [
    {
      rxGroupType: RxGroupTypesEnum.CASH,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
    } as IPerson,
  ];

  const personListMock: IPerson[] = [
    {
      rxGroupType: RxGroupTypesEnum.SIE,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      rxGroup: 'rx-group',
      rxSubGroup: 'rx-sub-group',
    } as IPerson,
  ];

  const personListNoPrimaryIdMock: IPerson[] = [
    {
      rxGroupType: RxGroupTypesEnum.SIE,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
    } as IPerson,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    successResponseMock.mockReturnValue('success');
    getResponseLocalMock.mockReturnValue([]);
    getRequiredResponseLocalMock.mockReturnValue({});
  });

  it.each([
    [undefined, undefined, undefined, true],
    [undefined, undefined, 'emulated-rx-sub-group', true],
    [undefined, 'emulated-member-id', undefined, true],
    [undefined, 'emulated-member-id', 'emulated-rx-sub-group', false],
    [[], undefined, undefined, true],
    [[], undefined, 'emulated-rx-sub-group', true],
    [[], 'emulated-member-id', undefined, true],
    [[], 'emulated-member-id', 'emulated-rx-sub-group', false],
    [personListNoPbmMock, undefined, undefined, true],
    [personListNoPbmMock, 'emulated-member-id', 'emulated-rx-sub-group', false],
    [personListNoPrimaryIdMock, undefined, undefined, true],
    [
      personListNoPrimaryIdMock,
      'emulated-member-id',
      'emulated-rx-sub-group',
      false,
    ],
  ])(
    'validates SIE profile exists (personList: %p, emulatedMemberId: %p, emulatedRxSubGroup: %p)',
    async (
      personListMock: undefined | IPerson[],
      emulatedMemberIdMock: string | undefined,
      emulatedRxSubGroupMock: string | undefined,
      isFailureExpected: boolean
    ) => {
      const featuresMock: IFeaturesState = {
        memberId: emulatedMemberIdMock,
        rxSubGroup: emulatedRxSubGroupMock,
      };
      getRequiredResponseLocalMock.mockReturnValue(featuresMock);
      getResponseLocalMock.mockReturnValue(personListMock);

      const errorMock = new Error('known-failure-response');
      knownFailureResponseMock.mockReturnValue(errorMock);

      const response = await getClaimsAccumulatorsHandler(
        responseMock,
        configurationMock
      );

      if (isFailureExpected) {
        expect(response).toEqual(errorMock);
        expectToHaveBeenCalledOnceOnlyWith(
          knownFailureResponseMock,
          responseMock,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.SIE_PROFILE_NOT_FOUND
        );
      } else {
        expect(response).not.toEqual(errorMock);
      }
    }
  );

  it.each([
    [undefined, true],
    ['emulated-member-id', false],
  ])(
    'validates member access (emulatedMemberId: %p)',
    async (
      emulatedMemberIdMock: undefined | string,
      isFailureExpected: boolean
    ) => {
      const featuresMock: IFeaturesState = {
        memberId: emulatedMemberIdMock,
        rxSubGroup: 'emulated-rx-sub-group',
      };
      getRequiredResponseLocalMock.mockReturnValue(featuresMock);
      getResponseLocalMock.mockReturnValue(personListMock);
      isMemberIdValidForUserAndDependentsMock.mockReturnValue(false);

      const errorMock = new Error('known-failure-response');
      knownFailureResponseMock.mockReturnValue(errorMock);

      const response = await getClaimsAccumulatorsHandler(
        responseMock,
        configurationMock
      );

      if (isFailureExpected) {
        expect(response).toEqual(errorMock);
        expectToHaveBeenCalledOnceOnlyWith(
          knownFailureResponseMock,
          responseMock,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS
        );
      } else {
        expect(response).not.toEqual(errorMock);
      }
    }
  );

  it('returns unknown failure if exception occurs', async () => {
    getResponseLocalMock.mockReturnValue(personListMock);

    isMemberIdValidForUserAndDependentsMock.mockReturnValue(true);

    const errorMock = new Error('unknown-failure-response');
    unknownFailureResponseMock.mockReturnValue(errorMock);

    const endpointErrorMock = new Error('unknown-error');
    getAccumulatorsMock.mockImplementation(() => {
      throw endpointErrorMock;
    });

    const response = await getClaimsAccumulatorsHandler(
      responseMock,
      configurationMock
    );

    expect(response).toEqual(errorMock);

    const expectedMemberId = personListMock[0].primaryMemberRxId;
    const expectedSubRxGroup = personListMock[0].rxSubGroup;
    expectToHaveBeenCalledOnceOnlyWith(
      getAccumulatorsMock,
      expectedMemberId,
      expectedSubRxGroup,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      unknownFailureResponseMock,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      endpointErrorMock
    );
  });

  it.each([
    [undefined, undefined],
    ['emulated-member-id', 'emulated-rx-sub-group'],
  ])(
    'returns success response (emulatedMemberId: %p, emulatedRxSubgroup: %p)',
    async (
      emulatedMemberIdMock: undefined | string,
      emulatedRxSubGroupMock: undefined | string
    ) => {
      const featuresMock: IFeaturesState = {
        memberId: emulatedMemberIdMock,
        rxSubGroup: emulatedRxSubGroupMock,
      };
      getRequiredResponseLocalMock.mockReturnValue(featuresMock);
      getResponseLocalMock.mockReturnValue(personListMock);

      const claimsAccumulatorsResponseMock: IAccumulatorsResponse = {
        personCode: 'person-code',
        familyId: 'family-id',
        uniqueId: 'unique-id',
        individualTotalDeductible: 1500,
        familyTotalDeductible: 5000,
        individualTotalOutOfPocket: 1600,
        familyTotalOutOfPocket: 6000,
      };

      const planDataResponseMock: IPlanDataResponse = {
        FamilyDeductible: 1000,
        FamilyMax: 2000,
        IndividualDeductible: 3000,
        IndividualMax: 4000,
        PlanDetailsDocument: {
          url: 'plan-details-document-url',
        } as ICmsFileContent,
      };

      const claimAccumulatorsMock: IAccumulators = {
        individualDeductible: { used: 1500, maximum: 1500 },
        individualOutOfPocket: { used: 1600, maximum: 2500 },
        familyDeductible: { used: 5000, maximum: 5000 },
        familyOutOfPocket: { used: 6000, maximum: 10000 },
      };

      isMemberIdValidForUserAndDependentsMock.mockReturnValue(true);

      const claimAccumulatorsEndpointResponseMock: IGetAccumulatorsResponse = {
        claimsAccumulators: claimsAccumulatorsResponseMock,
      };
      getAccumulatorsMock.mockResolvedValue(
        claimAccumulatorsEndpointResponseMock
      );

      const planEndpointResponseMock: IGetCmsPlanContentResponse = {
        planData: planDataResponseMock,
      };
      getCmsPlanContentMock.mockResolvedValue(planEndpointResponseMock);

      buildAccumulatorsMock.mockReturnValue(claimAccumulatorsMock);

      const successMock = 'success';
      successResponseMock.mockReturnValue(successMock);

      const response = await getClaimsAccumulatorsHandler(
        responseMock,
        configurationMock
      );

      expect(response).toEqual(successMock);

      expect(getAccumulatorsMock).toHaveBeenCalledTimes(1);

      const expectedMemberId =
        emulatedMemberIdMock ?? personListMock[0].primaryMemberRxId;
      const expectedRxSubGroup =
        emulatedRxSubGroupMock ?? personListMock[0].rxSubGroup;
      expectToHaveBeenCalledOnceOnlyWith(
        getAccumulatorsMock,
        expectedMemberId,
        expectedRxSubGroup,
        configurationMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getCmsPlanContentMock,
        expectedRxSubGroup,
        configurationMock,
        true
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildAccumulatorsMock,
        claimsAccumulatorsResponseMock,
        planDataResponseMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        successResponseMock,
        responseMock,
        SuccessConstants.SUCCESS_OK,
        claimAccumulatorsMock
      );
    }
  );
});
