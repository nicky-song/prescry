import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { SessionContextProvider } from '../src/experiences/guest-experience/context-providers/session/session.context-provider';
import { defaultSessionState } from '../src/experiences/guest-experience/state/session/session.state';
import { MediaQueryContextProvider } from '../src/experiences/guest-experience/context-providers/media-query/media-query.context-provider';
import { NavigationContainer } from '@react-navigation/native';
import { initializeFontAwesomeIcon } from '../src/components/icons/font-awesome/font-awesome.icon';
import { FontAwesome5ProIcon } from '../src/storybook/font-awesome-5-pro.icon';
import { loadStaticContent } from '../src/storybook/load-static-content';

export const parameters = {
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#fff'
      },
      {
        name: 'purple',
        value: '#6240a3'
      }
    ]
  },
  viewport: {
    defaultViewport: 'galaxys5',
    viewports: INITIAL_VIEWPORTS
  }
}


initializeFontAwesomeIcon(FontAwesome5ProIcon);

export const loaders = [
  async () => ({
    imageLoader: require('../src/storybook/storybook.image.helper'),
  }),
];

const drugFormMap = new Map([
  [
    'CAPS',
    {
      formCode: 'CAPS',
      abbreviation: 'Capsule',
      description: 'Capsule',
    },
  ],
  [
    'KIT',
    {
      formCode: 'KIT',
      abbreviation: 'Kit',
      description: 'Kit',
    },
  ],
  [
    'MISC',
    {
      formCode: 'MISC',
      abbreviation: 'Misc',
      description: 'Miscellaneous',
    },
  ],
  [
    'PEN',
    {
      formCode: 'PEN',
      abbreviation: 'Pen-injector',
      description: 'Pen-injector',
    },
  ],
  [
    'SOLN',
    {
      formCode: 'SOLN',
      abbreviation: 'Solution',
      description: 'Solution',
    },
  ],
  [
    'SOPN',
    {
      formCode: 'SOPN',
      abbreviation: 'Soln Pen-inj',
      description: 'Solution Pen-injector',
    },
  ],
  [
    'TAB',
    {
      formCode: 'TAB',
      abbreviation: 'Tablet',
      description: 'Tablet',
    },
  ],
]);


const injectedSessionState = {
  ...defaultSessionState,
  drugFormMap,
  uiCMSContentMap: loadStaticContent()
}

export const decorators = [
  (Story) => (
    <MediaQueryContextProvider>
      <SessionContextProvider injectedSessionState={injectedSessionState}>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
      </SessionContextProvider>
    </MediaQueryContextProvider>
  ),
]