// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IContentWithIsLoading } from '../../../models/cms-content/content-with-isloading.model';
import { getChildren } from '../../../testing/test.helper';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { InformationButton } from '../../buttons/information/information.button';
import { BaseText } from '../../text/base-text/base-text';
import { BaseProgressBar } from '../base/base.progress-bar';
import { AccumulatorProgressBar } from './accumulator.progress-bar';
import { IAccumulatorProgressBarContent } from './accumulator.progress-bar.content';
import { accumulatorProgressBarStyles } from './accumulator.progress-bar.styles';
import { AccumulatorProgressLabel } from './progress-label/accumulator.progress-label';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../buttons/information/information.button', () => ({
  InformationButton: () => <div />,
}));

jest.mock('../base/base.progress-bar', () => ({
  BaseProgressBar: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const defaultContentWithIsLoadingMock: Omit<
  IContentWithIsLoading<IAccumulatorProgressBarContent>,
  'fetchCMSContent'
> = {
  isContentLoading: false,
  content: {
    infoButtonLabel: '',
    maxProgressLabel: '',
    maxValueLabel: '',
    minProgressLabel: '',
  },
};

describe('AccumulatorProgressBar', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue(defaultContentWithIsLoadingMock);
  });

  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={1}
        value={0}
        title=''
        viewStyle={customViewStyle}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('accumulatorProgressBar');
    expect(container.props.style).toEqual(customViewStyle);
    expect(getChildren(container).length).toEqual(3);
  });

  it('renders title container', () => {
    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={1}
        value={0}
        title=''
        onInfoPress={jest.fn()}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBar',
    });
    const titleContainer = getChildren(container)[0];

    expect(titleContainer.type).toEqual(View);
    expect(titleContainer.props.testID).toEqual(
      'accumulatorProgressBarTitleContainer'
    );
    expect(titleContainer.props.style).toEqual(
      accumulatorProgressBarStyles.titleContainerViewStyle
    );
    expect(getChildren(titleContainer).length).toEqual(2);
  });

  it('renders title', () => {
    const titleMock = 'title';
    const isSkeletonMock = true;
    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={1}
        value={0}
        title={titleMock}
        isSkeleton={isSkeletonMock}
      />
    );

    const titleContainer = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBarTitleContainer',
    });
    const titleText = getChildren(titleContainer)[0];

    expect(titleText.type).toEqual(BaseText);
    expect(titleText.props.isSkeleton).toEqual(isSkeletonMock);
    expect(titleText.props.children).toEqual(titleMock);
  });

  it.each([[undefined], [jest.fn()]])(
    'renders information button (onInfoPress: %p)',
    (onInfoPressMock: undefined | jest.Mock) => {
      const contentWithIsLoadingMock: Omit<
        IContentWithIsLoading<IAccumulatorProgressBarContent>,
        'fetchCMSContent'
      > = {
        ...defaultContentWithIsLoadingMock,
        content: {
          ...defaultContentWithIsLoadingMock.content,
          infoButtonLabel: 'info-button-label: {term}',
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const titleMock = 'title';
      const testRenderer = renderer.create(
        <AccumulatorProgressBar
          maxValue={1}
          value={0}
          title={titleMock}
          onInfoPress={onInfoPressMock}
        />
      );

      const titleContainer = testRenderer.root.findByProps({
        testID: 'accumulatorProgressBarTitleContainer',
      });
      const infoButton = getChildren(titleContainer)[1];

      if (onInfoPressMock) {
        expect(infoButton.type).toEqual(InformationButton);
        expect(infoButton.props.onPress).toEqual(onInfoPressMock);
        expect(infoButton.props.accessibilityLabel).toEqual(
          `info-button-label: ${titleMock}`
        );
      } else {
        expect(infoButton).toBeNull();
      }
    }
  );

  it('renders maximum value container', () => {
    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={1}
        value={0}
        title=''
        onInfoPress={jest.fn()}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBar',
    });
    const maxValueContainer = getChildren(container)[1];

    expect(maxValueContainer.type).toEqual(View);
    expect(maxValueContainer.props.testID).toEqual(
      'accumulatorProgressBarMaxValueContainer'
    );
    expect(maxValueContainer.props.style).toEqual(
      accumulatorProgressBarStyles.maxValueContainerViewStyle
    );
    expect(getChildren(maxValueContainer).length).toEqual(2);
  });

  it('renders maximum value', () => {
    const maxValueMock = 1;
    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={maxValueMock}
        value={0}
        title=''
        onInfoPress={jest.fn()}
      />
    );

    const maxValueContainer = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBarMaxValueContainer',
    });
    const maxValue = getChildren(maxValueContainer)[0];

    expect(maxValue.type).toEqual(BaseText);
    expect(maxValue.props.style).toEqual(
      accumulatorProgressBarStyles.maxValueTextStyle
    );
    expect(maxValue.props.children).toEqual(
      MoneyFormatter.format(maxValueMock)
    );
  });

  it('renders maximum value label', () => {
    const isContentLoadingMock = true;
    const maxValueLabelMock = 'max-value-label';
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<IAccumulatorProgressBarContent>
    > = {
      ...defaultContentWithIsLoadingMock,
      isContentLoading: isContentLoadingMock,
      content: {
        ...defaultContentWithIsLoadingMock.content,
        maxValueLabel: maxValueLabelMock,
      },
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const maxValueMock = 3000;
    const testRenderer = renderer.create(
      <AccumulatorProgressBar maxValue={maxValueMock} value={0} title='' />
    );

    const maxValueContainer = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBarMaxValueContainer',
    });
    const maxValueLabel = getChildren(maxValueContainer)[1];

    expect(maxValueLabel.type).toEqual(BaseText);
    expect(maxValueLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(maxValueLabel.props.style).toEqual(
      accumulatorProgressBarStyles.maxLabelTextStyle
    );
    expect(maxValueLabel.props.children).toEqual(maxValueLabelMock);
  });

  it('renders progress bar', () => {
    const titleMock = 'title';
    const valueMock = 55;
    const maxValueMock = 100;

    const testRenderer = renderer.create(
      <AccumulatorProgressBar
        maxValue={maxValueMock}
        value={valueMock}
        title={titleMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'accumulatorProgressBar',
    });
    const progressBar = getChildren(container)[2];

    expect(progressBar.type).toEqual(BaseProgressBar);
    expect(progressBar.props.accessibilityLabel).toEqual(titleMock);
    expect(progressBar.props.minValue).toEqual(0);
    expect(progressBar.props.maxValue).toEqual(maxValueMock);
    expect(progressBar.props.value).toEqual(valueMock);
    expect(progressBar.props.minLabel).toBeDefined();
    expect(progressBar.props.maxLabel).toBeDefined();
    expect(progressBar.props.labelPosition).toEqual('top');
  });

  it.each([
    [-1, 100, 0, 100],
    [0, 100, 0, 100],
    [1, 100, 1, 99],
    [99, 100, 99, 1],
    [100, 100, 100, 0],
    [101, 100, 100, 0],
  ])(
    'renders progress bar labels (value: %p, maxValue: %p)',
    (
      valueMock: number,
      maxValueMock: number,
      expectedMinLabelValue: number,
      expectedMaxLabelValue: number
    ) => {
      const titleMock = 'title';
      const minProgressLabelMock = 'min-progress-label';
      const maxProgressLabelMock = 'max-progress-label';

      const isContentLoadingMock = true;
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<IAccumulatorProgressBarContent>
      > = {
        ...defaultContentWithIsLoadingMock,
        isContentLoading: isContentLoadingMock,
        content: {
          ...defaultContentWithIsLoadingMock.content,
          minProgressLabel: minProgressLabelMock,
          maxProgressLabel: maxProgressLabelMock,
        },
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const testRenderer = renderer.create(
        <AccumulatorProgressBar
          maxValue={maxValueMock}
          value={valueMock}
          title={titleMock}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'accumulatorProgressBar',
      });
      const progressBar = getChildren(container)[2];

      const minProgressLabel = progressBar.props.minLabel;
      expect(minProgressLabel.type).toEqual(AccumulatorProgressLabel);
      expect(minProgressLabel.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(minProgressLabel.props.label).toEqual(minProgressLabelMock);
      expect(minProgressLabel.props.value).toEqual(expectedMinLabelValue);
      expect(minProgressLabel.props.testID).toEqual(
        'accumulatorProgressBarMinProgressLabel'
      );

      const maxProgressLabel = progressBar.props.maxLabel;
      expect(maxProgressLabel.type).toEqual(AccumulatorProgressLabel);
      expect(maxProgressLabel.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(maxProgressLabel.props.label).toEqual(maxProgressLabelMock);
      expect(maxProgressLabel.props.value).toEqual(expectedMaxLabelValue);
      expect(maxProgressLabel.props.testID).toEqual(
        'accumulatorProgressBarMaxProgressLabel'
      );
    }
  );
});
