// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { pickAPharmacyNavigateDispatch } from '../../store/navigation/dispatch/shopping/pick-a-pharmacy-navigate.dispatch';
import { medicineCabinetStateMock } from '../../__mocks__/medicine-cabinet-state.mock';
import { MedicineCabinetScreen } from './medicine-cabinet.screen';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import {
  defaultMedicineCabinetState,
  IMedicineCabinetState,
} from '../../state/medicine-cabinet/medicine-cabinet.state';
import { IMedicineCabinetContext } from '../../../guest-experience/context-providers/medicine-cabinet/medicine-cabinet.context';
import {
  getMedicineCabinetAsyncAction,
  IGetMedicineCabinetAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-medicine-cabinet.async-action';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useUrl } from '../../../../hooks/use-url';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import {
  expectToHaveBeenCalledOnceOnlyWith,
  getChildren,
} from '../../../../testing/test.helper';
import { useFeaturesContext } from '../../context-providers/features/use-features-context.hook';
import { IFeaturesContext } from '../../context-providers/features/features.context';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { IMedicineCabinetScreenContent } from './medicine-cabinet.screen.content';
import { IGlobalContent } from '../../../../models/cms-content/global.content';
import { PrescriptionList } from '../../../../components/lists/prescription/prescription.list';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { medicineCabinetScreenStyles } from './medicine-cabinet.screen.styles';
import {
  INavigationLink,
  NavigationLinkList,
} from '../../../../components/lists/navigation-link/navigation-link.list';
import { LogoClickActionEnum } from '../../../../components/app/application-header/application-header';
import { isPbmMember } from '../../../../utils/profile.helper';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../state/membership/membership.state';
import {
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../../models/member-profile/member-profile-info';
import { IMembershipContext } from '../../context-providers/membership/membership.context';
import { Heading } from '../../../../components/member/heading/heading';
import { List } from '../../../../components/primitives/list';
import { ListItem } from '../../../../components/primitives/list-item';
import { ChevronCard } from '../../../../components/cards/chevron/chevron.card';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IShoppingPickAPharmacyScreenRouteProps } from '../shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';
import { EmptyStateMessage } from '../../../../components/messages/empty-state/empty-state.message';
import { ITestContainer } from '../../../../testing/test.container';
import { InlineLink } from '../../../../components/member/links/inline/inline.link';
import { MarkdownText } from '../../../../components/text/markdown-text/markdown-text';
import { useLoadingContext } from '../../context-providers/loading/use-loading-context';
import { ILoadingContext } from '../../context-providers/loading/loading.context';
import {
  defaultLoadingState,
  ILoadingState,
} from '../../state/loading/loading.state';
import { IFeaturesState } from '../../guest-experience-features';
import { sendNotificationEvent } from '../../api/api-v1.send-notification-event';

jest.mock('../../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../components/buttons/link/link.button', () => ({
  LinkButton: () => <div />,
}));

jest.mock(
  '../../../../components/lists/prescription/prescription.list',
  () => ({
    PrescriptionList: () => <div />,
  })
);

jest.mock(
  '../../../../components/lists/navigation-link/navigation-link.list',
  () => ({
    NavigationLinkList: () => <div />,
  })
);

jest.mock(
  '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook'
);
const useMedicineCabinetContextMock = useMedicineCabinetContext as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../context-providers/features/use-features-context.hook');
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

jest.mock(
  '../../store/navigation/dispatch/shopping/pick-a-pharmacy-navigate.dispatch'
);
const pickAPharmacyNavigateDispatchMock =
  pickAPharmacyNavigateDispatch as unknown as jest.Mock;

jest.mock('../../api/api-v1.send-notification-event');
const sendNotificationEventMock = sendNotificationEvent as unknown as jest.Mock;

jest.mock(
  '../../state/medicine-cabinet/async-actions/get-medicine-cabinet.async-action'
);
const getMedicineCabinetAsyncActionMock =
  getMedicineCabinetAsyncAction as jest.Mock;

jest.mock('../../context-providers/loading/use-loading-context');
const useLoadingContextMock = useLoadingContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
const useRefMock = useRef as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock(
  '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../../utils/profile.helper');
const isPbmMemberMock = isPbmMember as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../components/cards/chevron/chevron.card', () => ({
  ChevronCard: () => <div />,
}));

jest.mock(
  '../../../../components/messages/empty-state/empty-state.message',
  () => ({
    EmptyStateMessage: () => <div />,
  })
);
jest.mock('../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../../components/member/links/inline/inline.link', () => ({
  InlineLink: () => <div />,
}));

jest.mock('../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: () => <div />,
}));
const mockSetShowModal = jest.fn();

const prescriptions: IPrescriptionInfo[] =
  medicineCabinetStateMock.prescriptions;

const medicineCabinetStateTestMock: IMedicineCabinetState = {
  ...defaultMedicineCabinetState,
};

const prescriptionsMock: IPrescriptionInfo[] = [
  {
    ...prescriptionInfoMock,
    drugName: 'drug-name-1',
    form: 'drug-form-1',
    ndc: 'ndc-1',
  },
  {
    ...prescriptionInfoMock,
    drugName: 'drug-name-2',
    form: 'drug-form-2',
    ndc: 'ndc-2',
  },
];

interface IStateCalls {
  currentPage: [number, jest.Mock];
  currentResultLength: [number, jest.Mock];
  lastPage: [boolean, jest.Mock];
  showModal: [boolean, jest.Mock];
}

function stateReset({
  currentPage = [1, jest.fn()],
  currentResultLength = [0, jest.fn()],
  lastPage = [false, jest.fn()],
  showModal = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(currentPage);
  useStateMock.mockReturnValueOnce(currentResultLength);
  useStateMock.mockReturnValueOnce(lastPage);
  useStateMock.mockReturnValueOnce(showModal);
}
const primaryMemberMock: IPrimaryProfile = {
  firstName: 'first',
  lastName: 'last',
  dateOfBirth: '',
  identifier: '',
  phoneNumber: '',
  carrierPCN: 'carrierPCN',
  issuerNumber: 'issuerNumber',
  primaryMemberFamilyId: 'primaryMemberFamilyId',
  primaryMemberPersonCode: 'primaryMemberPersonCode',
  primaryMemberRxId: 'primaryMemberRxId',
  rxBin: 'rxBin',
  rxGroup: 'rxGroup',
  rxGroupType: RxGroupTypesEnum.SIE,
  rxSubGroup: '',
};

const membershipStateMock: IMembershipState = {
  ...defaultMembershipState,
  profileList: [
    {
      primary: primaryMemberMock,
      rxGroupType: 'rx-group-type',
    },
  ],
};

const membershipContextMock: Partial<IMembershipContext> = {
  membershipState: membershipStateMock,
};
describe('MedicineCabinetScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({
    config: {
      apis: {
        guestExperienceApi: {},
      },
    },
    settings: {
      deviceToken: 'device-token',
      token: 'token',
    },
  });
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  let consoleErrorSpy: jest.SpyInstance;

  const featuresContextMock: IFeaturesContext = {
    featuresState: {} as IFeaturesState,
  };
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: {} });
    const cabinetMock: IMedicineCabinetContext = {
      medicineCabinetState: { ...defaultMedicineCabinetState, prescriptions },
      medicineCabinetDispatch: jest.fn(),
    };

    useMedicineCabinetContextMock.mockReturnValue(cabinetMock);
    useRouteMock.mockReturnValue({ params: undefined });

    useReduxContextMock.mockReturnValue(reduxContextMock);
    const loadingMock: ILoadingContext = {
      loadingState: { ...defaultLoadingState },
    };
    useLoadingContextMock.mockReturnValue(loadingMock);

    useFeaturesContextMock.mockReturnValue(featuresContextMock);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    stateReset({});

    useMembershipContextMock.mockReturnValue(membershipContextMock);

    // Suppress jest error regarding ref on function component
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('gets content', () => {
    renderer.create(<MedicineCabinetScreen />);

    expect(useContentMock).toHaveBeenCalledTimes(2);
    expect(useContentMock).toHaveBeenNthCalledWith(1, CmsGroupKey.global, 2);
    expect(useContentMock).toHaveBeenNthCalledWith(
      2,
      CmsGroupKey.medicineCabinetScreen,
      2
    );
  });

  it('update url with /cabinet', () => {
    useMedicineCabinetContextMock.mockReturnValue({
      medicineCabinetState: medicineCabinetStateTestMock,
    });

    useReduxContextMock.mockReturnValue(reduxContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    renderer.create(<MedicineCabinetScreen />);

    expect(useUrlMock).toHaveBeenCalledWith('/cabinet');
  });

  it('get prescriptions on page load', async () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      loadingPrescriptionsText: 'loadingPrescriptionsText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetDispatchMock = jest.fn();

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...medicineCabinetStateTestMock,
        prescriptions: [],
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    renderer.create(<MedicineCabinetScreen />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    const expectArgs: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: medicineCabinetDispatchMock,
      navigation: rootStackNavigationMock,
      loadingText: contentMock.loadingPrescriptionsText,
    };

    expect(getMedicineCabinetAsyncActionMock).toHaveBeenCalledWith(expectArgs);
  });

  it('renders as basic page', () => {
    useMedicineCabinetContextMock.mockReturnValue({
      medicineCabinetState: medicineCabinetStateTestMock,
    });

    useReduxContextMock.mockReturnValue(reduxContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it.each([[undefined], [false], [true]])(
    'handles navigateBack (backToHome: %p)',
    (backToHomeMock: undefined | boolean) => {
      useRouteMock.mockReturnValue({ params: { backToHome: backToHomeMock } });
      useMedicineCabinetContextMock.mockReturnValue({
        medicineCabinetState: medicineCabinetStateTestMock,
      });

      useReduxContextMock.mockReturnValue(reduxContextMock);
      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      const testRenderer = renderer.create(<MedicineCabinetScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      basicPage.props.navigateBack();

      if (backToHomeMock) {
        expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
          reduxGetStateMock,
          rootStackNavigationMock
        );
      } else {
        expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
      }
    }
  );

  it('renders prescription list', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: prescriptionsMock,
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    useContentMock.mockReturnValueOnce({ content: {} });

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionList = getChildren(bodyContainer)[0];

    expect(prescriptionList.type).toEqual(PrescriptionList);
    expect(prescriptionList.props.prescriptions).toEqual(prescriptionsMock);
    expect(prescriptionList.props.onPrescriptionSelect).toEqual(
      expect.any(Function)
    );
    expect(prescriptionList.props.testID).toEqual(
      'medicineCabinetPrescriptionList'
    );

    const prescriptionIdMock = '1';
    prescriptionList.props.onPrescriptionSelect(prescriptionIdMock);

    const expectedRouteProps: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: prescriptionIdMock,
      navigateToHome: false,
      reloadPrescription: true,
      blockchain: undefined,
    };
    expect(pickAPharmacyNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      expectedRouteProps
    );
  });

  it('calls pick a pharmacy navigate dispatch with blockchain parameter as true when prescription is blockchain', () => {
    const blockchainPrescriptionMock: IPrescriptionInfo = {
      ...prescriptionInfoMock,
      drugName: 'drug-name-3',
      form: 'drug-form-3',
      ndc: 'ndc-3',
      blockchain: true,
    };

    const blockchainPrescriptionsMock = [
      ...prescriptionsMock,
      blockchainPrescriptionMock,
    ];

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: blockchainPrescriptionsMock,
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    useContentMock.mockReturnValueOnce({ content: {} });

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionList = getChildren(bodyContainer)[0];

    expect(prescriptionList.type).toEqual(PrescriptionList);
    expect(prescriptionList.props.prescriptions).toEqual(
      blockchainPrescriptionsMock
    );
    expect(prescriptionList.props.onPrescriptionSelect).toEqual(
      expect.any(Function)
    );
    expect(prescriptionList.props.testID).toEqual(
      'medicineCabinetPrescriptionList'
    );

    const prescriptionIdMock = '1';
    prescriptionList.props.onPrescriptionSelect(prescriptionIdMock, true);

    const expectedRouteProps: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: prescriptionIdMock,
      navigateToHome: false,
      blockchain: true,
      reloadPrescription: true,
    };
    expect(pickAPharmacyNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      expectedRouteProps
    );
  });

  it('calls send notification event', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: prescriptionsMock,
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    useContentMock.mockReturnValueOnce({ content: {} });

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionList = getChildren(bodyContainer)[0];

    const prescriptionIdMock = '1';
    prescriptionList.props.onPrescriptionSelect(prescriptionIdMock);

    expect(sendNotificationEventMock).toHaveBeenCalledWith(
      {},
      {
        idType: 'smartContractId',
        id: prescriptionIdMock,
        tags: [
          'dRx',
          'supportDashboard',
          'myPrescryptive',
          'prescriberFeedbackLoop',
        ],
        subject: 'Patient viewed NewRx in Medicine Cabinet.',
        messageData: '',
      },
      'device-token',
      'token'
    );
  });

  it('renders button container', () => {
    const testRenderer = renderer.create(<MedicineCabinetScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPageConnected.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const buttonContainer = getChildren(bodyContainer)[1];

    expect(buttonContainer.type).toEqual(View);
    expect(buttonContainer.props.testID).toEqual('buttonContainer');
    expect(getChildren(buttonContainer).length).toEqual(1);
  });

  it('get prescriptions when currentPage changes', async () => {
    stateReset({
      currentPage: [2, jest.fn()],
    });

    const medicineCabinetDispatchMock = jest.fn();

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...medicineCabinetStateTestMock,
        prescriptions: [...prescriptions],
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    const isGlobalContentLoadingMock = true;
    const globalContentMock: Partial<IGlobalContent> = {
      scrollToTop: 'scroll-to-top',
    };
    const globalContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IGlobalContent>>
    > = {
      isContentLoading: isGlobalContentLoadingMock,
      content: globalContentMock,
    };
    useContentMock.mockReturnValueOnce(globalContentWithIsLoadingMock);
    const isScreenContentLoadingMock = true;
    const screenContentMock: Partial<IMedicineCabinetScreenContent> = {
      seeMorePrescriptionsLink: 'see-more-prescriptions',
    };
    const screenContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isScreenContentLoadingMock,
      content: screenContentMock,
    };
    useContentMock.mockReturnValueOnce(screenContentWithIsLoadingMock);
    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPageConnected.props.body);
    const buttonContainer = bodyRenderer.root.findByProps({
      testID: 'buttonContainer',
    });

    const loadMoreButton = getChildren(buttonContainer)[0];
    expect(loadMoreButton.type).toEqual(LinkButton);
    expect(loadMoreButton.props.linkText).toEqual(
      screenContentMock.seeMorePrescriptionsLink
    );
    expect(loadMoreButton.props.isSkeleton).toEqual(isGlobalContentLoadingMock);

    const onPress = loadMoreButton.props.onPress;
    onPress();

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [2]);

    const effectHandler = useEffectMock.mock.calls[1][0];
    await effectHandler();

    const expectArgs: IGetMedicineCabinetAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      page: 2,
      medicineCabinetDispatch: medicineCabinetDispatchMock,
      navigation: rootStackNavigationMock,
    };

    expect(getMedicineCabinetAsyncActionMock).toHaveBeenCalledWith(expectArgs);
  });

  it('scroll to bottom when load more prescriptions', async () => {
    stateReset({
      currentPage: [2, jest.fn()],
      currentResultLength: [12, jest.fn()],
    });

    const medicineCabinetDispatchMock = jest.fn();

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...medicineCabinetStateTestMock,
        prescriptions: [...prescriptions],
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPageConnected.props.body);
    const buttonContainer = bodyRenderer.root.findByProps({
      testID: 'buttonContainer',
    });

    const loadMoreButton = getChildren(buttonContainer)[0];
    loadMoreButton.props.onPress();

    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      prescriptions,
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    await effectHandler();
  });

  it('scroll to top when clicked on back to top', () => {
    stateReset({
      currentPage: [2, jest.fn()],
      currentResultLength: [12, jest.fn()],
      lastPage: [true, jest.fn()],
    });

    useRefMock.mockReset();

    const scrollToMock = jest.fn();
    useRefMock.mockReturnValueOnce({ current: { scrollTo: scrollToMock } });

    const medicineCabinetDispatchMock = jest.fn();

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...medicineCabinetStateTestMock,
        prescriptions: [...prescriptions],
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    const isGlobalContentLoadingMock = true;
    const globalContentMock: Partial<IGlobalContent> = {
      scrollToTop: 'scroll-to-top',
    };
    const globalContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IGlobalContent>>
    > = {
      isContentLoading: isGlobalContentLoadingMock,
      content: globalContentMock,
    };
    useContentMock.mockReturnValueOnce(globalContentWithIsLoadingMock);

    useContentMock.mockReturnValueOnce({ content: {} });

    const isScreenContentLoadingMock = true;
    const screenContentMock: Partial<IMedicineCabinetScreenContent> = {
      seeMorePrescriptionsLink: 'see-more-prescriptions',
      title: 'title',
    };
    const screenContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isScreenContentLoadingMock,
      content: screenContentMock,
    };
    useContentMock.mockReturnValueOnce(screenContentWithIsLoadingMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPageConnected.props.body);
    const buttonContainer = bodyRenderer.root.findByProps({
      testID: 'buttonContainer',
    });

    const loadMoreButton = getChildren(buttonContainer)[0];

    expect(loadMoreButton.props.linkText).toEqual(
      globalContentMock.scrollToTop
    );
    expect(loadMoreButton.props.isSkeleton).toEqual(isGlobalContentLoadingMock);

    loadMoreButton.props.onPress();

    expect(useRefMock).toBeCalledTimes(1);
    expect(scrollToMock).toHaveBeenNthCalledWith(1, { y: 0 });
  });

  it.each([
    [false, []],
    [false, medicineCabinetStateMock.prescriptions],
    [true, []],
    [true, medicineCabinetStateMock.prescriptions],
  ])(
    'renders navigation section ( isPbmUserMock:%p, prescriptions: %p)',
    (isPbmUserMock: boolean, prescriptions: IPrescriptionInfo[]) => {
      const medicineCabinetStateMock: IMedicineCabinetState = {
        ...defaultMedicineCabinetState,
        prescriptions,
      };
      const medicineCabinetContextMock: IMedicineCabinetContext = {
        medicineCabinetDispatch: jest.fn(),
        medicineCabinetState: medicineCabinetStateMock,
      };
      useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

      isPbmMemberMock.mockReturnValue(isPbmUserMock);
      const testRenderer = renderer.create(<MedicineCabinetScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      expect(isPbmMemberMock).toHaveBeenCalledWith(
        membershipStateMock.profileList,
        featuresContextMock.featuresState
      );

      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const navigationContainerFragment = getChildren(bodyContainer)[2];
      if (isPbmUserMock || prescriptions.length)
        expect(getChildren(navigationContainerFragment).length).toEqual(2);
      else expect(navigationContainerFragment).toBeNull();
    }
  );

  it('renders navigation section line separator', () => {
    isPbmMemberMock.mockReturnValue(true);
    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const navigationContainerFragment = getChildren(bodyContainer)[2];
    const lineSeparator = getChildren(navigationContainerFragment)[0];

    expect(isPbmMemberMock).toHaveBeenCalledWith(
      membershipStateMock.profileList,
      featuresContextMock.featuresState
    );

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      medicineCabinetScreenStyles.navigationListSeparatorViewStyle
    );
  });

  it('renders navigation links', () => {
    isPbmMemberMock.mockReturnValue(true);

    const isScreenContentLoadingMock = true;
    const prescriptionBenefitPlanLinkMock = 'prescription-benefit-plan-link';
    const transferAPrescriptionLinkMock = 'transfer-a-prescription-link';
    const screenContentMock: Partial<IMedicineCabinetScreenContent> = {
      prescriptionBenefitPlanLink: prescriptionBenefitPlanLinkMock,
      transferAPrescriptionLink: transferAPrescriptionLinkMock,
    };
    const screenContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isScreenContentLoadingMock,
      content: screenContentMock,
    };
    useContentMock.mockReturnValue(screenContentWithIsLoadingMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const navigationContainerFragment = getChildren(bodyContainer)[2];
    const navigationLinks = getChildren(navigationContainerFragment)[1];

    expect(navigationLinks.type).toEqual(NavigationLinkList);
    expect(isPbmMemberMock).toHaveBeenCalledWith(
      membershipStateMock.profileList,
      featuresContextMock.featuresState
    );
    const expectedLinks: INavigationLink[] = [
      {
        key: 'prescriptionBenefitPlan',
        label: prescriptionBenefitPlanLinkMock,
        onPress: expect.any(Function),
        isSkeleton: isScreenContentLoadingMock,
      },
      {
        key: 'transferAPrescription',
        label: transferAPrescriptionLinkMock,
        onPress: expect.any(Function),
        isSkeleton: isScreenContentLoadingMock,
      },
    ];
    expect(navigationLinks.props.links).toEqual(expectedLinks);
  });

  it('handles "Plan deductibles" navigation link press', () => {
    isPbmMemberMock.mockReturnValue(true);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const navigationContainerFragment = getChildren(bodyContainer)[2];
    const navigationLinks = getChildren(navigationContainerFragment)[1];

    expect(isPbmMemberMock).toHaveBeenCalledWith(
      membershipStateMock.profileList,
      featuresContextMock.featuresState
    );

    const planDeductiblesLink = navigationLinks.props.links[0];
    planDeductiblesLink.onPress();

    expectToHaveBeenCalledOnceOnlyWith(
      rootStackNavigationMock.navigate as jest.Mock,
      'PrescriptionBenefitPlan'
    );
  });

  it('handles "Transfer prescription" navigation link press', () => {
    isPbmMemberMock.mockReturnValue(true);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const navigationContainerFragment = getChildren(bodyContainer)[2];
    const navigationLinks = getChildren(navigationContainerFragment)[1];

    const transferAPrescriptionLink = navigationLinks.props.links[1];
    transferAPrescriptionLink.onPress();

    expectToHaveBeenCalledOnceOnlyWith(
      rootStackNavigationMock.navigate as jest.Mock,
      'DrugSearchStack',
      {
        screen: 'DrugSearchHome',
      }
    );
  });

  it('renders loading state screen', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);
    const loadingMock: ILoadingContext = {
      loadingState: { count: 1 },
    };
    useLoadingContextMock.mockReturnValue(loadingMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    expect(getChildren(noMedicineCabinet)[0].type).toEqual(EmptyStateMessage);
    expect(getChildren(noMedicineCabinet)[1]).toBeNull();
  });

  it('renders empty medicine cabinet screen', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    useContentMock.mockReturnValueOnce({ content: {} });
    const loadingStateMock: ILoadingState = {
      count: 0,
    };
    const loadingContextMock: ILoadingContext = {
      loadingState: loadingStateMock,
    };
    useLoadingContextMock.mockReturnValue(loadingContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const emptyList = getChildren(bodyContainer)[0];

    expect(emptyList.type).toEqual(View);
    expect(getChildren(emptyList).length).toEqual(2);
    const emptyListChild = getChildren(emptyList);
    expect(emptyListChild[0].type).toEqual(EmptyStateMessage);
    expect(emptyListChild[1].type).toEqual(View);
  });

  it('renders no empty medicine cabinet empty message component', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      noPrescriptionText: 'noPrescriptionHeadingText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet);
    expect(noMedicineCabinetChildren[0].type).toEqual(EmptyStateMessage);
    expect(noMedicineCabinetChildren[0].props.imageName).toEqual(
      'emptyMedicineCabinet'
    );
    expect(noMedicineCabinetChildren[0].props.message).toEqual(
      contentMock.noPrescriptionText
    );
    expect(noMedicineCabinetChildren[0].props.bottomSpacing).toEqual('wide');
    expect(noMedicineCabinetChildren[0].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
  });

  it('renders no empty medicine cabinet line separator', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet)[1];
    const lineSeparator = getChildren(noMedicineCabinetChildren)[0];
    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      medicineCabinetScreenStyles.lineSeparatorViewStyle
    );
  });

  it('renders no empty medicine cabinet how to send prescription Heading', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      howToSendPrescriptionText: 'howToSendPrescriptionText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet)[1];
    const heading = getChildren(noMedicineCabinetChildren)[1];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      medicineCabinetScreenStyles.headingTextStyle
    );
    expect(heading.props.level).toEqual(2);
    expect(heading.props.children).toEqual(
      contentMock.howToSendPrescriptionText
    );
  });

  it('renders empty medicine cabinet list', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);
    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet)[1];
    const list = getChildren(noMedicineCabinetChildren)[2];
    expect(list.type).toEqual(List);
    expect(getChildren(list).length).toEqual(2);
    expect(list.props.style).toEqual(medicineCabinetScreenStyles.listViewStyle);
  });

  it('renders first list item', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet)[1];
    const list = getChildren(noMedicineCabinetChildren)[2];
    expect(getChildren(list)[0].type).toEqual(ListItem);
    expect(getChildren(getChildren(list)[0]).length).toEqual(1);
    expect(getChildren(list)[0].props.testID).toEqual(
      'transferPrescriptionListItem'
    );
  });

  it('renders chevron card ', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const listItem = bodyRenderer.root.findByProps({
      testID: 'transferPrescriptionListItem',
    });
    const chevronCard = getChildren(listItem)[0];
    expect(chevronCard.type).toEqual(ChevronCard);
    expect(chevronCard.props.viewStyle).toEqual(
      medicineCabinetScreenStyles.chevronCardViewStyle
    );
    expect(chevronCard.props.onPress).toEqual(expect.any(Function));
    chevronCard.props.onPress();
    expect(rootStackNavigationMock.navigate).toBeCalledWith('DrugSearchStack', {
      screen: 'DrugSearchHome',
    });
  });

  it('renders chevron card children', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      transferExistingPrescriptionHeading:
        'transferExistingPrescriptionHeading',
      transferExistingPrescriptionText: 'transferExistingPrescriptionText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const listItem = bodyRenderer.root.findByProps({
      testID: 'transferPrescriptionListItem',
    });
    const chevronCard = getChildren(listItem)[0];
    const view = getChildren(chevronCard)[0];
    expect(view.type).toEqual(View);
    const firstChild = getChildren(view)[0];
    const secondChild = getChildren(view)[1];
    expect(firstChild.type).toEqual(BaseText);
    expect(firstChild.props.style).toEqual(
      medicineCabinetScreenStyles.subHeadingTextStyle
    );
    expect(firstChild.props.children).toEqual(
      contentMock.transferExistingPrescriptionHeading
    );
    expect(secondChild.type).toEqual(BaseText);
    expect(secondChild.props.style).toEqual(
      medicineCabinetScreenStyles.subtitleTextStyle
    );
    expect(secondChild.props.children).toEqual(
      contentMock.transferExistingPrescriptionText
    );
  });

  it('renders second list item', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noMedicineCabinet = getChildren(bodyContainer)[0];
    const noMedicineCabinetChildren = getChildren(noMedicineCabinet)[1];
    const list = getChildren(noMedicineCabinetChildren)[2];
    const listItem = getChildren(list)[1];

    expect(listItem.type).toEqual(ListItem);
    expect(listItem.props.testID).toEqual('sayTheWordListItem');
    expect(getChildren(listItem).length).toEqual(3);
  });

  it('renders second list item children', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      sayTheWordPrescryptiveHeading: 'sayTheWordPrescryptiveHeading',
      sayTheWordPrescryptiveText: 'sayTheWordPrescryptiveText',
      learnMoreText: 'learnMoreText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const listItem = bodyRenderer.root.findByProps({
      testID: 'sayTheWordListItem',
    });
    const firstChild = getChildren(listItem)[0];
    const secondChild = getChildren(listItem)[1];
    expect(firstChild.type).toEqual(BaseText);
    expect(firstChild.props.style).toEqual(
      medicineCabinetScreenStyles.subHeadingTextStyle
    );
    expect(firstChild.props.children).toEqual(
      contentMock.sayTheWordPrescryptiveHeading
    );

    expect(secondChild.type).toEqual(BaseText);
    expect(secondChild.props.style).toEqual(
      medicineCabinetScreenStyles.subtitleTextStyle
    );
    const baseTextChildren = getChildren(secondChild);
    expect(baseTextChildren.length).toEqual(3);

    expect(baseTextChildren[0]).toEqual(contentMock.sayTheWordPrescryptiveText);
    expect(baseTextChildren[1]).toEqual(' ');

    const link = baseTextChildren[2];

    expect(link.type).toEqual(InlineLink);
    expect(link.props.children).toEqual(contentMock.learnMoreText);
  });

  it('Handles learn more link press', () => {
    const showModalMock = false;
    stateReset({ showModal: [showModalMock, mockSetShowModal] });
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);
    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const link = bodyRenderer.root.findByType(InlineLink);
    const onPress = link.props.onPress;
    onPress();
    expect(mockSetShowModal).toBeCalledTimes(1);
    expect(mockSetShowModal).toHaveBeenNthCalledWith(1, !showModalMock);
  });

  it('verify slide up modal', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      learnMoreModalHeading: 'learnMoreModalHeading',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const showModalMock = true;
    stateReset({ showModal: [showModalMock, mockSetShowModal] });
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const listItem = bodyRenderer.root.findByProps({
      testID: 'sayTheWordListItem',
    });
    const slideUpModal = getChildren(listItem)[2];
    expect(slideUpModal.props.isVisible).toEqual(showModalMock);
    expect(slideUpModal.props.heading).toEqual(
      contentMock.learnMoreModalHeading
    );
    expect(slideUpModal.props.onClosePress).toEqual(expect.any(Function));
    expect(slideUpModal.props.isSkeleton).toEqual(
      contentWithIsLoadingMock.isContentLoading
    );
    slideUpModal.props.onClosePress();
    expect(mockSetShowModal).toBeCalledTimes(1);
    expect(mockSetShowModal).toHaveBeenNthCalledWith(1, !showModalMock);
  });

  it('render slide up modal body', () => {
    const contentMock: Partial<IMedicineCabinetScreenContent> = {
      learnMoreModalText: 'learnMoreModalText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IMedicineCabinetScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const showModalMock = true;
    stateReset({ showModal: [showModalMock, mockSetShowModal] });
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<MedicineCabinetScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const listItem = bodyRenderer.root.findByProps({
      testID: 'sayTheWordListItem',
    });
    const slideUpModal = getChildren(listItem)[2];
    expect(getChildren(slideUpModal).length).toEqual(1);
    const modalBody = getChildren(slideUpModal)[0];
    expect(modalBody.type).toEqual(MarkdownText);
    expect(modalBody.props.children).toEqual(contentMock.learnMoreModalText);
  });
});
