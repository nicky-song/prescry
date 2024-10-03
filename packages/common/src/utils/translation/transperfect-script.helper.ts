// Copyright 2022 Prescryptive Health, Inc.

import { IGuestExperienceConfig } from '../../experiences/guest-experience/guest-experience-config';
import { LDFlagSet } from 'launchdarkly-js-sdk-common';

/**
 * Method to inject TransPerfect script into document head with key and url.
 * @param ldFlags param used for usetrans flag to decide on whether to inject script. (removable when considered stable and to use lang= convention)
 * @param config param used to retrieve key and url for TransPerfect
 */
export const transPerfectInject = (
  ldFlags: LDFlagSet,
  config: IGuestExperienceConfig
) => {
  const { usetrans } = ldFlags;
  const { transPerfectJavascriptUrl, transPerfectKey } = config;
  const containsScript = document.getElementsByName('transperfect-script');

  if (usetrans && !containsScript.length) {
    const transPerfectScript = document.createElement('script');
    transPerfectScript.setAttribute(
      'referrerpolicy',
      'no-referrer-when-downgrade'
    );
    transPerfectScript.setAttribute('type', 'text/javascript');
    transPerfectScript.setAttribute('src', transPerfectJavascriptUrl);
    transPerfectScript.setAttribute('data-oljs', transPerfectKey);
    transPerfectScript.setAttribute('name', 'transperfect-script');

    document.head.append(transPerfectScript);
  }
};
