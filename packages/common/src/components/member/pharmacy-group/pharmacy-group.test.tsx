// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { pharmacyInfoListMock } from '../../../experiences/guest-experience/__mocks__/pharmacy-info.mock';
import { getChildren } from '../../../testing/test.helper';
import { ShowMoreButton } from '../../buttons/show-more/show-more.button';
import { PharmacyInfoCard } from '../cards/pharmacy-info/pharmacy-info.card';
import { LineSeparator } from '../line-separator/line-separator';
import { PharmacyGroup } from './pharmacy-group';
import { pharmacyGroupStyles as styles } from './pharmacy-group.styles';
import pickAPharmacyFormatter from '../../../utils/formatters/pick-a-pharmacy.formatter';
import { pharmacyGroupContent as content } from './pharmacy-group.content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IOpenStatusContent } from '../../../utils/formatters/date.formatter';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../buttons/show-more/show-more.button', () => ({
  ShowMoreButton: () => <div />,
}));

jest.mock('../cards/pharmacy-info/pharmacy-info.card', () => ({
  PharmacyInfoCard: () => <div />,
}));

jest.mock('../line-separator/line-separator', () => ({
  LineSeparator: () => <div />,
}));

jest.mock('../../../utils/date-time/get-new-date', () => ({
  getNewDate: jest.fn().mockReturnValue({} as Date),
}));

jest.mock('../../../utils/formatters/pick-a-pharmacy.formatter', () => ({
  formatOpenStatus: jest.fn().mockReturnValue('open-status-mock'),
}));
const formatOpenStatusMock =
  pickAPharmacyFormatter.formatOpenStatus as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const setShowPharmaciesMock = jest.fn();

const onPharmacyPressMock = jest.fn();

const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };

const contentMock: IOpenStatusContent = {
  closed: 'closed',
  open: 'open',
  open24Hours: 'open-24-hours',
  opensAt: 'opens-at-label',
  closesAt: 'closes-at-label',
};

describe('PharmacyGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([false, setShowPharmaciesMock]);

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });
  it.each([[undefined], [viewStyleMock]])(
    'renders as View with expected default children components',
    (viewStyle?: ViewStyle) => {
      const testRenderer = renderer.create(
        <PharmacyGroup
          onPharmacyPress={onPharmacyPressMock}
          pharmacyInfoList={pharmacyInfoListMock}
          viewStyle={viewStyle}
        />
      );

      const pharmacyGroupView = testRenderer.root
        .children[0] as ReactTestInstance;
      const pharmacyGroupChildren = getChildren(pharmacyGroupView);
      const showMoreButton = pharmacyGroupChildren[0];
      const pharmacies = pharmacyGroupChildren[1];

      expect(pharmacyGroupView.type).toEqual(View);
      expect(pharmacyGroupView.props.style).toEqual([
        styles.pharmacyGroupViewStyle,
        viewStyle,
      ]);
      expect(pharmacyGroupChildren.length).toEqual(2);
      expect(showMoreButton.type).toEqual(ShowMoreButton);
      expect(pharmacies).toBeFalsy();
    }
  );

  it.each([[false], [true]])(
    'only renders pharmacies when showPharmacies (%s)',
    (showPharmacies: boolean) => {
      useStateMock.mockClear();
      useStateMock.mockReturnValueOnce([showPharmacies, setShowPharmaciesMock]);
      const testRenderer = renderer.create(
        <PharmacyGroup
          onPharmacyPress={onPharmacyPressMock}
          pharmacyInfoList={pharmacyInfoListMock}
        />
      );

      const pharmacyGroupView = testRenderer.root
        .children[0] as ReactTestInstance;
      const pharmacyGroupChildren = getChildren(pharmacyGroupView);
      const showMoreButton = pharmacyGroupChildren[0];

      expect(showMoreButton.type).toEqual(ShowMoreButton);

      const expectedMessage = `${content.showMessage} ${
        pharmacyInfoListMock.length
      } ${
        pharmacyInfoListMock.length === 1
          ? content.singularLocationMessage
          : content.pluralLocationMessage
      }`;

      expect(showMoreButton.props.message).toEqual(expectedMessage);

      const pharmacies = pharmacyGroupChildren[1];

      if (showPharmacies) {
        expect(pharmacies).toEqual(expect.any(Array));
      } else {
        expect(pharmacies).toBeFalsy();
      }
    }
  );

  it('renders expected pharmacyInfoCard + LineSeparator Views when showPharmacies', () => {
    useStateMock.mockClear();
    useStateMock.mockReturnValueOnce([true, setShowPharmaciesMock]);
    const testRenderer = renderer.create(
      <PharmacyGroup
        onPharmacyPress={onPharmacyPressMock}
        pharmacyInfoList={pharmacyInfoListMock}
      />
    );

    const allViews = testRenderer.root.findAllByType(View);
    const pharmacyGroupView = allViews[0];
    const pharmacyViews = allViews.splice(1);

    expect(pharmacyGroupView.type).toEqual(View);
    expect(pharmacyGroupView.props.style).toEqual([
      styles.pharmacyGroupViewStyle,
      undefined,
    ]);

    expect(pharmacyViews.length).toEqual(pharmacyInfoListMock.length);

    pharmacyViews.forEach((pharmacyView: ReactTestInstance, index: number) => {
      expect(pharmacyView.type).toEqual(View);
      expect(pharmacyView.props.style).toEqual(
        styles.pharmacyInfoCardParentViewStyle
      );

      const pharmacyViewChildren = getChildren(pharmacyView);
      const pharmacyInfoCard = pharmacyViewChildren[0];
      const lineSeparator = pharmacyViewChildren[1];

      expect(pharmacyInfoCard.type).toEqual(PharmacyInfoCard);
      expect(pharmacyInfoCard.props.onPress).toEqual(expect.any(Function));
      expect(pharmacyInfoCard.props.address).toEqual(
        pharmacyInfoListMock[index].pharmacy.address
      );
      expect(pharmacyInfoCard.props.ncpdp).toEqual(
        pharmacyInfoListMock[index].pharmacy.ncpdp
      );
      expect(pharmacyInfoCard.props.distance).toEqual(
        pharmacyInfoListMock[index].pharmacy.distance
      );
      expect(pharmacyInfoCard.props.serviceStatus).toEqual('open-status-mock');
      expect(pharmacyInfoCard.props.viewStyle).toEqual(
        styles.pharmacyInfoCardViewStyle
      );
      expect(pharmacyInfoCard.props.testID).toEqual(
        `pharmacyInfoCard-${pharmacyInfoListMock[index].pharmacy.ncpdp}`
      );

      if (index !== pharmacyViews.length - 1) {
        expect(lineSeparator.type).toEqual(LineSeparator);
        expect(lineSeparator.props.viewStyle).toEqual(
          styles.lineSeparatorViewStyle
        );
      } else {
        expect(lineSeparator).toBeFalsy();
      }
    });
  });

  it('calls formatOpenStatus and onPharmacyPress with expected args', () => {
    useStateMock.mockClear();
    useStateMock.mockReturnValueOnce([true, setShowPharmaciesMock]);
    const testRenderer = renderer.create(
      <PharmacyGroup
        onPharmacyPress={onPharmacyPressMock}
        pharmacyInfoList={pharmacyInfoListMock}
      />
    );

    const allViews = testRenderer.root.findAllByType(View);
    const pharmacyViews = allViews.splice(1);

    expect(pharmacyViews.length).toEqual(pharmacyInfoListMock.length);

    pharmacyViews.forEach((pharmacyView: ReactTestInstance, index: number) => {
      expect(formatOpenStatusMock).toHaveBeenNthCalledWith(
        index + 1,
        {},
        pharmacyInfoListMock[index].pharmacy.hours,
        pharmacyInfoListMock[index].pharmacy.twentyFourHours,
        contentMock
      );
      expect(pharmacyView.type).toEqual(View);
      expect(pharmacyView.props.style).toEqual(
        styles.pharmacyInfoCardParentViewStyle
      );

      const pharmacyViewChildren = getChildren(pharmacyView);
      const pharmacyInfoCard = pharmacyViewChildren[0];

      expect(pharmacyInfoCard.type).toEqual(PharmacyInfoCard);
      expect(pharmacyInfoCard.props.onPress).toEqual(expect.any(Function));

      pharmacyInfoCard.props.onPress();

      expect(onPharmacyPressMock).toHaveBeenNthCalledWith(index + 1, {
        ncpdp: pharmacyInfoListMock[index].pharmacy.ncpdp,
        isBestPrice: false,
        isBestValue: false,
        pharmacyDrugPrice: pharmacyInfoListMock[index],
      });
    });
  });
});
