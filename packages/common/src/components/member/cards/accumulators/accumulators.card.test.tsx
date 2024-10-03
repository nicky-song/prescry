// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IAccumulatorValue } from '../../../../models/accumulators';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { getChildren } from '../../../../testing/test.helper';
import { StrokeCard } from '../../../cards/stroke/stroke.card';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { AccumulatorProgressBar } from '../../../progress-bars/accumulator/accumulator.progress-bar';
import { BaseText } from '../../../text/base-text/base-text';
import { LineSeparator } from '../../line-separator/line-separator';
import { AccumulatorsCard, AccumulatorsCategory } from './accumulators.card';
import { IAccumulatorsCardContent } from './accumulators.card.content';
import { accumulatorsCardStyles } from './accumulators.card.styles';

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../progress-bars/accumulator/accumulator.progress-bar',
  () => ({
    AccumulatorProgressBar: () => <div />,
  })
);

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('AccumulatorsCard', () => {
  const defaultAccumulatorValueMock: IAccumulatorValue = {
    maximum: 0,
    used: 0,
  };

  const familyLabelMock = 'family-label';
  const individualLabelMock = 'individual-label';

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: {} });
  });

  it('gets content', () => {
    renderer.create(
      <AccumulatorsCard
        category='individual'
        deductible={defaultAccumulatorValueMock}
        outOfPocket={defaultAccumulatorValueMock}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.accumulatorsCard,
      2
    );
  });

  it.each([['individual'], ['family']])(
    'renders as StrokeCard (category: %p)',
    (categoryMock: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <AccumulatorsCard
          viewStyle={viewStyleMock}
          category={categoryMock as AccumulatorsCategory}
          deductible={defaultAccumulatorValueMock}
          outOfPocket={defaultAccumulatorValueMock}
        />
      );

      const strokeCard = testRenderer.root.children[0] as ReactTestInstance;

      expect(strokeCard.type).toEqual(StrokeCard);
      expect(strokeCard.props.viewStyle).toEqual(viewStyleMock);

      const expectedTestId = `accumulatorsCard-${categoryMock}`;
      expect(strokeCard.props.testID).toEqual(expectedTestId);

      expect(getChildren(strokeCard).length).toEqual(4);
    }
  );

  it('renders category container', () => {
    const testRenderer = renderer.create(
      <AccumulatorsCard
        category='individual'
        deductible={defaultAccumulatorValueMock}
        outOfPocket={defaultAccumulatorValueMock}
      />
    );

    const strokeCard = testRenderer.root.findByType(StrokeCard);
    const categoryContainer = getChildren(strokeCard)[0];

    expect(categoryContainer.type).toEqual(View);
    expect(categoryContainer.props.style).toEqual(
      accumulatorsCardStyles.categoryContainerViewStyle
    );
    expect(getChildren(categoryContainer).length).toEqual(2);
  });

  it.each([
    ['individual', 'user'],
    ['family', 'users'],
  ])(
    'renders category icon for %p',
    (categoryMock: string, expectedIconName: string) => {
      const testRenderer = renderer.create(
        <AccumulatorsCard
          category={categoryMock as AccumulatorsCategory}
          deductible={defaultAccumulatorValueMock}
          outOfPocket={defaultAccumulatorValueMock}
        />
      );

      const strokeCard = testRenderer.root.findByType(StrokeCard);
      const categoryContainer = getChildren(strokeCard)[0];
      const icon = getChildren(categoryContainer)[0];

      expect(icon.type).toEqual(FontAwesomeIcon);
      expect(icon.props.name).toEqual(expectedIconName);
      expect(icon.props.style).toEqual(
        accumulatorsCardStyles.categoryIconTextStyle
      );
    }
  );

  it.each([
    ['individual', individualLabelMock],
    ['family', familyLabelMock],
  ])(
    'renders category label for %p',
    (categoryMock: string, expectedLabel: string) => {
      const isContentLoadingMock = true;
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IAccumulatorsCardContent>>
      > = {
        isContentLoading: isContentLoadingMock,
        content: {
          family: familyLabelMock,
          individual: individualLabelMock,
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const testRenderer = renderer.create(
        <AccumulatorsCard
          category={categoryMock as AccumulatorsCategory}
          deductible={defaultAccumulatorValueMock}
          outOfPocket={defaultAccumulatorValueMock}
        />
      );

      const strokeCard = testRenderer.root.findByType(StrokeCard);
      const categoryContainer = getChildren(strokeCard)[0];
      const label = getChildren(categoryContainer)[1];

      expect(label.type).toEqual(BaseText);
      expect(label.props.style).toEqual(
        accumulatorsCardStyles.categoryLabelTextStyle
      );
      expect(label.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(label.props.children).toEqual(expectedLabel);
    }
  );

  it('renders separator line', () => {
    const testRenderer = renderer.create(
      <AccumulatorsCard
        category='individual'
        deductible={defaultAccumulatorValueMock}
        outOfPocket={defaultAccumulatorValueMock}
      />
    );

    const strokeCard = testRenderer.root.findByType(StrokeCard);
    const separator = getChildren(strokeCard)[1];

    expect(separator.type).toEqual(LineSeparator);
    expect(separator.props.viewStyle).toEqual(
      accumulatorsCardStyles.separatorViewStyle
    );
  });

  it.each([[{ maximum: 0, used: 100 }], [{ maximum: 1000, used: 100 }]])(
    'renders deductible progress bar (deductible: %p)',
    (deductibleValueMock: IAccumulatorValue) => {
      const isContentLoadingMock = true;
      const deductibleTitleMock = 'deductible-title';
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IAccumulatorsCardContent>>
      > = {
        isContentLoading: isContentLoadingMock,
        content: {
          deductible: deductibleTitleMock,
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const testRenderer = renderer.create(
        <AccumulatorsCard
          category='individual'
          deductible={deductibleValueMock}
          outOfPocket={defaultAccumulatorValueMock}
        />
      );

      const strokeCard = testRenderer.root.findByType(StrokeCard);
      const deductibleProgressBar = getChildren(strokeCard)[2];

      if (deductibleValueMock.maximum) {
        expect(deductibleProgressBar.type).toEqual(AccumulatorProgressBar);
        expect(deductibleProgressBar.props.title).toEqual(deductibleTitleMock);
        expect(deductibleProgressBar.props.maxValue).toEqual(
          deductibleValueMock.maximum
        );
        expect(deductibleProgressBar.props.value).toEqual(
          deductibleValueMock.used
        );
        expect(deductibleProgressBar.props.viewStyle).toEqual(
          accumulatorsCardStyles.progressBarViewStyle
        );
        expect(deductibleProgressBar.props.isSkeleton).toEqual(
          isContentLoadingMock
        );
      } else {
        expect(deductibleProgressBar).toBeNull();
      }
    }
  );

  it.each([[{ maximum: 0, used: 100 }], [{ maximum: 1000, used: 100 }]])(
    'renders out-of-pocket progress bar (out-of-pocket: %p)',
    (outOfPocketValueMock: IAccumulatorValue) => {
      const isContentLoadingMock = true;
      const maxOutOfPocketTitleMock = 'max-out-of-pocket-title';
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IAccumulatorsCardContent>>
      > = {
        isContentLoading: isContentLoadingMock,
        content: {
          maxOutOfPocket: maxOutOfPocketTitleMock,
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const testRenderer = renderer.create(
        <AccumulatorsCard
          category='individual'
          deductible={defaultAccumulatorValueMock}
          outOfPocket={outOfPocketValueMock}
        />
      );

      const strokeCard = testRenderer.root.findByType(StrokeCard);
      const outOfPocketProgressBar = getChildren(strokeCard)[3];

      expect(outOfPocketProgressBar.type).toEqual(AccumulatorProgressBar);
      expect(outOfPocketProgressBar.props.title).toEqual(
        maxOutOfPocketTitleMock
      );
      expect(outOfPocketProgressBar.props.maxValue).toEqual(
        outOfPocketValueMock.maximum
      );
      expect(outOfPocketProgressBar.props.value).toEqual(
        outOfPocketValueMock.used
      );
      expect(outOfPocketProgressBar.props.viewStyle).toEqual(
        accumulatorsCardStyles.progressBarViewStyle
      );
      expect(outOfPocketProgressBar.props.isSkeleton).toEqual(
        isContentLoadingMock
      );
    }
  );
});
