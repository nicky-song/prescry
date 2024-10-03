// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../language';

export interface IContentWithIsLoading<TContent> {
  content: TContent;
  isContentLoading: boolean;
  fetchCMSContent: (lang: Language) => void;
}
