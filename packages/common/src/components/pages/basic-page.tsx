// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { ScrollView, View, ViewProps, ViewStyle } from 'react-native';
import { useMediaQueryContext } from '../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import {
  ApplicationHeader,
  LogoClickAction,
} from '../app/application-header/application-header';
import { FooterContentContainer } from '../containers/footer-content/footer-content.container';
import { ProtectedView } from '../containers/protected-view/protected-view';
import { TranslatableView } from '../containers/translated-view/translatable-view';
import { WelcomeModal } from '../modal/welcome-modal/welcome-modal';
import { basicPageStyles } from './basic-page.styles';

export interface IBasicPageProps {
  hideNavigationMenuButton?: boolean;
  navigateBack?: () => void;
  navigateOnClose?: () => void;
  pageTitle?: string;
  /** @deprecated use `title` in `BodyContentContainer` */
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  /** @deprecated use `BodyContentContainer` */
  headerViewStyle?: ViewStyle;
  isCardStyle?: boolean;
  bodyViewStyle?: ViewStyle;
  allowBodyGrow?: boolean;
  showProfileAvatar?: boolean;
  showCloseButton?: boolean;
  filter?: React.ReactNode;
  stickyViews?: StickyView[];
  stickyIndices?: number[];
  hideApplicationHeader?: boolean;
  memberProfileName?: string;
  modals?: React.ReactNode;
  scrollEnabled?: boolean;
  notification?: React.ReactNode;
  logoClickAction?: LogoClickAction;
  translateContent?: boolean;
  applicationHeaderHamburgerTestID?: string;
}

export type StickyView = { view: React.ReactNode };

export const BasicPage = React.forwardRef(
  (props: IBasicPageProps, ref: React.Ref<ScrollView>) => {
    const {
      headerViewStyle,
      bodyViewStyle,
      allowBodyGrow,
      header,
      body,
      scrollEnabled,
      translateContent,
    } = props;

    const urlParams = location.search;
    const urlParamsSearch = new URLSearchParams(urlParams);
    const rxGroup = urlParamsSearch.get('rxgroup') ?? '';
    const brokerId = urlParamsSearch.get('brokerid') ?? '';

    const renderStickyViews = (): React.ReactNode => {
      if (props.stickyViews) {
        return props.stickyViews.map((view, index) => {
          return <View key={index}>{view.view}</View>;
        });
      }
      return;
    };

    const renderHeaderViewStyle =
      headerViewStyle || basicPageStyles.headerViewStyle;
    const renderBodyViewStyle = bodyViewStyle || basicPageStyles.bodyViewStyle;
    const renderScrollViewStyle = [
      basicPageStyles.scrollViewStyle,
      bodyViewStyle,
    ];

    const contentContainerViewStyle = allowBodyGrow
      ? basicPageStyles.contentContainerAllowGrowViewStyle
      : basicPageStyles.contentContainerNoGrowViewStyle;
    const { windowHeight } = useMediaQueryContext();

    const notification = props.notification ? (
      <View
        style={
          props.footer
            ? basicPageStyles.notificationWithFooterViewStyle
            : basicPageStyles.notificationViewStyle
        }
      >
        {props.notification}
      </View>
    ) : null;

    const footer = props.footer ? (
      <FooterContentContainer viewStyle={basicPageStyles.footerViewStyle}>
        {props.footer}
      </FooterContentContainer>
    ) : null;

    const viewContentProps = {
      style: [basicPageStyles.pageViewStyle, { height: windowHeight }],
      pointerEvents: 'box-none',
      testID: 'BasicPage',
    } as ViewProps;

    const viewContent = (
      <>
        <WelcomeModal rxGroup={rxGroup} brokerId={brokerId} />
        <ScrollView
          ref={ref}
          scrollEventThrottle={16}
          stickyHeaderIndices={props.stickyIndices}
          contentContainerStyle={contentContainerViewStyle}
          style={renderScrollViewStyle}
          scrollEnabled={scrollEnabled}
          testID='scrollView'
        >
          {!props.hideApplicationHeader && (
            <ApplicationHeader
              title={props.pageTitle}
              navigateBack={props.navigateBack}
              hideNavigationMenuButton={props.hideNavigationMenuButton}
              showProfileAvatar={props.showProfileAvatar}
              showCloseButton={props.showCloseButton}
              navigateOnClose={props.navigateOnClose}
              memberProfileName={props.memberProfileName}
              isCardStyle={props.isCardStyle}
              logoClickAction={props.logoClickAction}
              testID={props.applicationHeaderHamburgerTestID}
            />
          )}
          <View style={basicPageStyles.stickyHeaderViewStyle}>
            {renderStickyViews()}
          </View>
          {header && <View style={renderHeaderViewStyle}>{header}</View>}
          <View style={renderBodyViewStyle}>{body}</View>
        </ScrollView>
        {notification}
        {footer}
        {props.modals}
      </>
    );

    const translatableContent = (
      <TranslatableView {...viewContentProps}>{viewContent}</TranslatableView>
    );

    const protectedContent = (
      <ProtectedView {...viewContentProps}>{viewContent}</ProtectedView>
    );

    return translateContent ? translatableContent : protectedContent;
  }
);
