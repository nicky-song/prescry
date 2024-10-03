// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';

import { View } from 'react-native';
import {
  AppointmentReceipt,
  IAppointmentReceiptProps,
} from './appointment-receipt';
import { formatAddress } from '../../../utils/formatters/address.formatter';
import { AppointmentReceiptContent } from './appointment-receipt.content';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { PaymentStatus } from '../../../models/api-response/create-booking-response';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { appointmentReceiptStyles } from './appointment-receipt.styles';
import { ITestContainer } from '../../../testing/test.container';
import { ToolButton } from '../../buttons/tool.button/tool.button';
import { base64StringToBlob } from '../../../utils/test-results/test-results.helper';
import { goToUrl } from '../../../utils/link.helper';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { getChildren } from '../../../testing/test.helper';

jest.mock('../../buttons/tool.button/tool.button', () => ({
  ToolButton: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../utils/test-results/test-results.helper');
const base64StringToBlobMock = base64StringToBlob as jest.Mock;

jest.mock('../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
interface IStateCalls {
  showAppointmentReceipt: [boolean, jest.Mock];
  showSpinner: [boolean, jest.Mock];
}

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../text/protected-base-text/protected-base-text', () => ({
  ProtectedBaseText: () => <div />,
}));

jest.mock('../../containers/protected-view/protected-view', () => ({
  ProtectedView: () => <div />,
}));

function stateReset({
  showAppointmentReceipt = [true, jest.fn()],
  showSpinner = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(showAppointmentReceipt);
  useStateMock.mockReturnValueOnce(showSpinner);
}

const appointmentReceiptProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'paid' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    contractFee: 7.0,
    appointmentLink: 'appointmentLink',
  } as IAppointmentItem,

  isExpanded: true,
};

const appointmentReceiptNoPaymentRequiredProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'no_payment_required' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointment-link',
  } as IAppointmentItem,

  isExpanded: true,
};

const appointmentReceiptRefundedProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'refunded' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Confirmed',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointment-link',
  } as IAppointmentItem,

  isExpanded: true,
};

const appointmentReceiptCancelledProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'unpaid' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Cancelled',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointment-link',
  } as IAppointmentItem,

  isExpanded: true,
};

const appointmentReceiptRequestedProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'unpaid' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Requested',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointment-link',
  } as IAppointmentItem,

  isExpanded: true,
};

const appointmentReceiptCompletedProps: IAppointmentReceiptProps = {
  patientName: 'Joe Bloggs',
  appointment: {
    serviceName: '',
    customerName: 'name',
    customerDateOfBirth: '01/01/2000',
    status: 'Accepted',
    orderNumber: '12345',
    address1: '7807 219th ST SW',
    address2: '',
    city: 'Yamika',
    locationName: 'RX Pharmacy',
    state: 'WA',
    zip: '98056',
    date: 'date',
    time: 'time',
    providerTaxId: `123456`,
    descriptionOfService: 'Antigen COVID-19 Test',
    procedureCode: '89456',
    providerLegalName: 'rXPharmacy',
    providerNpi: `123456`,
    totalCost: '56.75',
    paymentStatus: 'no_payment_required' as PaymentStatus,
    serviceDescription: 'description',
    diagnosticCode: '123456',
    bookingStatus: 'Completed',
    startInUtc: new Date('2020-12-15T13:00:00+0000'),
    serviceType: '',
    appointmentLink: 'appointment-link',
  } as IAppointmentItem,

  isExpanded: true,
};

const formattedAddress = formatAddress({
  address1: appointmentReceiptProps.appointment.address1,
  address2: appointmentReceiptProps.appointment.address2,
  city: appointmentReceiptProps.appointment.city,
  state: appointmentReceiptProps.appointment.state,
  zip: appointmentReceiptProps.appointment.zip,
});

describe('AppointmentReceipt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReset();
    stateReset({});
  });

  it('renders correctly with defaults', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptProps} />
    );

    const appointmentReceiptExpanderView =
      appointmentReceipt.root.findAllByType(View);
    const appointmentReceiptHeaderText = appointmentReceipt.root.findByProps({
      style: appointmentReceiptStyles.appointmentReceiptHeaderTextStyle,
    });

    const appointmentReceiptIconContainer = appointmentReceipt.root.findByProps({
      style: appointmentReceiptStyles.appointmentReceiptIconContainerStyle,
    });
    const appointmentReceiptIcon = appointmentReceipt.root.findByProps({
      style: appointmentReceiptStyles.appointmentReceiptIconStyle,
    });

    const appointmentReceiptView = appointmentReceipt.root.findByProps({
      style: appointmentReceiptStyles.appointmentReceiptViewStyle,
    });
    const appointmentReceiptPharmacyDetailsView = getChildren(appointmentReceiptView)[0];

    expect(appointmentReceiptPharmacyDetailsView.type).toBe(ProtectedView);
    expect(appointmentReceiptPharmacyDetailsView.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptPharmacyDetailsViewStyle
    );
    expect(appointmentReceiptPharmacyDetailsView.props.testID).toEqual(
      'appointmentReceiptPharmacyDetails'
    );

    const pharmacyNameTextBox =
      appointmentReceiptPharmacyDetailsView.props.children[0];

    const pharmacyLocationTextBox =
      appointmentReceiptPharmacyDetailsView.props.children[1];

    const appointmentReceiptItems = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptItemView,
    });

    const appointmentReceiptItem1Header =
      appointmentReceiptItems[0].props.children[0];
    const appointmentReceiptItem1Value =
      appointmentReceiptItems[0].props.children[1];

    const appointmentReceiptItem2Header =
      appointmentReceiptItems[3].props.children[0];
    const appointmentReceiptItem2Value =
      appointmentReceiptItems[3].props.children[1];

    const appointmentReceiptItem3Header =
      appointmentReceiptItems[5].props.children[0];
    const appointmentReceiptItem3Value =
      appointmentReceiptItems[5].props.children[1];

    const appointmentReceiptItem4Header =
      appointmentReceiptItems[7].props.children[0];
    const appointmentReceiptItem4Value =
      appointmentReceiptItems[7].props.children[1];

    const appointmentReceiptItem5Header =
      appointmentReceiptItems[9].props.children[0];
    const appointmentReceiptItem5Value =
      appointmentReceiptItems[9].props.children[1];

    const appointmentReceiptItem6Header =
      appointmentReceiptItems[11].props.children[0];
    const appointmentReceiptItem6Value =
      appointmentReceiptItems[11].props.children[1];

    const appointmentReceiptItem7Header =
      appointmentReceiptItems[13].props.children[0];
    const appointmentReceiptItem7Value =
      appointmentReceiptItems[13].props.children[1];

    const appointmentReceiptItem8Header =
      appointmentReceiptItems[15].props.children[0];
    const appointmentReceiptItem8Value =
      appointmentReceiptItems[15].props.children[1];

    const appointmentReceiptItem9Header =
      appointmentReceiptItems[17].props.children[0];
    const appointmentReceiptItem9Value =
      appointmentReceiptItems[17].props.children[1];

    const appointmentReceiptItem10Header =
      appointmentReceiptItems[19].props.children[0];
    const appointmentReceiptItem10Value =
      appointmentReceiptItems[19].props.children[1];

    const appointmentReceiptItem11Header =
      appointmentReceiptItems[21].props.children[0];
    const appointmentReceiptItem11Value =
      appointmentReceiptItems[21].props.children[1];

    const appointmentReceiptItem12Header =
      appointmentReceiptItems[23].props.children[0];
    const appointmentReceiptItem12Value =
      appointmentReceiptItems[23].props.children[1];

    const appointmentReceiptChargesItems =
      appointmentReceipt.root.findAllByProps({
        style: appointmentReceiptStyles.appointmentReceiptChargesItemView,
      });

    const appointmentReceiptChargesItem1Header =
      appointmentReceiptChargesItems[0].props.children[0];
    const appointmentReceiptChargesItem1Value =
      appointmentReceiptChargesItems[0].props.children[1];

    const appointmentReceiptTotalsItems =
      appointmentReceipt.root.findAllByProps({
        style: appointmentReceiptStyles.appointmentReceiptTotalsItemView,
      });

    const appointmentReceiptTotalsItem1Header =
      appointmentReceiptTotalsItems[0].props.children[0];
    const appointmentReceiptTotalsItem1Value =
      appointmentReceiptTotalsItems[0].props.children[1];

    expect(appointmentReceiptExpanderView[0].props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptExpanderViewStyle
    );
    expect(appointmentReceiptHeaderText.props.children).toEqual(
      AppointmentReceiptContent.headerText
    );
    expect(appointmentReceiptIconContainer).toBeDefined();
    expect(appointmentReceiptIcon.props.solid).toEqual(true);
    expect(appointmentReceiptIcon.props.name).toEqual('chevron-up');

    expect(pharmacyNameTextBox.type).toEqual(BaseText);
    expect(pharmacyNameTextBox.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptPharmacyNameTextStyle
    );
    expect(pharmacyNameTextBox.props.children).toEqual(
      appointmentReceiptProps.appointment.locationName
    );

    expect(pharmacyLocationTextBox.type).toEqual(BaseText);
    expect(pharmacyLocationTextBox.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptPharmacyAddressTextStyle
    );
    expect(pharmacyLocationTextBox.props.children).toEqual(formattedAddress);
    expect(appointmentReceiptItems).toHaveLength(24);
    expect(appointmentReceiptItem1Header.props.children).toEqual(
      AppointmentReceiptContent.orderNumber
    );
    expect(appointmentReceiptItem1Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem1Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem1Value.props.children).toEqual(
      appointmentReceiptProps.appointment.orderNumber
    );
    expect(appointmentReceiptItem1Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem2Header.props.children).toEqual(
      AppointmentReceiptContent.nameOfPatient
    );
    expect(appointmentReceiptItem2Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem2Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem2Value.props.children).toEqual(
      appointmentReceiptProps.patientName
    );
    expect(appointmentReceiptItem2Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem3Header.props.children).toEqual(
      AppointmentReceiptContent.dateOfBirth
    );
    expect(appointmentReceiptItem3Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem3Value.type).toBe(BaseText);
    expect(appointmentReceiptItem3Value.props.children).toEqual(
      appointmentReceiptProps.appointment.customerDateOfBirth
    );
    expect(appointmentReceiptItem3Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem4Header.props.children).toEqual(
      AppointmentReceiptContent.dateOfService
    );
    expect(appointmentReceiptItem4Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem4Value.type).toBe(BaseText);
    expect(appointmentReceiptItem4Value.props.children).toEqual(
      appointmentReceiptProps.appointment.date
    );
    expect(appointmentReceiptItem4Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem5Header.props.children).toEqual(
      AppointmentReceiptContent.placeOfService
    );
    expect(appointmentReceiptItem5Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem5Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem5Value.props.children).toEqual(
      formattedAddress
    );
    expect(appointmentReceiptItem5Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem6Header.props.children).toEqual(
      AppointmentReceiptContent.providersTaxId
    );
    expect(appointmentReceiptItem6Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem6Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem6Value.props.children).toEqual(
      appointmentReceiptProps.appointment.providerTaxId
    );
    expect(appointmentReceiptItem6Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem7Header.props.children).toEqual(
      AppointmentReceiptContent.descriptionOfService
    );
    expect(appointmentReceiptItem7Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem7Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem7Value.props.children).toEqual(
      appointmentReceiptProps.appointment.serviceDescription
    );
    expect(appointmentReceiptItem7Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem8Header.props.children).toEqual(
      AppointmentReceiptContent.procedureCode
    );
    expect(appointmentReceiptItem8Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem8Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem8Value.props.children).toEqual(
      appointmentReceiptProps.appointment.procedureCode
    );
    expect(appointmentReceiptItem8Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem10Header.props.children).toEqual(
      AppointmentReceiptContent.diagnosisCode
    );
    expect(appointmentReceiptItem10Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem10Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem10Value.props.children).toEqual(
      appointmentReceiptProps.appointment.diagnosticCode
    );
    expect(appointmentReceiptItem10Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem11Header.props.children).toEqual(
      AppointmentReceiptContent.providersLegalName
    );
    expect(appointmentReceiptItem11Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem11Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem11Value.props.children).toEqual(
      appointmentReceiptProps.appointment.providerLegalName
    );
    expect(appointmentReceiptItem11Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem12Header.props.children).toEqual(
      AppointmentReceiptContent.providersNpi
    );
    expect(appointmentReceiptItem12Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem12Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem12Value.props.children).toEqual(
      appointmentReceiptProps.appointment.providerNpi
    );
    expect(appointmentReceiptItem12Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptItem9Header.props.children).toEqual(
      AppointmentReceiptContent.testCostToPharmacy
    );
    expect(appointmentReceiptItem9Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemHeader
    );
    expect(appointmentReceiptItem9Value.type).toBe(ProtectedBaseText);
    expect(appointmentReceiptItem9Value.props.children).toEqual(
      MoneyFormatter.format(appointmentReceiptProps.appointment.contractFee)
    );
    expect(appointmentReceiptItem9Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptItemValue
    );

    expect(appointmentReceiptChargesItem1Header.props.children).toEqual(
      AppointmentReceiptContent.chargeForService
    );
    expect(appointmentReceiptChargesItem1Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptChargesItemHeader
    );
    expect(appointmentReceiptChargesItem1Value.props.children).toEqual(
      `$` + appointmentReceiptProps.appointment.totalCost
    );
    expect(appointmentReceiptChargesItem1Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptChargesItemValue
    );

    expect(appointmentReceiptTotalsItem1Header.props.children).toEqual(
      AppointmentReceiptContent.total
    );
    expect(appointmentReceiptTotalsItem1Header.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptTotalsItemHeader
    );
    expect(appointmentReceiptTotalsItem1Value.props.children).toEqual(
      `$` + appointmentReceiptProps.appointment.totalCost
    );
    expect(appointmentReceiptTotalsItem1Value.props.style).toEqual(
      appointmentReceiptStyles.appointmentReceiptTotalsItemValue
    );
  });

  it('renders correctly with Paid payment status', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusPaid
    );
  });
  it('renders correctly with no payment required', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptNoPaymentRequiredProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusNotRequired
    );
  });
  it('renders correctly with refunded payment', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptRefundedProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusRefunded
    );
  });
  it('renders correctly with cancelled appointment', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptCancelledProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual('');
  });
  it('renders correctly with requested appointment', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptRequestedProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual('');
  });
  it('renders correctly with completed appointment', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptCompletedProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });
    const paymentStatusValue = paymentStatusContainer[0].props.children[1];
    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusNotRequired
    );
  });

  it('renders view pdf button for completed appointment', () => {
    const appointmentReceiptCompletedPropsWithPdf = {
      ...appointmentReceiptCompletedProps,
      appointment: {
        ...appointmentReceiptCompletedProps.appointment,
        pdfBase64: 'base64-string',
      },
    };
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptCompletedPropsWithPdf} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });

    const appointmentReceiptContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptContainerStyle,
    });

    const paymentStatusValue = paymentStatusContainer[0].props.children[1];

    const receiptPdfButtonContainer = appointmentReceiptContainer[0].props
      .children as ReactTestInstance[];

    const receiptPdfButton =
      receiptPdfButtonContainer[0].props.children.props.children;

    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusNotRequired
    );
    expect(receiptPdfButton.type).toEqual(ToolButton);
    expect(receiptPdfButton.props.iconTextStyle).toEqual(
      appointmentReceiptStyles.toolButtonTextStyle
    );
    expect(receiptPdfButton.props.iconName).toEqual('file-export');
    expect(receiptPdfButton.props.onPress).toEqual(expect.any(Function));
    expect(receiptPdfButton.props.style).toEqual(
      appointmentReceiptStyles.toolButtonViewStyle
    );
  });

  it.todo('handles receipt button pdf click');

  it('base64StringToBlob and goToUrl should be called when View PDF button is pressed', () => {
    const appointmentReceiptCompletedPropsWithPdf = {
      ...appointmentReceiptCompletedProps,
      appointment: {
        ...appointmentReceiptCompletedProps.appointment,
        pdfBase64: 'base64-string',
      },
    };
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptCompletedPropsWithPdf} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });

    const appointmentReceiptContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptContainerStyle,
    });

    const paymentStatusValue = paymentStatusContainer[0].props.children[1];

    const receiptPdfButtonContainer = appointmentReceiptContainer[0].props
      .children as ReactTestInstance[];

    const receiptPdfButton =
      receiptPdfButtonContainer[0].props.children.props.children;

    const receiptPdfButtonProps = receiptPdfButton.props;

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(
        () => 'blob:http://test-url.test/a53db373-4bbc-4e53-9496-b1bbb3e873d5'
      ),
    });

    receiptPdfButtonProps.onPress();

    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusNotRequired
    );
    expect(receiptPdfButton.type).toEqual(ToolButton);

    expect(base64StringToBlobMock).toHaveBeenCalled();
    expect(goToUrlMock).toHaveBeenCalled();
  });

  it('do not render view pdf button for not completed appointment', () => {
    const appointmentReceipt = renderer.create(
      <AppointmentReceipt {...appointmentReceiptCompletedProps} />
    );
    const paymentStatusContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptStatusItemView,
    });

    const appointmentReceiptContainer = appointmentReceipt.root.findAllByProps({
      style: appointmentReceiptStyles.appointmentReceiptContainerStyle,
    });

    const paymentStatusValue = paymentStatusContainer[0].props.children[1];

    const receiptPdfButtonContainer = appointmentReceiptContainer[0].props
      .children as ReactTestInstance[];

    const receiptPdfButton = receiptPdfButtonContainer[0].props.children;

    expect(paymentStatusValue.props.children).toEqual(
      AppointmentReceiptContent.statusNotRequired
    );
    expect(receiptPdfButton).toBe(null);
  });
});
