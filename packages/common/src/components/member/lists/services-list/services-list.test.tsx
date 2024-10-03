//  Copyright 2021 Prescryptive Health, Inc.

import renderer from 'react-test-renderer';
import React from 'react';
import { BookTestCard } from '../../items/book-test-card/book-test-card';
import { ServicesList } from './services-list';
import { useNavigation } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { IStaticFeedContextServiceItem } from '../../../../models/static-feed';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { ISessionState } from '../../../../experiences/guest-experience/state/session/session.state';
import { Language } from '../../../../models/language';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../items/book-test-card/book-test-card', () => ({
  BookTestCard: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

const mockServicesList = [
  {
    title: 'Rapid COVID-19 Antigen test',
    description: 'For NY state residents',
    minAge: 18,
    serviceType: 'abbott_antigen',
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
    cost: '65',
  },
  {
    title: 'Other COVID-19 Antigen test',
    description: 'For NY state residents',
    minAge: 18,
    serviceType: 'abbott_antigen',
    subText: [
      {
        language: 'English',
        markDownText: 'subtext-english-markdown-text-2-mock',
      },
      {
        language: 'Spanish',
        markDownText: 'subtext-spanish-markdown-text-2-mock',
      },
    ],
    enabled: true,
    cost: '85',
  },
] as IStaticFeedContextServiceItem[];

describe('ServicesList', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(appointmentsStackNavigationMock);
  });
  const mockNavigateAction = jest.fn();

  it.each([
    [
      'English' as Language,
      mockServicesList[0]?.subText
        ? mockServicesList[0].subText[0]?.markDownText
        : '',
    ],
    [
      'Spanish' as Language,
      mockServicesList[0]?.subText
        ? mockServicesList[0].subText[1]?.markDownText
        : '',
    ],
  ])(
    'renders BookTestCard with expected properties (sessionStateCurrentLanguage %p)',
    (
      sessionStateCurrentLanguage: Language,
      expectedMarkDownDescription: string
    ) => {
      const sessionStateMock: Partial<ISessionState> = {
        currentLanguage: sessionStateCurrentLanguage,
      };
      useSessionContextMock.mockReturnValue({ sessionState: sessionStateMock });

      const container = renderer.create(
        <ServicesList
          services={mockServicesList}
          navigateAction={mockNavigateAction}
        />
      );
      const testCard1 = container.root.findAllByType(BookTestCard)[0];
      expect(testCard1.type).toEqual(BookTestCard);
      expect(testCard1.props.title).toEqual(mockServicesList[0].title);
      expect(testCard1.props.description).toEqual(expectedMarkDownDescription);
      expect(testCard1.props.calloutLabel).toEqual(
        mockServicesList[0].description
      );
      expect(testCard1.props.price).toEqual(mockServicesList[0].cost);
      expect(testCard1.props.testID).toEqual(
        'servicesListBookTestCard-' + mockServicesList[0].serviceType
      );
    }
  );

  it('calls navigationAction when item is pressed', () => {
    const container = renderer.create(
      <ServicesList
        services={mockServicesList}
        navigateAction={mockNavigateAction}
      />
    );
    const testCard1 = container.root.findAllByType(BookTestCard)[0];
    expect(testCard1.type).toEqual(BookTestCard);
    testCard1.props.onPress();
    expect(mockNavigateAction).toBeCalledTimes(1);
    expect(mockNavigateAction).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      'abbott_antigen'
    );
  });
});
