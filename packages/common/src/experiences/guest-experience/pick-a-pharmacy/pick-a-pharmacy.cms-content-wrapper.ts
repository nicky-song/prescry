// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { IPickAPharmacyContent } from './pick-a-pharmacy.content';

export const pickAPharmacyCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPickAPharmacyContent => {
  const uiContent = getContent(language, content, CmsGroupKey.pickAPharmacy, 2);

  return {
    eligibility: findContentValue('elegibility-label', uiContent),
    pickYourPharmacy: findContentValue('pick-your-pharmacy-label', uiContent),
    informationButtonLabel: findContentValue(
      'information-button-label',
      uiContent
    ),
    location: findContentValue('location-label', uiContent),
    noPharmacyFound: findContentValue('no-pharmacy-found-label', uiContent),
    youPayLabel: findContentValue('you-pay-label', uiContent),
    planPaysLabel: findContentValue('plan-pays-label', uiContent),
    distanceLabel: findContentValue('distance-label', uiContent),
    popUpModalText: findContentValue('popup-modal-text-label', uiContent),
    popUpModalLabel: findContentValue('popup-modal-label', uiContent),
    popUpModalContent: findContentValue('popup-modal-content-label', uiContent),
    noPharmaciesFoundErrorMessage: findContentValue(
      'no-pharmacies-found-error-message-label',
      uiContent
    ),
    noPharmaciesFoundErrorMessagePlural: findContentValue(
      'no-pharmacies-found-error-message-plural-label',
      uiContent
    ),
    pickYourPharmacySubText: findContentValue(
      'pick-your-pharmacy-sub-text',
      uiContent
    ),
    rtpbDescription: findContentValue('rtpb-description', uiContent),
  };
};
