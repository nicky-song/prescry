// Copyright 2018 Prescryptive Health, Inc.

import { resetURLAfterNavigation } from './navigation-reducer.helper';
import { handleNavigateToHome } from './handle-navigate-to-home';
import { GuestExperienceFeatures } from '../../guest-experience-features';

jest.mock('./handle-navigate-to-home');
const handleNavigateToHomeMock = handleNavigateToHome as jest.Mock;

const featureHelper = jest.requireActual(
  '@phx/common/src/experiences/guest-experience/guest-experience-features'
);

describe('resetURLAfterNavigation', () => {
  beforeEach(() => {
    handleNavigateToHomeMock.mockReset();
  });

  it('appends each feature flag to a featureUrl string', () => {
    featureHelper.GuestExperienceFeatures = {
      ...GuestExperienceFeatures,
      usehome: true,
    };

    resetURLAfterNavigation(featureHelper.GuestExperienceFeatures);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith('?f=usehome:1');
  });

  it('only appends legacy feature flags', () => {
    featureHelper.GuestExperienceFeatures = {
      ...GuestExperienceFeatures,
      usehome: true,
    };
    resetURLAfterNavigation(featureHelper.GuestExperienceFeatures);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith('?f=usehome:1');
  });
});
