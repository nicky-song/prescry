// Copyright 2021 Prescryptive Health, Inc.

import renderer from 'react-test-renderer';
import React, { useState } from 'react';
import { IServiceData, Services } from './services';
import { View, ViewStyle } from 'react-native';
import { OfferedService } from '../../../../../../components/member/offered-service/offered-service';
import { useMediaQueryContext } from '../../../../context-providers/media-query/use-media-query-context.hook';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../../guest-experience-logger.middleware';
import { useReduxContext } from '../../../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../../context-providers/redux/redux.context';
import { getChildren } from '../../../../../../testing/test.helper';
import { startExperienceDispatch } from '../../../../store/start-experience/dispatch/start-experience.dispatch';
import {
  IMediaQueryContext,
  MediaSize,
} from '../../../../context-providers/media-query/media-query.context';
import {
  IServicesStyles,
  servicesLargeStyles,
  servicesMobileStyles,
} from './services.styles';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { ISessionContext } from '../../../../context-providers/session/session.context';
import { defaultSessionState } from '../../../../state/session/session.state';
import { setIsUnauthExperienceDispatch } from '../../../../state/session/dispatch/set-is-unauth-experience.dispatch';
import { IFeaturesState } from '../../../../guest-experience-features';
import { isDesktopDevice } from '../../../../../../utils/responsive-screen.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock(
  '../../../../context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

jest.mock('../../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../../state/session/dispatch/set-is-unauth-experience.dispatch'
);
const setIsUnauthExperienceDispatchMock =
  setIsUnauthExperienceDispatch as jest.Mock;

jest.mock(
  '../../../../store/start-experience/dispatch/start-experience.dispatch'
);
const startExperienceDispatchMock = startExperienceDispatch as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../../../../components/buttons/search/search.button', () => ({
  SearchButton: () => <div />,
}));

jest.mock(
  '../../../../../../components/member/learn-more-bullets/learn-more-bullets',
  () => ({
    LearnMoreBullets: () => <div />,
  })
);

jest.mock(
  '../../../../../../components/member/offered-service/offered-service',
  () => ({
    OfferedService: () => <div />,
  })
);

jest.mock('../../../../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

function stateReset(
  cardsState: [boolean[], jest.Mock],
  mediaSize: { mediaSize: MediaSize } = { mediaSize: 'small' }
) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(cardsState);

  useMediaQueryContextMock.mockReset();
  useMediaQueryContextMock.mockReturnValue(mediaSize);

  useNavigationMock.mockReturnValue(rootStackNavigationMock);
}

let originalWindowOpen: () => Window | null;

const { location: originalLocation } = window;

const onSmartPriceButtonPressMock = jest.fn();

describe('Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset([[false, false], jest.fn()]);
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    originalWindowOpen = window.open;
  });

  afterEach(() => {
    window.open = originalWindowOpen;
    window.location = originalLocation;
  });

  it.each([
    ['small', servicesMobileStyles.containerViewStyle],
    ['medium', servicesMobileStyles.containerViewStyle],
    ['large', servicesLargeStyles.containerViewStyle],
  ])(
    'renders top container (mediaSize: %p)',
    (mediaSizeMock: string, expectedViewStyle: ViewStyle) => {
      const reduxDispatchMock = jest.fn();
      const reduxStateMock = { features: {} };
      const reduxContextMock: IReduxContext = {
        dispatch: reduxDispatchMock,
        getState: jest.fn().mockReturnValue(reduxStateMock),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      stateReset([[false, false], jest.fn()]);
      const mediaQueryContextMock: Partial<IMediaQueryContext> = {
        mediaSize: mediaSizeMock as MediaSize,
      };
      useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

      const testRenderer = renderer.create(
        <Services
          onGetStartedShow={jest.fn()}
          onSmartPriceButtonPress={onSmartPriceButtonPressMock}
        />
      );

      const topContainer = testRenderer.root.findAllByType(View, {
        deep: false,
      })[0];

      expect(topContainer.props.style).toEqual(expectedViewStyle);
      expect(getChildren(topContainer).length).toEqual(1);
    }
  );

  it.each([
    ['small', servicesMobileStyles.cardContainerViewStyle],
    ['medium', servicesMobileStyles.cardContainerViewStyle],
    ['large', servicesLargeStyles.cardContainerViewStyle],
  ])(
    'renders card container (mediaSize: %p)',
    (mediaSizeMock: string, expectedViewStyle: ViewStyle) => {
      stateReset([[false, false], jest.fn()]);
      const mediaQueryContextMock: Partial<IMediaQueryContext> = {
        mediaSize: mediaSizeMock as MediaSize,
      };
      useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

      const testRenderer = renderer.create(
        <Services
          onGetStartedShow={jest.fn()}
          onSmartPriceButtonPress={onSmartPriceButtonPressMock}
        />
      );

      const topContainer = testRenderer.root.findAllByType(View, {
        deep: false,
      })[0];
      const cardContainer = getChildren(topContainer)[0];

      expect(cardContainer.type).toEqual(View);
      expect(cardContainer.props.style).toEqual(expectedViewStyle);
    }
  );

  it.each([
    ['small', servicesMobileStyles],
    ['medium', servicesMobileStyles],
    ['large', servicesLargeStyles],
  ])(
    'renders service cards ( mediaSize: %p)',
    (mediaSizeMock: string, expectedViewStyles: IServicesStyles) => {
      const mockCardsState = [true, true];
      const mockSetCardsState = jest.fn();
      stateReset([mockCardsState, mockSetCardsState], {
        mediaSize: mediaSizeMock as MediaSize,
      });
      const reduxDispatchMock = jest.fn();
      const featuresMock: IFeaturesState = {} as IFeaturesState;
      const reduxStateMock = { features: featuresMock };
      const reduxContextMock: IReduxContext = {
        dispatch: reduxDispatchMock,
        getState: jest.fn().mockReturnValue(reduxStateMock),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);
      const mockData = [{ action: 'default' }, { action: 'drugsearch' }];
      const testRenderer = renderer.create(
        <Services
          data={mockData}
          onGetStartedShow={jest.fn()}
          onSmartPriceButtonPress={onSmartPriceButtonPressMock}
        />
      );

      const topContainer = testRenderer.root.findAllByType(View, {
        deep: false,
      })[0];
      const cardContainer = getChildren(topContainer)[0];
      const cards = getChildren(cardContainer);

      expect(cards.length).toEqual(2);

      cards.forEach((card, index) => {
        expect(card.props.style).toEqual(
          index === 0
            ? {
                ...expectedViewStyles.firstServiceCardViewStyle,
                height: 'initial',
              }
            : index === cards.length - 1
            ? {
                ...expectedViewStyles.lastServiceCardViewStyle,
                height: 'initial',
              }
            : {
                ...expectedViewStyles.serviceCardViewStyle,
                height: 'initial',
              }
        );
        expect(getChildren(card).length).toEqual(1);

        const offeredService = getChildren(card)[0];
        expect(offeredService.type).toEqual(OfferedService);
        expect(offeredService.props.isOpen).toEqual(true);
        expect(offeredService.props.isCollapsible).toEqual(true);
        expect(offeredService.props.onTogglePress).toEqual(
          expect.any(Function)
        );
        expect(offeredService.props.onButtonPressed).toEqual(
          expect.any(Function)
        );
      });
    }
  );

  it('should have proper title', () => {
    const mockCardsState = [true, false];
    const mockSetCardsState = jest.fn();
    stateReset([mockCardsState, mockSetCardsState], {
      mediaSize: 'small',
    });

    const mockData = [
      {
        action: 'default',
        icon: 'virusSyringeIcon',
        name: 'Clinical services',
        text: 'With your local pharmacist',
      },
      {
        action: 'drugsearch',
        icon: 'smartpriceCardIcon',
        name: 'SmartPRICE™ Card',
        text: 'Save on your prescriptions',
      },
    ];
    const testRenderer = renderer.create(
      <Services
        data={mockData}
        onGetStartedShow={jest.fn()}
        onSmartPriceButtonPress={onSmartPriceButtonPressMock}
      />
    );
    const cards = testRenderer.root.findAllByType(OfferedService, {
      deep: false,
    });

    cards[0].props.onTogglePress();
    expect(cards[0].props.isOpen).toEqual(true);
    expect(cards[1].props.isOpen).toEqual(false);
  });

  it('should all cards open in desktop', () => {
    const mockCardsState = [true, true];
    const expectedCardsState = [false, false];
    const mockSetCardsState = jest.fn();
    stateReset([mockCardsState, mockSetCardsState]);

    const mockData = [
      {
        action: 'default',
        icon: 'img/services/vaccine.png',
        name: 'COVID-19 Vaccines',
        text: 'Schedule an appointment or get on a waitlist.',
      },
      {
        action: 'drugsearch',
        icon: 'img/services/covid.png',
        name: 'COVID-19 Testing',
        text: 'Schedule a test at your local pharmacy.',
      },
    ];
    const testRenderer = renderer.create(
      <Services
        data={mockData}
        onGetStartedShow={jest.fn()}
        onSmartPriceButtonPress={onSmartPriceButtonPressMock}
      />
    );
    const cards = testRenderer.root.findAllByType(OfferedService, {
      deep: false,
    });

    cards[0].props.onTogglePress();
    expect(mockSetCardsState).toHaveBeenCalledWith(expectedCardsState);
  });

  it('handles Smartprice card onClick', () => {
    const mockData = [
      {
        action: 'drugsearch',
        icon: 'img/services/smartprice.png',
        name: 'SmartPRICE Card',
        text: 'Save on your prescriptions.',
        link: 'smartprice',
      },
    ];

    const windowOpenMock = jest.fn();
    window.open = windowOpenMock;
    const testRenderer = renderer.create(
      <Services
        data={mockData}
        onGetStartedShow={jest.fn()}
        onSmartPriceButtonPress={onSmartPriceButtonPressMock}
      />
    );

    const cards = testRenderer.root.findAllByType(OfferedService, {
      deep: false,
    });

    cards[0].props.onButtonPressed();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.USER_CLICKED_ON_SERVICE,
      {
        payloadMessage: 'smartprice',
      }
    );
  });

  it('handles service card onClick (Mobile)', async () => {
    const reduxDispatchMock = jest.fn();
    const featuresMock: IFeaturesState = {} as IFeaturesState;
    const reduxStateMock = { features: featuresMock };
    const reduxGetStateMock = jest.fn().mockReturnValue(reduxStateMock);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const mockData = [
      {
        action: 'default',
        icon: 'virusSyringeIcon',
        name: 'Clinical services',
        text: 'With your local pharmacist',
      },
    ];

    isDesktopDeviceMock.mockReturnValue(false);

    const testRenderer = renderer.create(
      <Services
        data={mockData}
        onGetStartedShow={jest.fn()}
        onSmartPriceButtonPress={onSmartPriceButtonPressMock}
      />
    );

    const cards = testRenderer.root.findAllByType(OfferedService, {
      deep: false,
    });

    await cards[0].props.onButtonPressed();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.USER_CLICKED_ON_SERVICE,
      {
        payloadMessage: mockData[0].name,
      }
    );

    expect(onSmartPriceButtonPressMock).not.toHaveBeenCalled();

    expect(setIsUnauthExperienceDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      false
    );
    expect(startExperienceDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      reduxGetStateMock,
      rootStackNavigationMock,
      false
    );
  });

  it('handles service card onClick (Mobile) when action is drugsearch', async () => {
    const reduxDispatchMock = jest.fn();
    const featuresMock: IFeaturesState = {} as IFeaturesState;
    const reduxStateMock = { features: featuresMock };
    const reduxGetStateMock = jest.fn().mockReturnValue(reduxStateMock);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: Partial<ISessionContext> = {
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const mockData = [
      {
        action: 'drugsearch',
        icon: 'virusSyringeIcon',
        name: 'Clinical services',
        text: 'With your local pharmacist',
      },
    ];

    isDesktopDeviceMock.mockReturnValue(false);

    const testRenderer = renderer.create(
      <Services
        data={mockData}
        onGetStartedShow={jest.fn()}
        onSmartPriceButtonPress={onSmartPriceButtonPressMock}
      />
    );

    const cards = testRenderer.root.findAllByType(OfferedService, {
      deep: false,
    });

    await cards[0].props.onButtonPressed();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.USER_CLICKED_ON_SERVICE,
      {
        payloadMessage: mockData[0].name,
      }
    );

    expect(onSmartPriceButtonPressMock).toHaveBeenCalled();

    expect(setIsUnauthExperienceDispatchMock).not.toHaveBeenCalled();
    expect(startExperienceDispatchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['Some Other Service', '/', '?abc=123', '/?abc=123'],
    ['Some Other Service', '/invite', '?abc=123', '/invite?abc=123'],
  ])(
    'handles service card onClick (desktop; serviceName: %p; path=%p; queryString=%p)',
    async (
      serviceNameMock: string,
      pathMock: string,
      queryStringMock: string,
      expectedPath: string
    ) => {
      const reduxContextMock: IReduxContext = {
        dispatch: jest.fn(),
        getState: jest.fn().mockReturnValue({
          features: {},
        }),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      // @ts-ignore
      delete window.location;
      window.location = {
        pathname: pathMock,
        search: queryStringMock,
      } as Location;

      const mockData: IServiceData[] = [
        {
          action: 'default',
          icon: '/img/services/pbm.png',
          name: serviceNameMock,
          text: 'Connect your prescription benefits to start saving.',
        },
      ];

      isDesktopDeviceMock.mockReturnValue(true);

      const onGetStartedShowMock = jest.fn();
      const testRenderer = renderer.create(
        <Services
          data={mockData}
          onGetStartedShow={onGetStartedShowMock}
          onSmartPriceButtonPress={onSmartPriceButtonPressMock}
        />
      );

      const cards = testRenderer.root.findAllByType(OfferedService, {
        deep: false,
      });

      await cards[0].props.onButtonPressed();
      expect(onGetStartedShowMock).toHaveBeenCalledWith(expectedPath);
    }
  );
});
