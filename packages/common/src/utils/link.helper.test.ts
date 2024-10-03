// Copyright 2018 Prescryptive Health, Inc.

import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { callPhoneNumber, goToUrl } from './link.helper';

let windowSpy: jest.SpyInstance;
const windowOpenMock = jest.fn();

let openURLSpy: jest.SpyInstance;

beforeEach(() => {
  windowOpenMock.mockReset();
  windowSpy = jest.spyOn(global, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    open: windowOpenMock,
  }));

  openURLSpy = jest
    .spyOn(Linking, 'openURL')
    .mockImplementation(() => Promise.resolve(true));
});

afterEach(() => {
  windowSpy.mockRestore();
  openURLSpy.mockRestore();
});

describe('goToUrl', () => {
  it('calls window open when platform is web', async () => {
    Platform.OS = 'web';
    const expectedUrl = 'www.someurl.com';
    await goToUrl(expectedUrl);
    expect(windowOpenMock).toHaveBeenCalledWith(expectedUrl, '_blank');
  });

  it('calls Linking.openUrl when platform is not web', async () => {
    Platform.OS = 'windows';
    const expectedUrl = 'www.someurl.com';
    await goToUrl(expectedUrl);
    expect(openURLSpy).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('callPhoneNumber', () => {
  it('calls Linking.openUrl', async () => {
    const phoneNumberMock = '+1(phoneNumber)';
    const expectedUrl = `tel:${phoneNumberMock}`;
    await callPhoneNumber(phoneNumberMock);
    expect(openURLSpy).toHaveBeenCalledWith(expectedUrl);
  });
});
