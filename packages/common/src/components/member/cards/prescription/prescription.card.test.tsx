// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import { ITestContainer } from '../../../../testing/test.container';
import { getChildren } from '../../../../testing/test.helper';
import { CallToActionCard } from '../../../cards/call-to-action/call-to-action.card';
import { IBaseTagProps } from '../../../tags/base/base.tag';
import { DrugDetailsText } from '../../../text/drug-details/drug-details.text';
import { PrescriptionCard } from './prescription.card';
import { IPrescriptionCardContent } from './prescription.card.content';

jest.mock('../../../cards/call-to-action/call-to-action.card', () => ({
  CallToActionCard: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../text/drug-details/drug-details.text', () => ({
  DrugDetailsText: () => <div />,
}));

const prescriptionCardContentMock: IPrescriptionCardContent = {
  actionLabelNotSent: 'action-label-not-sent',
  actionLabelSent: 'action-label-sent',
  statusTagNotSent: 'status-tag-new',
  statusTagSent: 'status-tag-sent',
};

describe('PrescriptionCard', () => {
  it('gets content', () => {
    renderer.create(
      <PrescriptionCard
        onActionPress={jest.fn()}
        prescription={{} as IPrescriptionInfo}
        content={prescriptionCardContentMock}
        isContentLoading={false}
      />
    );
  });

  it.each([
    [undefined, undefined, 'prescriptionCard', 3],
    ['test-id', 1, 'test-id', 1],
  ])(
    'renders as CallToActionCard with testID %p (headingLevel: %p)',
    (
      testIdMock: undefined | string,
      headingLevelMock: undefined | number,
      expectedTestId: string,
      expectedHeadingLevel: number
    ) => {
      const viewStyleMock: ViewStyle = {
        width: 1,
      };
      const onActionPressMock = jest.fn();
      const prescriptionMock: Partial<IPrescriptionInfo> = {
        drugName: 'drug-name',
      };

      const hideLineMock = true;

      const testRenderer = renderer.create(
        <PrescriptionCard
          onActionPress={onActionPressMock}
          prescription={prescriptionMock as IPrescriptionInfo}
          viewStyle={viewStyleMock}
          testID={testIdMock}
          headingLevel={headingLevelMock}
          hideLine={hideLineMock}
          content={prescriptionCardContentMock}
          isContentLoading={false}
        />
      );

      const card = testRenderer.root.children[0] as ReactTestInstance;

      expect(card.type).toEqual(CallToActionCard);
      expect(card.props.title).toEqual(prescriptionMock.drugName);
      expect(card.props.tags).toBeDefined();
      expect(card.props.onActionPress).toEqual(onActionPressMock);
      expect(card.props.actionLabel).toBeDefined();
      expect(card.props.actionRank).toBeDefined();
      expect(card.props.viewStyle).toEqual(viewStyleMock);
      expect(card.props.testID).toEqual(expectedTestId);
      expect(card.props.isSkeleton).toEqual(false);
      expect(card.props.headingLevel).toEqual(expectedHeadingLevel);
      expect(card.props.hideLine).toEqual(hideLineMock);
      expect(card.props.translateTitle).toEqual(false);

      expect(getChildren(card).length).toEqual(1);
    }
  );

  it.each([
    [
      undefined,
      {
        label: prescriptionCardContentMock.statusTagNotSent,
        isSkeleton: false,
      },
    ],
    [
      'pharmacy-id',
      { label: prescriptionCardContentMock.statusTagSent, isSkeleton: false },
    ],
  ])(
    'renders tags (pharmcyId: %p)',
    (pharmacyIdMock: string | undefined, expectedTagProps: IBaseTagProps) => {
      const prescriptionMock: Partial<IPrescriptionInfo> = {
        drugName: 'drug-name',
        organizationId: pharmacyIdMock,
      };

      const testRenderer = renderer.create(
        <PrescriptionCard
          onActionPress={jest.fn()}
          prescription={prescriptionMock as IPrescriptionInfo}
          content={prescriptionCardContentMock}
          isContentLoading={false}
        />
      );

      const card = testRenderer.root.findByProps({
        testID: 'prescriptionCard',
      });

      expect(card.props.tags).toEqual([expectedTagProps]);
    }
  );

  it.each([
    [undefined, prescriptionCardContentMock.actionLabelNotSent, 'primary'],
    ['pharmacy-id', prescriptionCardContentMock.actionLabelSent, 'secondary'],
  ])(
    'renders action label and rank (pharmacyId: %p)',
    (
      pharmacyIdMock: string | undefined,
      expectedLabel: string,
      expectedRank: string
    ) => {
      const prescriptionMock: Partial<IPrescriptionInfo> = {
        drugName: 'drug-name',
        organizationId: pharmacyIdMock,
      };

      const testRenderer = renderer.create(
        <PrescriptionCard
          onActionPress={jest.fn()}
          prescription={prescriptionMock as IPrescriptionInfo}
          content={prescriptionCardContentMock}
          isContentLoading={false}
        />
      );

      const card = testRenderer.root.findByProps({
        testID: 'prescriptionCard',
      });

      expect(card.props.actionLabel).toEqual(expectedLabel);
      expect(card.props.actionRank).toEqual(expectedRank);
    }
  );

  it('renders drug details', () => {
    const prescriptionMock: Partial<IPrescriptionInfo> = {
      drugName: 'drug-name',
      strength: 'strength',
      unit: 'unit',
      quantity: 1,
      form: 'form',
      refills: 2,
      authoredOn: '2022-06-13',
    };

    const testRenderer = renderer.create(
      <PrescriptionCard
        onActionPress={jest.fn()}
        prescription={prescriptionMock as IPrescriptionInfo}
        content={prescriptionCardContentMock}
        isContentLoading={false}
      />
    );

    const card = testRenderer.root.findByProps({
      testID: 'prescriptionCard',
    });
    const drugDetails = getChildren(card)[0];

    expect(drugDetails.type).toEqual(DrugDetailsText);
    expect(drugDetails.props.strength).toEqual(prescriptionMock.strength);
    expect(drugDetails.props.unit).toEqual(prescriptionMock.unit);
    expect(drugDetails.props.quantity).toEqual(prescriptionMock.quantity);
    expect(drugDetails.props.formCode).toEqual(prescriptionMock.form);
    expect(drugDetails.props.refills).toEqual(prescriptionMock.refills);
    expect(drugDetails.props.authoredOn).toEqual(prescriptionMock.authoredOn);
  });

  it('renders skeletons', () => {
    const prescriptionMock: Partial<IPrescriptionInfo> = {
      drugName: 'drug-name',
      organizationId: 'pharmacy-id',
    };

    const testRenderer = renderer.create(
      <PrescriptionCard
        onActionPress={jest.fn()}
        prescription={prescriptionMock as IPrescriptionInfo}
        content={prescriptionCardContentMock}
        isContentLoading={true}
      />
    );

    const card = testRenderer.root.findByProps({
      testID: 'prescriptionCard',
    });

    const expectedIsSkeleton = true;

    expect(card.props.isSkeleton).toEqual(expectedIsSkeleton);
  });
});
