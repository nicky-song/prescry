// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { View } from 'react-native';
import { ImageAsset } from '../../../../components/image-asset/image-asset';
import { Heading } from '../../../../components/member/heading/heading';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { FontAwesomeIcon } from '../../../../components/icons/font-awesome/font-awesome.icon';
import { GrayScaleColor } from '../../../../theming/colors';
import { IconSize } from '../../../../theming/icons';
import { MarkdownText } from '../../../../components/text/markdown-text/markdown-text';
import { ProtectedBaseText } from '../../../../components/text/protected-base-text/protected-base-text';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useNavigation } from '@react-navigation/core';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IClaimReversalScreenContent } from './claim-reversal.screen.content';
import { callPhoneNumber } from '../../../../utils/link.helper';
import { claimReversalScreenStyles } from './claim-reversal.screen.styles';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { NeedHelpSection } from '../../../../components/member/need-help/need-help.section';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { getProfilesByGroup } from '../../../../utils/profile.helper';
import { ClaimReversalSlideUpModal } from '../claim-reversal.slide-up-modal/claim-reversal.slide-up-modal';

export const ClaimReversalScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const [
    isClaimReversalSlideUpModalVisible,
    setIsClaimReversalSlideUpModalVisible,
  ] = useState(false);

  const { getState } = useReduxContext();

  const {
    claimAlertState: { prescribedMedication, pharmacyInfo },
  } = useClaimAlertContext();

  const groupKey = CmsGroupKey.claimReversalScreen;
  const { content } = useContent<IClaimReversalScreenContent>(groupKey, 2);

  const {
    membershipState: { profileList },
  } = useMembershipContext();

  const sieMember = getProfilesByGroup(profileList, 'SIE');

  const isSieMember = sieMember?.length ? true : false;

  const pharmacyName =
    pharmacyInfo?.name.trim() + ' ' ?? content.pharmacyPlaceholder;

  const drugName = ` ${prescribedMedication?.drugName} ${prescribedMedication?.drugDetails.strength}${prescribedMedication?.drugDetails.unit} ${prescribedMedication?.drugDetails.formCode}.`;

  const onLearnMorePress = (_url: string) => {
    setIsClaimReversalSlideUpModalVisible(true);
    return true;
  };

  const onClaimReversalSlideUpModalClosePress = () => {
    setIsClaimReversalSlideUpModalVisible(false);
    return false;
  };

  const onPhoneButtonPress = () => {
    if (pharmacyInfo?.phone) callPhoneNumber(pharmacyInfo.phone);
  };

  const onHomeButtonPress = () => {
    navigateHomeScreenNoApiRefreshDispatch(getState, navigation);
  };

  const descriptionTwo = ' ' + content.descriptionTwo;

  const body = (
    <View
      testID='claimReversalScreen'
      style={claimReversalScreenStyles.bodyViewStyle}
    >
      <View style={claimReversalScreenStyles.topViewStyle}>
        <ImageAsset
          name='claimReversal'
          style={claimReversalScreenStyles.claimReversalImageStyle}
        />
        <Heading>{content.heading}</Heading>
      </View>
      <BaseText style={claimReversalScreenStyles.descriptionWrapperTextStyle}>
        <ProtectedBaseText
          style={claimReversalScreenStyles.pharmacyNameTextStyle}
        >
          {pharmacyName}
        </ProtectedBaseText>
        <BaseText>{content.descriptionOne}</BaseText>
        <ProtectedBaseText>{drugName}</ProtectedBaseText>
        {pharmacyInfo?.phone ? <BaseText>{descriptionTwo}</BaseText> : null}
      </BaseText>
      <MarkdownText
        textStyle={claimReversalScreenStyles.learnMoreTextStyle}
        onLinkPress={onLearnMorePress}
        testID='learnMore'
      >
        {content.learnMore}
      </MarkdownText>
      {pharmacyInfo?.phone ? (
        <BaseButton
          viewStyle={claimReversalScreenStyles.phoneButtonViewStyle}
          onPress={onPhoneButtonPress}
          testID='claimReversalScreenPhoneButton'
        >
          <FontAwesomeIcon
            name='phone-alt'
            color={GrayScaleColor.white}
            size={IconSize.regular}
            style={claimReversalScreenStyles.phoneIconViewStyle}
          />
          {content.phoneButton}
        </BaseButton>
      ) : null}
      <BaseButton
        viewStyle={claimReversalScreenStyles.homeButtonViewStyle}
        textStyle={claimReversalScreenStyles.homeButtonTextStyle}
        onPress={onHomeButtonPress}
        testID='claimReversalScreenHomeButton'
      >
        {content.homeButton}
      </BaseButton>
    </View>
  );

  const footer = <NeedHelpSection isSieMember={isSieMember} />;

  return (
    <BasicPageConnected
      body={body}
      translateContent={true}
      showProfileAvatar={true}
      navigateBack={onHomeButtonPress}
      bodyViewStyle={claimReversalScreenStyles.basicPageBodyViewStyle}
      modals={[
        <ClaimReversalSlideUpModal
          isVisible={isClaimReversalSlideUpModalVisible}
          onClosePress={onClaimReversalSlideUpModalClosePress}
        />,
      ]}
      footer={footer}
    />
  );
};
