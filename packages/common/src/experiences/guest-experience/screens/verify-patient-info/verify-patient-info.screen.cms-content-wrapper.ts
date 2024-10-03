// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IVerifyPatientInfoScreenContent } from './verify-patient-info.screen.content';

export const verifyPatientInfoScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IVerifyPatientInfoScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.verifyPatientInfoScreen,
    2
  );

  return {
    verifyPatientInfoTitle: findContentValue(
      'verify-patient-info-title',
      uiContent
    ),
    verifyPatientInfoDescription: findContentValue(
      'verify-patient-info-description',
      uiContent
    ),
    firstNameLabel: findContentValue('first-name-label', uiContent),
    firstNamePlaceholder: findContentValue('first-name-placeholder', uiContent),
    lastNameLabel: findContentValue('last-name-label', uiContent),
    lastNamePlaceholder: findContentValue('last-name-placeholder', uiContent),
    dateOfBirthLabel: findContentValue('date-of-birth-label', uiContent),
    authorizationStatement: findContentValue(
      'authorization-statement',
      uiContent
    ),
    footerButtonLabel: findContentValue('footer-button-label', uiContent),
  };
};
