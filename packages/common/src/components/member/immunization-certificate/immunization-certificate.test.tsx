// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import {
  IImmunizationCertificateProps,
  ImmunizationCertificate,
} from './immunization-certificate';
import { ImmunizationCertificateContent } from './immunization-certificate.content';
import { immunizationCertificateStyles } from './immunization-certificate.styles';

const record1 = {
  immunizationId: 'immunization_id',
  orderNumber: 'order_number',
  lotNumber: `123456789`,
  manufacturer: `Moderna A`,
  doseNumber: 1,
  date: '01/01/2021',
  locationName: 'Lurgan Hospital',
  city: 'Lurgan',
  state: 'TX',
  zip: `12345`,
  memberId: 'member_id',
  vaccineCode: 'vaccine_code',
  serviceDescription: 'service-description',
};

const record2 = {
  immunizationId: 'immunization_id',
  orderNumber: 'order_number',
  lotNumber: `101112131415`,
  manufacturer: `Moderna B`,
  doseNumber: 2,
  date: '21/01/2021',
  locationName: 'Craigavon Hospital',
  city: 'Craigavon',
  state: 'TX',
  zip: `78910`,
  memberId: 'member_id',
  vaccineCode: 'vaccine_code',
  serviceDescription: 'service-description',
};

const mockData = [record2, record1];

const immunizationCertificateProps: IImmunizationCertificateProps = {
  immunizationRecords: mockData,
};

describe('ImmunizationCertificate', () => {
  it('renders correctly with defaults', () => {
    const immunizationCertificate = renderer.create(
      <ImmunizationCertificate {...immunizationCertificateProps} />
    );

    const containerView = immunizationCertificate.root
      .children[0] as ReactTestInstance;
    const titleView = containerView.props.children[0];
    const detailsContainer = containerView.props.children[1];
    const recordDetailsContainer = detailsContainer.props.children[0];
    const recordDetailsView = recordDetailsContainer.props.children;

    const placeOfService = `${immunizationCertificateProps.immunizationRecords[0].locationName} - ${immunizationCertificateProps.immunizationRecords[0].city}, ${immunizationCertificateProps.immunizationRecords[0].state} ${immunizationCertificateProps.immunizationRecords[0].zip}`;

    const title = titleView.props.children;
    expect(title.type).toEqual(ProtectedBaseText);
    expect(title.props.children).toEqual(mockData[0].serviceDescription);
    expect(title.props.style).toEqual(
      immunizationCertificateStyles.certificateTitleTextStyle
    );

    expect(detailsContainer.props.style).toEqual(
      immunizationCertificateStyles.certificateDetailsContainerViewStyle
    );

    expect(recordDetailsContainer.props.style).toEqual(
      immunizationCertificateStyles.recordDetailsContainerViewStyle
    );

    expect(recordDetailsView.props.style).toEqual(
      immunizationCertificateStyles.recordDetailsViewStyle
    );

    const recordItems = immunizationCertificate.root.findAllByProps({
      style: immunizationCertificateStyles.recordItemViewStyle,
    });

    const recordItem1Header = recordItems[0].props.children[0];
    const recordItem1Value = recordItems[0].props.children[1];
    const recordItem2Header = recordItems[2].props.children[0];
    const recordItem2Value = recordItems[2].props.children[1];
    const recordItem3Value = recordItems[4].props.children[1];
    const recordItem4Value = recordItems[6].props.children[1];

    expect(recordItem1Header.type).toEqual(TranslatableBaseText);
    expect(recordItem1Header.props.style).toEqual(
      immunizationCertificateStyles.recordItemHeaderTextStyle
    );
    expect(recordItem1Value.props.children).toEqual(
      immunizationCertificateProps.immunizationRecords[0].manufacturer
    );
    expect(recordItem1Value.props.style).toEqual(
      immunizationCertificateStyles.recordItemValueTextStyle
    );
    expect(recordItem2Header.props.children).toEqual(
      ImmunizationCertificateContent.date
    );

    expect(recordItem2Value.type).toEqual(TranslatableBaseText);
    expect(recordItem2Value.props.children).toEqual(
      immunizationCertificateProps.immunizationRecords[0].date
    );

    expect(recordItem3Value.type).toEqual(ProtectedBaseText);
    expect(recordItem3Value.props.children).toEqual(placeOfService);

    expect(recordItem4Value.type).toEqual(ProtectedBaseText);
    expect(recordItem4Value.props.children).toEqual(
      immunizationCertificateProps.immunizationRecords[0].lotNumber
    );
  });
});
