// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { IStaticFeedContextServiceItem } from '../static-feed';

export interface ITitleDescriptionContext {
  title?: string;
  description?: string;
  type?: string;
  markDownText?: string;
  services?: IStaticFeedContextServiceItem[];
  serviceType?: string;
}
export interface IFeedContext {
  defaultContext?: ITitleDescriptionContext;
}
export interface IFeedItem {
  feedCode: string;
  context?: IFeedContext;
}
export interface IFeedResponseData {
  feedItems: IFeedItem[];
}

export type IFeedResponse = IApiDataResponse<IFeedResponseData>;
