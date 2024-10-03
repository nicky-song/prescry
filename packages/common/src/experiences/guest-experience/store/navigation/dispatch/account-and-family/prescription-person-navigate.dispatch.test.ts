// Copyright 2022 Prescryptive Health, Inc.

import { Workflow } from '../../../../../../models/workflow';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IPrescriptionPersonScreenRouteProps } from '../../../../screens/prescription-person/prescription-person.screen';
import { prescriptionPersonNavigateDispatch } from './prescription-person-navigate.dispatch';

const workflowMock: Workflow = 'prescriptionInvite';

describe('prescriptionPersonNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('navigates to prescription person screen with expected route params', () => {
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();

    const prescriptionIdMock = 'prescription-id-mock';
    const userExistsMock = true;

    prescriptionPersonNavigateDispatch(
      rootStackNavigationMock,
      prescriptionIdMock,
      userExistsMock
    );

    const expectedRouteParams: IPrescriptionPersonScreenRouteProps = {
      workflow: workflowMock,
      prescriptionId: prescriptionIdMock,
      userExists: userExistsMock,
    };

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AccountAndFamilyStack',
      {
        screen: 'PrescriptionPerson',
        params: expectedRouteParams,
      }
    );
  });
});
