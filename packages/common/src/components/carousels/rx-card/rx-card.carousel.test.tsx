// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Swiper } from 'swiper/react';

import { IPrimaryProfile, RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { RxCardCarousel } from './rx-card.carousel';
import {
  rxCardCarouselViewStyleStyles as styles
} from './rx-card.carousel.styles';
import { getChildren } from '../../../testing/test.helper';
import { RxCardType } from '../../../models/rx-id-card';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';


jest.mock('swiper', () => ({
  Swiper: jest.fn(),
  Pagination: jest.fn(),
}));

jest.mock('swiper/react', () => ({
  Swiper: jest.fn(),
  SwiperSlide: () => <div />,
}));
const swiperMock = Swiper as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

const profileMock: IPrimaryProfile = {
  firstName: 'First',
  lastName: 'Last',
  dateOfBirth: '',
  identifier: '',
  phoneNumber: '',
  primaryMemberRxId: '',
  primaryMemberFamilyId: 'T31313131313',
  primaryMemberPersonCode: '01',
  rxGroupType: RxGroupTypesEnum.SIE,
  rxGroup: 'HMA01',
  rxSubGroup: '',
  rxBin: '610749',
  carrierPCN: 'PH',
};

const cardsMock: RxCardType[] = ['pbm', 'smartPrice'];

const onSelectMock = jest.fn();

const containerViewStyleMock: ViewStyle = {
  marginLeft: 1,
};

const testIDMock = 'mock-test-id';
const windowWidthMock = 360;

describe('RxCardCarousel', () => {
  beforeEach(() => {
    useMediaQueryContextMock.mockReturnValue({
      windowWidth: windowWidthMock,
    });

    swiperMock.mockReset();
    swiperMock.mockReturnValueOnce(<div />);
  });

  it('renders outermost container as View with testID', () => {
    const testRenderer = renderer.create(
      <RxCardCarousel
        profile={profileMock}
        cards={cardsMock}
        onSelect={onSelectMock}
        viewStyle={containerViewStyleMock}
        testID={testIDMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const activeCardStyleMock: ViewStyle = {
      marginRight: 0,
    };

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual(testIDMock);
    expect(container.props.style).toEqual([
      styles.carouselViewStyle,
      containerViewStyleMock,
      activeCardStyleMock,
    ]);
  });

  it('renders a View with Swiper inside', () => {
    const testRenderer = renderer.create(
      <RxCardCarousel
        profile={profileMock}
        cards={cardsMock}
        onSelect={onSelectMock}
        viewStyle={containerViewStyleMock}
        testID={testIDMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const swiperView = getChildren(container)[0];

    expect(swiperView.type).toEqual(View);
    expect(swiperView.props.style).toEqual(styles.swiperViewStyle);

    expect(swiperMock).toHaveBeenCalledTimes(1);
  });

  it('renders a Swiper pagination View', () => {
    const testRenderer = renderer.create(
      <RxCardCarousel
        profile={profileMock}
        cards={cardsMock}
        onSelect={onSelectMock}
        viewStyle={containerViewStyleMock}
        testID={testIDMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const paginationView = getChildren(container)[1];

    expect(paginationView.type).toEqual(View);
    expect(paginationView.props.nativeID).toEqual(`${testIDMock}-pagination`);
    expect(paginationView.props.style).toEqual(styles.paginationViewStyle);
  });

});
