// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

export interface IFavoritePharmaciesScreenContent {
  favoritePharmaciesTitle: string;
  favoritePharmaciesErrorMessage: string;
}

export const favoritePharmaciesScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IFavoritePharmaciesScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.favoritePharmaciesScreen,
    2
  );

  return {
    favoritePharmaciesTitle: findContentValue(
      'favorite-pharmacies-title',
      uiContent
    ),
    favoritePharmaciesErrorMessage: findContentValue(
      'favorite-pharmacies-error-message',
      uiContent
    ),
  };
};
