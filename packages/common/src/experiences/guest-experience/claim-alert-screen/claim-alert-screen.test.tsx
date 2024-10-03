// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import { shallow } from 'enzyme';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { IAlternativePrescription } from '../../../components/member/alternative-prescription/alternative-prescription';
import { IPharmacyInformationProps } from '../../../components/member/pharmacy-information/pharmacy-information';
import { IRecommendationBottomProps } from '../../../components/member/recommendation-bottom/recommendation-bottom';
import { IRecommendationTopProps } from '../../../components/member/recommendation-top/recommendation-top';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import {
  ClaimAlertScreen,
  IClaimAlertInstruction,
  IClaimAlertProps,
  IClaimAlertScreenActionProps,
  IClaimAlertScreenProps,
  IOfferRowProps,
} from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../guest-experience-logger.middleware');

const offersList: IOfferRowProps[] = [
  {
    body: 'Coupon redeemable in-store only with any prescription purchase.Excludes sale items.Limit one per customer.OFFER valid through 31/12/2018..',
    dispenseType: 'Closes at 9 pm',
    distanceText: '1.5 Miles',
    externalLink: { moreLinkText: 'Learn More', link: 'www.google.com' },
    image: 'mock-image-source' as ImageSourcePropType,
    isOpen: true,
    offerId: 'mock-offer-1',
    pharmacyId: 'mock-pharmacy-1',
    pharmacyName: 'Bartell Drugs',
    price: 9.279,
    shippingPrice: 59.01,
    slug: 'SAVE $10 on any purchase of $20 or more',
  },
];
const recommendationHeaderTopProps: IRecommendationTopProps = {
  count: 3,
  daysSupply: 5,
  dose: '2',
  drugName: 'mockDrugName',
  form: 'dosage',
  refillCount: 2,
  rxId: 'mockRxId',
  units: 'mockUnits',
  medicationId: '123456',
};
const recommendationHeaderBottomProps: IRecommendationBottomProps = {
  pharmacyCashPrice: 34,
  pharmacyName: 'mockPharmacyName',
  planPays: 4,
};
const recommendationHeader: IRecommendationTopProps &
  IRecommendationBottomProps = {
  ...recommendationHeaderTopProps,
  ...recommendationHeaderBottomProps,
};
const claimAlertInstruction: IClaimAlertInstruction = {
  callToActionText: 'mockCallToActionText',
  doctorContactNumber: '88888888',
  doctorName: 'mockDoctorName',
  explanationText: 'mockExplanationText',
};
const offers: IAlternativePrescription[] = [
  {
    count: 8,
    dose: '3',
    drugName: 'mockDrugName',
    form: 'mockForm',
    price: '0',
    units: 'mockUnits',
    medicationId: '325178',
    planPays: '0',
  },
];
const pharmacyDetailsProps: IPharmacyInformationProps = {
  currentDate: new Date(2019, 9, 8),
  distance: '3 miles',
  driveThru: true,
  pharmacyAddress1: '144 128th Ave NE',
  pharmacyAddress2: 'Suite 300',
  pharmacyCity: 'Kirkland',
  pharmacyHours: new Map([
    ['Sunday', '7:00 am to 9:00 pm'],
    ['Monday', '7:00 am to 9:00 pm'],
    ['Tuesday', '7:00 am to 9:00 pm'],
    ['Wednesday', '7:00 am to 9:00 pm'],
    ['Thursday', '7:00 am to 9:00 pm'],
    ['Friday', '7:00 am to 9:00 pm'],
    ['Saturday', '7:00 am to 9:00 pm'],
  ]),
  pharmacyName: 'Medico shop',
  pharmacyState: 'WA',
  pharmacyZipCode: '98034',
  phoneNumber: '4258815894',
};
const alertSavingContent = {
  homeButton: 'home-button',
  heading: 'heading',
  description: 'description',
  imageName: 'icon',
};
const claimAlertProps: IClaimAlertProps = {
  alertId: 'mockRecommendationId',
  instruction: claimAlertInstruction,
  offers,
  alertSavingContent,
  pharmacyDetails: pharmacyDetailsProps,
  type: 'genericSubstitution',
};
const mockClaimAlertScreenProps: IClaimAlertScreenProps &
  IClaimAlertScreenActionProps = {
  getDrugInformation: jest.fn(),
  alertProps: claimAlertProps,
  offerList: offersList,
  prescription: recommendationHeader,
};

beforeEach(() => {
  jest.clearAllMocks();
  useNavigationMock.mockReturnValue(rootStackNavigationMock);

  const reduxContextMock: IReduxContext = {
    dispatch: jest.fn(),
    getState: jest.fn(),
  };
  useReduxContextMock.mockReturnValue(reduxContextMock);
});

describe('ClaimAlertScreen', () => {
  it('should have a BasicPageConnected with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const page = claimAlertScreen.find(BasicPageConnected).get(0);

    expect(page.props.header).toBeDefined();
    expect(page.props.body).toBeDefined();
    expect(page.props.footer).toBeDefined();
    expect(page.props.showProfileAvatar).toBeTruthy();
    expect(page.props.stickyIndices).toBeDefined();
    expect(page.props.stickyViews).toBeDefined();
  });

  it('renders "Home" button in footer', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const page = claimAlertScreen.find(BasicPageConnected).get(0);
    const homeButton = page.props.footer;

    expect(homeButton.type).toEqual(HomeButton);
    expect(homeButton.props.onPress).toEqual(expect.any(Function));
  });

  it('handles "Home" button press', () => {
    const reduxContextMock: Partial<IReduxContext> = {
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const page = claimAlertScreen.find(BasicPageConnected).get(0);
    const homeButton = page.props.footer;

    homeButton.props.onPress();

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      reduxContextMock.getState,
      rootStackNavigationMock
    );
  });
});

describe('ClaimAlertScreen Header', () => {
  it('should have a header with RecommendationHeaderTop and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const headertop = claimAlertScreen.find(BasicPageConnected).get(0).props
      .header.props.children[0];
    expect(headertop.props).toMatchObject(recommendationHeaderTopProps);
  });

  it('should have a header with RecommendationHeaderBottom and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const headerbottom = claimAlertScreen.find(BasicPageConnected).get(0).props
      .header.props.children[1];
    expect(headerbottom.props).toMatchObject(recommendationHeaderBottomProps);
  });
});

describe('ClaimAlertScreen Body', () => {
  it('should have render a body with claimAlertContent and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const mockClaimAlertContent = claimAlertScreen
      .find(BasicPageConnected)
      .get(0).props.body;
    expect(mockClaimAlertContent.type).toEqual(BodyContentContainer);
    expect(
      mockClaimAlertContent.props.children[0].props.children[0].props
    ).toMatchObject(alertSavingContent);
  });

  it('should have render a body with alternativePrescription and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const alternativePrescription = claimAlertScreen
      .find(BasicPageConnected)
      .get(0).props.body.props.children[1];
    expect(alternativePrescription.length).toBe(offers.length);
    expect(alternativePrescription.length).toBeGreaterThanOrEqual(1);
    expect(alternativePrescription[0].props).toEqual(offers[0]);
  });

  it('should have render a body with OfferDetailsInstruction and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const offerDetailsInstruction = claimAlertScreen
      .find(BasicPageConnected)
      .get(0).props.body.props.children[2];
    expect(offerDetailsInstruction.props).toMatchObject(claimAlertInstruction);
  });

  it('should have render a body with PharmacyDetails and with props', () => {
    const claimAlertScreen = shallow(
      <ClaimAlertScreen {...mockClaimAlertScreenProps} />
    );
    const alertPharmacyDetails = claimAlertScreen
      .find(BasicPageConnected)
      .get(0).props.body.props.children[4].props.children.props;
    expect(alertPharmacyDetails).toMatchObject(pharmacyDetailsProps);
  });
});

describe('ClaimAlertScreen Scenario 0', () => {
  const claimAlertScreenProps: IClaimAlertScreenProps &
    IClaimAlertScreenActionProps = {
    alertProps: {
      alertId: 'mockAlertId',
      alertSavingContent,
      pharmacyDetails: pharmacyDetailsProps,
      type: 'notification',
    },
    getDrugInformation: jest.fn(),
    offerList: offersList,
    prescription: recommendationHeader,
  };

  describe('ClaimAlertScreen', () => {
    it('should have a BasicPageConnected with props', () => {
      const claimAlertScreen = shallow(
        <ClaimAlertScreen {...claimAlertScreenProps} />
      );

      const page = claimAlertScreen.find(BasicPageConnected).get(0);
      expect(page.props.header).toBeDefined();
      expect(page.props.body).toBeDefined();
      expect(page.props.showProfileAvatar).toBeTruthy();
      expect(page.props.stickyIndices).toBeDefined();
      expect(page.props.stickyViews).toBeDefined();
      expect(page.props.translateContent).toBeTruthy();
    });
  });

  describe('ClaimAlertScreen Header', () => {
    it('should have a header with RecommendationHeaderTop and with props', () => {
      const claimAlertScreen = shallow(
        <ClaimAlertScreen {...mockClaimAlertScreenProps} />
      );
      const headertop = claimAlertScreen.find(BasicPageConnected).get(0).props
        .header.props.children[0];
      expect(headertop.props).toMatchObject(recommendationHeaderTopProps);
    });

    it('should have a header with RecommendationHeaderBottom and with props', () => {
      const claimAlertScreen = shallow(
        <ClaimAlertScreen {...mockClaimAlertScreenProps} />
      );
      const headerbottom = claimAlertScreen.find(BasicPageConnected).get(0)
        .props.header.props.children[1];
      expect(headerbottom.props).toMatchObject(recommendationHeaderBottomProps);
    });
    describe('ClaimAlertScreen Body', () => {
      it('should have render a body with claimAlertContent and with props', () => {
        const claimAlertScreen = shallow(
          <ClaimAlertScreen {...mockClaimAlertScreenProps} />
        );
        const mockClaimAlertContent = claimAlertScreen
          .find(BasicPageConnected)
          .get(0).props.body;
        expect(
          mockClaimAlertContent.props.children[0].props.children[0].props
        ).toMatchObject(alertSavingContent);
      });

      it('should have render a body with RecommendationOfferRowContent and with props', () => {
        const claimAlertScreen = shallow(
          <ClaimAlertScreen {...mockClaimAlertScreenProps} />
        );
        const recommendationOfferRowContent = claimAlertScreen
          .find(BasicPageConnected)
          .get(0).props.body.props.children[1];
        expect(recommendationOfferRowContent.length).toBe(offers.length);
        expect(recommendationOfferRowContent.length).toBeGreaterThanOrEqual(1);
        expect(recommendationOfferRowContent[0].props).toEqual(offers[0]);
      });

      it('should have render a body with OfferDetailsInstruction and with props', () => {
        const claimAlertScreen = shallow(
          <ClaimAlertScreen {...mockClaimAlertScreenProps} />
        );
        const offerDetailsInstruction = claimAlertScreen
          .find(BasicPageConnected)
          .get(0).props.body.props.children[2];
        expect(offerDetailsInstruction.props).toMatchObject(
          claimAlertInstruction
        );
      });

      it('should have render a body with PharmacyDetails and with props', () => {
        const claimAlertScreen = shallow(
          <ClaimAlertScreen {...mockClaimAlertScreenProps} />
        );
        const alertPharmacyDetails = claimAlertScreen
          .find(BasicPageConnected)
          .get(0).props.body.props.children[4].props.children.props;
        expect(alertPharmacyDetails).toMatchObject(pharmacyDetailsProps);
      });
    });
  });
});
