// Copyright 2021 Prescryptive Health, Inc.

import moment from 'moment';
import { ScrollView, View } from 'react-native';
import React, { RefObject, useRef, ReactElement, useEffect } from 'react';
import {
  getAppointmentsListAsyncAction,
  IGetAppointmentsListAsyncActionArgs,
} from '../../../../experiences/guest-experience/state/appointments-list/async-actions/get-appointments-list.async-action';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import { appointmentsListContent } from './appointments-list.content';
import { appointmentsListStyles } from './appointments-list.styles';
import { LinkButton } from '../../../buttons/link/link.button';
import { Tabs, ITab } from '../../tabs/tabs';
import { AppointmentItem } from '../../items/appointment-item/appointment-item';
import { BaseText } from '../../../text/base-text/base-text';
import { useAppointmentsListContext } from '../../../../experiences/guest-experience/context-providers/appointments-list/appointments-list-context.hook';
import { defaultAppointmentsListState } from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.state';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { AppointmentsStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';

export type IAppointmentType = 'upcoming' | 'past' | 'cancelled';

export type IAppointment = {
  appointment: IAppointmentListItem;
  appointmentType: string;
};
export interface IAppointmentListDetails {
  appointmentsType: IAppointmentType;
  start: number;
  batchSize: number;
  appointments?: IAppointmentListItem[];
}
export interface IAppointmentsListProps {
  navigation: AppointmentsStackNavigationProp;
  scrollViewRef: RefObject<ScrollView>;
  backToHome?: boolean;
}

export const AppointmentsList = ({
  navigation,
  scrollViewRef,
  backToHome,
}: IAppointmentsListProps): ReactElement => {
  const {
    appointmentsListState: {
      appointmentsType,
      start,
      appointments,
      allAppointmentsReceived,
    },
    appointmentsListDispatch,
  } = useAppointmentsListContext();

  const viewRef = useRef<View>(null);

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const getAppointmentsList = async (
    appointmentListType: IAppointmentType,
    startLocation: number,
    appointmentsList: IAppointmentListItem[]
  ) => {
    const appointmentListDetails: IAppointmentListDetails = {
      appointmentsType: appointmentListType,
      start: startLocation,
      appointments: appointmentsList,
      batchSize: appointmentsListContent.appointmentBatchSize,
    };
    const args: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      navigation,
      appointmentsListDispatch,
      appointmentListDetails,
    };
    await getAppointmentsListAsyncAction(args);
  };

  useEffect(() => {
    void getAppointmentsList(
      defaultAppointmentsListState.appointmentsType,
      defaultAppointmentsListState.start,
      defaultAppointmentsListState.appointments
    );
  }, []);

  const renderMoreAppointments = () => {
    void getAppointmentsList(appointmentsType, start, appointments);
  };

  const scrollToTop = () => {
    if (viewRef?.current && scrollViewRef?.current) {
      const viewRefCurrent = viewRef.current;
      const scrollViewRefCurrent = scrollViewRef.current;
      viewRefCurrent.measure((_, y) => {
        scrollViewRefCurrent.scrollTo(y);
      });
    }
  };

  const renderSeeMoreButton = () => {
    const noAppointmentTitle =
      appointmentsType === 'cancelled'
        ? appointmentsListContent.noCancelledAppointmentsTitle
        : appointmentsType === 'upcoming'
        ? appointmentsListContent.noUpcomingAppointmentsTitle
        : appointmentsListContent.noPastAppointmentsTitle;
    const noAppointmentContent =
      appointmentsType === 'cancelled'
        ? appointmentsListContent.noCancelledAppointmentsContent
        : appointmentsType === 'upcoming'
        ? appointmentsListContent.noUpcomingAppointmentsContent
        : appointmentsListContent.noPastAppointmentsContent;
    return appointments?.length ? (
      <LinkButton
        onPress={allAppointmentsReceived ? scrollToTop : renderMoreAppointments}
        viewStyle={appointmentsListStyles.listEndButtonViewStyle}
        linkText={
          allAppointmentsReceived
            ? appointmentsListContent.backToTopButtonText
            : appointmentsListContent.seeMoreAppointmentsButton
        }
      />
    ) : (
      <View
        style={appointmentsListStyles.noAppointmentsContainerViewStyle}
        testID='noAppointmentsContainer'
      >
        <View
          style={appointmentsListStyles.noAppointmentsInnerContainerViewStyle}
          testID='noAppointmentsInnerContainer'
        >
          <FontAwesomeIcon
            name={
              appointmentsType === 'cancelled'
                ? 'calendar-times'
                : 'calendar-alt'
            }
            style={appointmentsListStyles.iconTextStyle}
            light={true}
          />
          <BaseText style={appointmentsListStyles.noAppointmentsTitleTextStyle}>
            {noAppointmentTitle}
          </BaseText>
          <BaseText style={appointmentsListStyles.noAppointmentsTextStyle}>
            {noAppointmentContent}
          </BaseText>
        </View>
      </View>
    );
  };

  const renderAppointments = (appointmentItems: IAppointment[]) => {
    if (appointmentItems.length > 0) {
      return appointmentItems.map((appointmentItem) => {
        return (
          <AppointmentItem
            key={appointmentItem.appointment.orderNumber}
            appointment={appointmentItem.appointment}
            viewStyle={appointmentsListStyles.appointmentListItemTextStyle}
            navigation={navigation}
            backToHome={backToHome}
          />
        );
      });
    }
    return null;
  };

  const renderAllAppointments = () => {
    const result: IAppointment[] = [];
    if (appointments) {
      if (appointmentsType === 'upcoming' || appointmentsType === 'cancelled') {
        const typeText =
          appointmentsType === 'upcoming'
            ? appointmentsListContent.confirmedText
            : appointmentsListContent.canceledText;
        appointments.forEach((appointment) => {
          const appointmentItem: IAppointment = {
            appointment,
            appointmentType: typeText,
          };
          result.push(appointmentItem);
        });
      } else {
        appointments.forEach((appointment) => {
          if (appointment.bookingStatus === 'Completed') {
            const appointmentItem: IAppointment = {
              appointment,
              appointmentType: appointmentsListContent.completedText,
            };
            result.push(appointmentItem);
          } else if (
            appointment.bookingStatus === 'Confirmed' &&
            moment(appointment.startInUtc).isBefore(moment.utc())
          ) {
            const appointmentItem: IAppointment = {
              appointment,
              appointmentType: appointmentsListContent.pastText,
            };
            result.push(appointmentItem);
          }
        });
      }
    }

    return renderAppointments(result);
  };

  const onTabPress = (tabName: string) => {
    const tabNameType: IAppointmentType = tabName as IAppointmentType;
    if (appointmentsType !== tabNameType) {
      void getAppointmentsList(
        tabNameType,
        defaultAppointmentsListState.start,
        defaultAppointmentsListState.appointments
      );
    }
  };

  return (
    <View
      style={appointmentsListStyles.appointmentListViewStyle}
      testID='appointmentList'
      ref={viewRef}
    >
      <View
        style={appointmentsListStyles.tabContainerViewStyle}
        testID='tabContainer'
      >
        <Tabs
          tabs={appointmentsListContent.tabs}
          onTabPress={onTabPress}
          selected={appointmentsListContent.tabs.findIndex(
            (listTab: ITab) => listTab.value === appointmentsType
          )}
        />
      </View>
      {renderAllAppointments()}
      {renderSeeMoreButton()}
    </View>
  );
};
