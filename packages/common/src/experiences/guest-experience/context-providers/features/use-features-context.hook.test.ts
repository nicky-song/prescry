// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useFeaturesContext } from './use-features-context.hook';
import { IFeaturesContext } from './features.context';
import { GuestExperienceFeatures } from '../../guest-experience-features';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useFeaturesContext', () => {
  it('returns expected context', () => {
    const contextMock: IFeaturesContext = {
      featuresState: GuestExperienceFeatures,
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IFeaturesContext = useFeaturesContext();
    expect(context).toEqual(contextMock);
  });
});
