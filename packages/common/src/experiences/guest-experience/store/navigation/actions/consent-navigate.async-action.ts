// Copyright 2020 Prescryptive Health, Inc.

import { goToUrl } from '../../../../../utils/link.helper';

export const consentNavigateAsyncAction = async () => {
  const origin = window.location.origin;
  if (origin) {
    await goToUrl(origin + '/consent.html');
  }
};
