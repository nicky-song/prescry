// Copyright 2020 Prescryptive Health, Inc.

import { goToUrl } from '../../../../../utils/link.helper';
import { consentNavigateAsyncAction } from './consent-navigate.async-action';

jest.mock('../../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

describe('consentNavigateAsyncAction', () => {
  const initialWindowLocation: Location = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete window.location;
    window.location = { origin: 'https://test.com' } as Location;
  });

  afterEach(() => {
    window.location = initialWindowLocation;
  });

  it('Opens consent webpage from origin', async () => {
    await consentNavigateAsyncAction();
    expect(goToUrlMock).toHaveBeenCalledWith('https://test.com/consent.html');
  });

  it.each([[undefined], ['']])(
    'Does not open consent webpage if origin is falsy: %s',
    async (originMock: string | undefined) => {
      // @ts-ignore
      delete window.location;
      window.location = { origin: originMock } as Location;
      await consentNavigateAsyncAction();
      expect(goToUrlMock).not.toHaveBeenCalled();
    }
  );
});
