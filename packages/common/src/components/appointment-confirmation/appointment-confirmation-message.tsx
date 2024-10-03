// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { formatAddress } from '../../utils/formatters/address.formatter';
import { MarkdownText } from '../text/markdown-text/markdown-text';
import { AddressLink } from '../member/links/address/address.link';
import { appointmentConfirmationMessageContent } from './appointment-confirmation-message.content';
import { appointmentConfirmationMessageStyles } from './appointment-confirmation-message.styles';
import { Heading } from '../member/heading/heading';
import { StringFormatter } from '../../utils/formatters/string.formatter';
import { IAppointmentItem } from '../../models/api-response/appointment.response';
import { BaseText } from '../text/base-text/base-text';
import { ProtectedBaseText } from '../text/protected-base-text/protected-base-text';
export interface IAppointmentConfirmationMessageProps {
  confirmationDetails: string;
  appointment: IAppointmentItem;
  appointmentDate: string;
  appointmentTime: string;
  confirmationDetailsIntro: string;
  confirmationDetailsEnding: string;
  location: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
  bookingStatus: string;
  cancelWindowHours: string;
  isPastAppointment?: boolean;
  paymentStatus?: string;
  cancelError?: boolean;
}

export const AppointmentConfirmationMessage = (
  props: IAppointmentConfirmationMessageProps
) => {
  const {
    addressLine1: address1,
    addressLine2: address2,
    city,
    name,
    state,
    zip,
  } = props.location;

  const formattedAddress = formatAddress({
    address1,
    address2,
    city,
    state,
    zip,
  });

  const stylesheet = appointmentConfirmationMessageStyles;
  const { locationLabel, refundText, additionalInformationLabel } =
    appointmentConfirmationMessageContent;

  const {
    appointmentDate,
    appointmentTime,
    confirmationDetails,
    confirmationDetailsIntro,
    confirmationDetailsEnding,
    location,
    bookingStatus,
    isPastAppointment,
    paymentStatus,
    cancelWindowHours,
    appointment,
  } = props;
  const parameterMap = new Map<string, string>([
    ['appointment-date', appointmentDate],
    ['appointment-time', appointmentTime],
    ['location-name', location.name],
  ]);
  const formattedDetails = confirmationDetails
    ? StringFormatter.format(confirmationDetails, parameterMap)
    : '';
  const formattedEnding = confirmationDetailsEnding
    ? StringFormatter.format(confirmationDetailsEnding, parameterMap)
    : '';

  const renderRefundText =
    paymentStatus !== 'no_payment_required' && bookingStatus === 'Cancelled' ? (
      <MarkdownText textStyle={stylesheet.refundContentTextStyle}>
        {refundText}
      </MarkdownText>
    ) : null;

  const cancellationParameterMap = new Map<string, string>([
    ['cancel-window-hours', cancelWindowHours],
  ]);

  const renderAdditionalContentWithCancellation = (): ReactNode => {
    return (
      <>
        {renderAdditionalInformationLabel()}
        {renderAdditionalContent()}
        {renderCancellationDetails()}
      </>
    );
  };

  const renderAdditionalInformationLabel = (): ReactNode => {
    if (
      appointment.additionalInfo?.length ||
      appointment.cancellationPolicy?.length
    ) {
      return (
        <Heading level={2} textStyle={stylesheet.heading2TextStyle}>
          {additionalInformationLabel}
        </Heading>
      );
    }
    return null;
  };

  const renderAdditionalContent = (): ReactNode => {
    if (!appointment.additionalInfo) {
      return null;
    }
    return (
      <MarkdownText textStyle={stylesheet.additionalContentTextStyle}>
        {appointment.additionalInfo}
      </MarkdownText>
    );
  };

  const renderCancellationDetails = (): ReactNode => {
    if (!appointment.cancellationPolicy) {
      return null;
    }
    return (
      <MarkdownText>
        {StringFormatter.format(
          appointment.cancellationPolicy,
          cancellationParameterMap
        )}
      </MarkdownText>
    );
  };

  const renderLocationDetailsAndAdditionalContent =
    bookingStatus === 'Cancelled' ||
    bookingStatus === 'cancel' ||
    isPastAppointment ? null : (
      <>
        <Heading level={2} textStyle={stylesheet.heading2TextStyle}>
          {locationLabel}
        </Heading>
        <MarkdownText>{name}</MarkdownText>
        <AddressLink formattedAddress={formattedAddress} />
        {renderAdditionalContentWithCancellation()}
      </>
    );

  const renderFormattedDetails =
    (bookingStatus.toLowerCase() === 'completed' ||
      bookingStatus.toLowerCase() === 'confirmed') &&
    isPastAppointment ? (
      <>
        <View style={stylesheet.formattedDetailsViewStyle}>
          <BaseText>{confirmationDetailsIntro}</BaseText>
          <ProtectedBaseText
            style={stylesheet.baseTextFormattedDetailsLocationNameStyle}
          >
            {location.name}
          </ProtectedBaseText>
          <MarkdownText>{formattedEnding}</MarkdownText>
        </View>
      </>
    ) : (
      <MarkdownText>{formattedDetails}</MarkdownText>
    );

  return (
    <View style={stylesheet.bodyViewStyle}>
      {renderFormattedDetails}
      {renderRefundText}
      {renderLocationDetailsAndAdditionalContent}
    </View>
  );
};
