// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { MarkdownText } from '../text/markdown-text/markdown-text';
import {
  AppointmentConfirmationMessage,
  IAppointmentConfirmationMessageProps,
} from './appointment-confirmation-message';
import { appointmentConfirmationMessageStyles } from './appointment-confirmation-message.styles';
import { Heading } from '../member/heading/heading';
import { appointmentConfirmationMessageContent } from './appointment-confirmation-message.content';
import { StringFormatter } from '../../utils/formatters/string.formatter';
import { IAppointmentItem } from '../../models/api-response/appointment.response';
import { ITestContainer } from '../../testing/test.container';
import { getChildren } from '../../testing/test.helper';
import { ProtectedBaseText } from '../text/protected-base-text/protected-base-text';

jest.mock('../member/links/address/address.link', () => ({
  AddressLink: () => <div />,
}));

jest.mock('../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../utils/formatters/string.formatter');
const formatMock = StringFormatter.format as jest.Mock;

const address1 = 'address1';
const address2 = 'address2';
const city = 'city';
const state = 'state';
const zip = 'zip';
const appointmentDetailsMock: IAppointmentItem = {
  serviceName: '',
  customerName: 'name',
  customerDateOfBirth: '01/01/2000',
  status: 'Accepted',
  orderNumber: '12345',
  locationName: '',
  address1,
  address2,
  city,
  state,
  zip,
  additionalInfo: undefined,
  date: 'January 1, 2000',
  time: 'time',
  providerTaxId: 'dummy Tax Id',
  paymentStatus: 'no_payment_required',
  procedureCode: 'procedure-code',
  serviceDescription: 'service-description',
  bookingStatus: 'Confirmed',
  startInUtc: new Date('2120-12-15T13:00:00+0000'),
  serviceType: '',
  confirmationDescription: 'confirmation-description',
  cancellationPolicy: 'cancellation-policy',
  appointmentLink: 'appointment-link',
};

const defaultProps: IAppointmentConfirmationMessageProps = {
  appointmentDate: '',
  appointmentTime: '',
  confirmationDetails: '',
  location: {
    name: 'pharmacyname',
    addressLine1: 'line 1',
    city: 'cityname',
    state: 'statename',
    zip: 'zipcode',
  },
  bookingStatus: 'Requested',
  cancelWindowHours: '6',
  paymentStatus: 'no_payment_required',
  appointment: appointmentDetailsMock,
  confirmationDetailsIntro: '',
  confirmationDetailsEnding: '',
};

const stylesheet = appointmentConfirmationMessageStyles;

describe('AppointmentConfirmationMessage', () => {
  beforeEach(() => {
    formatMock.mockReset();
    formatMock.mockImplementation((s: string) => s);
  });

  it('renders with props', () => {
    const confirmationDetails = 'details';
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        confirmationDetails={confirmationDetails}
      />
    );
    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(3);

    expect(markdownComponents[0].props.children).toEqual(confirmationDetails);

    expect(markdownComponents[1].props.children).toEqual('pharmacyname');
  });

  it('formats confirmation details', () => {
    const appointmentDate = 'date';
    const appointmentTime = 'time';
    const confirmationDetails = 'details';
    const cancelWindowHours = '6';
    renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
        confirmationDetails={confirmationDetails}
      />
    );

    const expectedMap = new Map([
      ['appointment-date', appointmentDate],
      ['appointment-time', appointmentTime],
      ['location-name', defaultProps.location.name],
    ]);
    expect(formatMock).toHaveBeenNthCalledWith(
      1,
      confirmationDetails,
      expectedMap
    );
    const expectedCancelMessageMap = new Map([
      ['cancel-window-hours', cancelWindowHours],
    ]);
    expect(formatMock).toHaveBeenNthCalledWith(
      2,
      appointmentDetailsMock.cancellationPolicy,
      expectedCancelMessageMap
    );
  });

  it('renders location label as heading with expected properties', () => {
    const { locationLabel } = appointmentConfirmationMessageContent;
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage {...defaultProps} />
    );

    const labelHeading = testRenderer.root.findAllByType(Heading)[0];

    expect(labelHeading.props.level).toEqual(2);
    expect(labelHeading.props.textStyle).toEqual(stylesheet.heading2TextStyle);
    expect(labelHeading.props.children).toEqual(locationLabel);
  });

  it('renders cancellation text by default based on serviceType and no additional information if additional information not provided', () => {
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage {...defaultProps} />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(2);

    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(3);
  });

  it('renders additional information heading with expected properties', () => {
    const additionalInfo = 'additional content';
    const { additionalInformationLabel } =
      appointmentConfirmationMessageContent;
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...{
          ...defaultProps,
          appointment: { ...appointmentDetailsMock, additionalInfo },
        }}
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(2);

    const additionalInformationHeading = headings[1];
    expect(additionalInformationHeading.props.level).toEqual(2);
    expect(additionalInformationHeading.props.textStyle).toEqual(
      stylesheet.heading2TextStyle
    );
    expect(additionalInformationHeading.props.children).toEqual(
      additionalInformationLabel
    );
  });

  it('doesnt render additional information heading when additional info or cancellation text is not available', () => {
    const cancellationPolicy = '';
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...{
          ...defaultProps,
          appointment: { ...appointmentDetailsMock, cancellationPolicy },
        }}
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(1);
  });

  it('renders additional information content markdown with expected properties', () => {
    const additionalInfo = 'additional content';
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...{
          ...defaultProps,
          appointment: { ...appointmentDetailsMock, additionalInfo },
        }}
      />
    );
    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);

    expect(markdownComponents.length).toEqual(4);
    expect(markdownComponents[2].props.children).toEqual(additionalInfo);
    expect(markdownComponents[2].props.textStyle).toEqual(
      stylesheet.additionalContentTextStyle
    );
  });

  it('renders no location and additional information when appointment is cancelled', () => {
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        bookingStatus='Cancelled'
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(0);

    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(1);
  });

  it('renders no location and additional information when appointment is cancel', () => {
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        bookingStatus='cancel'
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(0);

    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(1);
  });

  it('renders no location and additional information when appointment is past', () => {
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        bookingStatus='Confirmed'
        isPastAppointment={true}
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(0);

    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(1);
  });

  it('renders formatted details with location when appointment is past', () => {
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...defaultProps}
        bookingStatus='Confirmed'
        isPastAppointment={true}
      />
    );

    const formattedDetailsView = testRenderer.root.findAllByProps({
      style: stylesheet.formattedDetailsViewStyle
    })[0];
    const locationNameText = getChildren(formattedDetailsView)[1];

    expect(locationNameText.type).toBe(ProtectedBaseText);
    expect(locationNameText.props.style).toEqual(
      stylesheet.baseTextFormattedDetailsLocationNameStyle
    );
    expect(locationNameText.props.children).toEqual(
      defaultProps.location.name
    )
  });

  it('renders additional information with refund text when appointment is cancelled and paid', () => {
    const additionalInfo = 'additional content';
    const { refundText } = appointmentConfirmationMessageContent;
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...{
          ...defaultProps,
          appointment: { ...appointmentDetailsMock, additionalInfo },
        }}
        bookingStatus='Cancelled'
        paymentStatus='paid'
      />
    );

    const headings = testRenderer.root.findAllByType(Heading);
    expect(headings.length).toEqual(0);

    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);
    expect(markdownComponents.length).toEqual(2);

    expect(markdownComponents[1].props.children).toEqual(refundText);
    expect(markdownComponents[1].props.textStyle).toEqual(
      stylesheet.refundContentTextStyle
    );
  });

  it('renders vaccine cancellation text for vaccine service type', () => {
    const cancellationDetails = 'cancellation-policy';
    const additionalInfo = 'additional content';

    const props: IAppointmentConfirmationMessageProps = {
      ...defaultProps,
    };
    const testRenderer = renderer.create(
      <AppointmentConfirmationMessage
        {...{
          ...props,
          appointment: { ...appointmentDetailsMock, additionalInfo },
        }}
      />
    );
    const markdownComponents = testRenderer.root.findAllByType(MarkdownText);

    expect(markdownComponents.length).toEqual(4);
    expect(markdownComponents[2].props.children).toEqual(additionalInfo);
    expect(markdownComponents[2].props.textStyle).toEqual(
      stylesheet.additionalContentTextStyle
    );
    expect(markdownComponents[3].props.children).toEqual(cancellationDetails);
  });  
});
