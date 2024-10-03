// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  IDependentProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { ContactInfoHeader } from '../contact-info-header/contact-info-header';
import { ContactInfoRow } from '../contact-info-row/contact-info-row';
import { contactInfoContainerContent } from './contact-info-container.content';
import {
  ContactInfoContainer,
  IContactInfoContainerProps,
} from './contact-info-container';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../experiences/guest-experience/context-providers/redux/redux.context';
import { editMemberProfileScreenDispatch } from '../../../experiences/guest-experience/store/edit-member-profile/dispatch/edit-member-profile-screen.dispatch';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { View } from 'react-native';
import { contactInfoContainerStyles } from './contact-info-container.styles';
import { getChildren } from '../../../testing/test.helper';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../contact-info-header/contact-info-header', () => ({
  ContactInfoHeader: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/store/edit-member-profile/dispatch/edit-member-profile-screen.dispatch'
);
const editMemberProfileScreenDispatchMock =
  editMemberProfileScreenDispatch as jest.Mock;

jest.mock('../contact-info-row/contact-info-row', () => ({
  ContactInfoRow: () => <div />,
}));

const memberPhoneNumberMock = '+11425999999';
const contactInfoContainerProps: IContactInfoContainerProps = {
  isAdult: true,
  memberInfo: {
    email: 'thomas.young@gmail.com',
    firstName: 'Thomas',
    identifier: 'identifier',
    isPrimary: true,
    lastName: 'Young',
    phoneNumber: memberPhoneNumberMock,
    primaryMemberFamilyId: 'TY-99999999',
    primaryMemberPersonCode: '99',
    primaryMemberRxId: 'TY-9999999999',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxSubGroup: 'CASH01',
    dateOfBirth: '2000-01-01',
  },
};

describe('ContactInfoContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
  });

  it('renders in View container', () => {
    const testRenderer = renderer.create(
      <ContactInfoContainer {...contactInfoContainerProps} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('ContactInfoContainer');
    expect(container.props.style).toEqual(contactInfoContainerStyles.viewStyle);
  });

  it('renders correctly with props', () => {
    const testRenderer = renderer.create(
      <ContactInfoContainer {...contactInfoContainerProps} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'ContactInfoContainer',
    });

    const infoHeader = getChildren(container)[0];
    expect(infoHeader.type).toEqual(ContactInfoHeader);
    expect(infoHeader.props.name).toEqual(
      MemberNameFormatter.formatName(
        contactInfoContainerProps.memberInfo.firstName,
        contactInfoContainerProps.memberInfo.lastName
      )
    );
    expect(infoHeader.props.isPrimary).toEqual(
      contactInfoContainerProps.memberInfo.isPrimary
    );
    expect(infoHeader.props.navigateToEditMemberProfileScreen).toEqual(
      expect.any(Function)
    );

    const infoRows = testRenderer.root.findAllByType(ContactInfoRow);
    expect(infoRows.length).toEqual(2);

    expect(infoRows[0].props.value).toBe(
      contactInfoContainerProps.memberInfo.primaryMemberFamilyId
    );
    expect(infoRows[1].props.value).toBe(
      formatPhoneNumber(memberPhoneNumberMock)
    );
  });

  it('handles edit button press', () => {
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const container = renderer.create(
      <ContactInfoContainer {...contactInfoContainerProps} />
    );

    const infoHeader = container.root.findByType(ContactInfoHeader);
    infoHeader.props.navigateToEditMemberProfileScreen();

    expect(editMemberProfileScreenDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      rootStackNavigationMock,
      contactInfoContainerProps.memberInfo,
      contactInfoContainerProps.isAdult,
      contactInfoContainerProps.secondaryUser
    );
  });

  it('should send email and phone number as `Same as primary` if emailid and phone number is not defined for child member', () => {
    const childMemberProps: IContactInfoContainerProps = {
      isAdult: false,
      memberInfo: {
        ...contactInfoContainerProps.memberInfo,
        email: '',
        phoneNumber: '',
      },
    };

    const container = renderer.create(
      <ContactInfoContainer {...childMemberProps} />
    );

    const infoRows = container.root.findAllByType(ContactInfoRow);
    expect(infoRows.length).toEqual(2);
    expect(infoRows[0].props.value).toBe(
      childMemberProps.memberInfo.primaryMemberFamilyId
    );
    expect(infoRows[1].props.value).toBe(
      contactInfoContainerContent.sameAsPrimary
    );
  });

  it('should should email as null if emailid is not defined for primary member', () => {
    const adultMemberProps: IContactInfoContainerProps = {
      isAdult: true,
      memberInfo: {
        firstName: 'Thomas',
        identifier: 'identifier',
        isPrimary: true,
        lastName: 'Young',
        phoneNumber: memberPhoneNumberMock,
        primaryMemberFamilyId: 'TY-99999999',
        primaryMemberPersonCode: '99',
        primaryMemberRxId: 'TY-9999999999',
        rxGroupType: RxGroupTypesEnum.SIE,
        rxSubGroup: 'CASH01',
        dateOfBirth: '2000-01-01',
      },
    };
    const container = renderer.create(
      <ContactInfoContainer {...adultMemberProps} />
    );

    const infoRows = container.root.findAllByType(ContactInfoRow);

    expect(infoRows.length).toEqual(2);
    expect(infoRows[0].props.value).toBe(
      adultMemberProps.memberInfo.primaryMemberFamilyId
    );
    expect(infoRows[1].props.value).toEqual(
      formatPhoneNumber(memberPhoneNumberMock)
    );
  });

  it('should not render email if email edit flag is not enabled', () => {
    const adultMemberProps: IContactInfoContainerProps = {
      isAdult: true,
      memberInfo: {
        firstName: 'Thomas',
        identifier: 'identifier',
        email: 'thomas.young@gmail.com',
        isPrimary: true,
        lastName: 'Young',
        phoneNumber: memberPhoneNumberMock,
        primaryMemberFamilyId: 'TY-99999999',
        primaryMemberPersonCode: '99',
        primaryMemberRxId: 'TY-9999999999',
        rxGroupType: RxGroupTypesEnum.SIE,
        rxSubGroup: 'CASH01',
        dateOfBirth: '2000-01-01',
      },
    };
    const container = renderer.create(
      <ContactInfoContainer {...adultMemberProps} />
    );

    const infoRows = container.root.findAllByType(ContactInfoRow);
    expect(infoRows.length).toEqual(2);
    expect(infoRows[0].props.value).toBe(
      adultMemberProps.memberInfo.primaryMemberFamilyId
    );
    expect(infoRows[1].props.value).toEqual(
      formatPhoneNumber(memberPhoneNumberMock)
    );
  });

  it('should render secondary field if secondaryUserName is provided in the props', () => {
    const secondaryUser: IDependentProfile = {
      firstName: 'Secondary',
      identifier: '1',
      lastName: 'Username',
      rxGroupType: RxGroupTypesEnum.SIE,
      rxSubGroup: 'CASH01',
      isPrimary: false,
    };
    const container = renderer.create(
      <ContactInfoContainer
        {...contactInfoContainerProps}
        secondaryUser={secondaryUser}
      />
    );

    const infoRows = container.root.findAllByType(ContactInfoRow);
    expect(infoRows.length).toEqual(3);

    expect(infoRows[0].props.name).toBe(
      contactInfoContainerContent.memberRxIDText
    );
    expect(infoRows[0].props.value).toBe(
      contactInfoContainerProps.memberInfo.primaryMemberFamilyId
    );
    expect(infoRows[1].props.name).toBe(
      contactInfoContainerContent.mobileNumberText
    );
    expect(infoRows[1].props.value).toEqual(
      formatPhoneNumber(memberPhoneNumberMock)
    );
    expect(infoRows[2].props.name).toBe(
      contactInfoContainerContent.secondaryLabelText
    );
    expect(infoRows[2].props.value).toEqual(
      MemberNameFormatter.formatName(
        secondaryUser.firstName,
        secondaryUser.lastName
      )
    );
  });
});
