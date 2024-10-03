// Copyright 2020 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { applyQuerySwitches } from '@phx/common/src/utils/features.helper';

import { getRequiredResponseLocal } from '../utils/request/request-app-locals.helper';
import { fetchRequestHeader } from '../utils/request-helper';
import {
  IFeaturesState,
  GuestExperienceFeatures,
} from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { unexpectedErrorResponse } from './middleware.helper';
import { isAccountTokenRequiredRoute } from './account-token.middleware';

export const featureSwitchesMiddleware =
  () => (request: Request, response: Response, next: NextFunction) =>
    middleware(request, response, next);

function middleware(request: Request, response: Response, next: NextFunction) {
  try {
    if (!isAccountTokenRequiredRoute(request.originalUrl)) {
      return next();
    }

    const features: IFeaturesState = {
      ...GuestExperienceFeatures,
    };

    const account = getRequiredResponseLocal(response, 'account');
    if (account.featuresDefault) {
      applyQuerySwitches(features, `f=${account.featuresDefault}`);
    }

    const switches = fetchRequestHeader(request, RequestHeaders.switches);
    if (switches) {
      applyQuerySwitches(features, switches);
    }
    response.locals.features = features;
    return next();
  } catch (error) {
    return unexpectedErrorResponse(error as Error, response);
  }
}
