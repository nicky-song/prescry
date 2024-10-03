// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { GuestExperienceFeatures } from '../../guest-experience-features';
import { IFeaturesContext, FeaturesContext } from './features.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('FeaturesContext', () => {
  it('creates context', () => {
    expect(FeaturesContext).toBeDefined();

    const expectedContext: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
