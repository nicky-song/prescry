// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { IImmunizationRecord } from '../../../models/api-response/immunization-record-response';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { ImmunizationCertificateContent } from './immunization-certificate.content';
import { immunizationCertificateStyles } from './immunization-certificate.styles';

export interface IImmunizationCertificateProps {
  immunizationRecords: IImmunizationRecord[];
}

export const ImmunizationCertificate = (
  props: IImmunizationCertificateProps
) => {
  const immunizationRecords = props.immunizationRecords;

  function renderCertificate(): ReactNode {
    return (
      <View style={immunizationCertificateStyles.certificateContainerViewStyle}>
        {renderTitle()}
        <View
          style={
            immunizationCertificateStyles.certificateDetailsContainerViewStyle
          }
        >
          {renderRecords()}
        </View>
      </View>
    );
  }

  function renderRecords(): ReactNode {
    return immunizationRecords
      .sort((a, b) => a.doseNumber - b.doseNumber)
      .map((record, index) => renderRecordItems(record, index));
  }

  function renderTitle(): ReactNode {
    return (
      <View style={immunizationCertificateStyles.certificateTitleViewStyle}>
        <ProtectedBaseText
          style={immunizationCertificateStyles.certificateTitleTextStyle}
        >
          {props.immunizationRecords[0].serviceDescription}
        </ProtectedBaseText>
      </View>
    );
  }

  function renderRecordItems(
    record: IImmunizationRecord,
    recordIndex: number
  ): ReactNode {
    const placeOfService = `${record.locationName} - ${record.city}, ${record.state} ${record.zip}`;
    const recordDetailsRowList = [
      {
        rowName:
          stringifyNumber(record.doseNumber) +
          ' ' +
          ImmunizationCertificateContent.dose,
        rowValue: record.manufacturer,
        translateContent: false,
      },
      {
        rowName: ImmunizationCertificateContent.date,
        rowValue: record.date,
        translateContent: true,
      },
      {
        rowName: ImmunizationCertificateContent.placeOfService,
        rowValue: placeOfService,
        translateContent: false,
      },
      {
        rowName: ImmunizationCertificateContent.lotNumber,
        rowValue: record.lotNumber,
        translateContent: false,
      },
    ];

    const renderRowItems = () => {
      return recordDetailsRowList.map((recordItemDetail, index) => {
        return recordItemDetail.rowValue ? (
          <View
            style={immunizationCertificateStyles.recordItemViewStyle}
            key={index}
          >
            <TranslatableBaseText
              style={immunizationCertificateStyles.recordItemHeaderTextStyle}
            >
              {recordItemDetail.rowName}
            </TranslatableBaseText>
            {recordItemDetail.translateContent ? (
              <TranslatableBaseText
                style={immunizationCertificateStyles.recordItemValueTextStyle}
              >
                {recordItemDetail.rowValue}
              </TranslatableBaseText>
            ) : (
              <ProtectedBaseText
                style={immunizationCertificateStyles.recordItemValueTextStyle}
              >
                {recordItemDetail.rowValue}
              </ProtectedBaseText>
            )}
          </View>
        ) : null;
      });
    };

    return (
      <View
        style={immunizationCertificateStyles.recordDetailsContainerViewStyle}
        key={recordIndex}
      >
        <View style={immunizationCertificateStyles.recordDetailsViewStyle}>
          {renderRowItems()}
        </View>
      </View>
    );
  }

  function stringifyNumber(num: number) {
    switch (num) {
      case 1:
        return ImmunizationCertificateContent.first;
      case 2:
        return ImmunizationCertificateContent.second;
      case 3:
        return ImmunizationCertificateContent.third;
      case 4:
        return ImmunizationCertificateContent.fourth;
      case 5:
        return ImmunizationCertificateContent.fifth;
      default:
        return num;
    }
  }

  return <>{renderCertificate()}</>;
};
