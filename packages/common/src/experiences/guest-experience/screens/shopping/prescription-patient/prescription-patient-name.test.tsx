// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { PrescriptionPatientName } from './prescription-patient-name';
import { styles } from './prescription-patient-name.styles';

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const mockPatient = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '2000-01-01',
  phoneNumber: '+11111111111',
  recoveryEmail: 'email',
  memberId: 'member-id-mock',
  masterId: 'master-id-mock',
  rxGroupType: 'CASH',
  rxSubGroup: 'rx-sub-group',
} as ILimitedPatient;

describe('PrescriptionPatientName', () => {
  it('renders patient name', () => {
    useContentMock.mockReturnValue({
      content: { forPatient: 'For {firstName} {lastName}' },
      isContentLoading: false,
    });
    const testRenderer = renderer.create(
      <PrescriptionPatientName prescriptionPatient={mockPatient} />
    );

    const componentView = testRenderer.root.children[0] as ReactTestInstance;

    expect(componentView.type).toEqual(View);
    expect(componentView.props.style).toEqual(styles.forPatientViewStyle);
    const text = testRenderer.root.findByType(BaseText);

    expect(text.type).toEqual(BaseText);
    expect(text.props.children).toEqual(
      `For ${mockPatient.firstName} ${mockPatient.lastName}`
    );
  });
});
