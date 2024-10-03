// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';

import { Swiper as SwiperType, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'

import { IPrimaryProfile } from '../../../models/member-profile/member-profile-info';
import { RxCardType } from '../../../models/rx-id-card';
import { RxIdCard } from '../../cards/rx-id-card/rx-id-card';
import  {
  cardGap,
  getSlidesPerView,
  rxCardCarouselViewStyleStyles as styles
} from './rx-card.carousel.styles';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';

export interface IRxCardCarouselProps {
  profile: IPrimaryProfile;
  cards: RxCardType [];
  onSelect: (cardType: RxCardType) => void;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const RxCardCarousel = ({
  profile,
  cards,
  onSelect,
  viewStyle,
  testID = 'rxCardCarousel',
}: IRxCardCarouselProps): ReactElement => {

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const multiCards = (cards.length >= 2);

  const carouselViewStyles = multiCards
    ? [styles.carouselViewStyle, viewStyle]
    : [styles.carouselViewStyle, viewStyle, styles.carouselViewStyle_singleCard];
  
  const cardViewStyles = multiCards
    ? [styles.cardViewStyle]
    : [styles.cardViewStyle, styles.cardViewStyle_single];

  const { windowWidth } = useMediaQueryContext();
  const cardsPerView = multiCards
    ? getSlidesPerView(windowWidth, viewStyle)
    : 1;

  const paginationNativeId = `${testID}-pagination`;
  const hasPagination = (multiCards && cardsPerView < 2);

  const setPaginationMargins = () => {
    const paginationStyle: ViewStyle = {};

    if (activeCardIndex === 0) {
      paginationStyle.marginRight = 0;
    }
    else {
      paginationStyle.marginLeft = 0;
    }

    carouselViewStyles[2] = paginationStyle;
  };

  if (hasPagination) {
    setPaginationMargins();
  }
  
  useEffect(() => {
    if (hasPagination) {
      setPaginationMargins();
    }
  }, [activeCardIndex]);
  
  const onSlideChange = (swiper: SwiperType) => {
    onSelect(cards[swiper.activeIndex]);

    setActiveCardIndex(swiper.activeIndex);
  };

  return (
    <View
      style={carouselViewStyles}
      testID={testID}
    >
      <View style={styles.swiperViewStyle}>
        <Swiper
          modules={[Pagination]}
          slidesPerView={cardsPerView}
          spaceBetween={cardGap}
          pagination={{ 
            clickable: true,
            el: `[id=${paginationNativeId}]`,
          }}
          onSlideChange={onSlideChange}
        >
          {
            cards.map((card, key) => (
              <SwiperSlide
                key={key}
              >
                <RxIdCard
                  profile={profile}
                  rxCardType={card}
                  viewStyle={cardViewStyles}
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </View>
      <View 
        nativeID={paginationNativeId}
        style={styles.paginationViewStyle}
      />
    </View>
  );
};
