// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { digitalIdCardScreenStyles } from './digital-id-card.screen.styles';
import { IDigitalIdCardScreenContent } from './digital-id-card.screen.content';
import {
  DigitalIDCardNavigationProp,
  DigitalIDCardRouteProp,
} from '../../navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import {
  getHighestPriorityProfile,
  getProfileName,
} from '../../../../utils/profile.helper';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { PlanMemberSupportSection } from './sections/plan-member-support/plan-member-support.section';
import { resetStackToHome } from '../../store/navigation/navigation-reducer.actions';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { assertIsDefined } from '../../../../assertions/assert-is-defined';
import { ProtectedBaseText } from '../../../../components/text/protected-base-text/protected-base-text';
import { RxIdCard } from '../../../../components/cards/rx-id-card/rx-id-card';
import { RxGroupTypesEnum } from '../../../../models/member-profile/member-profile-info';

export interface IDigitalIDCardScreenRouteProps {
  backToHome?: boolean;
}

export const DigitalIDCardScreen = (): ReactElement => {
  const navigation = useNavigation<DigitalIDCardNavigationProp>();

  const { params } = useRoute<DigitalIDCardRouteProp>();

  const { content, isContentLoading } = useContent<IDigitalIdCardScreenContent>(
    CmsGroupKey.digitalIdCard,
    2
  );

  const styles = digitalIdCardScreenStyles;

  const { membershipState } = useMembershipContext();
  const { profileList } = membershipState;

  const highestPriorityProfile = getHighestPriorityProfile(profileList);
  assertIsDefined(highestPriorityProfile);

  const profile = highestPriorityProfile.primary;

  const { issuerNumber, firstName, lastName } = profile;

  const memberProfileName = getProfileName(firstName, lastName);

  const defaultIssuerNumber = '9151014609';

  const onNavigateBack = () => {
    if (params?.backToHome) {
      resetStackToHome(navigation);
    } else {
      navigation.goBack();
    }
  };

  const body = (
    <BodyContentContainer
      testID='digitalIdCardScreen'
      title={content.title}
      isSkeleton={isContentLoading}
    >
      <BaseText isSkeleton={isContentLoading} skeletonWidth='long'>
        {content.preamble}
      </BaseText>
      <RxIdCard
        profile={profile}
        viewStyle={styles.digitalIdCardViewStyle}
        rxCardType={
          profile.rxGroupType === RxGroupTypesEnum.SIE ? 'pbm' : 'smartPrice'
        }
      />
      <View testID='issuerNumber' style={styles.issuerNumberViewStyle}>
        <BaseText
          style={styles.issuerNumberLabelTextStyle}
          skeletonWidth='medium'
          isSkeleton={isContentLoading}
        >
          {content.issuerNumber}
        </BaseText>
        <ProtectedBaseText style={styles.issuerNumberTextStyle}>
          {issuerNumber || defaultIssuerNumber}
        </ProtectedBaseText>
      </View>
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      <PlanMemberSupportSection />
    </BodyContentContainer>
  );
  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      memberProfileName={memberProfileName}
      navigateBack={onNavigateBack}
      bodyViewStyle={styles.digitalIdCardScreenBodyViewStyle}
      translateContent={true}
    />
  );
};
