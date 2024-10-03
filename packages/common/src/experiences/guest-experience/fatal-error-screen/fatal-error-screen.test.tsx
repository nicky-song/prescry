// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { useRoute } from '@react-navigation/native';
import renderer from 'react-test-renderer';
import {
  FatalError,
  IFatalErrorProps,
} from '../../../components/member/fatal-error/fatal-error';
import { useConfigContext } from '../context-providers/config/use-config-context.hook';

import { FatalErrorScreen } from './fatal-error-screen';

jest.mock('../../../components/member/fatal-error/fatal-error', () => ({
  FatalError: () => <div />,
}));

jest.mock('@react-navigation/native');
const useRouteMock = useRoute as jest.Mock;

jest.mock('../context-providers/config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

describe('FatalErrorScreen', () => {
  
  it('should have fatalError component that uses errorMessage passed in route', () => {
    const mockError =
      'please access <b>myrx.io</b> from you mobile <b>link</b>';
    const mockEmail = 'test@test.com';
    
    useRouteMock.mockReturnValue({ 
      params: { 
        errorMessage: mockError,
      } 
    });
    useConfigContextMock.mockReturnValue({
      configState: {
        supportEmail: mockEmail,
      },
    });
    
    const fatalError = renderer.create(<FatalErrorScreen />);
    const fatalErrorProps = fatalError.root.findByType(FatalError)
      .props as IFatalErrorProps;
    
    expect(fatalErrorProps.errorMessage).toBe(mockError);
    expect(fatalErrorProps.supportEmail).toBe(mockEmail);
  });

  it('should have fatalError component and use default errorMessage if not passed', () => {
    const mockConfigEmail = 'config@test.com';
    
    useRouteMock.mockReturnValue({
      params: {}
    });
    useConfigContextMock.mockReturnValue({
      configState: { supportEmail: mockConfigEmail },
    });

    const fatalError = renderer.create(<FatalErrorScreen />);
    const fatalErrorProps = fatalError.root.findByType(FatalError)
      .props as IFatalErrorProps;
    
    expect(fatalErrorProps.errorMessage).toBe('');
    expect(fatalErrorProps.supportEmail).toBe(mockConfigEmail);
  });
});
