// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IAccumulators } from '../../../models/accumulators';
import { getChildren } from '../../../testing/test.helper';
import { List } from '../../primitives/list';
import { AccumulatorList } from './accumulator.list';
import { accumulatorListStyles } from './accumulator.list.styles';

jest.mock('../../member/cards/accumulators/accumulators.card', () => ({
  AccumulatorsCard: () => <div />,
}));

const accumulator1Mock: IAccumulators = {
  individualDeductible: {
    maximum: 1500,
    used: 385.55,
  },
  individualOutOfPocket: {
    maximum: 4000,
    used: 385.55,
  },
  familyDeductible: {
    maximum: 1500,
    used: 385.55,
  },
  familyOutOfPocket: {
    maximum: 4000,
    used: 385.55,
  },
};
const accumulator2Mock: IAccumulators = {
  individualDeductible: {
    maximum: 0,
    used: 0,
  },
  individualOutOfPocket: {
    maximum: 0,
    used: 0,
  },
  familyDeductible: {
    maximum: 1500,
    used: 385.55,
  },
  familyOutOfPocket: {
    maximum: 4000,
    used: 385.55,
  },
};

const accumulator3Mock: IAccumulators = {
  individualDeductible: {
    maximum: 1500,
    used: 385.55,
  },
  individualOutOfPocket: {
    maximum: 4000,
    used: 385.55,
  },
  familyDeductible: {
    maximum: 0,
    used: 0,
  },
  familyOutOfPocket: {
    maximum: 0,
    used: 0,
  },
};

describe('AccumulatorList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'accumulatorList'],
    ['test-id', 'test-id'],
  ])(
    'renders list container',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <AccumulatorList
          viewStyle={viewStyleMock}
          accumulators={accumulator1Mock}
          testID={testIdMock}
        />
      );
      const container = testRenderer.root.children[0] as ReactTestInstance;
      expect(container.type).toEqual(List);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(container.props.testID).toEqual(expectedTestId);
      const accumulatorCards = getChildren(container);
      expect(accumulatorCards.length).toEqual(2);
    }
  );

  it.each([[accumulator1Mock], [accumulator2Mock], [accumulator3Mock]])(
    'renders both individual and family accumulator card',
    (accumulatorsMock: IAccumulators) => {
      const testRenderer = renderer.create(
        <AccumulatorList accumulators={accumulatorsMock} />
      );
      const listContainer = testRenderer.root.findByType(List);
      const accumulatorCards = getChildren(listContainer);
      const expectedViewStyle = accumulatorListStyles.accumulatorCardViewStyle;

      expect(accumulatorCards[0].props.category).toEqual('individual');
      expect(accumulatorCards[0].props.deductible).toEqual(
        accumulatorsMock.individualDeductible
      );
      expect(accumulatorCards[0].props.outOfPocket).toEqual(
        accumulatorsMock.individualOutOfPocket
      );
      expect(accumulatorCards[1].props.category).toEqual('family');
      expect(accumulatorCards[1].props.viewStyle).toEqual(expectedViewStyle);
      expect(accumulatorCards[1].props.deductible).toEqual(
        accumulatorsMock.familyDeductible
      );
      expect(accumulatorCards[1].props.outOfPocket).toEqual(
        accumulatorsMock.familyOutOfPocket
      );
    }
  );
});
