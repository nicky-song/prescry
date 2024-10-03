// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, ReactElement } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { ImageInstanceNames } from '../../../theming/assets';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import { BaseButton } from '../../buttons/base/base.button';
import { ImageAsset } from '../../image-asset/image-asset';
import { BaseText } from '../../text/base-text/base-text';
import {
  offeredServiceStyle,
  offeredServiceDesktopStyles,
} from './offered-service.styles';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IServiceProps {
  icon?: ImageInstanceNames;
  text?: string;
  name?: string;
  onButtonPressed?: () => void;
  isOpen?: boolean;
  buttonLabel?: string;
  isCollapsible?: boolean;
  onTogglePress?: () => void;
  buttonTestId?: string;
}

export const OfferedService: FunctionComponent<IServiceProps> = ({
  icon,
  text,
  name,
  onButtonPressed,
  isOpen,
  children,
  buttonLabel,
  isCollapsible = false,
  onTogglePress,
  buttonTestId,
}): ReactElement => {
  const isNarrowWidth = useMediaQueryContext().mediaSize !== 'large';
  const styles = isNarrowWidth
    ? offeredServiceStyle
    : offeredServiceDesktopStyles;

  const isDesktop = isDesktopDevice();

  const toggleLabel = isCollapsible ? (
    <FontAwesomeIcon
      name={isOpen ? 'chevron-up' : 'chevron-down'}
      size={IconSize.small}
      color={isOpen ? GrayScaleColor.secondaryGray : PrimaryColor.darkBlue}
      style={styles.dropDownArrowImage}
    />
  ) : undefined;

  const toggleViewStyle: ViewStyle = isOpen
    ? styles.visibleContainerStyle
    : styles.hiddenContainerStyle;

  const renderComponent = (content: ReactElement) =>
    isCollapsible ? (
      <TouchableOpacity activeOpacity={1} onPress={onTogglePress}>
        {content}
      </TouchableOpacity>
    ) : (
      content
    );

  const toggleImage = isCollapsible ? (
    <View style={styles.labelContainerViewStyle}>{toggleLabel}</View>
  ) : undefined;

  const renderImageMobileView = () => {
    return !isDesktop && icon ? (
      <View style={styles.serviceIconViewStyle}>
        <ImageAsset
          style={styles.iconImageStyle}
          resizeMode='contain'
          resizeMethod='scale'
          name={icon}
        />
      </View>
    ) : null;
  };

  const headerRender = (
    <View style={styles.responsiveContainerViewStyle}>
      {renderImageMobileView()}
      <View style={styles.flexViewStyle}>
        <BaseText style={styles.serviceTitleTextStyle}>{name}</BaseText>
        <BaseText style={styles.serviceTextTextStyle}>{text}</BaseText>
      </View>
      {toggleImage}
    </View>
  );

  const renderIcon = icon ? (
    <View style={styles.serviceIconViewStyle}>
      <ImageAsset
        style={styles.iconImageStyle}
        resizeMode='contain'
        resizeMethod='scale'
        name={icon}
      />
    </View>
  ) : null;

  return isDesktop ? (
    <View style={styles.serviceDescriptionDesktopViewStyle}>
      {renderIcon}
      <View style={styles.serviceContentViewStyle}>
        {renderComponent(headerRender)}
        <View style={toggleViewStyle}>{children}</View>
        <BaseButton
          size={'medium'}
          viewStyle={styles.buttonViewStyle}
          onPress={onButtonPressed}
          testID={buttonTestId}
        >
          {buttonLabel}
        </BaseButton>
      </View>
    </View>
  ) : (
    <View style={styles.serviceDescriptionViewStyle}>
      {renderComponent(headerRender)}
      <View style={toggleViewStyle}>{children}</View>
      <BaseButton
        size={'medium'}
        viewStyle={styles.buttonViewStyle}
        onPress={onButtonPressed}
        testID={buttonTestId}
      >
        {buttonLabel}
      </BaseButton>
    </View>
  );
};
