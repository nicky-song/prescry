// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  BodyContentContainer,
  IBodyContentContainerProps,
} from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { GreatPriceScreen } from './great-price.screen';
import { IGreatPriceScreenContent } from './great-price.screen.content';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { getChildren } from '../../../../testing/test.helper';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { greatPriceScreenStyles } from './great-price.screen.styles';
import { PrescribedMedication } from '../../../../components/member/prescribed-medication/prescribed-medication';
import { PrescriptionPharmacyInfo } from '../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { PharmacyHoursContainer } from '../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { IPrescribedMedication } from '../../../../models/prescribed-medication';
import { pharmacyInfoMock } from '../../__mocks__/claim-alert.mock';
import { ClaimNotification } from '../../../../utils/api-helpers/build-mock-claim-alert-args';
import dateFormatter from '../../../../utils/formatters/date.formatter';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: ({ children }: IBodyContentContainerProps) => (
      <div>{children}</div>
    ),
  })
);

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../components/member/prescribed-medication/prescribed-medication',
  () => ({
    PrescribedMedication: () => <div />,
  })
);

jest.mock(
  '../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info',
  () => ({
    PrescriptionPharmacyInfo: () => <div />,
  })
);

jest.mock(
  '../../../../components/member/pharmacy-hours-container/pharmacy-hours-container',
  () => ({
    PharmacyHoursContainer: () => <div />,
  })
);

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock(
  '../../../../components/member/customer-support/customer-support',
  () => ({
    CustomerSupport: () => <div />,
  })
);

jest.mock('../../context-providers/claim-alert/use-claim-alert-context');
const useClaimAlertContextMock = useClaimAlertContext as jest.Mock;

const prescribedMedicationMock: IPrescribedMedication = {
  drugName: 'Janumet',
  drugDetails: {
    strength: '500',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 60,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  orderDate: new Date().toDateString(),
};

describe('GreatPriceScreen', () => {
  const contentMock: IGreatPriceScreenContent = {
    title: 'title-mock',
    description: 'description-mock',
    doneButton: 'done-button-mock',
  };
  const isContentLoadingMock = false;
  const claimAlertDispatchMock = jest.fn();
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });

    useReduxContextMock.mockReturnValue({
      getState: reduxGetStateMock,
      dispatch: reduxDispatchMock,
    });

    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        pharmacyInfo: pharmacyInfoMock,
        notificationType: 'alternativesAvailable' as ClaimNotification,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');
    expect(bodyContainer.props.children.length).toEqual(6);
  });

  it('renders description as first child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const description = getChildren(bodyContainer)[0];

    expect(description.type).toEqual(BaseText);
    expect(description.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(description.props.style).toEqual(
      greatPriceScreenStyles.descriptionTextStyle
    );
    expect(description.props.children).toEqual(contentMock.description);
  });

  it('renders PrescribedMedication as second child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const prescribedMedication = getChildren(bodyContainer)[1];

    expect(prescribedMedication.type).toEqual(PrescribedMedication);
    expect(prescribedMedication.props.drugName).toEqual(
      prescribedMedicationMock.drugName
    );
    expect(prescribedMedication.props.drugDetails).toEqual(
      prescribedMedicationMock.drugDetails
    );
    expect(prescribedMedication.props.price).toEqual(
      prescribedMedicationMock.price
    );
    expect(prescribedMedication.props.planPrice).toEqual(
      prescribedMedicationMock.planPrice
    );
    expect(prescribedMedication.props.viewStyle).toEqual(
      greatPriceScreenStyles.prescribedMedicationViewStyle
    );
    expect(prescribedMedication.props.pharmacyName).toEqual(
      pharmacyInfoMock.name
    );
    expect(prescribedMedication.props.orderDate).toEqual(
      dateFormatter.formatStringToMMDDYYYY(prescribedMedicationMock.orderDate)
    );
  });

  it('renders PrescriptionPharmacyInfo as third child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const prescriptionPharmacyInfo = getChildren(bodyContainer)[2];

    expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
    expect(prescriptionPharmacyInfo.props.title).toEqual(pharmacyInfoMock.name);
    expect(prescriptionPharmacyInfo.props.ncpdp).toEqual(
      pharmacyInfoMock.ncpdp
    );
    expect(prescriptionPharmacyInfo.props.phoneNumber).toEqual(
      pharmacyInfoMock.phone
    );
    expect(prescriptionPharmacyInfo.props.pharmacyAddress1).toEqual(
      pharmacyInfoMock.address?.lineOne
    );
    expect(prescriptionPharmacyInfo.props.pharmacyCity).toEqual(
      pharmacyInfoMock.address?.city
    );
    expect(prescriptionPharmacyInfo.props.pharmacyState).toEqual(
      pharmacyInfoMock.address?.state
    );
    expect(prescriptionPharmacyInfo.props.pharmacyZipCode).toEqual(
      pharmacyInfoMock.address?.zip
    );
    expect(prescriptionPharmacyInfo.props.viewStyle).toEqual(
      greatPriceScreenStyles.prescriptionPharmacyInfoViewStyle
    );
  });

  it('renders PharmacyHoursContainer as fifth child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const pharmacyHoursContainer = getChildren(bodyContainer)[3];

    expect(pharmacyHoursContainer.type).toEqual(PharmacyHoursContainer);
    expect(pharmacyHoursContainer.props.pharmacyHours).toEqual(expect.any(Map));
    expect(pharmacyHoursContainer.props.isCollapsed).toEqual(true);
  });

  it('renders BaseButton as sixth child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const baseButton = getChildren(bodyContainer)[4];

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.viewStyle).toEqual(
      greatPriceScreenStyles.doneButtonViewStyle
    );
    expect(baseButton.props.textStyle).toEqual(
      greatPriceScreenStyles.doneButtonTextStyle
    );
    expect(baseButton.props.children).toEqual(contentMock.doneButton);
  });

  it('renders CustomerSupport as seventh child in body container', () => {
    const testRenderer = renderer.create(<GreatPriceScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('greatPriceScreen');

    const customerSupport = getChildren(bodyContainer)[5];

    expect(customerSupport.type).toEqual(CustomerSupport);
    expect(customerSupport.props.viewStyle).toEqual(
      greatPriceScreenStyles.customerSupportViewStyle
    );
  });
});
