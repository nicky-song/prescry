// Copyright 2021 Prescryptive Health, Inc.

import {
  isDesktopDevice,
  getContainerHeightMinusHeader,
} from './responsive-screen.helper';
import { Dimensions } from 'react-native';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 1024, height: 768 }),
  },
}));

describe('isDesktopDevice', () => {
  it.each([
    ['iPhone', false],
    ['iPad', false],
    ['Android', false],
    ['MacOS', true],
  ])(
    'returns correct value for desktop and mobile devices (deviceName: %p, isValidDesktopDevice: %p)',
    (deviceName: string, isValidDesktopDevice: boolean) => {
      const userAgentMock = jest.spyOn(navigator, 'userAgent', 'get');
      userAgentMock.mockReturnValue(deviceName);
      expect(isDesktopDevice()).toEqual(isValidDesktopDevice);
    }
  );
});

describe('getContainerHeightMinusHeader', () => {
  it('should get the height of a container minues the header in a device', () => {
    expect(getContainerHeightMinusHeader()).toEqual(
      Dimensions.get('window').height - 80
    );
  });
});
