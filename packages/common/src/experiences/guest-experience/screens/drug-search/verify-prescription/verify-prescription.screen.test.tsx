// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { Heading } from '../../../../../components/member/heading/heading';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { VerifyPrescriptionScreen } from './verify-prescription.screen';
import { verifyPrescriptionScreenStyle } from './verify-prescription.screen.style';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';
import { lyricaSearchResultMock } from '../../../__mocks__/drug-search-response.mock';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { PrescriptionTitle } from '../../../../../components/member/prescription-title/prescription-title';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { SecondaryButton } from '../../../../../components/buttons/secondary/secondary.button';
import { selectedSourcePharmacyMock } from '../../../__mocks__/selected-source-pharmacy.mock';
import { IPrimaryProfile } from '../../../../../models/member-profile/member-profile-info';
import { IAccount } from '../../../../../models/account';
import { transferPrescriptionAsyncAction } from '../../../state/drug-search/async-actions/transfer-prescription.async-action';
import { ITransferPrescriptionRequestBody } from '../../../../../models/api-request-body/transfer-prescription.request-body';
import { prescriptionTransferConfirmationNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/prescription-transfer-confirmation-navigate.dispatch';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { pharmacyDrugPrice1Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { useNavigation, useRoute } from '@react-navigation/native';
import { homeNavigateAsyncAction } from '../../../store/navigation/actions/home-navigate.async-action';
import { getChildren } from '../../../../../testing/test.helper';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateHomeScreenDispatch } from '../../../store/navigation/dispatch/navigate-home-screen.dispatch';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IVerifyPrescriptionScreenContent } from '../../../../../models/cms-content/verify-prescription-screen.ui-content';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { ProtectedView } from '../../../../../components/containers/protected-view/protected-view';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../state/drug-search/async-actions/transfer-prescription.async-action'
);
const transferPrescriptionAsyncActionMock =
  transferPrescriptionAsyncAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/drug-search/prescription-transfer-confirmation-navigate.dispatch'
);
const prescriptionTransferConfirmationNavigateDispatchMock =
  prescriptionTransferConfirmationNavigateDispatch as jest.Mock;

jest.mock('../../../store/navigation/actions/home-navigate.async-action');
const homeNavigateAsyncActionMock = homeNavigateAsyncAction as jest.Mock;

jest.mock('../../../store/navigation/dispatch/navigate-home-screen.dispatch');
const navigateHomeScreenDispatchMock = navigateHomeScreenDispatch as jest.Mock;

const setPrescriptionNumberMock = jest.fn();
const setDisableButtonMock = jest.fn();
const setAddressVisibleMock = jest.fn();
const setPatientAddressMock = jest.fn();

const defaultConfigurationMock = drugSearchResultHelper.getDefaultConfiguration(
  lyricaSearchResultMock
);
const drugSearchStateMock: IDrugSearchState = {
  ...defaultDrugSearchState,
  selectedDrug: lyricaSearchResultMock,
  selectedConfiguration: defaultConfigurationMock,
  selectedPharmacy: pharmacyDrugPrice1Mock,
  selectedSourcePharmacy: selectedSourcePharmacyMock,
};

const contentMock: IVerifyPrescriptionScreenContent = {
  verifyPrescriptionHeader: 'verify-prescription-header-mock',
  verifyPrescriptionContent: '',
  prescriptionArrivalNotice: '',
  prescriptionInfoHeader: '',
  quantityLabel: 'qty',
  daysLabel: 'days',
  prescriptionNumberText: '',
  prescriptionNumberPlaceholder: '',
  submitButtonText: 'Submit',
  cancelButtonText: 'Cancel',
  addressComponentHeaderText: '',
  fromLabel: 'From',
  toLabel: 'To',
  needMoreInformationNotice: '',
};

const pricingOptionMock = 'smartPrice' as PricingOption;

describe('VerifyPrescriptionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });

    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest
        .fn()
        .mockReturnValue({ memberProfile: { profileList: [] } }),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useStateMock.mockReturnValue([undefined, jest.fn()]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: { hasBackNavigation: false, pricingOption: pricingOptionMock },
    });
  });

  it.each([[undefined], [false], [true]])(
    'set navigate back handler (hasBackNavigation: %p)',
    (hasBackNavigationMock: boolean | undefined) => {
      const reduxDispatchMock = jest.fn();
      const reduxContextMock: Partial<IReduxContext> = {
        dispatch: reduxDispatchMock,
        getState: jest
          .fn()
          .mockReturnValue({ memberProfile: { profileList: [] } }),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);
      useRouteMock.mockReturnValue({
        params: { hasBackNavigation: hasBackNavigationMock },
      });

      const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);

      const navigateBack = basicPageConnected.props.navigateBack;

      if (!hasBackNavigationMock) {
        expect(navigateBack).toBeUndefined();
      } else {
        navigateBack();

        expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
      }
    }
  );

  it('should have correct page structure', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useStateMock.mockReturnValue([undefined, setPrescriptionNumberMock]);
    useStateMock.mockReturnValue([true, setAddressVisibleMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    expect(basicPageConnected.props.hideNavigationMenuButton).toEqual(false);
    expect(basicPageConnected.props.showProfileAvatar).toEqual(true);
    expect(basicPageConnected.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(basicPageConnected.props.translateContent).toEqual(true);

    const body = basicPageConnected.props.body;
    expect(body.type).toEqual(BodyContentContainer);
    const header = body.props.children[0];
    expect(header.type).toEqual(Heading);
    expect(header.props.level).toEqual(1);
    expect(header.props.children).toEqual(contentMock.verifyPrescriptionHeader);
    const subHeader = body.props.children[1];
    expect(subHeader.props.style).toEqual(
      verifyPrescriptionScreenStyle.verifyPrescriptionContentTextStyle
    );
    expect(subHeader.props.children).toEqual(
      contentMock.verifyPrescriptionContent
    );
    const pharmacyTransferDetails = body.props.children[2];
    const fromLocationLabel = pharmacyTransferDetails.props.children[0];
    expect(fromLocationLabel.type).toEqual(BaseText);
    expect(fromLocationLabel.props.style).toEqual(
      verifyPrescriptionScreenStyle.toFromTextStyle
    );
    expect(fromLocationLabel.props.children).toEqual(contentMock.fromLabel);

    const fromLocationInfo = pharmacyTransferDetails.props.children[1];
    expect(fromLocationInfo.type).toEqual(ProtectedView);
    expect(fromLocationInfo.props.style).toEqual(
      verifyPrescriptionScreenStyle.locationInfoViewStyle
    );

    const fromLocationInfoTitle = fromLocationInfo.props.children[0];
    const pharmacyBrandOrName =
      selectedSourcePharmacyMock.brand ?? selectedSourcePharmacyMock.name;
    expect(fromLocationInfoTitle.props.children).toEqual(pharmacyBrandOrName);
    const fromLocationInfoAddress = fromLocationInfo.props.children[1];
    expect(fromLocationInfoAddress.props.children).toEqual(
      '123 Test St Apt 321, Seattle, WA 98109'
    );
    const fromLineSeparator = pharmacyTransferDetails.props.children[2];
    expect(fromLineSeparator.type).toEqual(LineSeparator);
    expect(fromLineSeparator.props.viewStyle).toEqual(
      verifyPrescriptionScreenStyle.pharmacyLineSeparatorViewStyle
    );

    const toLocationLabel = pharmacyTransferDetails.props.children[3];
    expect(toLocationLabel.type).toEqual(BaseText);
    expect(toLocationLabel.props.style).toEqual(
      verifyPrescriptionScreenStyle.toFromTextStyle
    );
    expect(toLocationLabel.props.children).toEqual(contentMock.toLabel);

    const toLocationInfo = pharmacyTransferDetails.props.children[4];
    expect(toLocationInfo.type).toEqual(ProtectedView);
    expect(toLocationInfo.props.style).toEqual(
      verifyPrescriptionScreenStyle.locationInfoViewStyle
    );

    const toLocationInfoTitle = toLocationInfo.props.children[0];
    expect(toLocationInfoTitle.props.children).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.name
    );
    const toLocationInfoAddress = toLocationInfo.props.children[1];
    expect(toLocationInfoAddress.props.children).toEqual(
      'address-line-1-1 address-line-2-1, city-1, state-1 zip-1'
    );
    const arrivalNoticeText = pharmacyTransferDetails.props.children[5];
    expect(arrivalNoticeText.type).toEqual(BaseText);
    expect(arrivalNoticeText.props.style).toEqual(
      verifyPrescriptionScreenStyle.verifyPrescriptionArrivalNoticeTextStyle
    );
    expect(arrivalNoticeText.props.children).toEqual(
      contentMock.prescriptionArrivalNotice
    );
    const toLineSeparator = pharmacyTransferDetails.props.children[6];
    expect(toLineSeparator.type).toEqual(LineSeparator);
    expect(toLineSeparator.props.viewStyle).toEqual(
      verifyPrescriptionScreenStyle.pharmacyLineSeparatorViewStyle
    );

    const prescriptionInfoHeader = body.props.children[3];
    expect(prescriptionInfoHeader.props.children).toEqual(
      contentMock.prescriptionInfoHeader
    );
    const needMoreInformationNotice = body.props.children[4];
    expect(needMoreInformationNotice.type).toEqual(BaseText);
    expect(needMoreInformationNotice.props.style).toEqual(
      verifyPrescriptionScreenStyle.needMoreInformationNoticeTextStyle
    );
    const prescriptionTitle = body.props.children[5];
    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(
      lyricaSearchResultMock.name
    );
    const drugVariant = drugSearchResultHelper.getVariantByNdc(
      lyricaSearchResultMock.drugVariants[0].ndc,
      lyricaSearchResultMock
    );
    expect(prescriptionTitle.props.strength).toEqual(drugVariant?.strength);
    expect(prescriptionTitle.props.formCode).toEqual(drugVariant?.formCode);
    expect(prescriptionTitle.props.unit).toEqual(drugVariant?.strengthUnit);
    expect(prescriptionTitle.props.quantity).toEqual(
      defaultConfigurationMock?.quantity
    );
    expect(prescriptionTitle.props.refills).toEqual(0);
    const textInput = body.props.children[6];
    expect(textInput.type).toEqual(PrimaryTextInput);
    expect(textInput.props.label).toEqual(contentMock.prescriptionNumberText);
    expect(textInput.props.isRequired).toEqual(false);
    expect(textInput.props.placeholder).toEqual(
      contentMock.prescriptionNumberPlaceholder
    );
    expect(textInput.props.testID).toEqual(
      'verifyPrescriptionScreenPrescriptionNumberTextInput'
    );
    const addressComponent = body.props.children[7];
    expect(addressComponent.props.style).toEqual(
      verifyPrescriptionScreenStyle.addressComponentViewStyle
    );

    const submitButton = body.props.children[8];
    expect(submitButton.type).toEqual(BaseButton);
    expect(submitButton.props.viewStyle).toEqual(
      verifyPrescriptionScreenStyle.submitButtonViewStyle
    );
    expect(submitButton.props.testID).toEqual(
      'verifyPrescriptionScreenSubmitButton'
    );
    expect(submitButton.props.children).toEqual(contentMock.submitButtonText);

    const cancelButton = body.props.children[9];
    expect(cancelButton.type).toEqual(SecondaryButton);
    expect(cancelButton.props.testID).toEqual(
      'verifyPrescriptionScreenCancelButton'
    );
    expect(cancelButton.props.children).toEqual(contentMock.cancelButtonText);
  });

  it.each([[undefined], ['brand-mock']])(
    'should have correct fromLocationInfoTitle children (brand: %s)',
    (brandMock?: string) => {
      useDrugSearchContextMock.mockReturnValue({
        drugSearchState: {
          ...drugSearchStateMock,
          selectedSourcePharmacy: {
            ...drugSearchStateMock.selectedSourcePharmacy,
            brand: brandMock,
          },
        },
        drugSearchDispatch: jest.fn(),
      });

      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      useStateMock.mockReturnValue([undefined, setPrescriptionNumberMock]);
      useStateMock.mockReturnValue([true, setAddressVisibleMock]);

      const testRenderer = renderer.create(<VerifyPrescriptionScreen />);
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const body = basicPageConnected.props.body;
      const pharmacyTransferDetails = body.props.children[2];

      const fromLocationInfo = pharmacyTransferDetails.props.children[1];
      const fromLocationInfoTitle = fromLocationInfo.props.children[0];
      const pharmacyBrandOrName = brandMock ?? selectedSourcePharmacyMock.name;

      expect(fromLocationInfoTitle.props.children).toEqual(pharmacyBrandOrName);
    }
  );

  it('should update page state when prescription number is changed', () => {
    useStateMock.mockReturnValue(['12345', setPrescriptionNumberMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const prescriptionNumberInput = body.props.children[6];
    prescriptionNumberInput.props.onChangeText('1234');

    expect(setPrescriptionNumberMock).toBeCalledTimes(1);
    expect(setPrescriptionNumberMock).toBeCalledWith('1234');
  });

  it('should not update page state when prescription number matches number in state', () => {
    useStateMock.mockReturnValue(['12345', setPrescriptionNumberMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const prescriptionNumberInput = body.props.children[6];
    prescriptionNumberInput.props.onChangeText('12345');

    expect(setPrescriptionNumberMock).not.toBeCalled();
  });

  it('should return null for source pharmacy details when no information present', () => {
    useStateMock.mockReturnValue([undefined, setPrescriptionNumberMock]);
    const missingPharmacyDetailsDrugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      selectedPharmacy: pharmacyDrugPrice1Mock,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: missingPharmacyDetailsDrugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });
    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const pharmacyTransferDetails = body.props.children[2];
    const fromLocationInfo = pharmacyTransferDetails.props.children[1];
    expect(fromLocationInfo).toBeNull();
  });

  it('should return null for destination pharmacy details when no information present', () => {
    useStateMock.mockReturnValue([undefined, setPrescriptionNumberMock]);
    const missingPharmacyDetailsDrugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      selectedPharmacy: undefined,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: missingPharmacyDetailsDrugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });
    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const pharmacyTransferDetails = body.props.children[2];
    const toLocationInfo = pharmacyTransferDetails.props.children[4];
    expect(toLocationInfo).toBeNull();
  });

  it('hides address fields for SIE members', () => {
    useStateMock.mockReturnValue([false, setDisableButtonMock]);
    useStateMock.mockReturnValue([false, setAddressVisibleMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const addressComponent = body.props.children[7];
    expect(addressComponent).toBeNull();
  });

  it('hides address fields for CASH only members with address already present in the DB', () => {
    useStateMock.mockReturnValue([false, setDisableButtonMock]);
    useStateMock.mockReturnValue([false, setAddressVisibleMock]);

    const reduxGetStateForCASHProfileMock = jest.fn().mockReturnValue({
      memberProfile: {
        profileList: [
          {
            rxGroupType: 'CASH',
            primary: {
              email: '',
              firstName: 'ME',
              identifier: '6000b2fa965fa7b37c00a7b2',
              isLimited: false,
              isPhoneNumberVerified: false,
              isPrimary: false,
              lastName: 'TEST',
              phoneNumber: '',
              primaryMemberFamilyId: 'CA7F7K',
              primaryMemberPersonCode: '03',
              primaryMemberRxId: 'CA7F7K03',
              address1: 'address1',
              city: 'city',
              state: 'state',
              zip: '12345',
              age: 4,
            } as IPrimaryProfile,
            childMembers: [],
          },
        ],
        account: {} as IAccount,
      },
    });

    const cashProfileReduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateForCASHProfileMock,
    };

    useReduxContextMock.mockReturnValueOnce(cashProfileReduxContextMock);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const addressComponent = body.props.children[7];
    expect(addressComponent).toBeNull();
  });

  it('shows address fields for CASH only members when address is not in the DB', () => {
    useStateMock.mockReturnValue([true, setDisableButtonMock]);
    useStateMock.mockReturnValue([true, setAddressVisibleMock]);

    const missingAddressForCASHUSerReduxGetStateMock = jest
      .fn()
      .mockReturnValue({
        memberProfile: {
          profileList: [
            {
              rxGroupType: 'CASH',
              primary: {
                email: '',
                firstName: 'ME',
                identifier: '6000b2fa965fa7b37c00a7b2',
                isLimited: false,
                isPhoneNumberVerified: false,
                isPrimary: false,
                lastName: 'TEST',
                phoneNumber: '',
                primaryMemberFamilyId: 'CA7F7K',
                primaryMemberPersonCode: '03',
                primaryMemberRxId: 'CA7F7K03',
                age: 4,
              } as IPrimaryProfile,
              childMembers: [],
            },
          ],
          account: {} as IAccount,
        },
      });

    const cashProfileWithoutAddressReduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: missingAddressForCASHUSerReduxGetStateMock,
    };

    useReduxContextMock.mockReturnValueOnce(
      cashProfileWithoutAddressReduxContextMock
    );

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const addressComponent = body.props.children[7];
    expect(addressComponent.props.style).toEqual(
      verifyPrescriptionScreenStyle.addressComponentViewStyle
    );
  });

  it('enables submit button when address fields are not displayed on page load', () => {
    useStateMock.mockReturnValue([false, setAddressVisibleMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    expect(body.type).toEqual(BodyContentContainer);
    const submitButton = body.props.children[8];
    expect(submitButton.props.disabled).toBe(false);
  });

  it('disables submit button when address fields are displayed on page load', () => {
    useStateMock.mockReturnValue([true, setAddressVisibleMock]);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    expect(body.type).toEqual(BodyContentContainer);
    const submitButton = body.props.children[8];
    expect(submitButton.props.disabled).toBe(true);
  });

  it('calls transfer prescription API when submit button is pressed', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ memberProfile: { profileList: [] } });
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const patientAddressMock = {
      address1: 'mock-address',
      city: 'mock-city',
      state: 'mock-state',
      zip: '12345',
    };
    useStateMock
      .mockReturnValueOnce(['12345', setPrescriptionNumberMock])
      .mockReturnValueOnce([true, setAddressVisibleMock])
      .mockReturnValueOnce([false, setDisableButtonMock])
      .mockReturnValue([patientAddressMock, setPatientAddressMock]);

    const transferPrescriptionRequestBodyMock: ITransferPrescriptionRequestBody =
      {
        memberAddress: patientAddressMock,
        sourceNcpdp: drugSearchStateMock.selectedSourcePharmacy?.ncpdp ?? '',
        destinationNcpdp:
          drugSearchStateMock.selectedPharmacy?.pharmacy.ncpdp ?? '',
        ndc: drugSearchStateMock.selectedConfiguration?.ndc ?? '',
        daysSupply: drugSearchStateMock.selectedConfiguration?.supply ?? 0,
        quantity: drugSearchStateMock.selectedConfiguration?.quantity ?? 0,
        prescriptionNumber: '12345',
      };
    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    expect(body.type).toEqual(BodyContentContainer);
    const submitButton = body.props.children[8];
    submitButton.props.onPress();
    expect(await transferPrescriptionAsyncActionMock).toHaveBeenCalledWith({
      transferPrescriptionRequestBody: transferPrescriptionRequestBodyMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    });
    expect(
      prescriptionTransferConfirmationNavigateDispatchMock
    ).toHaveBeenCalledWith(rootStackNavigationMock, pricingOptionMock);
  });

  it('should navigate to authenticated home screen when cancel button is pressed', async () => {
    useStateMock
      .mockReturnValueOnce([undefined, setPrescriptionNumberMock])
      .mockReturnValueOnce([false, setAddressVisibleMock])
      .mockReturnValueOnce([false, setDisableButtonMock])
      .mockReturnValue([undefined, setPatientAddressMock]);

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ memberProfile: { profileList: [] } });
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const asyncActionMock = jest.fn();
    homeNavigateAsyncActionMock.mockReturnValue(asyncActionMock);

    const testRenderer = renderer.create(<VerifyPrescriptionScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    expect(body.type).toEqual(BodyContentContainer);

    const cancelButton = getChildren(body)[9];
    await cancelButton.props.onPress();

    expect(transferPrescriptionAsyncActionMock).not.toBeCalled();
    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });
});
