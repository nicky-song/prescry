// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ServicesListConnected } from '../../../components/member/lists/services-list/services-list.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { ServiceTypes } from '../../../models/provider-location';
import {
  IServiceSelectionScreenRouteProps,
  ServiceSelectionScreen,
} from './service-selection-screen';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../testing/test.helper';
import { Heading } from '../../../components/member/heading/heading';
import { serviceSelectionScreenStyles } from './service-selection-screen.styles';
import { serviceSelectionScreenContent } from './service-selection-screen.content';
import { IStaticFeedContextServiceItem } from '../../../models/static-feed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../components/member/lists/services-list/services-list.connected',
  () => ({
    ServicesListConnected: () => <div />,
  })
);

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

describe('ServiceSelectionScreen ', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const routeParamsMock: IServiceSelectionScreenRouteProps = {
      services: [],
    };
    useRouteMock.mockReturnValue({ params: routeParamsMock });
  });

  it('renders as BasicPage', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const testRenderer = renderer.create(<ServiceSelectionScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConnected.type).toEqual(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.showProfileAvatar).toEqual(true);
    expect(pageProps.logoClickAction).toEqual(LogoClickActionEnum.CONFIRM);
    expect(pageProps.navigateBack).toEqual(rootStackNavigationMock.goBack);
    expect(pageProps.translateContent).toEqual(true);
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(<ServiceSelectionScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;

    expect(bodyContentContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(bodyContentContainer).length).toEqual(3);
  });

  it('renders title in body container', () => {
    const testRenderer = renderer.create(<ServiceSelectionScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;
    const title = getChildren(bodyContentContainer)[0];

    expect(title.type).toEqual(Heading);
    expect(title.props.textStyle).toEqual(
      serviceSelectionScreenStyles.titleTextStyle
    );
    expect(title.props.children).toEqual(serviceSelectionScreenContent.title);
  });

  it('renders service list in body container', () => {
    const servicesMock: IStaticFeedContextServiceItem[] = [];
    const testRenderer = renderer.create(<ServiceSelectionScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;
    const servicesList = getChildren(bodyContentContainer)[1];

    expect(servicesList.type).toEqual(ServicesListConnected);
    expect(servicesList.props.services).toEqual(servicesMock);
  });

  it('renders more Info link for vaccine services', () => {
    const routeParamsMock: IServiceSelectionScreenRouteProps = {
      services: [
        {
          title: 'title',
          description: 'service description',
          serviceType: ServiceTypes.c19VaccineDose2,
          cost: '$155',
          subText: [
            {
              language: 'English',
              markDownText: 'subtext-english-markdown-text-1-mock',
            },
            {
              language: 'Spanish',
              markDownText: 'subtext-spanish-markdown-text-1-mock',
            },
          ],
          enabled: true,
        },
      ],
    };
    useRouteMock.mockReturnValue({ params: routeParamsMock });

    const testRenderer = renderer.create(<ServiceSelectionScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const moreInfoLink = getChildren(body)[2];

    expect(moreInfoLink.type).toEqual(MarkdownText);
    expect(moreInfoLink.props.textStyle).toEqual(
      serviceSelectionScreenStyles.moreInfoVaccineLinkTextStyle
    );
    expect(moreInfoLink.props.children).toEqual(
      serviceSelectionScreenContent.moreInfoVaccineLink
    );
  });

  it('does not render more Info link for non-vaccine services', () => {
    const routeParamsMock: IServiceSelectionScreenRouteProps = {
      services: [
        {
          title: 'title',
          description: 'service description',
          serviceType: ServiceTypes.abbottAntigen,
          cost: '$155',
          subText: [
            {
              language: 'English',
              markDownText: 'subtext-english-markdown-text-1-mock',
            },
            {
              language: 'Spanish',
              markDownText: 'subtext-spanish-markdown-text-1-mock',
            },
          ],
          enabled: true,
        },
      ],
    };
    useRouteMock.mockReturnValue({ params: routeParamsMock });

    const testRenderer = renderer.create(<ServiceSelectionScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPageConnected.props.body;
    const moreInfoLink = getChildren(body)[2];

    expect(moreInfoLink).toBeNull();
  });
});
