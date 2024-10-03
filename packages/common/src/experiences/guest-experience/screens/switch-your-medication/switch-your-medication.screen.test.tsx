// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { getChildren } from '../../../../testing/test.helper';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { SwitchYourMedicationScreen } from './switch-your-medication.screen';
import { ISwitchYourMedicationScreenContent } from './switch-your-medication.screen.content';
import { callPhoneNumber } from '../../../../utils/link.helper';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { IDrugDetails } from '../../../../utils/formatters/drug.formatter';
import { IPrescriptionDetails } from '../../../../models/prescription-details';
import { IDrugPricing } from '../../../../models/drug-pricing';
import { SwitchingMedicationContainer } from '../../../../components/containers/switching-medication/switching-medication.container';
import { switchYourMedicationScreenStyles } from './switch-your-medication.screen.styles';
import { View } from 'react-native';
import { Heading } from '../../../../components/member/heading/heading';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { usePbmProfileCobrandingContent } from '../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock(
  '../../../../components/member/customer-support/customer-support',
  () => ({
    CustomerSupport: () => <div />,
  })
);

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock(
  '../../../../components/containers/switching-medication/switching-medication.container',
  () => ({
    SwitchingMedicationContainer: () => <div />,
  })
);

jest.mock('../../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

void callPhoneNumberMock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content'
);
const usePbmProfileCobrandingContentMock =
  usePbmProfileCobrandingContent as jest.Mock;

const reduxGetStateMock = jest.fn();

const drugNameMock = 'drug-name-mock';
const drugDetailsMock = {} as IDrugDetails;
const priceMock = 99;
const planPriceMock = 999;
const savingsAmountMock = 9;
const prescriptionDetailsListMock = [] as IPrescriptionDetails[];
const drugPricingMock = {} as IDrugPricing;

const contentMock: ISwitchYourMedicationScreenContent = {
  title: 'title-mock',
  switchingMedicationLabel: 'switching-medication-label-mock',
  combinationTitle: 'combination-title-mock',
  singleTitle: 'single-title-mock',
  description: 'description-mock',
  callButtonLabel: 'call-button-label',
  actionButtonLabel: 'action-button-label',
};

const isContentLoadingMock = false;

describe('SwitchYourMedicationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ISwitchYourMedicationScreenContent>>
    > = {
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    useReduxContextMock.mockReturnValue({ getState: reduxGetStateMock });
    useRouteMock.mockReturnValue({
      params: {
        drugName: drugNameMock,
        drugDetails: drugDetailsMock,
        price: priceMock,
        planPrice: planPriceMock,
        memberSaves: savingsAmountMock,
        prescriptionDetailsList: prescriptionDetailsListMock,
        drugPricing: drugPricingMock,
      },
    });
  });

  it('gets content', () => {
    renderer.create(<SwitchYourMedicationScreen />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.switchYourMedication,
      2
    );
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.navigateBack).toEqual(
      rootStackNavigationMock.goBack
    );
    expect(basicPage.props.showProfileAvatar).toEqual(true);
  });

  it('renders body container', () => {
    const contentMock: Partial<ISwitchYourMedicationScreenContent> = {
      title: 'title-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ISwitchYourMedicationScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('switchYourMedicationScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(getChildren(bodyContainer).length).toEqual(6);
  });

  it('renders expected SwitchingMedicationContainer as first child of BodyContentContainer', () => {
    const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const switchingMedicationContainer = getChildren(bodyContainer)[0];

    expect(switchingMedicationContainer.type).toEqual(
      SwitchingMedicationContainer
    );

    expect(
      switchingMedicationContainer.props.prescribedMedicationProps
    ).toEqual({
      drugName: drugNameMock,
      drugDetails: drugDetailsMock,
      price: priceMock,
      planPrice: planPriceMock,
    });
    expect(switchingMedicationContainer.props.prescriptionDetailsProps).toEqual(
      {
        title:
          prescriptionDetailsListMock.length > 1
            ? contentMock.combinationTitle
            : contentMock.singleTitle,
        memberSaves: savingsAmountMock,
        prescriptionDetailsList: prescriptionDetailsListMock,
        drugPricing: drugPricingMock,
        isShowingPriceDetails: prescriptionDetailsListMock.length > 1,
      }
    );
    expect(switchingMedicationContainer.props.viewStyle).toEqual(
      switchYourMedicationScreenStyles.switchYourMedicationContainerViewStyle
    );
  });

  it.each([[true], [false]])(
    'renders expected BaseText (description) as second child of BodyContentContainer (isCobrandedContentAvailable: %p)',
    (isCobrandedContentAvailable: boolean) => {
      const switchYourMedsDescriptionMock = 'switch-your-meds-description-mock';

      usePbmProfileCobrandingContentMock.mockReturnValue(
        isCobrandedContentAvailable
          ? {
              switchYourMedsDescription: switchYourMedsDescriptionMock,
            }
          : {}
      );

      const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const descriptionText = getChildren(bodyContainer)[1];

      expect(descriptionText.type).toEqual(BaseText);

      expect(descriptionText.props.style).toEqual(
        switchYourMedicationScreenStyles.descriptionTextStyle
      );
      expect(descriptionText.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(descriptionText.props.children).toEqual(
        isCobrandedContentAvailable
          ? switchYourMedsDescriptionMock
          : contentMock.description
      );
    }
  );

  it.each([
    [true, undefined],
    [true, ''],
    [true, 'Provider'],
    [true, 'switch-your-meds-provider-name-mock'],
    [false, undefined],
  ])(
    'renders expected Heading (providerName) as third child of BodyContentContainer (isCobrandedContentAvailable: %p; switchYourMedsProviderNameMock: %p)',
    (
      isCobrandedContentAvailable: boolean,
      switchYourMedsProviderNameMock: string | undefined
    ) => {
      usePbmProfileCobrandingContentMock.mockReturnValue(
        isCobrandedContentAvailable
          ? {
              switchYourMedsProviderName: switchYourMedsProviderNameMock,
            }
          : {}
      );

      const testRenderer = renderer.create(<SwitchYourMedicationScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;

      if (
        isCobrandedContentAvailable &&
        switchYourMedsProviderNameMock
      ) {
        const headingView = getChildren(bodyContainer)[2];
        
        expect(headingView.type).toEqual(View);
        expect(headingView.props.style).toEqual(
          switchYourMedicationScreenStyles.headingViewStyle
        );

        const heading = getChildren(headingView)[0];

        expect(heading.type).toEqual(Heading);
        expect(heading.props.level).toEqual(4);
        expect(heading.props.translateContent).toEqual(false);
        expect(heading.props.children).toEqual(
          isCobrandedContentAvailable &&
            switchYourMedsProviderNameMock &&
            switchYourMedsProviderNameMock?.toLowerCase() !== 'provider'
            ? switchYourMedsProviderNameMock
            : 'John Smith' // TODO: expect actual providerName
        );
      } else {
        const nullChild = getChildren(bodyContainer)[2];

        expect(nullChild).toBeNull();
      }
    }
  );

  it.each([[true], [false]])(
    'renders expected Heading (providerName) as third child of BodyContentContainer (isCobrandedContentAvailable: %p)',
    (isCobrandedContentAvailable: boolean) => {
      const switchYourMedsCallButtonLabelMock =
        'switch-your-meds-call-button-label-mock';

      usePbmProfileCobrandingContentMock.mockReturnValue(
        isCobrandedContentAvailable
          ? {
              switchYourMedsCallButtonLabel: switchYourMedsCallButtonLabelMock,
            }
          : {}
      );

      const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const callButton = getChildren(bodyContainer)[3];

      expect(callButton.type).toEqual(BaseButton);
      expect(callButton.props.onPress).toEqual(expect.any(Function));

      callButton.props.onPress();

      expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
      expect(callPhoneNumberMock).toHaveBeenNthCalledWith(1, '+17777777777'); // TODO: expect actual phoneNumber

      expect(callButton.props.viewStyle).toEqual(
        switchYourMedicationScreenStyles.callButtonViewStyle
      );
      expect(callButton.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(callButton.props.children).toEqual(
        isCobrandedContentAvailable
          ? switchYourMedsCallButtonLabelMock
          : contentMock.callButtonLabel
      );
    }
  );

  it('renders expected BaseButton (done) as fifth child of BodyContentContainer', () => {
    const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const doneButton = getChildren(bodyContainer)[4];

    expect(doneButton.type).toEqual(BaseButton);
    expect(doneButton.props.onPress).toEqual(expect.any(Function));

    doneButton.props.onPress();

    expect(doneButton.props.viewStyle).toEqual(
      switchYourMedicationScreenStyles.actionButtonViewStyle
    );
    expect(doneButton.props.textStyle).toEqual(
      switchYourMedicationScreenStyles.actionButtonTextStyle
    );
    expect(doneButton.props.children).toEqual(contentMock.actionButtonLabel);
  });

  it('renders expected CustomerSupport as sixth child of BodyContentContainer', () => {
    const testRenderer = renderer.create(<SwitchYourMedicationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const customerSupport = getChildren(bodyContainer)[5];

    expect(customerSupport.type).toEqual(CustomerSupport);
    expect(customerSupport.props.viewStyle).toEqual(
      switchYourMedicationScreenStyles.customerSupportViewStyle
    );
  });
});
