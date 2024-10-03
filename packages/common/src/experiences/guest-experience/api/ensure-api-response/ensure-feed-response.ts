// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IFeedResponse } from '../../../../models/api-response/feed-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureFeedResponse = (responseJson: unknown) => {
  const response = responseJson as IFeedResponse;
  const isValid = response.data && response.data.feedItems;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
