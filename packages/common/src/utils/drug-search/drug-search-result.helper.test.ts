// Copyright 2021 Prescryptive Health, Inc.

import {
  lyricaSearchResultMock,
  preGenDhaSearchResultMock,
  preGennaSearchResultMock,
} from '../../experiences/guest-experience/__mocks__/drug-search-response.mock';
import { IDrugConfiguration } from '../../models/drug-configuration';
import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../models/drug-search-response';
import DrugSearchResultHelper from './drug-search-result.helper';

describe('DrugSearchResultHelper', () => {
  it.each([
    ['', undefined],
    [lyricaSearchResultMock.name, lyricaSearchResultMock],
    [preGenDhaSearchResultMock.name, preGenDhaSearchResultMock],
  ])(
    'gets drug by name %p',
    (drugNameMock, expectedDrug: IDrugSearchResult | undefined) => {
      const drugSearchResultsMock: IDrugSearchResult[] = [
        lyricaSearchResultMock,
        preGennaSearchResultMock,
        preGenDhaSearchResultMock,
      ];

      const foundDrug = DrugSearchResultHelper.getDrugByName(
        drugNameMock,
        drugSearchResultsMock
      );
      expect(foundDrug).toEqual(expectedDrug);
    }
  );

  it('gets default drug configuration', () => {
    const variant1NdcMock = 'ndc-1';
    const variantsMock: Partial<IDrugVariant>[] = [
      {
        ndc: variant1NdcMock,
      },
      {
        ndc: 'ndc-2',
      },
      {
        ndc: 'ndc-3',
      },
      {
        ndc: 'ndc-4',
      },
      {
        ndc: 'ndc-5',
      },
    ];

    const drugSearchResultMock: Partial<IDrugSearchResult> = {
      drugVariants: variantsMock as IDrugVariant[],
    };

    const configuration = DrugSearchResultHelper.getDefaultConfiguration(
      drugSearchResultMock as IDrugSearchResult
    );

    const expectedConfiguration: IDrugConfiguration = {
      ndc: variant1NdcMock,
      quantity: 1,
      supply: 30,
    };

    expect(configuration).toEqual(expectedConfiguration);
  });

  it.each([
    [undefined, 1],
    [0, 1],
    [1, 1],
    [2, 2],
    [90, 90],
  ])(
    'get default drug configuration determines quantity (quantity: %p)',
    (quantityMock: undefined | number, expectedQuantity: number) => {
      const variant1NdcMock = 'ndc-1';
      const variantsMock: Partial<IDrugVariant>[] = [
        {
          ndc: variant1NdcMock,
          modeQuantity: quantityMock,
        },
      ];

      const drugSearchResultMock: Partial<IDrugSearchResult> = {
        drugVariants: variantsMock as IDrugVariant[],
      };

      expect(
        DrugSearchResultHelper.getSupportedDefaultQuantity(quantityMock)
      ).toEqual(expectedQuantity);

      const configuration = DrugSearchResultHelper.getDefaultConfiguration(
        drugSearchResultMock as IDrugSearchResult
      );

      const expectedConfiguration: IDrugConfiguration = {
        ndc: variant1NdcMock,
        quantity: expectedQuantity,
        supply: 30,
      };

      expect(configuration).toEqual(expectedConfiguration);
    }
  );

  it.each([
    [undefined, 30],
    [1, 30],
    [29, 30],
    [30, 30],
    [59, 30],
    [60, 60],
    [61, 30],
    [89, 30],
    [90, 90],
    [91, 30],
  ])(
    'get default drug configuration determines days supply (daysSupply: %p)',
    (daysSupplyMock: undefined | number, expectedDaysSupply) => {
      const variant1NdcMock = 'ndc-1';
      const variantsMock: Partial<IDrugVariant>[] = [
        {
          ndc: variant1NdcMock,
          modeDaysSupply: daysSupplyMock,
        },
        {
          ndc: 'ndc-2',
        },
        {
          ndc: 'ndc-3',
        },
        {
          ndc: 'ndc-4',
        },
        {
          ndc: 'ndc-5',
        },
      ];

      const drugSearchResultMock: Partial<IDrugSearchResult> = {
        drugVariants: variantsMock as IDrugVariant[],
      };

      expect(
        DrugSearchResultHelper.getSupportedDefaultDaysSupply(daysSupplyMock)
      ).toEqual(expectedDaysSupply);

      const configuration = DrugSearchResultHelper.getDefaultConfiguration(
        drugSearchResultMock as IDrugSearchResult
      );

      const expectedConfiguration: IDrugConfiguration = {
        ndc: variant1NdcMock,
        quantity: 1,
        supply: expectedDaysSupply,
      };

      expect(configuration).toEqual(expectedConfiguration);
    }
  );

  it('get default drug configuration returns undefined if no drug variants', () => {
    const variantsMock: Partial<IDrugVariant>[] = [];

    const drugSearchResultMock: Partial<IDrugSearchResult> = {
      drugVariants: variantsMock as IDrugVariant[],
    };

    const configuration = DrugSearchResultHelper.getDefaultConfiguration(
      drugSearchResultMock as IDrugSearchResult
    );

    expect(configuration).toBeUndefined();
  });

  it('gets variant for ndc', () => {
    const variantsMock: Partial<IDrugVariant>[] = [
      {
        form: 'Capsule',
        ndc: 'ndc-1',
      },
      {
        form: 'Capsule',
        ndc: 'ndc-2',
      },
      {
        form: 'Lozenge',
        ndc: 'ndc-3',
      },
      {
        form: 'Tablet',
        ndc: 'ndc-4',
      },
      {
        form: 'Tablet',
        ndc: 'ndc-5',
      },
    ];

    const drugSearchResultMock: Partial<IDrugSearchResult> = {
      drugVariants: variantsMock as IDrugVariant[],
    };

    const variant = DrugSearchResultHelper.getVariantByNdc(
      'ndc-3',
      drugSearchResultMock as IDrugSearchResult
    );
    expect(variant?.form).toEqual('Lozenge');
  });

  it.each([
    ['Capsule', 'ndc-1'],
    ['Lozenge', 'ndc-3'],
    ['Tablet', 'ndc-4'],
    ['blargh', undefined],
  ])(
    'gets variant by drug form (%p)',
    (formMock: string, expectedNdc: string | undefined) => {
      const variantsMock: Partial<IDrugVariant>[] = [
        {
          form: 'Capsule',
          ndc: 'ndc-1',
        },
        {
          form: 'Capsule',
          ndc: 'ndc-2',
        },
        {
          form: 'Lozenge',
          ndc: 'ndc-3',
        },
        {
          form: 'Tablet',
          ndc: 'ndc-4',
        },
        {
          form: 'Tablet',
          ndc: 'ndc-5',
        },
      ];

      const drugSearchResultMock: Partial<IDrugSearchResult> = {
        drugVariants: variantsMock as IDrugVariant[],
      };

      const variant = DrugSearchResultHelper.getVariantByForm(
        formMock,
        drugSearchResultMock as IDrugSearchResult
      );
      expect(variant?.ndc).toEqual(expectedNdc);
    }
  );

  it.each([
    ['Capsule', '600ml', 'ndc-1'],
    ['Capsule', '300ml', 'ndc-2'],
    ['Capsule', '800ml', undefined],
    ['Lozenge', '100ml', 'ndc-3'],
    ['Lozenge', '200ml', undefined],
    ['Tablet', '300ml', 'ndc-4'],
    ['Tablet', '600ml', 'ndc-5'],
    ['blargh', '600ml', undefined],
  ])(
    'gets variant by strength (form: %p, strength: %p)',
    (
      formMock: string,
      strengthAndUnitMock: string,
      expectedNdc: string | undefined
    ) => {
      const variantsMock: Partial<IDrugVariant>[] = [
        {
          form: 'Capsule',
          ndc: 'ndc-1',
          strength: '600',
          strengthUnit: 'ml',
        },
        {
          form: 'Capsule',
          ndc: 'ndc-2',
          strength: '300',
          strengthUnit: 'ml',
        },
        {
          form: 'Lozenge',
          ndc: 'ndc-3',
          strength: '100',
          strengthUnit: 'ml',
        },
        {
          form: 'Tablet',
          ndc: 'ndc-4',
          strength: '300',
          strengthUnit: 'ml',
        },
        {
          form: 'Tablet',
          ndc: 'ndc-5',
          strength: '600',
          strengthUnit: 'ml',
        },
      ];

      const drugSearchResultMock: Partial<IDrugSearchResult> = {
        drugVariants: variantsMock as IDrugVariant[],
      };

      const variant = DrugSearchResultHelper.getVariantByStrength(
        formMock,
        strengthAndUnitMock,
        drugSearchResultMock as IDrugSearchResult
      );
      expect(variant?.ndc).toEqual(expectedNdc);
    }
  );
});
