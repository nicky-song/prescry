// Copyright 2022 Prescryptive Health, Inc.

import { IAccumulators } from '@phx/common/src/models/accumulators';
import { buildAccumulators } from './build-accumulators';
import { IPlanDataResponse } from '../../../utils/external-api/cms-api-content/get-cms-plan-content';
import { IAccumulatorsResponse } from '../../../utils/external-api/accumulators/get-accumulators';
import { ICmsFileContent } from '../../../models/cms/cms-file-content';

describe('buildAccumulators', () => {
  it('builds accumulators', () => {
    const claimsAccumulatorsResponseMock: IAccumulatorsResponse = {
      personCode: 'person-code',
      familyId: 'family-id',
      uniqueId: 'unique-id',
      individualTotalDeductible: 1500,
      familyTotalDeductible: 5000,
      individualTotalOutOfPocket: 1600,
      familyTotalOutOfPocket: 6000,
    };

    const planDetailsDocumentUrlMock = 'plan-details-document-url';
    const planDataResponseMock: IPlanDataResponse = {
      FamilyDeductible: 1000,
      FamilyMax: 2000,
      IndividualDeductible: 3000,
      IndividualMax: 4000,
      PlanDetailsDocument: {
        url: planDetailsDocumentUrlMock,
      } as ICmsFileContent,
    };

    const result = buildAccumulators(
      claimsAccumulatorsResponseMock,
      planDataResponseMock
    );

    const expectedAccumulators: IAccumulators = {
      individualDeductible: {
        used: claimsAccumulatorsResponseMock.individualTotalDeductible,
        maximum: planDataResponseMock.IndividualDeductible,
      },
      individualOutOfPocket: {
        used: claimsAccumulatorsResponseMock.individualTotalOutOfPocket,
        maximum: planDataResponseMock.IndividualMax,
      },
      familyDeductible: {
        used: claimsAccumulatorsResponseMock.familyTotalDeductible,
        maximum: planDataResponseMock.FamilyDeductible,
      },
      familyOutOfPocket: {
        used: claimsAccumulatorsResponseMock.familyTotalOutOfPocket,
        maximum: planDataResponseMock.FamilyMax,
      },
      planDetailsPdf: planDetailsDocumentUrlMock,
    };

    expect(result).toEqual(expectedAccumulators);
  });

  it('returns accumulators with 0 used when claim accumulators response undefined', () => {
    const result = buildAccumulators(undefined, undefined);

    const expectedAccumulators: IAccumulators = {
      individualDeductible: {
        used: 0,
        maximum: 0,
      },
      individualOutOfPocket: {
        used: 0,
        maximum: 0,
      },
      familyDeductible: {
        used: 0,
        maximum: 0,
      },
      familyOutOfPocket: {
        used: 0,
        maximum: 0,
      },
    };
    expect(result).toEqual(expectedAccumulators);
  });

  it('handles partially defined plan data', () => {
    const result = buildAccumulators(undefined, {});

    const expectedAccumulators: IAccumulators = {
      individualDeductible: {
        used: 0,
        maximum: 0,
      },
      individualOutOfPocket: {
        used: 0,
        maximum: 0,
      },
      familyDeductible: {
        used: 0,
        maximum: 0,
      },
      familyOutOfPocket: {
        used: 0,
        maximum: 0,
      },
    };
    expect(result).toEqual(expectedAccumulators);
  });
});
