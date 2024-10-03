// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ConfigContextProvider } from './config.context-provider';
import { ConfigContext, IConfigContext } from './config.context';
import { ITestContainer } from '../../../../testing/test.container';
import { GuestExperienceConfig } from '../../guest-experience-config';

jest.mock('./config.context', () => ({
  ConfigContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('ConfigContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as context provider', () => {
    const testRenderer = renderer.create(
      <ConfigContextProvider>
        <ChildMock />
      </ConfigContextProvider>
    );

    const provider = testRenderer.root.findByType(ConfigContext.Provider);

    const expectedContext: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
