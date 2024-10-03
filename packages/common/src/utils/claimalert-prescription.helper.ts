// Copyright 2022 Prescryptive Health, Inc.

import { ILoginScreenRouteProps } from '../experiences/guest-experience/login-screen/login-screen';

export const getClaimAlertOrPrescriptionIdFromUrl = (
  urlPath: string
): ILoginScreenRouteProps | undefined => {
  const resource = (urlPath || '').replace(/\//g, '').trim().toLowerCase();
  if (
    resource === 'activate' ||
    resource === 'results' ||
    resource === 'checkoutresult' ||
    resource.startsWith('appointment') ||
    resource === 'invite' ||
    urlPath.split('/')[1] === 'p'
  ) {
    return undefined;
  }
  if (resource.startsWith('prescription') || resource.startsWith('cabinet')) {
    const isCabinet = resource.startsWith('cabinet');
    const pathIndex = isCabinet ? 3 : 2;
    const isBlockchain = urlPath.split('/')[2] === 'bc';

    const prescriptionId = urlPath.split('/')[pathIndex];

    return { prescriptionId, isBlockchain };
  } else {
    return {
      claimAlertId: resource,
    };
  }
};
