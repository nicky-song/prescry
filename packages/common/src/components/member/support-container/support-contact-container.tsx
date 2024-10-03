// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { supportContactContainerContent } from './support-contact-container.content';
import { InlineLink } from '../links/inline/inline.link';
import { BaseText } from '../../text/base-text/base-text';
import { supportContactContainerStyles } from './support-contact-container.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { useConfigContext } from '../../../experiences/guest-experience/context-providers/config/use-config-context.hook';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { ContactInfoPanel } from '../panels/contact-info/contact-info.panel';
import { useFeaturesContext } from '../../../experiences/guest-experience/context-providers/features/use-features-context.hook';
import { isPbmMember } from '../../../utils/profile.helper';
import { goToUrl } from '../../../utils/link.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { useTalkativeWidget } from '../../../hooks/use-talkative-widget/use-talkative-widget';

export const SupportContactContainer = (): ReactElement => {
  const { configState } = useConfigContext();
  const { memberPortalUrl, supportEmail, memberSupportEmail } = configState;

  const { membershipState } = useMembershipContext();
  const { profileList } = membershipState;

  const groupKey = CmsGroupKey.communication;
  const {
    content: communicationContent,
    isContentLoading: isCommunicationContentLoading,
  } = useContent<ICommunicationContent>(
    groupKey,
    2,
    undefined,
    true
  );

  const { featuresState: features } = useFeaturesContext();
  const showPbmMemberSupport = isPbmMember(profileList, features);
  useTalkativeWidget({
    showHeader: true,
    forceExpandedView: true,
  });
  const goToMemberPortal = () => goToUrl(memberPortalUrl);

  const memberPortalContent = showPbmMemberSupport ? (
    <>
      <BaseText style={supportContactContainerStyles.memberPortalViewStyle}>
        {supportContactContainerContent.memberPortalText}{' '}
      </BaseText>
      <View
        style={supportContactContainerStyles.rowViewStyle}
        testID='portalLinkContainer'
      >
        <FontAwesomeIcon
          name='user-circle'
          style={supportContactContainerStyles.iconTextStyle}
          size={16}
        />
        <InlineLink
          textStyle={supportContactContainerStyles.linkTextStyle}
          onPress={goToMemberPortal}
        >
          {supportContactContainerContent.memberPortalLinkLabel}
        </InlineLink>
      </View>
    </>
  ) : null;

  const supportEmailForMemberType = showPbmMemberSupport
    ? memberSupportEmail
    : supportEmail;

  const phoneNumber =
    showPbmMemberSupport &&
    communicationContent &&
    !isCommunicationContentLoading
      ? communicationContent.supportPBMPhone
      : undefined;

  const contactInfoPanel = (
    <ContactInfoPanel
      title={supportContactContainerContent.supportText}
      email={supportEmailForMemberType}
      phoneNumber={phoneNumber}
    />
  );

  return (
    <View testID='SupportContactContainer'>
      {contactInfoPanel}
      {memberPortalContent}
    </View>
  );
};
