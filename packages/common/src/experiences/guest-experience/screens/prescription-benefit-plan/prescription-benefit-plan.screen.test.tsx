// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import {
  expectToHaveBeenCalledOnceOnlyWith,
  getChildren,
} from '../../../../testing/test.helper';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import {
  getAccumulatorsAsyncAction,
  IGetAccumulatorAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-accumulators.async-action';
import {
  defaultMedicineCabinetState,
  IMedicineCabinetState,
} from '../../state/medicine-cabinet/medicine-cabinet.state';
import {
  accumulatorsMock,
  medicineCabinetStateMock,
} from '../../__mocks__/medicine-cabinet-state.mock';
import { PrescriptionBenefitPlanScreen } from './prescription-benefit-plan.screen';
import { IPrescriptionBenefitPlanScreenContent } from './prescription-benefit-plan.screen.content';
import { IAccumulators } from '../../../../models/accumulators';
import { AccumulatorList } from '../../../../components/lists/accumulators/accumulator.list';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { prescriptionBenefitPlanScreenStyles } from './prescription-benefit-plan.screen.styles';
import {
  INavigationLink,
  NavigationLinkList,
} from '../../../../components/lists/navigation-link/navigation-link.list';
import { IPrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal.content';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import { PrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal';
import { intEnumLength } from '../../../../testing/enum.helper';
import { ToolButton } from '../../../../components/buttons/tool.button/tool.button';
import { ITestContainer } from '../../../../testing/test.container';
import { goToUrl } from '../../../../utils/link.helper';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

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

jest.mock(
  '../../state/medicine-cabinet/async-actions/get-accumulators.async-action'
);
const getAccumulatorsAsyncActionMock = getAccumulatorsAsyncAction as jest.Mock;

jest.mock('../../../../components/buttons/tool.button/tool.button', () => ({
  ToolButton: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
const mockSetShowModal = jest.fn();

jest.mock('../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

describe('PrescriptionBenefitPlanScreen', () => {
  enum BodyChildren {
    openPlanDetailsButton,
    accumulatorList,
    learnMoreLink,
    learnMoreModal,
    lineSeparator,
    navigationLinks,
  }

  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useStateMock.mockReturnValue([false, jest.fn()]);
    const modalContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      content: {},
      isContentLoading: false,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useContentMock.mockReturnValue(modalContentWithIsLoadingMock);
    useMedicineCabinetContextMock.mockReturnValue({
      medicineCabinetState: {},
    });
  });

  it('gets content', () => {
    renderer.create(<PrescriptionBenefitPlanScreen />);

    expectToHaveBeenCalledOnceOnlyWith(
      useContentMock,
      CmsGroupKey.prescriptionBenefitPlanScreen,
      2
    );
  });

  it('get accumulators on page load', async () => {
    const medicineCabinetDispatchMock = jest.fn();

    const medicineCabinetContext: IMedicineCabinetContext = {
      medicineCabinetState: {
        ...defaultMedicineCabinetState,
        accumulators: medicineCabinetStateMock.accumulators,
      },
      medicineCabinetDispatch: medicineCabinetDispatchMock,
    };

    useMedicineCabinetContextMock.mockReturnValue(medicineCabinetContext);

    renderer.create(<PrescriptionBenefitPlanScreen />);
    expect(useEffectMock.mock.calls[0][1]).toEqual([]);
    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();
    const expectArgs: IGetAccumulatorAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      medicineCabinetDispatch: medicineCabinetDispatchMock,
      navigation: rootStackNavigationMock,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      getAccumulatorsAsyncActionMock,
      expectArgs
    );
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

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
    const contentMock: Partial<IPrescriptionBenefitPlanScreenContent> = {
      title: 'title',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('prescriptionBenefitPlanScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(getChildren(bodyContainer).length).toEqual(
      intEnumLength(BodyChildren)
    );
  });

  it.each([[undefined], [''], ['plan-details-pdf']])(
    'renders "Open plan details" button (pdf: %p)',
    (planDetailsPdfMock: string | undefined) => {
      const accumulatorsMock = {
        planDetailsPdf: planDetailsPdfMock,
      } as IAccumulators;
      const medicineCabinetStateMock: Partial<IMedicineCabinetState> = {
        accumulators: accumulatorsMock,
      };
      useMedicineCabinetContextMock.mockReturnValue({
        medicineCabinetState: medicineCabinetStateMock,
      });

      const contentMock: Partial<IPrescriptionBenefitPlanScreenContent> = {
        openPlanDetails: 'open-plan-details',
        openPlanDetailsNotAvailable: 'open-plan-details-not-available',
      };
      const contentWithIsLoadingMock: Partial<
        IContentWithIsLoading<Partial<IPrescriptionBenefitPlanScreenContent>>
      > = {
        content: contentMock,
      };
      useContentMock.mockReturnValue(contentWithIsLoadingMock);

      const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const button =
        getChildren(bodyContainer)[BodyChildren.openPlanDetailsButton];

      expect(button.type).toEqual(ToolButton);
      expect(button.props.iconName).toEqual('external-link-alt');
      expect(button.props.viewStyle).toEqual(
        prescriptionBenefitPlanScreenStyles.openPlanDetailsButtonViewStyle
      );
      expect(button.props.disabled).toEqual(!planDetailsPdfMock);

      const expectedLabel = planDetailsPdfMock
        ? contentMock.openPlanDetails
        : contentMock.openPlanDetailsNotAvailable;
      expect(button.props.children).toEqual(expectedLabel);
    }
  );

  it('handles "Open plan details" button press', async () => {
    const accumulatorsMock = {
      planDetailsPdf: 'plan-details-pdf',
    } as IAccumulators;
    const medicineCabinetStateMock: Partial<IMedicineCabinetState> = {
      accumulators: accumulatorsMock,
    };
    useMedicineCabinetContextMock.mockReturnValue({
      medicineCabinetState: medicineCabinetStateMock,
    });

    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const button =
      getChildren(bodyContainer)[BodyChildren.openPlanDetailsButton];

    await button.props.onPress();

    expectToHaveBeenCalledOnceOnlyWith(
      goToUrlMock,
      accumulatorsMock.planDetailsPdf
    );
  });

  it.each([[undefined], [accumulatorsMock]])(
    'renders Accumulators list (accumulators: %p)',
    (injectedAccumulatorsMock: undefined | IAccumulators) => {
      const medicineCabinetStateMock: Partial<IMedicineCabinetState> = {
        accumulators: injectedAccumulatorsMock,
      };
      useMedicineCabinetContextMock.mockReturnValue({
        medicineCabinetState: medicineCabinetStateMock,
      });

      const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const accumulatorsList =
        getChildren(bodyContainer)[BodyChildren.accumulatorList];

      if (injectedAccumulatorsMock) {
        expect(accumulatorsList.type).toEqual(AccumulatorList);
        expect(accumulatorsList.props.accumulators).toEqual(
          injectedAccumulatorsMock
        );
      } else {
        expect(accumulatorsList).toBeNull();
      }
    }
  );

  it.each([[undefined], [accumulatorsMock]])(
    'renders Accumulators list (accumulators: %p)',
    (injectedAccumulatorsMock: undefined | IAccumulators) => {
      const medicineCabinetStateMock: Partial<IMedicineCabinetState> = {
        accumulators: injectedAccumulatorsMock,
      };
      useMedicineCabinetContextMock.mockReturnValue({
        medicineCabinetState: medicineCabinetStateMock,
      });

      const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPage.props.body;
      const accumulatorsList =
        getChildren(bodyContainer)[BodyChildren.accumulatorList];

      if (injectedAccumulatorsMock) {
        expect(accumulatorsList.type).toEqual(AccumulatorList);
        expect(accumulatorsList.props.accumulators).toEqual(
          injectedAccumulatorsMock
        );
      } else {
        expect(accumulatorsList).toBeNull();
      }
    }
  );

  it('renders learn more link', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanScreenContent> = {
      learnMoreText: 'learnMoreText',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const link = getChildren(bodyContainer)[BodyChildren.learnMoreLink];
    expect(link.type).toEqual(LinkButton);
    expect(link.props.linkText).toEqual(contentMock.learnMoreText);
    expect(link.props.testID).toEqual('prescriptionBenefitPlanLearnMoreLink');
    expect(link.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(link.props.onPress).toEqual(expect.any(Function));
    expect(link.props.viewStyle).toEqual(
      prescriptionBenefitPlanScreenStyles.linkViewStyle
    );
    expect(link.props.textStyle).toEqual(
      prescriptionBenefitPlanScreenStyles.linkTextStyle
    );
  });

  it('handles "learn more" link press', () => {
    const showModalMock = false;
    useStateMock.mockReturnValue([showModalMock, mockSetShowModal]);
    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    const link = getChildren(bodyContainer)[BodyChildren.learnMoreLink];
    expect(link.props.onPress).toEqual(expect.any(Function));
    const onPress = link.props.onPress;
    onPress();
    expectToHaveBeenCalledOnceOnlyWith(mockSetShowModal, !showModalMock);
  });

  it('render slide up modal', () => {
    const showModalMock = true;
    useStateMock.mockReturnValue([showModalMock, mockSetShowModal]);
    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    const slideUpModal =
      getChildren(bodyContainer)[BodyChildren.learnMoreModal];
    expect(slideUpModal.type).toEqual(PrescriptionBenefitPlanLearnMoreModal);

    expect(slideUpModal.props.onPressHandler).toEqual(expect.any(Function));
    const onPress = slideUpModal.props.onPressHandler;
    onPress();
    expect(mockSetShowModal).toBeCalledTimes(1);
    expect(mockSetShowModal).toHaveBeenCalledWith(!showModalMock);
  });

  it('renders navigation section line separator', () => {
    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const lineSeparator =
      getChildren(bodyContainer)[BodyChildren.lineSeparator];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      prescriptionBenefitPlanScreenStyles.navigationListSeparatorViewStyle
    );
  });

  it('renders navigation links', () => {
    const isScreenContentLoadingMock = true;
    const claimHistoryLinkMock = 'claim-history-link';

    const screenContentMock: Partial<IPrescriptionBenefitPlanScreenContent> = {
      claimHistoryLink: claimHistoryLinkMock,
    };
    const screenContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanScreenContent>>
    > = {
      isContentLoading: isScreenContentLoadingMock,
      content: screenContentMock,
    };
    useContentMock.mockReturnValue(screenContentWithIsLoadingMock);

    const testRenderer = renderer.create(<PrescriptionBenefitPlanScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const navigationLinks =
      getChildren(bodyContainer)[BodyChildren.navigationLinks];

    expect(navigationLinks.type).toEqual(NavigationLinkList);
    const expectedLinks: INavigationLink[] = [
      {
        key: 'claimHistory',
        label: claimHistoryLinkMock,
        onPress: expect.any(Function),
        isSkeleton: isScreenContentLoadingMock,
      },
    ];
    expect(navigationLinks.props.links).toEqual(expectedLinks);

    const claimHistoryLink = navigationLinks.props.links[0];
    claimHistoryLink.onPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ClaimHistory'
    );
  });
});
