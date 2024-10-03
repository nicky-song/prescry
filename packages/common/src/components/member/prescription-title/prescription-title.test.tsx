// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { prescriptionTitleStyles as styles } from './prescription-title.styles';
import { PrescriptionTitle } from './prescription-title';
import { Heading } from '../heading/heading';
import { LineSeparator } from '../line-separator/line-separator';
import { prescriptionTitleContent } from './prescription-title.content';
import { SquareButton } from '../../buttons/square-button/square.button';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { goToUrl } from '../../../utils/link.helper';
import { DrugDetailsText } from '../../text/drug-details/drug-details.text';
import { getChildren } from '../../../testing/test.helper';
import { ClaimAlertDrugDetailsText } from '../../text/claim-alert-drug-details/claim-alert-drug-details.text';

jest.mock('../../../utils/link.helper');

jest.mock('../heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../buttons/square-button/square.button', () => ({
  SquareButton: () => <div />,
}));

jest.mock('../../text/drug-details/drug-details.text', () => ({
  DrugDetailsText: () => <div />,
}));

jest.mock(
  '../../text/claim-alert-drug-details/claim-alert-drug-details.text',
  () => ({
    ClaimAlertDrugDetailsText: () => <div />,
  })
);

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('PrescriptionTitle', () => {
  it('renders as View with expected style', () => {
    const strengthMock = '10';
    const quantityMock = 12;
    const refillsMock = 3;
    const formMock = 'CAP';
    const unitMock = 'ml';
    const supplyMock = 2;
    const viewStyleMock: ViewStyle = {};

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName='Basaglar'
        strength={strengthMock}
        quantity={quantityMock}
        refills={refillsMock}
        formCode={formMock}
        supply={supplyMock}
        unit={unitMock}
        infoLink='link'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      viewStyleMock,
      styles.containerViewStyle,
    ]);
    expect(getChildren(view).length).toEqual(3);
  });

  it('renders expected elements with expected properties', () => {
    const strengthMock = '10';
    const quantityMock = 12;
    const refillsMock = 3;
    const formMock = 'CAP';
    const unitMock = 'ml';
    const supplyMock = 2;

    const expectedHeadingLevel = 3;

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName='Basaglar'
        strength={strengthMock}
        quantity={quantityMock}
        refills={refillsMock}
        formCode={formMock}
        supply={supplyMock}
        unit={unitMock}
        infoLink='link'
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const rowContainer = container.props.children[0];

    expect(rowContainer.type).toEqual(TouchableOpacity);
    expect(rowContainer.props.style).toEqual(styles.rowContainerViewStyle);

    const titleHeading = rowContainer.props.children[0];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.level).toEqual(expectedHeadingLevel);
    expect(titleHeading.props.textStyle).toEqual(styles.headingTextStyle);
    expect(titleHeading.props.translateContent).toEqual(false);
    expect(titleHeading.props.children).toEqual('Basaglar');
    
    const imageAsset = rowContainer.props.children[1];
    expect(imageAsset.type).toEqual(FontAwesomeIcon);
    expect(imageAsset.props.name).toEqual('external-link-alt');
    expect(imageAsset.props.style).toEqual(styles.iconTextStyle);

    const drugDetails = getChildren(getChildren(container)[1])[0];

    expect(drugDetails.type).toEqual(DrugDetailsText);
    expect(drugDetails.props.strength).toEqual(strengthMock);
    expect(drugDetails.props.unit).toEqual(unitMock);
    expect(drugDetails.props.quantity).toEqual(quantityMock);
    expect(drugDetails.props.formCode).toEqual(formMock);
    expect(drugDetails.props.supply).toEqual(supplyMock);
    expect(drugDetails.props.refills).toEqual(refillsMock);
    expect(drugDetails.props.viewStyle).toEqual(styles.detailsTextViewStyle);
  });

  it('renders expected properties when drug information is not defined', () => {
    const headingLevelMock = 2;
    const drugNameMock = 'drug-name';

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName={drugNameMock}
        quantity={12}
        refills={3}
        formCode='CAP'
        headingLevel={headingLevelMock}
      />
    );

    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];
    const titleHeading = container.props.children[0];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.level).toEqual(headingLevelMock);
    expect(titleHeading.props.textStyle).toEqual(styles.headingTextStyle);
    expect(titleHeading.props.translateContent).toEqual(false);
    expect(titleHeading.props.children).toEqual(drugNameMock);
  });

  it('renders expected properties when drug information is defined', () => {
    const headingLevelMock = 2;
    const drugNameMock = 'drug-name';
    const infoLinkMock = 'www.link.com';

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName={drugNameMock}
        strength='10'
        quantity={12}
        refills={3}
        supply={2}
        formCode='CAP'
        unit='ml'
        infoLink={infoLinkMock}
        headingLevel={headingLevelMock}
      />
    );
    const container = testRenderer.root.findAllByType(TouchableOpacity, {
      deep: false,
    })[0];
    expect(container.props.onPress).toEqual(expect.any(Function));

    container.props.onPress();
    expect(goToUrl).toHaveBeenCalledWith(infoLinkMock);

    const titleHeading = container.props.children[0];
    
    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.level).toEqual(headingLevelMock);
    expect(titleHeading.props.textStyle).toEqual(styles.headingTextStyle);
    expect(titleHeading.props.translateContent).toEqual(false);
    expect(titleHeading.props.children).toEqual(drugNameMock);

    const icon = container.props.children[1];
    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('external-link-alt');
    expect(icon.props.style).toEqual(styles.iconTextStyle);
  });

  it('renders expected properties when configureMedication is defined', () => {
    const strengthMock = '10';
    const quantityMock = 12;
    const refillsMock = 3;
    const formMock = 'CAP';
    const unitMock = 'ml';
    const supplyMock = 2;
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName='Basaglar'
        strength={strengthMock}
        quantity={quantityMock}
        refills={refillsMock}
        formCode={formMock}
        supply={supplyMock}
        unit={unitMock}
        infoLink='link'
        onPressButton={jest.fn()}
        testID={testIDMock}
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const rowContainer = container.props.children[0];

    expect(rowContainer.type).toEqual(TouchableOpacity);
    expect(rowContainer.props.style).toEqual(styles.rowContainerViewStyle);

    const titleHeading = rowContainer.props.children[0];
    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.children).toEqual('Basaglar');

    const imageAsset = rowContainer.props.children[1];
    expect(imageAsset.type).toEqual(FontAwesomeIcon);
    expect(imageAsset.props.name).toEqual('external-link-alt');
    expect(imageAsset.props.style).toEqual(styles.iconTextStyle);

    const drugDetails = container.props.children[1].props.children[0];

    expect(drugDetails.type).toEqual(DrugDetailsText);
    expect(drugDetails.props.strength).toEqual(strengthMock);
    expect(drugDetails.props.unit).toEqual(unitMock);
    expect(drugDetails.props.quantity).toEqual(quantityMock);
    expect(drugDetails.props.formCode).toEqual(formMock);
    expect(drugDetails.props.supply).toEqual(supplyMock);
    expect(drugDetails.props.refills).toEqual(refillsMock);

    const editButton = container.props.children[1].props.children[1];
    expect(editButton.type).toEqual(SquareButton);
    expect(editButton.props.onPress).toEqual(expect.any(Function));
    expect(editButton.props.viewStyle).toEqual(
      styles.editButtonViewStyle
    );
    expect(editButton.props.testID).toEqual(testIDMock);
    expect(editButton.props.children).toEqual(
      prescriptionTitleContent.editButtonLabel
    );
  });

  it('renders ConditionedDrugDetailsText when isClaimAlert true', () => {
    const strengthMock = '10';
    const quantityMock = 12;
    const refillsMock = 3;
    const formMock = 'CAP';
    const unitMock = 'ml';
    const supplyMock = 2;
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName='Basaglar'
        strength={strengthMock}
        quantity={quantityMock}
        refills={refillsMock}
        formCode={formMock}
        supply={supplyMock}
        unit={unitMock}
        infoLink='link'
        onPressButton={jest.fn()}
        isClaimAlert={true}
        testID={testIDMock}
      />
    );
    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const drugDetails = container.props.children[1].props.children[0];

    expect(drugDetails.type).toEqual(ClaimAlertDrugDetailsText);
    expect(drugDetails.props.strength).toEqual(strengthMock);
    expect(drugDetails.props.unit).toEqual(unitMock);
    expect(drugDetails.props.quantity).toEqual(quantityMock);
    expect(drugDetails.props.formCode).toEqual(formMock);
    expect(drugDetails.props.supply).toEqual(supplyMock);
    expect(drugDetails.props.refills).toEqual(refillsMock);
  });

  it.each([[undefined], [false], [true]])(
    'renders line separator (hideSeparator: %p)',
    (hideSeparatorMock: boolean | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionTitle
          productName='Basaglar'
          quantity={0}
          refills={0}
          formCode='CAP'
          onPressButton={jest.fn()}
          hideSeparator={hideSeparatorMock}
        />
      );

      const container = testRenderer.root.findByType(View);
      const separator = container.props.children[2];

      if (hideSeparatorMock) {
        expect(separator).toBeNull();
      } else {
        expect(separator.type).toEqual(LineSeparator);
        expect(separator.props.viewStyle).toEqual(styles.separatorViewStyle);
      }
    }
  );

  it('renders skeletons when isSkeleton is true', () => {
    const strengthMock = '10';
    const quantityMock = 12;
    const refillsMock = 3;
    const formMock = 'CAP';
    const unitMock = 'ml';
    const supplyMock = 2;

    const testRenderer = renderer.create(
      <PrescriptionTitle
        productName='Basaglar'
        strength={strengthMock}
        quantity={quantityMock}
        refills={refillsMock}
        formCode={formMock}
        supply={supplyMock}
        unit={unitMock}
        infoLink='link'
        onPressButton={jest.fn()}
        isSkeleton={true}
      />
    );

    const container = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];
    const rowContainer = container.props.children[0];
    const titleHeading = rowContainer.props.children[0];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.isSkeleton).toEqual(true);
    expect(titleHeading.props.skeletonWidth).toEqual('long');

    const editButton = container.props.children[1].props.children[1];
    expect(editButton.type).toEqual(SquareButton);
    expect(editButton.props.isSkeleton).toEqual(true);
  });
});
