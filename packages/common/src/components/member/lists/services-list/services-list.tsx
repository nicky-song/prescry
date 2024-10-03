// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { AppointmentsStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';
import { Language } from '../../../../models/language';
import { IStaticFeedContextServiceItem } from '../../../../models/static-feed';
import { BookTestCard } from '../../items/book-test-card/book-test-card';
import { servicesListStyles } from './services-list.styles';

export interface IServicesListOwnProps {
  services: IStaticFeedContextServiceItem[];
}

export interface IServicesListDispatchProps {
  navigateAction: (
    navigation: AppointmentsStackNavigationProp,
    serviceType: string
  ) => void;
}

export type IServiceListProps = IServicesListOwnProps &
  IServicesListDispatchProps;

export const ServicesList = (props: IServiceListProps) => {
  const { navigateAction } = props;
  const { sessionState } = useSessionContext();
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  return (
    <View testID='servicesList'>
      {props.services.map(
        (item: IStaticFeedContextServiceItem, index: number) => {
          const onItemPress = () =>
            navigateAction(navigation, item.serviceType);

          return (
            <BookTestCard
              key={index}
              title={item.title}
              description={getMarkDownDescription(
                item,
                sessionState.currentLanguage
              )}
              calloutLabel={item.description}
              price={item.cost}
              onPress={onItemPress}
              viewStyle={servicesListStyles.bookTestCardViewStyle}
              testID={'servicesListBookTestCard-' + item.serviceType}
            />
          );
        }
      )}
    </View>
  );
};

const getMarkDownDescription = (
  staticFeedContextServiceItem: IStaticFeedContextServiceItem,
  language: Language
): string | undefined => {
  return staticFeedContextServiceItem.subText?.find(
    (text) => text.language === language
  )?.markDownText;
};
