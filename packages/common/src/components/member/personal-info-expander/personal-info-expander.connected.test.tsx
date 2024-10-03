// Copyright 2020 Prescryptive Health, Inc.

import { IPersonalInfoExpanderDataProps } from './personal-info-expander';
import { mapStateToProps } from './personal-info-expander.connected';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';

describe('PersonalInfoExpanderConnected', () => {
  it('maps state', () => {
    const mockState = ({
      memberListInfo: {
        loggedInMember: {
          carrierPCN: 'PH',
          dateOfBirth: '2000-01-01',
          firstName: 'fake firstName',
          issuerNumber: '00007',
          lastName: 'fake lastName',
          primaryMemberFamilyId: 'TY-99999999',
          primaryMemberPersonCode: '99',
          primaryMemberRxId: 'TY-9999999999',
          rxBin: '001',
          rxGroup: '007',
        },
      },
      testResult: {
        memberDateOfBirth: '2005-01-01',
        memberFirstName: 'fakePatient firstName',
        memberLastName: 'fakePatient lastName',
      },
    } as unknown) as RootState;

    const ownProps: Partial<IPersonalInfoExpanderDataProps> = {
      viewStyle: { width: 1 },
    };

    const expectedProps: IPersonalInfoExpanderDataProps = {
      ...ownProps,
      PersonalInfoExpanderData: {
        dateOfBirth: '2005-01-01',
        name: MemberNameFormatter.formatName(
          mockState.testResult.memberFirstName,
          mockState.testResult.memberLastName
        ),
      },
    };

    const mappedProps: IPersonalInfoExpanderDataProps = mapStateToProps(
      mockState,
      ownProps
    );

    expect(mappedProps).toEqual(expectedProps);
  });
});
