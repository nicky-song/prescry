// Copyright 2021 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IPrescriptionPatientNameContent } from './prescription-patient-name.content';

export const prescriptionPatientNameCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionPatientNameContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionPatientName,
    2
  );
  return {
    forPatient: findContentValue('for-patient', uiContent),
  };
};
