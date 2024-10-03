// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { FeaturesContextProvider } from './features.context-provider';
import { FeaturesContext, IFeaturesContext } from './features.context';
import { ITestContainer } from '../../../../testing/test.container';
import { GuestExperienceFeatures } from '../../guest-experience-features';

jest.mock('./features.context', () => ({
  FeaturesContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('FeaturesContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as context provider', () => {
    const testRenderer = renderer.create(
      <FeaturesContextProvider>
        <ChildMock />
      </FeaturesContextProvider>
    );

    const provider = testRenderer.root.findByType(FeaturesContext.Provider);

    const expectedContext: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
