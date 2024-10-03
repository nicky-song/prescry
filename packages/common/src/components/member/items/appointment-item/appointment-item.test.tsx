// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import {
  appointmentItemStyle,
  appointmentItemStyle as styles,
} from './appointment-item.styles';
import { AppointmentItem } from './appointment-item';
import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import { AppointmentItemContent } from './appointment-item.content';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { appointmentsStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { navigateAppointmentDetailsScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointment-details-screen-dispatch';
import { getChildren } from '../../../../testing/test.helper';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));
jest.mock(
  '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointment-details-screen-dispatch'
);

const navigateAppointmentDetailsScreenDispatchMock =
  navigateAppointmentDetailsScreenDispatch as jest.Mock;

const appointmentLinkMock = 'appointmentlink';

const appointmentMock: IAppointmentListItem = {
  customerName: 'name',
  orderNumber: '12345',
  locationName: 'name',
  date: 'January 1, 2000',
  time: '10:00 AM',
  serviceDescription: 'none',
  bookingStatus: 'Confirmed',
  startInUtc: new Date('2021-06-23T13:00:00+0000'),
  serviceType: '',
  appointmentLink: appointmentLinkMock,
};

const viewStyle: ViewStyle = {
  backgroundColor: 'red',
};
const appointmentItemProps = {
  appointment: appointmentMock,
  viewStyle,
  type: 'Confirmed',
  navigation: appointmentsStackNavigationMock,
};
describe('AppointmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders clickable item in TouchableOpacity with expected properties', () => {
    const testRenderer = renderer.create(
      <AppointmentItem {...appointmentItemProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    expect(touchableOpacity.props.style).toEqual([
      styles.cardViewStyle,
      viewStyle,
    ]);
    expect(touchableOpacity.props.children.length).toEqual(2);
    expect(touchableOpacity.props.onPress).toBeDefined();
    expect(touchableOpacity.props.onPress.name).toEqual('onPress');
  });

  it('Dispatches to appointment confirmation screen when onpress is clicked ', () => {
    const testRenderer = renderer.create(
      <AppointmentItem {...appointmentItemProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    touchableOpacity.props.onPress();
    expect(navigateAppointmentDetailsScreenDispatchMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      appointmentMock.orderNumber,
      undefined,
      undefined,
      appointmentLinkMock,
      undefined
    );
  });

  it('renders icon with expected properties', () => {
    const testRenderer = renderer.create(
      <AppointmentItem {...appointmentItemProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

    const iconContainer = touchableOpacity.props.children[1];
    expect(iconContainer.type).toEqual(View);
    expect(iconContainer.props.style).toEqual(styles.iconContainerViewStyle);

    const icon = iconContainer.props.children;

    const iconImage = icon.props.children;
    expect(iconImage.type).toEqual(FontAwesomeIcon);
    expect(iconImage.props.name).toEqual('chevron-right');
    expect(iconImage.props.style).toEqual(styles.iconStyle);
  });

  it('renders clickable item Title in Text with expected properties', () => {
    const title = 'name';

    const testRenderer = renderer.create(<
      AppointmentItem {...appointmentItemProps} />
    );

    const textContainerView = testRenderer.root.findAllByProps({
      style: appointmentItemStyle.textContainerViewStyle,
    })[0];
    const titleText = getChildren(textContainerView)[0];

    expect(titleText.type).toBe(ProtectedBaseText);
    expect(titleText.props.style).toEqual(styles.titleTextStyle);
    expect(titleText.props.children).toEqual(title);
  });

  it('renders card with correct labels and content', () => {
    const testRenderer = renderer.create(
      <AppointmentItem {...appointmentItemProps} />
    );
    const cardFields = testRenderer.root.findAllByProps({
      style: appointmentItemStyle.labelContentViewStyle,
    });

    const serviceField = cardFields[0];
    const dateField = cardFields[2];
    const locationField = cardFields[4];
    const serviceLabel = serviceField.props.children[0];
    const serviceContent = serviceField.props.children[1];

    const dateLabel = dateField.props.children[0];
    const dateContent = dateField.props.children[1];
    const locationLabel = locationField.props.children[0];
    const locationContent = locationField.props.children[1];

    expect(serviceLabel.props.children).toEqual(
      AppointmentItemContent.serviceFieldLabel
    );
    expect(serviceContent.type).toBe(ProtectedBaseText);
    expect(serviceContent.props.children).toEqual(appointmentMock.serviceDescription);

    expect(dateLabel.props.children).toEqual(
      AppointmentItemContent.dateFieldLabel
    );
    expect(dateContent.type).toBe(Text);
    expect(dateContent.props.children).toEqual(
      `${appointmentMock.date} ${appointmentMock.time}` 
    );

    expect(locationLabel.props.children).toEqual(
      AppointmentItemContent.providerFieldLabel
    );
    expect(locationContent.type).toBe(ProtectedBaseText);
    expect(locationContent.props.children).toEqual(appointmentMock.locationName);
  });
});
