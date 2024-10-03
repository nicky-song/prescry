// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { HomeButton } from '../../../../components/buttons/home/home.button';
import { ToolButton } from '../../../../components/buttons/tool.button/tool.button';
import {
  BodyContentContainer,
  IBodyContentContainerProps,
} from '../../../../components/containers/body-content/body-content.container';
import { ClaimHistoryList } from '../../../../components/lists/claim-history/claim-history.list';
import { EmptyStateMessage } from '../../../../components/messages/empty-state/empty-state.message';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IClaim } from '../../../../models/claim';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import {
  expectToHaveBeenCalledOnceOnlyWith,
  getChildren,
} from '../../../../testing/test.helper';
import { goToUrl } from '../../../../utils/link.helper';
import { base64StringToBlob } from '../../../../utils/test-results/test-results.helper';
import { ILoadingContext } from '../../context-providers/loading/loading.context';
import { useLoadingContext } from '../../context-providers/loading/use-loading-context';
import { IMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { defaultLoadingState } from '../../state/loading/loading.state';
import {
  getClaimHistoryAsyncAction,
  IGetClaimHistoryAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-claim-history.async-action';
import {
  defaultMedicineCabinetState,
  IMedicineCabinetState,
} from '../../state/medicine-cabinet/medicine-cabinet.state';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { claimHistoryMock } from '../../__mocks__/medicine-cabinet-state.mock';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { ClaimHistoryScreen } from './claim-history.screen';
import { IClaimHistoryScreenContent } from './claim-history.screen.content';
import { claimHistoryScreenStyles } from './claim-history.screen.styles';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook'
);
const useMedicineCabinetContextMock = useMedicineCabinetContext as jest.Mock;

jest.mock(
  '../../../../components/lists/claim-history/claim-history.list',
  () => ({
    ClaimHistoryList: () => <div />,
  })
);
jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../state/medicine-cabinet/async-actions/get-claim-history.async-action'
);
const getClaimHistoryAsyncActionMock = getClaimHistoryAsyncAction as jest.Mock;

jest.mock(
  '../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: ({ children }: IBodyContentContainerProps) => (
      <div>{children}</div>
    ),
  })
);

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock(
  '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock(
  '../../../../components/messages/empty-state/empty-state.message',
  () => ({
    EmptyStateMessage: () => <div />,
  })
);
jest.mock('../../../../components/buttons/tool.button/tool.button', () => ({
  ToolButton: () => <div />,
}));

jest.mock('../../context-providers/loading/use-loading-context');
const useLoadingContextMock = useLoadingContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

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

const createObjectURLBackup = URL.createObjectURL;

describe('ClaimHistoryScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    const cabinetMock: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...defaultMedicineCabinetState,
        claimHistory: claimHistoryMock,
      },
      medicineCabinetDispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useMedicineCabinetContextMock.mockReturnValue(cabinetMock);
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      content: {},
      isContentLoading: false,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const loadingMock: ILoadingContext = {
      loadingState: { ...defaultLoadingState },
    };

    useLoadingContextMock.mockReturnValue(loadingMock);
  });

  afterEach(() => {
    URL.createObjectURL = createObjectURLBackup;
  });

  it('gets content', () => {
    renderer.create(<ClaimHistoryScreen />);

    expectToHaveBeenCalledOnceOnlyWith(
      useContentMock,
      CmsGroupKey.claimHistoryScreen,
      2
    );
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<ClaimHistoryScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.navigateBack).toEqual(
      rootStackNavigationMock.goBack
    );
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders body container', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      title: 'title',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('claimHistoryScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(getChildren(bodyContainer).length).toEqual(2);
  });

  it('get claim history list on page load', async () => {
    const medicineCabinetDispatchMock = jest.fn();
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      loadingClaimsText: 'loadingClaimsText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        prescriptions: [],
        claimHistory: claimHistoryMock,
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    renderer.create(<ClaimHistoryScreen />);
    expect(useEffectMock.mock.calls[0][1]).toEqual([]);
    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();
    const expectArgs: IGetClaimHistoryAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: medicineCabinetDispatchMock,
      navigation: rootStackNavigationMock,
      loadingText: contentMock.loadingClaimsText,
    };

    expect(getClaimHistoryAsyncActionMock).toHaveBeenCalledWith(expectArgs);
  });

  it.each([
    [[], false],
    [claimHistoryMock.claims, true],
  ])(
    'renders download button if claims exist (claims: %p)',
    (claimsMock: IClaim[], isButtonExpected: boolean) => {
      const medicineCabinetStateMock: IMedicineCabinetState = {
        ...defaultMedicineCabinetState,
        claimHistory: { ...claimHistoryMock, claims: claimsMock },
      };
      const medicineCabinetContextMock: IMedicineCabinetContext = {
        medicineCabinetDispatch: jest.fn(),
        medicineCabinetState: medicineCabinetStateMock,
      };
      useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

      const contentMock: Partial<IClaimHistoryScreenContent> = {
        downloadButtonLabel: 'download-button-label',
      };
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
      > = {
        content: contentMock,
      };
      useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);

      const testRenderer = renderer.create(<ClaimHistoryScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);

      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const downloadButton = getChildren(bodyContainer)[0];

      if (isButtonExpected) {
        expect(downloadButton.type).toEqual(ToolButton);
        expect(downloadButton.props.iconName).toEqual('file-download');
        expect(downloadButton.props.onPress).toEqual(expect.any(Function));
        expect(downloadButton.props.viewStyle).toEqual(
          claimHistoryScreenStyles.downloadButtonViewStyle
        );
        expect(downloadButton.props.children).toEqual(
          contentMock.downloadButtonLabel
        );
      } else {
        expect(downloadButton).toBeNull();
      }
    }
  );

  it('handles download button click', async () => {
    const claimPdfMock = Buffer.from('claim-pdf').toString('base64');
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { ...claimHistoryMock, claimPdf: claimPdfMock },
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const downloadButton = getChildren(bodyContainer)[0];

    const objectUrlMock = 'object-url';
    const createObjectUrlMock = jest.fn().mockReturnValue({
      toString: () => objectUrlMock,
    });
    URL.createObjectURL = createObjectUrlMock;

    await downloadButton.props.onPress();

    expectToHaveBeenCalledOnceOnlyWith(
      createObjectUrlMock,
      base64StringToBlob(claimPdfMock)
    );

    expectToHaveBeenCalledOnceOnlyWith(goToUrlMock, objectUrlMock);
  });

  it('renders claim history list', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: claimHistoryMock,
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const claimHistoryList = getChildren(bodyContainer)[1];

    expect(claimHistoryList.type).toEqual(ClaimHistoryList);
    expect(claimHistoryList.props.claims).toEqual(claimHistoryMock.claims);
    expect(claimHistoryList.props.testID).toEqual('claimHistoryList');
  });

  it('renders no claim history screen elements', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);
    const loadingStateContextMock: ILoadingContext = {
      loadingState: { count: 0 },
    };
    useLoadingContextMock.mockReturnValue(loadingStateContextMock);
    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    expect(noClaimHistoryChildren.length).toEqual(2);
    expect(noClaimHistory.type).toEqual(View);
    expect(noClaimHistoryChildren[0].type).toEqual(EmptyStateMessage);
    expect(noClaimHistoryChildren[1].type).toEqual(View);
  });

  it('renders loading state screen', () => {
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
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

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    expect(getChildren(noClaimHistory)[0].type).toEqual(EmptyStateMessage);
    expect(getChildren(noClaimHistory)[1]).toBeNull();
  });

  it('renders no claim history screen empty message component', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      emptyClaimsHeading: 'emptyClaimsHeading',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    expect(noClaimHistoryChildren[0].type).toEqual(EmptyStateMessage);
    expect(noClaimHistoryChildren[0].props.imageName).toEqual(
      'emptyClaimsImage'
    );
    expect(noClaimHistoryChildren[0].props.message).toEqual(
      contentMock.emptyClaimsHeading
    );
    expect(noClaimHistoryChildren[0].props.bottomSpacing).toEqual('regular');
    expect(noClaimHistoryChildren[0].props.isSkeleton).toEqual(
      isContentLoadingMock
    );
  });

  it('renders no claim history subtext', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      emptyClaimsText: 'emptyClaimsText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
      prescriptions: [],
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    const baseText = getChildren(noClaimHistoryChildren[1])[0];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      claimHistoryScreenStyles.noClaimsTextViewStyle
    );
    expect(baseText.props.children).toEqual(contentMock.emptyClaimsText);
  });

  it('renders no claim history with prescription subtext', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      emptyClaimsWithPrescriptionText: 'emptyClaimsWithPrescriptionText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
      prescriptions: prescriptionsMock,
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValueOnce(
      medicineCabinetContextMock
    );

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    const baseText = getChildren(noClaimHistoryChildren[1])[0];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      claimHistoryScreenStyles.noClaimsTextViewStyle
    );
    expect(baseText.props.children).toEqual(
      contentMock.emptyClaimsWithPrescriptionText
    );
  });

  it('renders no claim history home button', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      title: 'title',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);

    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      claimHistory: { claims: [] },
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    const homeButton = getChildren(noClaimHistoryChildren[1])[1];
    expect(homeButton.type).toEqual(HomeButton);
    expect(homeButton.props.isSkeleton).toEqual(true);
    expect(homeButton.props.testID).toEqual('claimHistoryScreenHomeButton');
    expect(homeButton.props.onPress).toEqual(expect.any(Function));
    homeButton.props.onPress();
    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('renders empty claims medicine cabinet button', () => {
    const contentMock: Partial<IClaimHistoryScreenContent> = {
      medicineCabinetButtonLabel: 'medicineCabinetButtonLabel',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);
    const medicineCabinetStateMock: IMedicineCabinetState = {
      ...defaultMedicineCabinetState,
      prescriptions: prescriptionsMock,
      claimHistory: { claims: [] },
    };
    const medicineCabinetContextMock: IMedicineCabinetContext = {
      medicineCabinetDispatch: jest.fn(),
      medicineCabinetState: medicineCabinetStateMock,
    };
    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContextMock);

    const testRenderer = renderer.create(<ClaimHistoryScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const noClaimHistory = getChildren(bodyContainer)[1];
    const noClaimHistoryChildren = getChildren(noClaimHistory);
    const homeButton = getChildren(noClaimHistoryChildren[1])[1];
    expect(noClaimHistoryChildren.length).toEqual(2);

    expect(homeButton.type).toEqual(BaseButton);
    homeButton.props.onPress();
    expect(homeButton.props.children).toEqual(
      contentMock.medicineCabinetButtonLabel
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'MedicineCabinet',
      {}
    );
  });
});
