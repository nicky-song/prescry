// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  DrugDetailsText,
  IDrugDetailsTextProps,
} from '../drug-details/drug-details.text';
import { ClaimAlertDrugDetailsText } from './claim-alert-drug-details.text';

jest.mock('../drug-details/drug-details.text', () => ({
  DrugDetailsText: () => <div />,
}));

describe('ClaimAlertDrugDetailsText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['strength-mock', 'unit-mock', 'form-code-mock', 1],
    [undefined, 'unit-mock', 'form-code-mock', 1],
    ['strength-mock', undefined, 'form-code-mock', 1],
    ['strength-mock', 'unit-mock', undefined, 1],
    ['strength-mock', 'unit-mock', 'form-code-mock', undefined],
    [undefined, 'unit-mock', undefined, 1],
    ['strength-mock', undefined, 'form-code-mock', undefined],
  ])(
    'renders as DrugDetailsText (strength: %s, unit: %s, formCode: %s, quantity: %s)',
    (
      strength: string | undefined,
      unit: string | undefined,
      formCode: string | undefined,
      quantity: number | undefined
    ) => {
      const claimAlertDrugDetailsTextProps: Partial<IDrugDetailsTextProps> = {
        viewStyle: {},
        strength,
        unit,
        formCode,
        quantity,
        refills: 1,
        supply: 1,
        authoredOn: 'authored-on-mock',
      };

      const conditionProps = (): Partial<IDrugDetailsTextProps> => {
        const hasStrengthAndUnit = unit !== undefined && strength !== undefined;

        const hasFormCodeAndQuantity =
          formCode !== undefined && quantity !== undefined;

        return {
          ...claimAlertDrugDetailsTextProps,
          strength: hasStrengthAndUnit ? strength : undefined,
          unit: hasStrengthAndUnit ? unit : undefined,
          formCode: hasFormCodeAndQuantity ? formCode : undefined,
          quantity: hasFormCodeAndQuantity ? quantity : undefined,
        };
      };

      const expectedProps = conditionProps();

      const testRenderer = renderer.create(
        <ClaimAlertDrugDetailsText {...claimAlertDrugDetailsTextProps} />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      if (formCode && quantity) {
        expect(container.type).toEqual(DrugDetailsText);
        expect(container.props).toEqual(expectedProps);
      } else {
        expect(container).toBeUndefined();
      }
    }
  );
});
