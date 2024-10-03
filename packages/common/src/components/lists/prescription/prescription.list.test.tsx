// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrescriptionInfo } from '../../../models/prescription-info';
import { getChildren, getKey } from '../../../testing/test.helper';
import { PrescriptionCard } from '../../member/cards/prescription/prescription.card';
import { IPrescriptionCardContent } from '../../member/cards/prescription/prescription.card.content';
import { Heading } from '../../member/heading/heading';
import { List } from '../../primitives/list';
import { PrescriptionList } from './prescription.list';
import { prescriptionListStyles } from './prescription.list.styles';

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../member/cards/prescription/prescription.card', () => ({
  PrescriptionCard: () => <div />,
}));

jest.mock('../../buttons/link/link.button', () => ({
  LinkButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const prescription1Mock: Partial<IPrescriptionInfo> = {
  prescriptionId: '1',
  drugName: 'QUININE SULFATE 324MG CAP',
};

const prescription2Mock: Partial<IPrescriptionInfo> = {
  prescriptionId: '2',
  drugName: 'AMOXICILLIN TRIHYDRATE 500MG CAP',
};

const headingLevelMock = 2;

const prescriptionCardContentMock: IPrescriptionCardContent = {
  actionLabelNotSent: 'action-label-not-sent',
  actionLabelSent: 'action-label-sent',
  statusTagNotSent: 'status-tag-new',
  statusTagSent: 'status-tag-sent',
};

describe('PrescriptionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({});
  });

  it.each([
    [undefined, 'prescriptionList'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container (testID: %p)',
    (testIdMock: undefined | string, expectedTestId: string) => {
      useContentMock.mockReturnValue({
        content: prescriptionCardContentMock,
        isContentLoading: false,
      });

      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <PrescriptionList
          viewStyle={viewStyleMock}
          onPrescriptionSelect={jest.fn()}
          title=''
          prescriptions={[]}
          testID={testIdMock}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      const expectedGroupKey = CmsGroupKey.prescriptionCard;

      expect(container.type).toEqual(View);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(container.props.testID).toEqual(expectedTestId);
      expect(getChildren(container).length).toEqual(2);
      expect(useContentMock).toHaveBeenCalledWith(expectedGroupKey, 2);
    }
  );

  it.each([
    [undefined, 2],
    [1, 1],
    [2, 2],
    [3, 3],
  ])(
    'renders title with heading level %p',
    (headingLevelMock: undefined | number, expectedLevel: number) => {
      const titleMock = 'title';
      const isSkeletonMock = true;

      const testRenderer = renderer.create(
        <PrescriptionList
          onPrescriptionSelect={jest.fn()}
          title={titleMock}
          headingLevel={headingLevelMock}
          prescriptions={[]}
          isSkeleton={isSkeletonMock}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'prescriptionList',
      });
      const title = getChildren(container)[0];

      expect(title.type).toEqual(Heading);
      expect(title.props.level).toEqual(expectedLevel);
      expect(title.props.isSkeleton).toEqual(isSkeletonMock);
      expect(title.props.textStyle).toEqual(
        prescriptionListStyles.titleTextStyle
      );
      expect(title.props.children).toEqual(titleMock);
    }
  );

  it('renders no heading if title not specified', () => {
    const isSkeletonMock = true;

    const testRenderer = renderer.create(
      <PrescriptionList
        onPrescriptionSelect={jest.fn()}
        title={undefined}
        prescriptions={[]}
        isSkeleton={isSkeletonMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'prescriptionList',
    });
    const title = getChildren(container)[0];

    expect(title).toBeNull();
  });

  it('renders list container', () => {
    const testRenderer = renderer.create(
      <PrescriptionList
        onPrescriptionSelect={jest.fn()}
        title=''
        prescriptions={[]}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'prescriptionList',
    });
    const listContainer = getChildren(container)[1];

    expect(listContainer.type).toEqual(List);
  });

  it.each([
    [undefined, undefined, 'prescriptionList', headingLevelMock],
    ['title', undefined, 'prescriptionList', headingLevelMock + 1],
    ['title', 'test-id', 'test-id', headingLevelMock + 1],
  ])(
    'renders prescription cards (title: %p, testId: %p)',
    (
      titleMock: undefined | string,
      testIdMock: undefined | string,
      expectedTestId: string,
      expectedLevel: number
    ) => {
      useContentMock.mockReturnValue({
        content: prescriptionCardContentMock,
        isContentLoading: false,
      });

      const blockchainPrescriptionMock = {
        ...prescription1Mock,
        blockchain: true,
      };
      const prescriptionsMock: IPrescriptionInfo[] = [
        prescription1Mock as IPrescriptionInfo,
        prescription2Mock as IPrescriptionInfo,
        blockchainPrescriptionMock as IPrescriptionInfo,
      ];

      const onPrescriptionSelectMock = jest.fn();

      const testRenderer = renderer.create(
        <PrescriptionList
          onPrescriptionSelect={onPrescriptionSelectMock}
          title={titleMock}
          headingLevel={headingLevelMock}
          prescriptions={prescriptionsMock}
          testID={testIdMock}
        />
      );

      const listContainer = testRenderer.root.findByType(List);
      const prescriptionCards = getChildren(listContainer);

      expect(prescriptionCards.length).toEqual(prescriptionsMock.length);

      prescriptionCards.forEach((prescriptionCard, index) => {
        const expectedPrescription = prescriptionsMock[index];

        expect(prescriptionCard.type).toEqual(PrescriptionCard);
        expect(getKey(prescriptionCard)).toEqual(
          expectedPrescription.prescriptionId
        );
        expect(prescriptionCard.props.onActionPress).toEqual(
          expect.any(Function)
        );
        expect(prescriptionCard.props.prescription).toEqual(
          expectedPrescription
        );
        expect(prescriptionCard.props.headingLevel).toEqual(expectedLevel);

        const expectedViewStyle =
          index === 0
            ? prescriptionListStyles.prescriptionCardFirstViewStyle
            : prescriptionListStyles.prescriptionCardViewStyle;
        expect(prescriptionCard.props.viewStyle).toEqual(expectedViewStyle);
        expect(prescriptionCard.props.testID).toEqual(
          `${expectedTestId}-${expectedPrescription.prescriptionId}`
        );
        expect(prescriptionCard.props.content).toEqual(
          prescriptionCardContentMock
        );
        expect(prescriptionCard.props.isContentLoading).toEqual(false);

        const isLastCard = index === prescriptionsMock.length - 1;

        if (isLastCard) {
          expect(prescriptionCard.props.hideLine).toEqual(true);
        } else {
          expect(prescriptionCard.props.hideLine).toBeFalsy();
        }

        prescriptionCard.props.onActionPress();

        expect(onPrescriptionSelectMock).toHaveBeenCalledWith(
          expectedPrescription.prescriptionId,
          expectedPrescription.blockchain
        );
      });
    }
  );
});
