// Copyright 2020 Prescryptive Health, Inc.

import { Platform } from 'react-native';
import { MapUrlHelper } from './map-url.helper';

Platform.select = jest.fn();
const selectMock = Platform.select as jest.Mock;

describe('MapUrlHelper', () => {
  it('creates map url (web)', () => {
    selectMock.mockImplementation((platformObj) => platformObj.web);
    createsMapUrl('https://maps.google.com');
  });

  it('creates map url (android)', () => {
    selectMock.mockImplementation((platformObj) => platformObj.android);
    createsMapUrl('maps.google.com');
  });

  it('creates map url (ios)', () => {
    selectMock.mockImplementation((platformObj) => platformObj.ios);
    createsMapUrl('maps.google.com');
  });

  function createsMapUrl(expectedOrigin: string) {
    expect(MapUrlHelper.getUrl('a')).toEqual(`${expectedOrigin}/?q=a`);
    expect(MapUrlHelper.getUrl('a', 'b')).toEqual(`${expectedOrigin}/?q=a+b`);
    expect(MapUrlHelper.getUrl('a', 'b', 'c')).toEqual(
      `${expectedOrigin}/?q=a+b+c`
    );
  }
});
