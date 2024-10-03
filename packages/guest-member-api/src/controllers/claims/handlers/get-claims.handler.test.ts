// Copyright 2022 Prescryptive Health, Inc.

import { getClaimsHandler } from './get-claims.handler';
import { Response } from 'express';
import {
  claim1Mock,
  claim2Mock,
  claimsResponseMock,
} from '../mocks/claims.mock';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IPerson } from '@phx/common/src/models/person';
import { isMemberIdValidForUserAndDependents } from '../../../utils/person/get-dependent-person.helper';
import { buildClaims } from '../helpers/build-claims';
import { IClaim } from '@phx/common/src/models/claim';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import {
  buildClaimHistoryPdf,
  IClaimHistoryPdfIdentity,
} from '../helpers/build-claim-history-pdf';
import {
  getClaims,
  IGetClaimsResponse,
} from '../../../utils/external-api/claims/get-claims';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;

jest.mock('../../../utils/person/get-dependent-person.helper');
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;

jest.mock('../../../utils/external-api/claims/get-claims');
const getClaimsMock = getClaims as jest.Mock;

jest.mock('../helpers/build-claims');
const buildClaimsMock = buildClaims as jest.Mock;

jest.mock('../helpers/build-claim-history-pdf');
const buildClaimHistoryPdfMock = buildClaimHistoryPdf as jest.Mock;

describe('getClaimsHandler', () => {
  const responseMock = {} as Response;

  const personListWithNoPbmMock: IPerson[] = [
    {
      rxGroupType: RxGroupTypesEnum.CASH,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '2000-01-01',
      primaryMemberRxId: 'id-1',
    } as IPerson,
  ];

  const personListWithPbmMock: IPerson[] = [
    {
      rxGroupType: RxGroupTypesEnum.SIE,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '2000-01-01',
      primaryMemberRxId: 'id-1',
      rxGroup: 'rx-group',
      rxSubGroup: 'rx-sub-group',
    } as IPerson,
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    getRequiredResponseLocalMock.mockReturnValue({});
    getClaimsMock.mockResolvedValue({});
  });

  it.each([
    [undefined, undefined, undefined, true],
    [undefined, 'emulated-member-id', undefined, true],
    [undefined, undefined, 'emulated-rx-sub-group', true],
    [undefined, 'emulated-member-id', 'emulated-rx-sub-group', false],
    [[], undefined, undefined, true],
    [[], 'emulated-member-id', undefined, true],
    [[], undefined, 'emulated-rx-sub-group', true],
    [[], 'emulated-member-id', 'emulated-rx-sub-group', false],
    [personListWithNoPbmMock, undefined, undefined, true],
    [personListWithPbmMock, undefined, undefined, false],
  ])(
    'validates PBM member exists (personList: %p, emulatedMemberId: %p, emulatedRxSubGroup: %p)',
    async (
      personListMock: undefined | IPerson[],
      emulatedMemberIdMock: undefined | string,
      emulatedRxSubGroupMock: undefined | string,
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

      isMemberIdValidForUserAndDependentsMock.mockReturnValue(true);

      const result = await getClaimsHandler(responseMock, configurationMock);

      if (isFailureExpected) {
        expectToHaveBeenCalledOnceOnlyWith(
          knownFailureResponseMock,
          responseMock,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.SIE_PROFILE_NOT_FOUND,
          undefined,
          undefined
        );

        expect(result).toEqual(errorMock);
      } else {
        expect(result).not.toEqual(errorMock);
      }
    }
  );

  it.each([
    [undefined, false, true],
    [undefined, true, false],
    ['emulated-member-id', false, false],
    ['emulated-member-id', true, false],
  ])(
    'validates member access (emulatedMemberId: %p)',
    async (
      emulatedMemberIdMock: string | undefined,
      isMemberIdValidMock: boolean,
      isFailureExpected: boolean
    ) => {
      const featuresMock: IFeaturesState = {
        memberId: emulatedMemberIdMock,
        rxSubGroup: 'emulated-rx-sub-group',
      };
      getRequiredResponseLocalMock.mockReturnValue(featuresMock);
      getResponseLocalMock.mockReturnValue(personListWithPbmMock);
      isMemberIdValidForUserAndDependentsMock.mockReturnValue(
        isMemberIdValidMock
      );

      const errorMock = new Error('known-failure-response');
      knownFailureResponseMock.mockReturnValue(errorMock);

      const result = await getClaimsHandler(responseMock, configurationMock);

      if (emulatedMemberIdMock) {
        expect(isMemberIdValidForUserAndDependentsMock).not.toHaveBeenCalled();
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          isMemberIdValidForUserAndDependentsMock,
          responseMock,
          personListWithPbmMock[0].primaryMemberRxId
        );
      }

      if (isFailureExpected) {
        expectToHaveBeenCalledOnceOnlyWith(
          knownFailureResponseMock,
          responseMock,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS,
          undefined,
          undefined
        );
        expect(result).toEqual(errorMock);
      } else {
        expect(result).not.toEqual(errorMock);
      }
    }
  );

  it.each([
    [undefined, undefined],
    ['emulated-member-id', 'emulated-rx-sub-group'],
  ])(
    'returns claims on success (emulatedMemberId: %p, emulatedRxSubGroup: %p)',
    async (
      emulatedMemberIdMock: string | undefined,
      emulatedRxSubGroupMock: string | undefined
    ) => {
      const featuresMock: IFeaturesState = {
        memberId: emulatedMemberIdMock,
        rxSubGroup: emulatedRxSubGroupMock,
      };
      getRequiredResponseLocalMock.mockReturnValue(featuresMock);

      getResponseLocalMock.mockReturnValue(personListWithPbmMock);
      isMemberIdValidForUserAndDependentsMock.mockReturnValue(true);

      const successMock = 'success';
      successResponseMock.mockReturnValue(successMock);

      const endpointResponse: Partial<IGetClaimsResponse> = {
        claims: claimsResponseMock.claimData,
      };
      getClaimsMock.mockResolvedValue(endpointResponse);

      const claimsMock: IClaim[] = [claim1Mock, claim2Mock];
      buildClaimsMock.mockReturnValue(claimsMock);

      const claimPdfMock = 'claimPdfMock';
      buildClaimHistoryPdfMock.mockReturnValue(claimPdfMock);

      const result = await getClaimsHandler(responseMock, configurationMock);

      const expectedPerson = personListWithPbmMock[0];
      const expectedMemberId =
        emulatedMemberIdMock ?? expectedPerson.primaryMemberRxId;
      const expectedRxSubGroup =
        emulatedRxSubGroupMock ?? expectedPerson.rxSubGroup;

      expectToHaveBeenCalledOnceOnlyWith(
        getClaimsMock,
        expectedMemberId,
        expectedRxSubGroup,
        configurationMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildClaimsMock,
        claimsResponseMock.claimData
      );

      const expectedIdentity: IClaimHistoryPdfIdentity = {
        firstName: emulatedMemberIdMock ? 'Mock' : expectedPerson.firstName,
        lastName: emulatedMemberIdMock ? 'Member' : expectedPerson.lastName,
        isoDateOfBirth: emulatedMemberIdMock
          ? '1999-01-01'
          : expectedPerson.dateOfBirth,
      };
      expectToHaveBeenCalledOnceOnlyWith(
        buildClaimHistoryPdfMock,
        configurationMock,
        claimsMock,
        expectedMemberId,
        expectedIdentity
      );

      expectToHaveBeenCalledOnceOnlyWith(
        successResponseMock,
        responseMock,
        SuccessConstants.SUCCESS_OK,
        {
          claims: claimsMock,
          claimPdf: claimPdfMock,
        }
      );

      expect(result).toEqual(successMock);
    }
  );

  it('returns unknown failure if exception occurs', async () => {
    getResponseLocalMock.mockReturnValue(personListWithPbmMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);

    const errorMock = new Error('unknown-failure-response');
    unknownFailureResponseMock.mockReturnValue(errorMock);

    const endpointErrorMock = new Error('unknown-error');
    getClaimsMock.mockImplementation(() => {
      throw endpointErrorMock;
    });

    const result = await getClaimsHandler(responseMock, configurationMock);

    expect(result).toEqual(errorMock);
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      endpointErrorMock
    );
  });
});
