// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { IDrugDetails } from '../../../utils/formatters/drug.formatter';
import {
  IPrescribedMedicationProps,
  PrescribedMedication,
} from '../../member/prescribed-medication/prescribed-medication';
import { LineSeparator } from '../../member/line-separator/line-separator';
import { SwitchingMedicationContainer } from './switching-medication.container';
import { switchingMedicationContainerStyles } from './switching-medication.container.styles';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import {
  IPrescriptionDetailsProps,
  PrescriptionDetails,
} from '../../member/prescription-details/prescription-details';

import { IPrescriptionDetails } from '../../../models/prescription-details';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../member/prescribed-medication/prescribed-medication', () => ({
  PrescribedMedication: () => <div />,
}));

jest.mock('../../member/line-separator/line-separator', () => ({
  LineSeparator: () => <div />,
}));

jest.mock('../../member/alternative-medication/alternative-medication', () => ({
  AlternativeMedication: () => <div />,
}));

const prescribedMedicationPropsMock: IPrescribedMedicationProps = {
  drugName: 'drug-name-mock',
  drugDetails: {} as IDrugDetails,
  price: 1,
  planPrice: 2,
};

const prescriptionDetailsPropsMock: IPrescriptionDetailsProps = {
  title: 'title-mock',
  memberSaves: 99,
  planSaves: 0,
  prescriptionDetailsList: [] as IPrescriptionDetails[],
  drugPricing: { memberPays: 99, planPays: 999 },
  isShowingPriceDetails: true,
  viewStyle: {} as ViewStyle,
};

const viewStyleMock: ViewStyle = {};

const switchingMedicationLabelMock = 'switching-medication-label-mock';

const isContentLoadingMock = false;

describe('SwitchingMedicationContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: {
        switchingMedicationLabel: switchingMedicationLabelMock,
      },
      isContentLoading: isContentLoadingMock,
    });
  });

  it('renders as View with expected style', () => {
    const testRenderer = renderer.create(
      <SwitchingMedicationContainer
        prescribedMedicationProps={prescribedMedicationPropsMock}
        prescriptionDetailsProps={prescriptionDetailsPropsMock}
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      switchingMedicationContainerStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(getChildren(view).length).toEqual(3);
  });

  it('renders with PrescribedMedication as first child with expected drugName, drugDetails, price, planPrice', () => {
    const testRenderer = renderer.create(
      <SwitchingMedicationContainer
        prescribedMedicationProps={prescribedMedicationPropsMock}
        prescriptionDetailsProps={prescriptionDetailsPropsMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescribedMedication = getChildren(view)[0];

    expect(prescribedMedication.type).toEqual(PrescribedMedication);
  });

  it('renders with LineSeparator as second child with expected ', () => {
    const testRenderer = renderer.create(
      <SwitchingMedicationContainer
        prescribedMedicationProps={prescribedMedicationPropsMock}
        prescriptionDetailsProps={prescriptionDetailsPropsMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const lineSeparator = getChildren(view)[1];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.label).toEqual(switchingMedicationLabelMock);
    expect(lineSeparator.props.viewStyle).toEqual(
      switchingMedicationContainerStyles.lineSeparatorViewStyle
    );
    expect(lineSeparator.props.isSkeleton).toEqual(isContentLoadingMock);
  });

  it('renders with PrescriptionDetails as third child with expected props', () => {
    const testRenderer = renderer.create(
      <SwitchingMedicationContainer
        prescribedMedicationProps={prescribedMedicationPropsMock}
        prescriptionDetailsProps={prescriptionDetailsPropsMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionDetails = getChildren(view)[2];

    expect(prescriptionDetails.type).toEqual(PrescriptionDetails);
    expect(prescriptionDetails.props).toEqual({
      ...prescriptionDetailsPropsMock,
      viewStyle:
        switchingMedicationContainerStyles.prescriptionDetailsViewStyle,
    });
  });
});
