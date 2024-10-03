// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { contactInfoContainerContent } from './contact-info-container.content';
import { ContactInfoHeader } from '../contact-info-header/contact-info-header';
import { ContactInfoRow } from '../contact-info-row/contact-info-row';
import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../models/member-profile/member-profile-info';
import { RootStackNavigationProp } from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { editMemberProfileScreenDispatch } from '../../../experiences/guest-experience/store/edit-member-profile/dispatch/edit-member-profile-screen.dispatch';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { contactInfoContainerStyles } from './contact-info-container.styles';

export interface IContactInfoContainerProps {
  memberInfo: IPrimaryProfile | IDependentProfile;
  isAdult?: boolean;
  secondaryUser?: IDependentProfile;
}

export const ContactInfoContainer = ({
  memberInfo,
  isAdult,
  secondaryUser,
}: IContactInfoContainerProps): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { dispatch: reduxDispatch } = useReduxContext();

  const getEmailId = (email: string | undefined, isAdult?: boolean) => {
    if (email) {
      return email;
    }

    return isAdult ? '' : contactInfoContainerContent.sameAsPrimary;
  };

  const handleEditContactInfo = () => {
    editMemberProfileScreenDispatch(
      reduxDispatch,
      navigation,
      memberInfo,
      isAdult,
      secondaryUser
    );
  };

  const contactInfoRowList = [
    {
      rowName: contactInfoContainerContent.memberRxIDText,
      rowValue:
        memberInfo.primaryMemberFamilyId ?? memberInfo.primaryMemberRxId,
    },
    {
      rowName: contactInfoContainerContent.emailIdText,
      rowValue: getEmailId(memberInfo.email, isAdult),
    },
    {
      rowName: contactInfoContainerContent.mobileNumberText,
      rowValue: memberInfo.phoneNumber
        ? formatPhoneNumber(memberInfo.phoneNumber)
        : contactInfoContainerContent.sameAsPrimary,
    },
  ];

  const renderRowItems = () => {
    if (secondaryUser) {
      contactInfoRowList.push({
        rowName: contactInfoContainerContent.secondaryLabelText,
        rowValue: MemberNameFormatter.formatName(
          secondaryUser.firstName,
          secondaryUser.lastName
        ),
      });
    }

    return contactInfoRowList.map((contactInfoRow) => {
      const { rowName, rowValue } = contactInfoRow;

      if (rowName === contactInfoContainerContent.emailIdText) {
        return null;
      }

      return <ContactInfoRow key={rowName} name={rowName} value={rowValue} />;
    });
  };

  return (
    <View
      style={contactInfoContainerStyles.viewStyle}
      testID='ContactInfoContainer'
    >
      <ContactInfoHeader
        name={MemberNameFormatter.formatName(
          memberInfo.firstName,
          memberInfo.lastName
        )}
        isPrimary={!!memberInfo.isPrimary}
        navigateToEditMemberProfileScreen={handleEditContactInfo}
      />
      {renderRowItems()}
    </View>
  );
};
