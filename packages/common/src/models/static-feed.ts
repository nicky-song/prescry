// Copyright 2020 Prescryptive Health, Inc.

import { Language } from './language';

export interface IStaticFeed {
  audience?: IStaticFeedAudience;
  enabled: boolean;
  endDate?: Date;
  feedCode: string;
  priority: number;
  startDate?: Date;
  context?: IStaticFeedContext;
}
export interface IStaticFeedAudience {
  exclude?: string[];
  include?: string[];
}

export interface IStaticFeedContextServiceItemSubText {
  language: Language;
  markDownText: string;
}

export interface IStaticFeedContextServiceItem {
  title: string;
  description: string;
  serviceType: string;
  subText?: IStaticFeedContextServiceItemSubText[];
  minAge?: number;
  featureFlag?: string;
  cost?: string;
  enabled: boolean;
}

export interface IStaticFeedContext {
  title?: string;
  description?: string;
  type?: string;
  markDownText?: string;
  minAge?: number;
  serviceList?: IStaticFeedContextServiceItem[];
  serviceType?: string;
  featureFlag?: string;
}
