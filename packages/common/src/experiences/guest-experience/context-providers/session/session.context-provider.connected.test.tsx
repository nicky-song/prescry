// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../store/root-reducer';
import { ISessionContextProviderProps } from './session.context-provider';
import { mapStateToProps } from './session.context-provider.connected';

describe('SessionContextProviderConnected', () => {
  it('maps state', () => {
    const mappedProps: Partial<ISessionContextProviderProps> = mapStateToProps({
      securePin: {
        isAuthExperience: true,
        isUserAuthenticated: false,
      },
    } as RootState);

    const expectedProps: Partial<ISessionContextProviderProps> = {
      isUnauthExperience: false,
      isUserAuthenticated: false,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
