// Copyright 2020 Prescryptive Health, Inc.

import { ScrollView, View } from 'react-native';
import { shallow } from 'enzyme';
import React, { RefObject, useEffect, useRef } from 'react';
import renderer from 'react-test-renderer';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import { AppointmentsList } from './appointments-list';
import { appointmentsListStyles } from './appointments-list.styles';
import { appointmentsListContent } from './appointments-list.content';
import { AppointmentItem } from '../../items/appointment-item/appointment-item';
import { getChildren } from '../../../../testing/test.helper';
import { ITab, Tabs } from '../../tabs/tabs';
import { LinkButton } from '../../../buttons/link/link.button';
import { BaseText } from '../../../text/base-text/base-text';
import { useAppointmentsListContext } from '../../../../experiences/guest-experience/context-providers/appointments-list/appointments-list-context.hook';
import { defaultAppointmentsListState } from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.state';
import {
  getAppointmentsListAsyncAction,
  IGetAppointmentsListAsyncActionArgs,
} from '../../../../experiences/guest-experience/state/appointments-list/async-actions/get-appointments-list.async-action';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { appointmentsStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { IReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/redux.context';
import { IAppointmentsListContext } from '../../../../experiences/guest-experience/context-providers/appointments-list/appointments-list.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('../../tabs/tabs', () => ({
  Tabs: () => <div />,
}));

jest.mock('../../items/appointment-item/appointment-item', () => ({
  AppointmentItem: () => <div />,
}));

jest.mock('../../../buttons/link/link.button', () => ({
  LinkButton: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/appointments-list/appointments-list-context.hook'
);
const useAppointmentsListContextMock = useAppointmentsListContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/state/appointments-list/async-actions/get-appointments-list.async-action'
);
const getAppointmentsListAsyncActionMock =
  getAppointmentsListAsyncAction as jest.Mock;

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const appointmentsMock: IAppointmentListItem[] = [
  {
    customerName: 'name',
    orderNumber: '12345',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
];

const manyAppointmentsMock: IAppointmentListItem[] = [
  {
    customerName: 'name',
    orderNumber: '11111',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '22222',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '33333',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '44444',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '55555',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '66666',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '77777',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '88888',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
];

const pastAppointmentsMock: IAppointmentListItem[] = [
  {
    customerName: 'name',
    orderNumber: '12346',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2021-06-13T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
  {
    customerName: 'name',
    orderNumber: '12348',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Completed',
    startInUtc: new Date('2021-06-13T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
];

const cancelledAppointmentsMock: IAppointmentListItem[] = [
  {
    customerName: 'name',
    orderNumber: '12347',
    locationName: 'name',
    date: 'date',
    time: 'time',
    serviceDescription: 'none',
    bookingStatus: 'Cancelled',
    startInUtc: new Date('2021-06-23T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointmentlink',
  },
];

let savedDateNow: () => number;

const setDefaultState = (appointmentListType?: string) => {
  useAppointmentsListContextMock.mockReturnValue({
    appointmentsListState: {
      appointmentsType:
        appointmentListType ?? defaultAppointmentsListState.appointmentsType,
      start: defaultAppointmentsListState.start,
      appointments: defaultAppointmentsListState.appointments,
      allAppointmentsReceived:
        defaultAppointmentsListState.allAppointmentsReceived,
    },
  });
  useReduxContextMock.mockReturnValue({
    reduxDispatch: jest.fn(),
    reduxGetState: jest.fn(),
  });
};
const scrollToMock = jest.fn();
const scrollViewRef = {
  current: { scrollTo: scrollToMock },
} as unknown as RefObject<ScrollView>;

describe('AppointmentsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    savedDateNow = Date.now;
    Date.now = jest.fn().mockReturnValue(new Date('2021-06-20T13:00:00+0000'));
    setDefaultState();
  });

  afterEach(() => {
    Date.now = savedDateNow;
  });

  it('has expected number of effect handlers', () => {
    renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    expect(useEffectMock).toHaveBeenCalledTimes(1);
  });

  it('gets appointments list on mount', async () => {
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const appointmentsListDispatchMock = jest.fn();
    const appointmentsListContextMock: IAppointmentsListContext = {
      appointmentsListDispatch: appointmentsListDispatchMock,
      appointmentsListState: defaultAppointmentsListState,
    };
    useAppointmentsListContextMock.mockReturnValue(appointmentsListContextMock);

    renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    const expectedArgs: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: reduxContextMock.dispatch,
      reduxGetState: reduxContextMock.getState,
      navigation: appointmentsStackNavigationMock,
      appointmentsListDispatch: appointmentsListDispatchMock,
      appointmentListDetails: {
        appointmentsType: defaultAppointmentsListState.appointmentsType,
        start: defaultAppointmentsListState.start,
        appointments: defaultAppointmentsListState.appointments,
        batchSize: appointmentsListContent.appointmentBatchSize,
      },
    };
    expect(getAppointmentsListAsyncActionMock).toBeCalledWith(expectedArgs);
  });

  it('renders outer view correctly with expected properties', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );
    const appointmentListContainer = container.root.findByType(View);

    expect(appointmentListContainer.props.testID).toEqual('appointmentList');
    expect(appointmentListContainer.props.style).toEqual(
      appointmentsListStyles.appointmentListViewStyle
    );
    expect(getChildren(appointmentListContainer).length).toEqual(3);
  });

  it('renders tabs container with expected properties', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const tabContainer = getChildren(viewPage)[0];
    expect(tabContainer.props.style).toEqual(
      appointmentsListStyles.tabContainerViewStyle
    );
    expect(tabContainer.type).toEqual(View);
    expect(getChildren(tabContainer).length).toEqual(1);
  });

  it('renders tabs component with expected properties', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const tabContainer = getChildren(viewPage)[0];
    const tabsComponent = getChildren(tabContainer)[0];
    expect(tabsComponent.props.tabs).toEqual(appointmentsListContent.tabs);
    expect(tabsComponent.type).toEqual(Tabs);
    expect(tabsComponent.props.selected).toEqual(
      appointmentsListContent.tabs.findIndex(
        (listTab: ITab) => listTab.value === 'upcoming'
      )
    );
  });

  it('executes onTabPress function correctly when start location is above 0', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 5,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const tabContainer = getChildren(viewPage)[0];
    const tabsComponent = getChildren(tabContainer)[0];

    tabsComponent.props.onTabPress('past');

    expect(getAppointmentsListAsyncActionMock).toHaveBeenCalled();
  });

  it('executes onTabPress function correctly when start location is 0', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const tabContainer = getChildren(viewPage)[0];
    const tabsComponent = getChildren(tabContainer)[0];

    tabsComponent.props.onTabPress('cancelled');

    expect(getAppointmentsListAsyncActionMock).toHaveBeenCalled();
  });

  it('renders upcoming appointments with expected properties', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: appointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const upcomingAppointmentsList = viewPage.props.children[1];
    const upcomingAppointmentItem = upcomingAppointmentsList[0];

    expect(getChildren(viewPage).length).toEqual(3);
    expect(upcomingAppointmentItem.type).toEqual(AppointmentItem);
    expect(upcomingAppointmentItem.key).toEqual('12345');
    expect(upcomingAppointmentItem.props.appointment).toEqual(
      appointmentsMock[0]
    );
    expect(upcomingAppointmentItem.props.viewStyle).toEqual(
      appointmentsListStyles.appointmentListItemTextStyle
    );
    expect(upcomingAppointmentItem.props.navigation).toEqual(
      appointmentsStackNavigationMock
    );
  });

  it('renders past appointments with expected properties', () => {
    setDefaultState('past');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: pastAppointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const pastAppointmentsList = viewPage.props.children[1];
    const pastAppointmentItem = pastAppointmentsList[0];
    const completedAppointmentItem = pastAppointmentsList[1];

    expect(getChildren(viewPage).length).toEqual(3);
    expect(pastAppointmentItem.type).toEqual(AppointmentItem);
    expect(pastAppointmentItem.key).toEqual('12346');
    expect(pastAppointmentItem.props.appointment).toEqual(
      pastAppointmentsMock[0]
    );
    expect(pastAppointmentItem.props.viewStyle).toEqual(
      appointmentsListStyles.appointmentListItemTextStyle
    );
    expect(completedAppointmentItem.type).toEqual(AppointmentItem);
    expect(completedAppointmentItem.key).toEqual('12348');
    expect(completedAppointmentItem.props.appointment).toEqual(
      pastAppointmentsMock[1]
    );
    expect(completedAppointmentItem.props.viewStyle).toEqual(
      appointmentsListStyles.appointmentListItemTextStyle
    );
  });

  it('renders cancelled appointments with expected properties', () => {
    setDefaultState('cancelled');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'cancelled',
        start: 0,
        appointments: cancelledAppointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const appointmentItem = viewPage.props.children[1][0];

    expect(getChildren(viewPage).length).toEqual(3);
    expect(appointmentItem.type).toEqual(AppointmentItem);
    expect(appointmentItem.key).toEqual('12347');
    expect(appointmentItem.props.appointment).toEqual(
      cancelledAppointmentsMock[0]
    );
    expect(appointmentItem.props.viewStyle).toEqual(
      appointmentsListStyles.appointmentListItemTextStyle
    );
  });

  it('renders See More button with expected properties', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: manyAppointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const seeMoreButton = getChildren(viewPage)[2];
    expect(seeMoreButton.type).toEqual(LinkButton);
    expect(seeMoreButton.props.viewStyle).toEqual(
      appointmentsListStyles.listEndButtonViewStyle
    );
    expect(seeMoreButton.props.linkText).toEqual(
      appointmentsListContent.seeMoreAppointmentsButton
    );
  });

  it('executes See More button press correctly', () => {
    setDefaultState('upcoming');

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: manyAppointmentsMock,
      },
    });

    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const seeMoreButton = getChildren(viewPage)[2];
    seeMoreButton.props.onPress();
  });

  it('renders Back to Top button with expected properties', () => {
    setDefaultState('upcoming');
    const measureMock = jest.fn();
    useRefMock.mockImplementation(() => {
      return {
        current: {
          measure: measureMock,
        },
      };
    });

    useAppointmentsListContextMock.mockReturnValue({
      appointmentsListState: {
        appointmentsType: 'upcoming',
        start: 0,
        appointments: manyAppointmentsMock,
        allAppointmentsReceived: true,
      },
    });
    const wrapper = shallow(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const views = wrapper.find(View);
    const viewPage = views.get(0);
    const backToTopButton = viewPage.props.children[2];
    expect(backToTopButton.type).toEqual(LinkButton);
    expect(backToTopButton.props.viewStyle).toEqual(
      appointmentsListStyles.listEndButtonViewStyle
    );
    expect(backToTopButton.props.linkText).toEqual(
      appointmentsListContent.backToTopButtonText
    );
    backToTopButton.props.onPress();
    expect(useRefMock).toBeCalledTimes(1);
    expect(measureMock).toHaveBeenCalledTimes(1);
    expect(measureMock).toBeCalledWith(expect.any(Function));
    const measureHandler = measureMock.mock.calls[0][0];
    const yMock = 5;
    measureHandler(undefined, yMock);

    expect(scrollToMock).toHaveBeenCalledWith(yMock);
  });

  it('renders No Appointments container correctly', () => {
    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const pageContainers = getChildren(viewPage);
    const appointmentsList = pageContainers[1];
    const noAppointmentsContainer = pageContainers[2];
    expect(appointmentsList).toBeNull();
    expect(noAppointmentsContainer.type).toEqual(View);
    expect(noAppointmentsContainer.props.style).toEqual(
      appointmentsListStyles.noAppointmentsContainerViewStyle
    );
    expect(noAppointmentsContainer.props.testID).toEqual(
      'noAppointmentsContainer'
    );
    expect(getChildren(noAppointmentsContainer).length).toEqual(1);
  });

  it('renders No Appointments inner container correctly', () => {
    const container = renderer.create(
      <AppointmentsList
        navigation={appointmentsStackNavigationMock}
        scrollViewRef={scrollViewRef}
      />
    );

    const viewPage = container.root.findByType(View);
    const noAppointmentsContainer = getChildren(viewPage)[2];
    const noAppointmentsInnerContainer = getChildren(
      noAppointmentsContainer
    )[0];
    expect(noAppointmentsInnerContainer.type).toEqual(View);
    expect(noAppointmentsInnerContainer.props.style).toEqual(
      appointmentsListStyles.noAppointmentsInnerContainerViewStyle
    );
    expect(noAppointmentsInnerContainer.props.testID).toEqual(
      'noAppointmentsInnerContainer'
    );
    expect(getChildren(noAppointmentsInnerContainer).length).toEqual(3);
  });

  it.each([
    ['upcoming', 'calendar-alt'],
    ['past', 'calendar-alt'],
    ['cancelled', 'calendar-times'],
  ])(
    'renders No Appointments icon correctly for %p appointments',
    (appointmentType, iconName) => {
      setDefaultState(appointmentType);
      const container = renderer.create(
        <AppointmentsList
          navigation={appointmentsStackNavigationMock}
          scrollViewRef={scrollViewRef}
        />
      );

      const viewPage = container.root.findByType(View);
      const noAppointmentsContainer = getChildren(viewPage)[2];
      const noAppointmentsInnerContainer = getChildren(
        noAppointmentsContainer
      )[0];
      const noAppointmentsIcon = getChildren(noAppointmentsInnerContainer)[0];
      expect(noAppointmentsIcon.type).toEqual(FontAwesomeIcon);
      expect(noAppointmentsIcon.props.style).toEqual(
        appointmentsListStyles.iconTextStyle
      );
      expect(noAppointmentsIcon.props.name).toEqual(iconName);
      expect(noAppointmentsIcon.props.light).toEqual(true);
    }
  );

  it.each([
    ['upcoming', appointmentsListContent.noUpcomingAppointmentsTitle],
    ['past', appointmentsListContent.noPastAppointmentsTitle],
    ['cancelled', appointmentsListContent.noCancelledAppointmentsTitle],
  ])(
    'renders No Appointments title correctly for %p appointments',
    (appointmentType, title) => {
      setDefaultState(appointmentType);
      const container = renderer.create(
        <AppointmentsList
          navigation={appointmentsStackNavigationMock}
          scrollViewRef={scrollViewRef}
        />
      );

      const viewPage = container.root.findByType(View);
      const noAppointmentsContainer = getChildren(viewPage)[2];
      const noAppointmentsInnerContainer = getChildren(
        noAppointmentsContainer
      )[0];
      const noAppointmentsTitle = getChildren(noAppointmentsInnerContainer)[1];
      expect(noAppointmentsTitle.type).toEqual(BaseText);
      expect(noAppointmentsTitle.props.style).toEqual(
        appointmentsListStyles.noAppointmentsTitleTextStyle
      );
      expect(getChildren(noAppointmentsTitle).length).toEqual(1);
      expect(getChildren(noAppointmentsTitle)[0]).toEqual(title);
    }
  );

  it.each([
    ['upcoming', appointmentsListContent.noUpcomingAppointmentsContent],
    ['past', appointmentsListContent.noPastAppointmentsContent],
    ['cancelled', appointmentsListContent.noCancelledAppointmentsContent],
  ])(
    'renders No Appointments content correctly for %p appointments',
    (appointmentType, title) => {
      setDefaultState(appointmentType);
      const container = renderer.create(
        <AppointmentsList
          navigation={appointmentsStackNavigationMock}
          scrollViewRef={scrollViewRef}
        />
      );

      const viewPage = container.root.findByType(View);
      const noAppointmentsContainer = getChildren(viewPage)[2];
      const noAppointmentsInnerContainer = getChildren(
        noAppointmentsContainer
      )[0];
      const noAppointmentsContent = getChildren(
        noAppointmentsInnerContainer
      )[2];
      expect(noAppointmentsContent.type).toEqual(BaseText);
      expect(noAppointmentsContent.props.style).toEqual(
        appointmentsListStyles.noAppointmentsTextStyle
      );
      expect(getChildren(noAppointmentsContent).length).toEqual(1);
      expect(getChildren(noAppointmentsContent)[0]).toEqual(title);
    }
  );
});
