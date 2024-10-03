// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode, useState } from 'react';
import { StyleProp, View, ViewStyle, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IAppointmentItem } from '../../../models/api-response/appointment.response';
import { PrimaryColor } from '../../../theming/colors';
import { formatAddress } from '../../../utils/formatters/address.formatter';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { goToUrl } from '../../../utils/link.helper';
import { base64StringToBlob } from '../../../utils/test-results/test-results.helper';
import { ToolButton } from '../../buttons/tool.button/tool.button';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { AppointmentReceiptContent } from './appointment-receipt.content';
import { appointmentReceiptStyles } from './appointment-receipt.styles';

export interface IAppointmentReceiptProps {
  viewStyle?: StyleProp<ViewStyle>;
  patientName: string;
  appointment: IAppointmentItem;
  isExpanded?: boolean;
}

export interface IAppointmentReceiptExpanderState {
  showAppointmentReceipt?: boolean;
}

export const AppointmentReceipt = (
  props: IAppointmentReceiptProps
): ReactElement => {
  const { isExpanded, patientName, appointment } = props;

  const styles = appointmentReceiptStyles;

  const [showAppointmentReceipt, setShow] = useState<boolean>(
    isExpanded ?? true
  );
  const [showSpinner, setShowSpinner] = useState(false);
  const toggleExpand = () => setShow(!showAppointmentReceipt);

  const { address1, address2, city, locationName, state, zip } = appointment;

  const formattedAddress = formatAddress({
    address1,
    address2,
    city,
    state,
    zip,
  });

  const onPressViewPdf = async () => {
    setShowSpinner(true);
    const receiptPdf = props.appointment.pdfBase64;
    if (receiptPdf) {
      const blob = base64StringToBlob(receiptPdf);

      const url = URL.createObjectURL(blob).toString();

      if (url) {
        await goToUrl(url);
      }
      setShowSpinner(false);
    }
  };

  const formattedCost = (fieldName: string | number) =>
    MoneyFormatter.format(Number(fieldName));

  const spinner = showSpinner ? (
    <ActivityIndicator
      size='large'
      color={PrimaryColor.prescryptivePurple}
      style={appointmentReceiptStyles.spinnerViewStyle}
    />
  ) : null;

  const renderViewReceiptPdfButton =
    props.appointment && props.appointment.pdfBase64 ? (
      showSpinner ? (
        spinner
      ) : (
        <>
          <ToolButton
            iconTextStyle={appointmentReceiptStyles.toolButtonTextStyle}
            iconName='file-export'
            onPress={onPressViewPdf}
            style={appointmentReceiptStyles.toolButtonViewStyle}
          >
            {AppointmentReceiptContent.viewPDF}
          </ToolButton>
        </>
      )
    ) : null;

  function getPaymentStatus(): string {
    if (appointment.paymentStatus === 'paid') {
      return AppointmentReceiptContent.statusPaid;
    } else if (appointment.paymentStatus === 'no_payment_required') {
      return AppointmentReceiptContent.statusNotRequired;
    } else if (appointment.paymentStatus === 'refunded') {
      return AppointmentReceiptContent.statusRefunded;
    }
    return '';
  }

  return (
    <>
      {renderExpander()}
      {renderReceipt()}
    </>
  );

  function renderExpander(): ReactNode {
    return (
      <View
        style={styles.appointmentReceiptExpanderViewStyle}
        testID='appointmentReceiptExpander'
      >
        <View testID='appointmentReceiptHeader'>
          <BaseText style={styles.appointmentReceiptHeaderTextStyle}>
            {AppointmentReceiptContent.headerText}
          </BaseText>
        </View>
        <TouchableOpacity
          style={styles.appointmentReceiptIconContainerStyle}
          onPress={toggleExpand}
        >
          <FontAwesomeIcon
            style={styles.appointmentReceiptIconStyle}
            solid={true}
            name={showAppointmentReceipt ? 'chevron-up' : 'chevron-down'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderReceipt(): ReactNode {
    if (showAppointmentReceipt)
      return (
        <View
          style={styles.appointmentReceiptContainerStyle}
          testID='appointmentReceiptContainer'
        >
          <View>{renderViewReceiptPdfButton}</View>
          <View style={styles.appointmentReceiptViewStyle}>
            {renderPharmacyDetails()}
            <View style={styles.appointmentReceiptDetailsContainerView}>
              {renderReceiptItems()}
              {renderCost()}
              {renderPaymentStatus()}
            </View>
          </View>
        </View>
      );
    return;
  }

  function renderPharmacyDetails(): ReactNode {
    return (
      <ProtectedView
        style={styles.appointmentReceiptPharmacyDetailsViewStyle}
        testID='appointmentReceiptPharmacyDetails'
      >
        <BaseText style={styles.appointmentReceiptPharmacyNameTextStyle}>
          {locationName}
        </BaseText>
        <BaseText style={styles.appointmentReceiptPharmacyAddressTextStyle}>
          {formattedAddress}
        </BaseText>
      </ProtectedView>
    );
  }

  function renderReceiptItems(): ReactNode {
    const receiptDetailsRowList = [
      {
        rowName: AppointmentReceiptContent.orderNumber,
        rowValue: appointment.orderNumber,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.nameOfPatient,
        rowValue: patientName,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.dateOfBirth,
        rowValue: appointment.customerDateOfBirth,
        translateContent: true,
      },
      {
        rowName: AppointmentReceiptContent.dateOfService,
        rowValue: appointment.date,
        translateContent: true,
      },
      {
        rowName: AppointmentReceiptContent.placeOfService,
        rowValue: formattedAddress,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.providersTaxId,
        rowValue: appointment.providerTaxId,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.descriptionOfService,
        rowValue: appointment.serviceDescription,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.procedureCode,
        rowValue: appointment.procedureCode,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.testCostToPharmacy,
        rowValue: appointment.contractFee
          ? formattedCost(appointment.contractFee)
          : appointment.contractFee,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.diagnosisCode,
        rowValue: appointment.diagnosticCode,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.providersLegalName,
        rowValue: appointment.providerLegalName,
        translateContent: false,
      },
      {
        rowName: AppointmentReceiptContent.providersNpi,
        rowValue: appointment.providerNpi,
        translateContent: false,
      },
    ];

    const renderRowItems = () => {
      return receiptDetailsRowList.map((receiptItemDetail, index) => {
        return receiptItemDetail.rowValue ? (
          <View
            style={styles.appointmentReceiptItemView}
            key={index}
            testID={receiptItemDetail.rowName}
          >
            <BaseText style={styles.appointmentReceiptItemHeader}>
              {receiptItemDetail.rowName}
            </BaseText>
            { 
              receiptItemDetail.translateContent
                ? (
                  <BaseText style={styles.appointmentReceiptItemValue}>
                    {receiptItemDetail.rowValue}
                  </BaseText>
                )
                : (
                  <ProtectedBaseText style={styles.appointmentReceiptItemValue}>
                    {receiptItemDetail.rowValue}
                  </ProtectedBaseText>
                )
            }
          </View>
        ) : null;
      });
    };

    return (
      <View
        style={styles.appointmentReceiptDetailsView}
        testID='appointmentReceiptDetails'
      >
        {renderRowItems()}
      </View>
    );
  }

  function renderChargesItems(): ReactNode {
    const receiptChargesRowList = [
      {
        rowName: AppointmentReceiptContent.chargeForService,
        rowValue: formattedCost(appointment.totalCost || '0'),
      },
    ];

    const renderRowItems = () => {
      return receiptChargesRowList.map((chargeItemDetail, index) => {
        return (
          <View
            style={styles.appointmentReceiptChargesItemView}
            key={index}
            testID='appointmentReceiptCharges'
          >
            <BaseText style={styles.appointmentReceiptChargesItemHeader}>
              {chargeItemDetail.rowName}
            </BaseText>
            <BaseText style={styles.appointmentReceiptChargesItemValue}>
              {chargeItemDetail.rowValue}
            </BaseText>
          </View>
        );
      });
    };

    return (
      <View
        style={styles.appointmentReceiptChargesContainerView}
        testID='appointmentReceiptChargesContainer'
      >
        {renderRowItems()}
      </View>
    );
  }

  function renderTotal(): ReactNode {
    const receiptTotalsRowList = [
      {
        rowName: AppointmentReceiptContent.total,
        rowValue: formattedCost(appointment.totalCost || '0'),
      },
    ];

    const renderRowItems = () => {
      return receiptTotalsRowList.map((totalItemDetail, index) => {
        return (
          <View
            style={styles.appointmentReceiptTotalsItemView}
            key={index}
            testID='appointmentReceiptTotals'
          >
            <BaseText style={styles.appointmentReceiptTotalsItemHeader}>
              {totalItemDetail.rowName}
            </BaseText>
            <BaseText style={styles.appointmentReceiptTotalsItemValue}>
              {totalItemDetail.rowValue}
            </BaseText>
          </View>
        );
      });
    };

    return (
      <View
        style={styles.appointmentReceiptChargesContainerView}
        testID='appointmentReceiptChargesContainer'
      >
        {renderRowItems()}
      </View>
    );
  }

  function renderCost(): ReactNode {
    return (
      <View
        style={styles.appointmentReceiptCostContainerView}
        testID='appointmentReceiptCost'
      >
        {renderChargesItems()}
        {renderTotal()}
      </View>
    );
  }

  function renderPaymentStatus(): ReactNode {
    const paymentStatusRowList = [
      {
        rowName: AppointmentReceiptContent.paymentStatus,
        rowValue: getPaymentStatus(),
      },
    ];

    const renderRowItems = () => {
      return paymentStatusRowList.map((statusItemDetail, index) => {
        return (
          <View
            style={styles.appointmentReceiptStatusItemView}
            key={index}
            testID='appointmentReceiptStatus-${index}'
          >
            <BaseText style={styles.appointmentReceiptStatusItemHeader}>
              {statusItemDetail.rowName}
            </BaseText>
            <BaseText style={styles.appointmentReceiptStatusItemValue}>
              {statusItemDetail.rowValue}
            </BaseText>
          </View>
        );
      });
    };

    return (
      <View
        style={styles.appointmentReceiptStatusContainerView}
        testID='appointmentReceiptStatusContainer'
      >
        {renderRowItems()}
      </View>
    );
  }
};
