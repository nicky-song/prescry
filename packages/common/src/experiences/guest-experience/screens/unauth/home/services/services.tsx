// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { servicesLargeStyles, servicesMobileStyles } from './services.styles';
import { servicesContent } from './services.content';
import { LearnMoreBullets } from '../../../../../../components/member/learn-more-bullets/learn-more-bullets';
import { OfferedService } from '../../../../../../components/member/offered-service/offered-service';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useMediaQueryContext } from '../../../../context-providers/media-query/use-media-query-context.hook';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../../guest-experience-logger.middleware';
import { useReduxContext } from '../../../../context-providers/redux/use-redux-context.hook';
import { startExperienceDispatch } from '../../../../store/start-experience/dispatch/start-experience.dispatch';
import { setIsUnauthExperienceDispatch } from '../../../../state/session/dispatch/set-is-unauth-experience.dispatch';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { isDesktopDevice } from '../../../../../../utils/responsive-screen.helper';
import { RootStackNavigationProp } from '../../../../navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { ImageInstanceNames } from '../../../../../../theming/assets';

export interface IServiceData {
  action: string;
  icon?: string;
  link?: string;
  text?: string;
  name?: string;
  buttonLabel?: string;
  learnMoreTitle?: string;
  bullets?: string[];
  buttonTestId?: string;
}
export interface IServicesProps {
  data?: IServiceData[];
  onGetStartedShow: (path?: string) => void;
  onSmartPriceButtonPress: () => void;
}

export const Services = ({
  data,
  onGetStartedShow,
  onSmartPriceButtonPress,
}: IServicesProps): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const styles =
    useMediaQueryContext().mediaSize !== 'large'
      ? servicesMobileStyles
      : servicesLargeStyles;

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const { sessionDispatch } = useSessionContext();

  const isDesktop = isDesktopDevice();

  const numberOfCards = data?.length
    ? Array.from({ length: data?.length }, (_, _i) =>
        isDesktop ? true : false
      )
    : [];
  const [cardsState, setCardsState] = useState(numberOfCards);

  const isCardStateTrue = cardsState.every((c: boolean) => c === true);

  const isCollapsibleCard = true;

  const onClickAppService = async (service: string, action: string) => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.USER_CLICKED_ON_SERVICE,
      {
        payloadMessage: service,
      }
    );

    if (action === 'drugsearch') {
      onSmartPriceButtonPress();
    } else {
      const isUnauthExperience = false;
      setIsUnauthExperienceDispatch(sessionDispatch, isUnauthExperience);
      await startExperienceDispatch(
        reduxDispatch,
        reduxGetState,
        navigation,
        isUnauthExperience
      );
    }
  };

  const serviceStyle = {
    ...styles.serviceCardViewStyle,
    height: isCardStateTrue ? 'initial' : 'fit-content',
  };

  const firstServiceStyle = {
    ...styles.firstServiceCardViewStyle,
    height: isCardStateTrue ? 'initial' : 'fit-content',
  };

  const lastServiceStyle = {
    ...styles.lastServiceCardViewStyle,
    height: isCardStateTrue ? 'initial' : 'fit-content',
  };

  return (
    <View style={styles.containerViewStyle}>
      <View style={styles.cardContainerViewStyle}>
        {data ? (
          data.map((d, i) => {
            const onCardPress = () => {
              const cardsNewState = cardsState.map((s, index) => {
                if (isDesktop) {
                  return !s;
                } else {
                  if (index === i) {
                    return !s;
                  }
                  return false;
                }
              });
              setCardsState(cardsNewState);
            };

            const onServiceButtonPressed = async () => {
              if (d.link === 'smartprice') {
                guestExperienceCustomEventLogger(
                  CustomAppInsightEvents.USER_CLICKED_ON_SERVICE,
                  {
                    payloadMessage: 'smartprice',
                  }
                );
              }

              if (isDesktop) {
                const { pathname } = window.location;
                onGetStartedShow(`${pathname}${window.location.search}`);
              } else {
                const service = d.name || d.link || '';
                await onClickAppService(service, d.action);
              }
            };

            return (
              <View
                key={`${d.name || d.link}-${i}`}
                style={
                  i === 0
                    ? firstServiceStyle
                    : i === data.length - 1
                    ? lastServiceStyle
                    : serviceStyle
                }
              >
                <OfferedService
                  icon={d.icon as ImageInstanceNames}
                  name={d.name}
                  text={d.text}
                  buttonLabel={d.buttonLabel}
                  isOpen={cardsState[i]}
                  isCollapsible={isCollapsibleCard}
                  onTogglePress={onCardPress}
                  onButtonPressed={onServiceButtonPressed}
                  buttonTestId={d.buttonTestId}
                >
                  <LearnMoreBullets
                    title={d.learnMoreTitle}
                    bulletPoints={d.bullets}
                  />
                </OfferedService>
              </View>
            );
          })
        ) : (
          <BaseText>{servicesContent.loading}</BaseText>
        )}
      </View>
    </View>
  );
};
