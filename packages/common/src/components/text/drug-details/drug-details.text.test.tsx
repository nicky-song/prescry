// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { ISessionState } from '../../../experiences/guest-experience/state/session/session.state';
import { IContentWithIsLoading } from '../../../models/cms-content/content-with-isloading.model';
import { IDrugForm } from '../../../models/drug-form';
import { getChildren, getKey } from '../../../testing/test.helper';
import {
  formatQuantityWithForm,
  formatRefills,
  formatStrength,
  formatSupply,
} from '../../../utils/formatters/drug.formatter';
import { BaseText } from '../base-text/base-text';
import { DrugDetailsText } from './drug-details.text';
import { IDrugDetailsTextContent } from './drug-details.text.content';
import { drugDetailsTextStyles } from './drug-details.text.styles';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const drugFormMapMock: Map<string, IDrugForm> = new Map([
  ['CAP', { formCode: 'CAP', abbreviation: 'Capsule', description: '' }],
]);

jest.mock('../../../utils/formatters/drug.formatter');
const formatQuantityWithFormMock = formatQuantityWithForm as jest.Mock;
const formatStrengthMock = formatStrength as jest.Mock;
const formatSupplyMock = formatSupply as jest.Mock;
const formatRefillsMock = formatRefills as jest.Mock;

describe('DrugDetailsText', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const sessionStateMock: Partial<ISessionState> = {
      drugFormMap: drugFormMapMock,
    };
    useSessionContextMock.mockReturnValue({ sessionState: sessionStateMock });

    useContentMock.mockReturnValue({ content: {} });
  });

  it('renders in View container', () => {
    const viewStyleMock: ViewStyle = { width: 1 };

    const testRenderer = renderer.create(
      <DrugDetailsText quantity={1} viewStyle={viewStyleMock} formCode='' />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.style).toEqual([
      drugDetailsTextStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(container.props.testID).toEqual('drugDetailsText');
  });

  enum DataType {
    quantity,
    strength,
    supply,
    refills,
  }

  interface IExpected {
    key: string;
    dataType?: DataType;
  }

  it.each([
    [
      1,
      undefined,
      'mg',
      undefined,
      undefined,
      [{ key: 'quantity-1', dataType: DataType.quantity }],
    ],
    [
      2,
      '100',
      'mg',
      undefined,
      undefined,
      [
        { key: `strength-100`, dataType: DataType.strength },
        { key: 'quantity-delimiter' },
        { key: 'quantity-2', dataType: DataType.quantity },
      ],
    ],
    [
      2,
      undefined,
      'mg',
      30,
      undefined,
      [
        { key: 'quantity-2', dataType: DataType.quantity },
        { key: 'supply-delimiter' },
        { key: 'supply-30', dataType: DataType.supply },
      ],
    ],
    [
      2,
      undefined,
      'mg',
      undefined,
      5,
      [
        { key: 'quantity-2', dataType: DataType.quantity },
        { key: 'refills-delimiter' },
        { key: 'refills-5', dataType: DataType.refills },
      ],
    ],
    [
      2,
      undefined,
      'mg',
      30,
      5,
      [
        { key: 'quantity-2', dataType: DataType.quantity },
        { key: 'supply-delimiter' },
        { key: 'supply-30', dataType: DataType.supply },
        { key: 'refills-delimiter' },
        { key: 'refills-5', dataType: DataType.refills },
      ],
    ],
    [
      2,
      '100',
      'mg',
      30,
      undefined,
      [
        { key: `strength-100`, dataType: DataType.strength },
        { key: 'quantity-delimiter' },
        { key: 'quantity-2', dataType: DataType.quantity },
        { key: 'supply-delimiter' },
        { key: 'supply-30', dataType: DataType.supply },
      ],
    ],
    [
      2,
      '100',
      'mg',
      30,
      5,
      [
        { key: `strength-100`, dataType: DataType.strength },
        { key: 'quantity-delimiter' },
        { key: 'quantity-2', dataType: DataType.quantity },
        { key: 'supply-delimiter' },
        { key: 'supply-30', dataType: DataType.supply },
        { key: 'refills-delimiter' },
        { key: 'refills-5', dataType: DataType.refills },
      ],
    ],
  ])(
    'renders detail components (quantity: %p, strength: %p, unit: %p, supply: %p, refills: %p)',
    (
      quantityMock: number,
      strengthMock: string | undefined,
      unitMock: string | undefined,
      supplyMock: number | undefined,
      refillsMock: number | undefined,
      expectedComponents: IExpected[]
    ) => {
      const contentMock: IDrugDetailsTextContent = {
        asOf: 'as of',
        daySingle: 'day',
        dayPlural: 'days',
        refillSingle: 'refill',
        refillPlural: 'refills',
      };
      const isContentLoadingMock = true;
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<IDrugDetailsTextContent>
      > = {
        content: contentMock,
        isContentLoading: isContentLoadingMock,
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const formattedQuantityMock = 'formatted-quantity';
      formatQuantityWithFormMock.mockReturnValue(formattedQuantityMock);

      const formattedStrengthMock = 'formatted-strength';
      formatStrengthMock.mockReturnValue(formattedStrengthMock);

      const formattedSupplyMock = 'formatted-supply';
      formatSupplyMock.mockReturnValue(formattedSupplyMock);

      const formattedRefillsMock = 'formatted-refills';
      formatRefillsMock.mockReturnValue(formattedRefillsMock);

      const formCodeMock = 'CAP';
      const authoredOnMock = '2022-06-10';

      const testRenderer = renderer.create(
        <DrugDetailsText
          formCode={formCodeMock}
          quantity={quantityMock}
          strength={strengthMock}
          unit={unitMock}
          supply={supplyMock}
          refills={refillsMock}
          authoredOn={authoredOnMock}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'drugDetailsText',
      });
      const components = getChildren(container);

      expect(components.length).toEqual(expectedComponents.length);

      components.forEach((component, index) => {
        const expected = expectedComponents[index];

        expect(component.type).toEqual(BaseText);
        expect(getKey(component)).toEqual(expected.key);

        switch (expected.dataType) {
          case DataType.quantity:
            expect(component.props.children).toEqual(formattedQuantityMock);
            expect(formatQuantityWithFormMock).toHaveBeenCalledWith(
              quantityMock,
              formCodeMock,
              drugFormMapMock
            );
            break;

          case DataType.strength:
            expect(component.props.children).toEqual(formattedStrengthMock);
            expect(formatStrengthMock).toHaveBeenCalledWith(
              strengthMock,
              unitMock
            );
            break;

          case DataType.supply:
            expect(component.props.children).toEqual(formattedSupplyMock);
            expect(component.props.isSkeleton).toEqual(isContentLoadingMock);
            expect(formatSupplyMock).toHaveBeenCalledWith(
              supplyMock,
              contentMock
            );
            break;

          case DataType.refills:
            expect(component.props.children).toEqual(formattedRefillsMock);
            expect(component.props.isSkeleton).toEqual(isContentLoadingMock);
            expect(formatRefillsMock).toHaveBeenCalledWith(
              refillsMock,
              authoredOnMock,
              contentMock
            );
            break;

          default:
            expect(component.props.children).toEqual(' | ');
            break;
        }
      });
    }
  );
});
