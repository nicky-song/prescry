// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../../text/base-text/base-text';
import { ExpandableCard } from '../../cards/expandable/expandable.card';
import {
  IPharmacyHoursContainerProps,
  PharmacyHoursContainer,
} from './pharmacy-hours-container';
import { pharmacyHoursContainerContent } from './pharmacy-hours-container.content';
import { pharmacyHoursContainerStyles } from './pharmacy-hours-container.styles';

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('../../cards/expandable/expandable.card', () => ({
  ExpandableCard: () => <div />,
}));

const pharmacyHoursMock = new Map([
  ['Sunday', '7:00 am to 9:00 pm'],
  ['Monday', '7:00 am to 9:00 pm'],
  ['Tuesday', '7:00 am to 9:00 pm'],
  ['Wednesday', '7:00 am to 9:00 pm'],
  ['Thursday', '7:00 am to 9:00 pm'],
  ['Friday', '7:00 am to 9:00 pm'],
  ['Saturday', '7:00 am to 9:00 pm'],
]);

const pharmacyHoursContainerProps: IPharmacyHoursContainerProps = {
  pharmacyHours: pharmacyHoursMock,
  isCollapsed: true,
};

jest.mock('../../image-asset/image-asset');

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const setShowFullHours = jest.fn();

describe('pharmacyHoursContainer component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue([false, setShowFullHours]);
  });

  it.each([
    [true, 'collapsed'],
    [false, 'expanded'],
    [undefined, 'collapsed'],
  ])(
    'renders as expandable card (isCollapsed is %p',
    (isCollapsedMock: boolean | undefined, expectedInitialState: string) => {
      const viewStyleMock = {};

      const testRenderer = renderer.create(
        <PharmacyHoursContainer
          pharmacyHours={pharmacyHoursContainerProps.pharmacyHours}
          isCollapsed={isCollapsedMock}
          viewStyle={viewStyleMock}
        />
      );

      const expandableCard = testRenderer.root.children[0] as ReactTestInstance;

      expect(expandableCard.type).toEqual(ExpandableCard);
      expect(expandableCard.props.isSingleton).toEqual(true);
      expect(expandableCard.props.initialState).toEqual(expectedInitialState);
      expect(expandableCard.props.collapsedTitle).toEqual(
        pharmacyHoursContainerContent.pharmacyHours
      );
      expect(expandableCard.props.hideLine).toEqual(true);
      expect(expandableCard.props.viewStyle).toEqual(viewStyleMock);
    }
  );

  it('should have pharmacy opening and closing timings for a week if not collapsed', () => {
    const testRenderer = renderer.create(
      <PharmacyHoursContainer
        pharmacyHours={pharmacyHoursContainerProps.pharmacyHours}
        isCollapsed={pharmacyHoursContainerProps.isCollapsed}
      />
    );
    const expandableCard = testRenderer.root.children[0] as ReactTestInstance;

    const expandedContent = expandableCard.props.expandedContent;

    expect(expandedContent.length).toEqual(7);

    const oneDay = expandedContent[0];
    expect(oneDay.type).toEqual(View);
    expect(oneDay.props.style).toEqual(
      pharmacyHoursContainerStyles.subContainerViewStyle
    );
    expect(oneDay.props.children.length).toEqual(2);

    const dayView = oneDay.props.children[0];
    const hoursView = oneDay.props.children[1];

    expect(dayView.type).toEqual(View);
    expect(dayView.props.style).toEqual(
      pharmacyHoursContainerStyles.pharmacyDayViewStyle
    );

    const dayText = dayView.props.children;

    expect(dayText.type).toEqual(BaseText);

    expect(hoursView.type).toEqual(View);
    expect(hoursView.props.style).toEqual(
      pharmacyHoursContainerStyles.pharmacyHoursViewStyle
    );

    const hoursText = hoursView.props.children;

    expect(hoursText.type).toEqual(BaseText);

    testRenderer.root.findAllByType(BaseText).map((text, index) => {
      if (index % 2 === 0) {
        expect(
          Array.from(pharmacyHoursContainerProps.pharmacyHours.keys()).some(
            (day) => day === text.props.children
          )
        ).toBeTruthy();
      } else {
        expect(
          Array.from(pharmacyHoursContainerProps.pharmacyHours.values()).some(
            (timing) => timing === text.props.children
          )
        ).toBeTruthy();
      }
    });
  });

  it('should not have pharmacy opening and closing timings for a week if collapsed = true except for today', () => {
    const testRenderer = renderer.create(
      <PharmacyHoursContainer
        pharmacyHours={pharmacyHoursContainerProps.pharmacyHours}
        isCollapsed={true}
      />
    );

    const expandableCard = testRenderer.root.children[0] as ReactTestInstance;

    const collapsedContent = expandableCard.props.collapsedContent;

    const oneDay = collapsedContent;
    expect(oneDay.type).toEqual(View);
    expect(oneDay.props.style).toEqual(
      pharmacyHoursContainerStyles.subContainerViewStyle
    );
    expect(oneDay.props.children.length).toEqual(2);

    const dayView = oneDay.props.children[0];
    const hoursView = oneDay.props.children[1];

    expect(dayView.type).toEqual(View);
    expect(dayView.props.style).toEqual(
      pharmacyHoursContainerStyles.pharmacyDayViewStyle
    );

    const dayText = dayView.props.children;

    expect(dayText.type).toEqual(BaseText);

    expect(hoursView.type).toEqual(View);
    expect(hoursView.props.style).toEqual(
      pharmacyHoursContainerStyles.pharmacyHoursViewStyle
    );

    const hoursText = hoursView.props.children;

    expect(hoursText.type).toEqual(BaseText);

    const todayTextContainer = oneDay.props.children[0] as ReactTestInstance;

    const todayText = todayTextContainer.props.children;
    expect(testRenderer.root.children.length).toBe(1);
    expect(todayText.props.children).toBe(pharmacyHoursContainerContent.today);
  });

  it('renders skeletons when isSkeleton is true', () => {
    const testRenderer = renderer.create(
      <PharmacyHoursContainer
        pharmacyHours={pharmacyHoursContainerProps.pharmacyHours}
        isCollapsed={true}
        isSkeleton={true}
      />
    );

    const expandableCard = testRenderer.root.children[0] as ReactTestInstance;

    const collapsedContent = expandableCard.props.collapsedContent;

    const oneDay = collapsedContent;

    const dayView = oneDay.props.children[0];
    const hoursView = oneDay.props.children[1];

    const dayText = dayView.props.children;

    expect(dayText.type).toEqual(BaseText);
    expect(dayText.props.isSkeleton).toEqual(true);
    expect(dayText.props.skeletonWidth).toEqual('short');

    const hoursText = hoursView.props.children;

    expect(hoursText.type).toEqual(BaseText);
    expect(hoursText.props.isSkeleton).toEqual(true);
    expect(hoursText.props.skeletonWidth).toEqual('short');
  });
});
