// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IClaim } from '../../../models/claim';
import { getChildren, getKey } from '../../../testing/test.helper';
import { ClaimHistoryCard } from '../../member/cards/claim-history/claim-history.card';
import { List } from '../../primitives/list';
import { ClaimHistoryList } from './claim-history.list';
import { claimHistoryListStyles } from './claim-history.list.styles';

jest.mock('../../member/cards/claim-history/claim-history.card', () => ({
  ClaimHistoryCard: () => <div />,
}));

const claim1Mock: Partial<IClaim> = {
  prescriptionId: '1',
  drugName: 'Medicine A',
};

const claim2Mock: Partial<IClaim> = {
  prescriptionId: '2',
  drugName: 'Medicine B',
};
// const headingLevelMock = 2;

describe('Claim history list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'claimHistoryList'],
    ['test-id', 'test-id'],
  ])(
    'renders list container',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };
      const testRenderer = renderer.create(
        <ClaimHistoryList
          claims={[]}
          testID={testIdMock}
          viewStyle={viewStyleMock}
        />
      );
      const container = testRenderer.root.children[0] as ReactTestInstance;
      expect(container.type).toEqual(List);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(container.props.testID).toEqual(expectedTestId);
    }
  );

  it.each([
    [undefined, 'claimHistoryList'],
    ['test-id', 'test-id'],
  ])(
    'renders claim history cards (testId: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const claimsMock: IClaim[] = [claim1Mock as IClaim, claim2Mock as IClaim];
      const testRenderer = renderer.create(
        <ClaimHistoryList claims={claimsMock} testID={testIdMock} />
      );
      const listContainer = testRenderer.root.findByType(List);
      const claimHistoryCards = getChildren(listContainer);

      expect(claimHistoryCards.length).toEqual(claimsMock.length);

      claimHistoryCards.forEach((claimHistoryCard, index) => {
        const expectedClaims = claimsMock[index];
        expect(claimHistoryCard.type).toEqual(ClaimHistoryCard);
        expect(getKey(claimHistoryCard)).toEqual(expectedClaims.prescriptionId);
        expect(claimHistoryCard.props.claim).toEqual(expectedClaims);

        const expectedViewStyle =
          index === 0
            ? claimHistoryListStyles.firstCardViewStyle
            : claimHistoryListStyles.cardViewStyle;
        expect(claimHistoryCard.props.viewStyle).toEqual(expectedViewStyle);
        expect(claimHistoryCard.props.testID).toEqual(
          `${expectedTestId}-${expectedClaims.prescriptionId}`
        );
        const isLastCard = index === claimsMock.length - 1;

        if (isLastCard) {
          expect(claimHistoryCard.props.hideLine).toEqual(true);
        } else {
          expect(claimHistoryCard.props.hideLine).toBeFalsy();
        }
      });
    }
  );
});
