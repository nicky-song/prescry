// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import { ContactInfoContainer } from '../../../components/member/contact-info-container/contact-info-container';
import {
  IDependentProfile,
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { memberListInfoScreenStyles } from './member-list-info-screen.styles';
import { memberInfoListScreenContent } from './member-list-info-screen.content';
import { MemberListInfoNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import {
  getProfilesByGroup,
  mapPatientDependents,
} from '../../../utils/profile.helper';

export const MemberListInfoScreen = (): React.ReactElement => {
  const navigation = useNavigation<MemberListInfoNavigationProp>();

  const { membershipState } = useMembershipContext();

  const { account, profileList, patientList, patientDependents } =
    membershipState;

  const sieProfile = getProfilesByGroup(
    profileList,
    RxGroupTypesEnum.SIE,
    patientList
  );
  const cashProfile = getProfilesByGroup(
    profileList,
    RxGroupTypesEnum.CASH,
    patientList
  );

  const personProfile =
    sieProfile?.length > 0
      ? sieProfile[0]
      : cashProfile.length > 0
      ? cashProfile[0]
      : undefined;

  const patientDependentsFormatted = patientDependents
    ? mapPatientDependents(
        patientDependents,
        personProfile?.rxGroupType,
        personProfile
      )
    : undefined;

  const patientProfile =
    patientList && personProfile?.primary ? personProfile.primary : undefined;

  const { firstName, lastName } = patientProfile || account;

  const loggedInMember = personProfile?.primary;
  const childMembers = patientDependents
    ? patientDependentsFormatted?.childDependents
    : personProfile?.childMembers;
  const adultMembers = personProfile?.adultMembers;
  const memberProfileName = firstName && lastName && `${firstName} ${lastName}`;
  const isOnlyCashProfile = sieProfile.length === 0 && cashProfile.length > 0;

  const createContactRowKey = (
    contactRow: IPrimaryProfile | IDependentProfile
  ) => {
    return `${contactRow.identifier} ${contactRow.firstName}-${contactRow.lastName}`;
  };

  const getSecondaryUserById = (id: string) => {
    return adultMembers?.find((member) => member.identifier === id);
  };

  const renderContactRow = (
    contactRow: IPrimaryProfile | IDependentProfile,
    isAdult: boolean
  ) => {
    const key = createContactRowKey(contactRow);
    const secondaryUserIdentifier = isAdult
      ? contactRow.secondaryAlertCarbonCopyIdentifier
      : contactRow.secondaryAlertChildCareTakerIdentifier;

    const secondaryUser = secondaryUserIdentifier
      ? getSecondaryUserById(secondaryUserIdentifier)
      : undefined;

    return (
      <View key={key} style={memberListInfoScreenStyles.rowContainerView}>
        <ContactInfoContainer
          memberInfo={contactRow}
          isAdult={isAdult}
          secondaryUser={secondaryUser}
        />
      </View>
    );
  };

  const renderBody = () => {
    if (loggedInMember) {
      const loggedInUserRow = renderContactRow(loggedInMember, true);
      const renderChildMembers =
        loggedInMember.isPrimary &&
        childMembers &&
        childMembers.length > 0 &&
        !isOnlyCashProfile ? (
          <View style={memberListInfoScreenStyles.childContainerView}>
            <Text
              style={memberListInfoScreenStyles.childContainerViewHeaderText}
            >
              {memberInfoListScreenContent.dependentMembersUnder13}
            </Text>
            {childMembers
              .filter(
                (contact) =>
                  contact.primaryMemberRxId &&
                  contact.firstName &&
                  contact.lastName
              )
              .map((contactRow: IDependentProfile) =>
                renderContactRow(
                  {
                    ...contactRow,
                    rxGroupType: loggedInMember?.rxGroupType,
                  },
                  false
                )
              )}
          </View>
        ) : null;

      const body = (
        <View style={memberListInfoScreenStyles.containerView}>
          {loggedInUserRow}
          {renderChildMembers}
        </View>
      );

      return body;
    }
    return null;
  };
  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      headerViewStyle={memberListInfoScreenStyles.headerView}
      header={undefined}
      body={renderBody()}
      bodyViewStyle={memberListInfoScreenStyles.bodyViewStyle}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      memberProfileName={memberProfileName}
      translateContent={true}
    />
  );
};
