// Copyright 2021 Prescryptive Health, Inc.

import { View } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { ISessionContext } from '../../../context-providers/session/session.context';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import {
  defaultSessionState,
  ISessionState,
} from '../../../state/session/session.state';
import { FindYourPharmacyScreen } from './find-your-pharmacy.screen';
import { findYourPharmacyStyle } from './find-your-pharmacy.screen.style';
import { SearchBox } from '../../../../../components/member/search-box/search-box';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { defaultDrugSearchState } from '../../../state/drug-search/drug-search.state';
import {
  getPharmaciesByZipCodeAsyncAction,
  IGetPharmaciesByZipCodeAsyncActionArgs,
} from '../../../state/drug-search/async-actions/get-pharmacies-by-zip-code.async-action';
import { Workflow } from '../../../../../models/workflow';
import { LinkButton } from '../../../../../components/buttons/link/link.button';
import { IPharmacy } from '../../../../../models/pharmacy';
import { IAddress } from '../../../../../models/address';
import { IHours } from '../../../../../models/date-time/hours';
import { verifyPrescriptionNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/verify-prescription-navigate.dispatch';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreateAccountScreenRouteProps } from '../../sign-in/create-account/create-account.screen';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IFindPharmacyContent } from './find-your-pharmacy.screen.content';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock(
  '../../../state/drug-search/async-actions/get-pharmacies-by-zip-code.async-action'
);
const getPharmaciesByZipCodeAsyncActionMock =
  getPharmaciesByZipCodeAsyncAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/drug-search/verify-prescription-navigate.dispatch'
);
const verifyPrescriptionNavigateDispatchMock =
  verifyPrescriptionNavigateDispatch as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const setStartMock = jest.fn();

interface IStateCalls {
  setZipCode: [string, jest.Mock];
  setStart: [number, jest.Mock];
  setPreviousPharmacyListLength: [number, jest.Mock];
  setAllPharmaciesReceived: [boolean, jest.Mock];
}

function stateReset({
  setZipCode = ['', jest.fn()],
  setStart = [0, setStartMock],
  setPreviousPharmacyListLength = [0, jest.fn()],
  setAllPharmaciesReceived = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(setStart);
  useStateMock.mockReturnValueOnce(setZipCode);
  useStateMock.mockReturnValueOnce(setPreviousPharmacyListLength);
  useStateMock.mockReturnValueOnce(setAllPharmaciesReceived);
}

const workflowMock: Workflow = 'startSaving';

const findYourPharmacyContentMock: IFindPharmacyContent = {
  placeholder: 'place-holder-label-mock',
  searchresults: 'search-results-label-mock',
  header: 'header-label-mock',
  subHeader: 'sub-header-label-mock',
  displayMore: 'display-more-label-mock',
  backToTheTop: 'back-to-the-top-label-mock',
};

describe('FindYourPharmacyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: defaultDrugSearchState,
      drugSearchDispatch: jest.fn(),
    });
    stateReset({});
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: { workflow: workflowMock } });
    useContentMock.mockReturnValue({
      content: findYourPharmacyContentMock,
      isContentLoading: false,
    });
  });

  it('requests getPharmacies if zipcode set', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    stateReset({ setZipCode: ['98005', jest.fn()] });
    const sessionDispatchMock = jest.fn();
    const drugSearchDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
      isUnauthExperience: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: defaultDrugSearchState,
      drugSearchDispatch: drugSearchDispatchMock,
    });
    renderer.create(<FindYourPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      '98005',
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    const expectedArgs: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      start: undefined,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
      isUnauthExperience: true,
      navigation: rootStackNavigationMock,
    };
    expect(getPharmaciesByZipCodeAsyncActionMock).toHaveBeenNthCalledWith(
      1,
      expectedArgs
    );
  });

  it('renders as basic page', () => {
    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.headerViewStyle).toEqual(
      findYourPharmacyStyle.headerViewStyle
    );
    expect(basicPage.props.showProfileAvatar).toEqual(false);
    expect(basicPage.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders header', () => {
    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const body = basicPage.props.body;
    const header = body.props.children[0];
    expect(header.type).toEqual(View);
    const headingView = header.props.children;
    expect(headingView.type).toEqual(View);
    const heading = headingView.props.children[0];
    const subHeading = headingView.props.children[1];
    expect(heading.props.textStyle).toEqual(
      findYourPharmacyStyle.findPharmacyTextStyle
    );
    expect(heading.props.children).toEqual(findYourPharmacyContentMock.header);
    expect(subHeading.props.style).toEqual(
      findYourPharmacyStyle.findPharmacySubTextStyle
    );
    expect(subHeading.props.children).toEqual(
      findYourPharmacyContentMock.subHeader
    );
  });

  it('renders searchBox', () => {
    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const body = basicPage.props.body;
    const searchBox = body.props.children[1];
    expect(searchBox.type).toEqual(SearchBox);
    expect(searchBox.props.testID).toEqual('findYourPharmacySearchBox');
  });

  it('renders footer', () => {
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const linkButton = basicPage.props.body.props.children[4];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.linkText).toEqual(
      findYourPharmacyContentMock.displayMore
    );
  });

  it('requests getPharmacies if pressed see more pharmacies', () => {
    stateReset({ setZipCode: ['98005', jest.fn()] });
    const sessionDispatchMock = jest.fn();
    const drugSearchDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
      isUnauthExperience: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: drugSearchDispatchMock,
    });
    const testRenderer = renderer.create(<FindYourPharmacyScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const linkButton = basicPage.props.body.props.children[4];
    const onPress = linkButton.props.onPress;
    onPress();

    expect(setStartMock).toHaveBeenCalledTimes(1);
    expect(setStartMock).toHaveBeenNthCalledWith(1, 20);
  });

  it('scrolls to top if all pharmacies shown', () => {
    stateReset({
      setZipCode: ['98005', jest.fn()],
      setAllPharmaciesReceived: [true, jest.fn()],
    });
    useRefMock.mockReset();

    const scrollToMock = jest.fn();
    useRefMock.mockReturnValueOnce({ current: { scrollTo: scrollToMock } });

    const measureMock = jest.fn();
    useRefMock.mockReturnValueOnce({ current: { measure: measureMock } });

    const sessionDispatchMock = jest.fn();
    const drugSearchDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
      isUnauthExperience: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: drugSearchDispatchMock,
    });
    const wrapper = shallow(<FindYourPharmacyScreen />);
    const basicPage = wrapper.find(BasicPageConnected).get(0);
    const body = basicPage.props.body;
    const linkButton = body.props.children[4];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.linkText).toEqual(
      findYourPharmacyContentMock.backToTheTop
    );

    const onPress = linkButton.props.onPress;
    onPress();

    expect(setStartMock).not.toHaveBeenCalled();
    expect(measureMock).toHaveBeenCalledTimes(1);
    expect(measureMock).toBeCalledWith(expect.any(Function));
    const measureHandler = measureMock.mock.calls[0][0];
    const yMock = 5;
    measureHandler(undefined, yMock);
    expect(scrollToMock).toHaveBeenCalledWith(yMock);
  });

  it('navigates to create account screen when unauth flow', () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: jest.fn(),
    });
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
      isUnauthExperience: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyCards = basicPage.props.body.props.children[3];
    const pharmacyCardView = pharmacyCards[0];
    const pharmacyCard = pharmacyCardView.props.children;

    const onPress = pharmacyCard.props.navigateToPharmacyInformation;
    onPress();
    const expectedParams: ICreateAccountScreenRouteProps = {
      workflow: workflowMock,
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('RootStack', {
      screen: 'CreateAccount',
      params: expectedParams,
    });
    expect(verifyPrescriptionNavigateDispatchMock).not.toHaveBeenCalled();
  });

  it('does not navigate to create account screen when unauth flow and workflow undefined', () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: jest.fn(),
    });
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
      isUnauthExperience: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useRouteMock.mockReturnValueOnce({ params: { workflow: undefined } });

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyCards = basicPage.props.body.props.children[3];
    const pharmacyCardView = pharmacyCards[0];
    const pharmacyCard = pharmacyCardView.props.children;

    const onPress = pharmacyCard.props.navigateToPharmacyInformation;
    onPress();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(verifyPrescriptionNavigateDispatchMock).not.toHaveBeenCalled();
  });

  it('navigates to verify prescription screen when auth flow', () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: jest.fn(),
    });
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map(),
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: sessionStateMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    const pricingOptionMock = 'smartPrice' as PricingOption;
    useRouteMock.mockReset();
    useRouteMock.mockReturnValue({
      params: { workflow: workflowMock, pricingOption: pricingOptionMock },
    });

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyCards = basicPage.props.body.props.children[3];
    const pharmacyCardView = pharmacyCards[0];
    const pharmacyCard = pharmacyCardView.props.children;

    const onPress = pharmacyCard.props.navigateToPharmacyInformation;
    onPress();

    expect(verifyPrescriptionNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      true,
      pricingOptionMock
    );
  });

  it('renders error message when occur on zipcode search', () => {
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        invalidZipErrorMessage: 'error occurred',
      },
      drugSearchDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    const errorMessage = basicPage.props.body.props.children[2];
    expect(errorMessage.props.children).toEqual('error occurred');
  });

  it('navigates back correctly', () => {
    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    basicPage.props.navigateBack();
    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders skeletons', () => {
    useContentMock.mockReturnValue({
      content: {},
      isContentLoading: true,
    });

    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: {
        ...defaultDrugSearchState,
        sourcePharmacies: [
          {
            address: {
              lineOne: '123 Main St',
              lineTwo: 'Suite 1000',
              city: 'Seattle',
              state: 'WA',
              zip: '98102',
            } as IAddress,
            name: 'test-name',
            ncpdp: '1',
            hours: [] as IHours[],
            twentyFourHours: true,
          } as IPharmacy,
        ],
      },
      drugSearchDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<FindYourPharmacyScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const body = basicPage.props.body;
    const header = body.props.children[0];
    expect(header.type).toEqual(View);
    const headingView = header.props.children;
    expect(headingView.type).toEqual(View);
    const heading = headingView.props.children[0];
    const subHeading = headingView.props.children[1];
    expect(heading.props.isSkeleton).toEqual(true);
    expect(subHeading.props.isSkeleton).toEqual(true);

    const linkButton = body.props.children[4];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.isSkeleton).toEqual(true);
  });
});
