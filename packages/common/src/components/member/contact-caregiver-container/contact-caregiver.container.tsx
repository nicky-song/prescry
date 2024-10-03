// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Heading } from '../heading/heading';
import { BaseText } from '../../text/base-text/base-text';
import { LinkButton } from '../../buttons/link/link.button';
import { contactCaregiverContainerStyles } from './contact-caregiver.container.styles';
import { List } from '../../primitives/list';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { CobrandingHeader } from '../cobranding-header/cobranding-header';

import { goToUrl } from '../../../utils/link.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IContactCaregiverContainerContent } from '../../../models/cms-content/contact-caregiver.container.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
export interface ContactCaregiverScreenContainerProps {
  group_number?: string;
  supportEmail: string;
}

export const ContactCaregiverScreenContainer = (
  props: ContactCaregiverScreenContainerProps
): ReactElement => {
  const { group_number, supportEmail } = props;
  const contactCareGiverGroupKey = CmsGroupKey.contactCareGiver;
  const {
    content: {
      title,
      titleDescription,
      subTitle,
      subItems,
      helpLinkTitle,
      helpLinkText,
      helpLinkInfo,
    },
  } = useContent<IContactCaregiverContainerContent>(
    contactCareGiverGroupKey,
    2
  );

  const { logo: cobrandingLogo } = useCobrandingContent(group_number);

  const {
    headingTextStyle,
    subHeadingTextStyle,
    reloadLinkViewStyle,
    listViewStyle,
    listItemViewStyle,
    listItemTitleStyle,
    helpCardViewStyle,
    helpLinkTitleViewStyle,
    helpLinkTitleTextStyle,
    helpLinkInfoViewStyle,
    helpIconStyle,
    helpLinkInfoTextStyle,
    providedByViewStyle,
  } = contactCaregiverContainerStyles;

  const onPress = () => goToUrl(`mailto:${supportEmail}`);

  const renderContactBanner = (
    <View style={helpCardViewStyle}>
      <View style={helpLinkTitleViewStyle}>
        <FontAwesomeIcon style={helpIconStyle} name='headphones' size={18} />
        <Heading textStyle={helpLinkTitleTextStyle}>{helpLinkTitle}</Heading>
      </View>
      <View style={helpLinkInfoViewStyle}>
        <LinkButton
          onPress={onPress}
          linkText={helpLinkText}
          viewStyle={reloadLinkViewStyle}
        />
        <BaseText style={helpLinkInfoTextStyle}>{helpLinkInfo}</BaseText>
      </View>
    </View>
  );

  const renderDescriptionList = (
    <List style={listViewStyle}>
      {subItems.map((item) => (
        <View style={listItemViewStyle} key={item.id}>
          <FontAwesomeIcon name='wifi-1' solid={true} size={18} />
          <BaseText>
            <BaseText style={listItemTitleStyle}>{item?.title}</BaseText>
            {item.info}
          </BaseText>
        </View>
      ))}
    </List>
  );

  const renderCobranding = cobrandingLogo ? (
    <View style={providedByViewStyle}>
      <CobrandingHeader logoUrl={cobrandingLogo} />
    </View>
  ) : null;

  return (
    <>
      {renderCobranding}
      <Heading textStyle={headingTextStyle} level={1}>
        {title}
      </Heading>
      <BaseText size='default'>{titleDescription}</BaseText>
      <Heading textStyle={subHeadingTextStyle}>{subTitle}</Heading>
      {renderDescriptionList}
      {renderContactBanner}
    </>
  );
};
