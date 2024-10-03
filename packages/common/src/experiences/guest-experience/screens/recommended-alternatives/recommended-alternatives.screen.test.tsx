// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { getChildren } from '../../../../testing/test.helper';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { RecommendedAlternativesScreen } from './recommended-alternatives.screen';
import { IRecommendedAlternativesScreenContent } from './recommended-alternatives.screen.content';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { PrescribedMedication } from '../../../../components/member/prescribed-medication/prescribed-medication';
import { recommendedAlternativesScreenStyles } from './recommended-alternatives.screen.styles';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { Heading } from '../../../../components/member/heading/heading';
import { View } from 'react-native';
import { AlternativeMedication } from '../../../../components/member/alternative-medication/alternative-medication';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import {
  defaultAlternativeMedicationPropsList,
  defaultPrescribedMedicationProps,
} from '../../__mocks__/recommended-alternatives.mock';
import { IPrescribedMedication } from '../../../../models/prescribed-medication';
import { IAlternativeMedication } from '../../../../models/alternative-medication';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import {
  claimAlertMock,
  pharmacyInfoMock,
} from '../../__mocks__/claim-alert.mock';
import { IconButton } from '../../../../components/buttons/icon/icon.button';
import { KeepCurrentPrescriptionSection } from '../../../../components/member/keep-current-prescription/keep-current-prescription.section';
import { convertHoursToMap } from '../../../../utils/pharmacy-info.helper';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import {
  AllFavoriteNotifications,
  FavoritingStatus,
} from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { ContactDoctorContainer } from '../../../../components/member/contact-doctor/contact-doctor-container';
import { SwitchYourMedicationSlideUpModal } from './slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal';
import { LowestPriceSlideUpModal } from './slide-up-modals/lowest-price/lowest-price.slide-up-modal';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { useShoppingContext } from '../../context-providers/shopping/use-shopping-context.hook';
import { IContactInfo } from '../../../../models/contact-info';
import { IShoppingState } from '../../state/shopping/shopping.state';
import { alternativeDrugPriceMock } from '../../__mocks__/alternative-drug-price.mock';
import { IAlternativeDrugPrice } from '../../../../models/alternative-drug-price';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock(
  '../../../../components/notifications/all-favorite/all-favorite.notifications',
  () => ({
    ...jest.requireActual(
      '../../../../components/notifications/all-favorite/all-favorite.notifications'
    ),
    AllFavoriteNotifications: () => <div />,
  })
);

jest.mock(
  '../../../../components/member/keep-current-prescription/keep-current-prescription.section',
  () => ({
    KeepCurrentPrescriptionSection: () => <div />,
  })
);

jest.mock('../../../../utils/pharmacy-info.helper');
const convertHoursToMapMock = convertHoursToMap as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  './slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal',
  () => ({
    SwitchYourMedicationSlideUpModal: () => <div />,
  })
);

jest.mock('./slide-up-modals/lowest-price/lowest-price.slide-up-modal', () => ({
  LowestPriceSlideUpModal: () => <div />,
}));

jest.mock('../../../../components/buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

jest.mock('../../context-providers/claim-alert/use-claim-alert-context');
const useClaimAlertContextMock = useClaimAlertContext as jest.Mock;

jest.mock('../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: () => <div />,
}));

jest.mock('../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock(
  '../../../../components/member/line-separator/line-separator',
  () => ({
    LineSeparator: () => <div />,
  })
);

jest.mock(
  '../../../../components/member/customer-support/customer-support',
  () => ({
    CustomerSupport: () => <div />,
  })
);

jest.mock(
  '../../../../components/member/alternative-medication/alternative-medication',
  () => ({
    AlternativeMedication: () => <div />,
  })
);

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock(
  '../../../../components/member/contact-doctor/contact-doctor-container',
  () => ({
    ContactDoctorContainer: () => <div />,
  })
);

jest.mock('../../../../utils/formatters/string.formatter', () => ({
  StringFormatter: {
    format: jest
      .fn()
      .mockImplementation(
        (s: string, parameterMap?: Map<string, string> | undefined) => {
          return `${s}${parameterMap?.keys.toString()}${parameterMap?.values.toString()}`;
        }
      ),
  },
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

const setIsSlideUpModalShowingMock = jest.fn();

const contentMock: IRecommendedAlternativesScreenContent = {
  title: 'title-mock',
  heading: 'heading-mock',
  learnMoreDescription: 'learn-more-description-mock',
  skipButtonLabel: 'skip-button-label-mock',
};

const reduxGetStateMock = jest.fn();

const prescribedMedicationMock =
  defaultPrescribedMedicationProps as IPrescribedMedication;
const alternativeMedicationListMock = defaultAlternativeMedicationPropsList.map(
  (alterantiveMedicationProps) => {
    return {
      memberSaves: alterantiveMedicationProps.memberSaves,
      planSaves: alterantiveMedicationProps.planSaves,
      prescriptionDetailsList:
        alterantiveMedicationProps.prescriptionDetailsList,
      drugPricing: alterantiveMedicationProps.drugPricing,
    } as IAlternativeMedication;
  }
);

const shoppingStateMock: Partial<IShoppingState> = {
  prescriptionInfo: prescriptionInfoMock,
  alternativeDrugPrice: alternativeDrugPriceMock as IAlternativeDrugPrice,
};
const hoursMapMock = new Map();

const membershipDispatchMock = jest.fn();

describe('RecommendedAlternativesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const contentWithIsLoadingMock: Pick<
      IContentWithIsLoading<IRecommendedAlternativesScreenContent>,
      'content' | 'isContentLoading'
    > = {
      content: contentMock,
      isContentLoading: false,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    useStateMock.mockReturnValue([false, setIsSlideUpModalShowingMock]);

    useReduxContextMock.mockReturnValue({
      getState: reduxGetStateMock,
    });

    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        alternativeMedicationList: alternativeMedicationListMock,
        pharmacyInfo: pharmacyInfoMock,
        prescriber: claimAlertMock.prescriber,
      },
    });
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    convertHoursToMapMock.mockReturnValue(hoursMapMock);

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingStatus: 'success' as FavoritingStatus,
      },
      membershipDispatch: membershipDispatchMock,
    });
    useRouteMock.mockReturnValue({
      params: {
        isShopping: false,
      },
    });
  });

  it('gets content', () => {
    renderer.create(<RecommendedAlternativesScreen />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.recommendedAlternatives,
      2
    );
  });

  it.each([[true], [false], [undefined]])(
    'renders as BasicPage with isShopping %p',
    (isShopping?: boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          isShopping,
        },
      });
      const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.type).toEqual(BasicPageConnected);
      expect(basicPage.props.body).toBeDefined();
      expect(basicPage.props.notification).toBeDefined();
      expect(basicPage.props.showProfileAvatar).toEqual(true);

      if (isShopping) {
        expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
        basicPage.props.navigateBack();
        expect(rootStackNavigationMock.goBack).toBeCalled();
      }

      expect(basicPage.props.modals.length).toEqual(2);

      expect(basicPage.props.modals[0].type).toEqual(
        SwitchYourMedicationSlideUpModal
      );
      expect(basicPage.props.modals[1].type).toEqual(LowestPriceSlideUpModal);
    }
  );

  it('renders AllFavoriteNotifications as notification in BasicPage', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);

    const notification = basicPage.props.notification;

    expect(notification.type).toEqual(AllFavoriteNotifications);
    expect(notification.props.onNotificationClose).toEqual(
      expect.any(Function)
    );

    notification.props.onNotificationClose();

    expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
    expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
      1,
      membershipDispatchMock,
      'none'
    );
  });

  it('does not render AllFavoriteNotifications if favoritingStatus undefined', () => {
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        favoritingStatus: undefined,
      },
      membershipDispatch: membershipDispatchMock,
    });

    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);

    const notification = basicPage.props.notification;

    expect(notification).toBeUndefined();
  });

  it('renders body container', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.testID).toEqual('recommendedAlternativesScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(false);
    expect(getChildren(bodyContainer).length).toEqual(7);
  });

  it.each([[true], [false], [undefined]])(
    'renders expected PrescribedMedication as first child in BodyContentContainer with isShopping :%p',
    (isShopping?: boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          isShopping,
        },
      });

      const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const prescribedMedication = getChildren(bodyContainer)[0];

      expect(prescribedMedication.type).toEqual(PrescribedMedication);
      const prescribedMedicationData = isShopping
        ? (shoppingStateMock.alternativeDrugPrice
            ?.prescribedMedication as IPrescribedMedication)
        : prescribedMedicationMock;

      expect(prescribedMedication.props.drugName).toEqual(
        prescribedMedicationData.drugName
      );
      expect(prescribedMedication.props.drugDetails).toEqual(
        prescribedMedicationData.drugDetails
      );
      expect(prescribedMedication.props.price).toEqual(
        prescribedMedicationData.price
      );
      expect(prescribedMedication.props.planPrice).toEqual(
        prescribedMedicationData.planPrice
      );
      expect(prescribedMedication.props.viewStyle).toEqual(
        recommendedAlternativesScreenStyles.prescribedMedicationViewStyle
      );
      expect(prescribedMedication.props.pharmacyName).toEqual(
        pharmacyInfoMock.name
      );
      expect(prescribedMedication.props.orderDate).toEqual(
        prescribedMedicationData.orderDate
          ? dateFormatter.formatStringToMMDDYYYY(
              prescribedMedicationData.orderDate
            )
          : undefined
      );
      expect(prescribedMedication.props.isDigitalRx).toEqual(isShopping);
    }
  );

  it('renders expected Heading as second child in BodyContentContainer', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const headingContainer = getChildren(bodyContainer)[1];

    expect(headingContainer.type).toEqual(BaseText);
    expect(headingContainer.props.style).toEqual(
      recommendedAlternativesScreenStyles.headingContainerTextStyle
    );

    const heading = getChildren(headingContainer)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(1);
    expect(heading.props.textStyle).toEqual(
      recommendedAlternativesScreenStyles.headingTextStyle
    );
    expect(heading.props.isSkeleton).toEqual(false);
    expect(heading.props.children).toEqual(contentMock.heading);
  });

  it('renders expected IconButton as third child in BodyContentContainer', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const headingContainer = getChildren(bodyContainer)[1];

    const iconButton = getChildren(headingContainer)[1];

    expect(iconButton.type).toEqual(IconButton);
    expect(iconButton.props.iconName).toEqual('info-circle');
    expect(iconButton.props.accessibilityLabel).toEqual('learnMore');
    expect(iconButton.props.iconTextStyle).toEqual(
      recommendedAlternativesScreenStyles.iconButtonTextStyle
    );
    expect(iconButton.props.viewStyle).toEqual(
      recommendedAlternativesScreenStyles.iconButtonViewStyle
    );

    iconButton.props.onPress();

    expect(setIsSlideUpModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsSlideUpModalShowingMock).toHaveBeenNthCalledWith(
      1,
      'switch-your-medication'
    );
  });

  it.each([[true], [false], [undefined]])(
    'renders expected AlternativeMedication components in BodyContentContainer with isShopping %p',
    (isShopping?: boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          isShopping,
        },
      });
      const testRenderer = renderer.create(<RecommendedAlternativesScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const alternativeMedicationList = getChildren(bodyContainer)[2];
      const alternativeMedications =
        alternativeMedicationList as unknown as ReactTestInstance[];
      const alternatives = isShopping
        ? (shoppingStateMock.alternativeDrugPrice
            ?.alternativeMedicationList as IAlternativeMedication[])
        : (alternativeMedicationListMock as IAlternativeMedication[]);

      alternativeMedications.forEach(
        (alternativeMedicationContainer, index) => {
          expect(alternativeMedicationContainer.type).toEqual(View);
          expect(alternativeMedicationContainer.props.style).toEqual(
            recommendedAlternativesScreenStyles.alternativeMedicationContainerViewStyle
          );
          expect(getChildren(alternativeMedicationContainer).length).toEqual(2);

          const alternativeMedication = getChildren(
            alternativeMedicationContainer
          )[0];
          const lineSeparator = getChildren(alternativeMedicationContainer)[1];

          expect(alternativeMedication.type).toEqual(AlternativeMedication);
          expect(alternativeMedication.props).toEqual(expect.any(Object)); // TODO: replace with actual expected props

          expect(alternativeMedication.props.memberSaves).toEqual(
            alternatives[index].memberSaves
          );
          expect(alternativeMedication.props.planSaves).toEqual(
            alternatives[index].planSaves
          );
          expect(alternativeMedication.props.testID).toEqual(
            `alternativeMedication${index}`
          );

          expect(lineSeparator.type).toEqual(LineSeparator);
          expect(lineSeparator.props.viewStyle).toEqual(
            recommendedAlternativesScreenStyles.lineSeparatorViewStyle
          );
        }
      );
    }
  );

  it.each([[true], [false], [undefined]])(
    'renders expected KeepCurrentPrescriptionSection as sixth child in BodyContentContainer with isShopping :%p',
    (isShopping?: boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          isShopping,
        },
      });

      const testRenderer = renderer.create(<RecommendedAlternativesScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const pharmacyInfo = isShopping
        ? (shoppingStateMock.alternativeDrugPrice?.pharmacyInfo as IContactInfo)
        : pharmacyInfoMock;
      const keepCurrentPrescriptionSection = getChildren(bodyContainer)[5];

      expect(keepCurrentPrescriptionSection.type).toEqual(
        KeepCurrentPrescriptionSection
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyName).toEqual(
        pharmacyInfo.name
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyNcpdp).toEqual(
        pharmacyInfo.ncpdp
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyHours).toEqual(
        hoursMapMock
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyPhoneNumber).toEqual(
        pharmacyInfo.phone
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyAddress1).toEqual(
        pharmacyInfo.address?.lineOne
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyCity).toEqual(
        pharmacyInfo.address?.city
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyState).toEqual(
        pharmacyInfo.address?.state
      );
      expect(keepCurrentPrescriptionSection.props.pharmacyZipCode).toEqual(
        pharmacyInfo.address?.zip
      );
      expect(
        keepCurrentPrescriptionSection.props.onKeepCurrentPrescriptionPress
      ).toEqual(expect.any(Function));

      keepCurrentPrescriptionSection.props.onKeepCurrentPrescriptionPress();

      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        'RootStack',
        {
          screen: 'MedicineCabinet',
        }
      );

      expect(keepCurrentPrescriptionSection.props.viewStyle).toEqual(
        recommendedAlternativesScreenStyles.keepCurrentPrescriptionSectionViewStyle
      );
    }
  );

  it('renders expected CustomerSupport as seventh child in BodyContentContainer', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const customerSupport = getChildren(bodyContainer)[6];

    expect(customerSupport.type).toEqual(CustomerSupport);

    expect(customerSupport.props.viewStyle).toEqual(
      recommendedAlternativesScreenStyles.customerSupportViewStyle
    );
  });

  it('verify switch your medication slideup modal', () => {
    const showModalMock = 'switch-your-medication';
    useStateMock.mockReturnValue([showModalMock, setIsSlideUpModalShowingMock]);

    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const slideUpModal = basicPage.props.modals[0];

    expect(slideUpModal.type).toEqual(SwitchYourMedicationSlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(true);
    expect(slideUpModal.props.onClosePress).toEqual(expect.any(Function));

    slideUpModal.props.onClosePress();

    expect(setIsSlideUpModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsSlideUpModalShowingMock).toHaveBeenNthCalledWith(1, 'none');
  });

  it('verify lowest price slideup modal', () => {
    const showModalMock = 'lowest-price';
    useStateMock.mockReturnValue([showModalMock, setIsSlideUpModalShowingMock]);

    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const slideUpModal = basicPage.props.modals[1];

    expect(slideUpModal.type).toEqual(LowestPriceSlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(true);
    expect(slideUpModal.props.title).toEqual(pharmacyInfoMock.name);
    expect(slideUpModal.props.phoneNumber).toEqual(pharmacyInfoMock.phone);
    expect(slideUpModal.props.pharmacyAddress1).toEqual(
      pharmacyInfoMock.address?.lineOne
    );
    expect(slideUpModal.props.pharmacyCity).toEqual(
      pharmacyInfoMock.address?.city
    );
    expect(slideUpModal.props.pharmacyState).toEqual(
      pharmacyInfoMock.address?.state
    );
    expect(slideUpModal.props.pharmacyZipCode).toEqual(
      pharmacyInfoMock.address?.zip
    );

    // title={pharmacyInfo?.name}
    // phoneNumber={pharmacyInfo?.phone}
    // pharmacyAddress1={pharmacyInfo?.address?.lineOne}
    // pharmacyCity={pharmacyInfo?.address?.city}
    // pharmacyState={pharmacyInfo?.address?.state}
    // pharmacyZipCode={pharmacyInfo?.address?.zip}

    slideUpModal.props.onClosePress();

    expect(setIsSlideUpModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsSlideUpModalShowingMock).toHaveBeenNthCalledWith(1, 'none');
  });

  it.each([[true], [false], [undefined]])(
    'render contact doctor container with line separator with isShopping %p',
    (isShopping?: boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          isShopping,
        },
      });
      const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const contactDoctorContainer = getChildren(bodyContainer)[3];
      const prescriber =
        isShopping && shoppingStateMock.prescriptionInfo?.practitioner
          ? {
              name: shoppingStateMock.prescriptionInfo.practitioner.name,
              phone:
                shoppingStateMock.prescriptionInfo.practitioner.phoneNumber,
            }
          : claimAlertMock.prescriber;

      expect(contactDoctorContainer.type).toEqual(ContactDoctorContainer);
      expect(contactDoctorContainer.props.doctorName).toEqual(prescriber.name);
      expect(contactDoctorContainer.props.phoneNumber).toEqual(
        prescriber.phone
      );
      expect(contactDoctorContainer.props.viewStyle).toEqual(
        recommendedAlternativesScreenStyles.contactDoctorContainerViewStyle
      );
      const lineSeparator = getChildren(bodyContainer)[4];
      expect(lineSeparator.type).toEqual(LineSeparator);
      expect(lineSeparator.props.viewStyle).toEqual(
        recommendedAlternativesScreenStyles.lineSeparatorViewStyle
      );
    }
  );

  it('renders costumer support', () => {
    const testRenderer = renderer.create(<RecommendedAlternativesScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.testID).toEqual('recommendedAlternativesScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(false);
    const bodyChildren = getChildren(bodyContainer);
    expect(bodyChildren.length).toEqual(7);
    const costumerSupport = bodyChildren[6];
    expect(costumerSupport.type).toEqual(CustomerSupport);
    expect(costumerSupport.props.testID).toBe(
      'recommendedAlternativesCustomerSupport'
    );
  });
});
