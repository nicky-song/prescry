// Copyright 2022 Prescryptive Health, Inc.

export interface IMapBoxFeatureContext {
  id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

export interface IMapBoxFeatureGeometry {
  type: string;
  coordinates: number[];
  interpolated?: boolean;
}

export interface IMapBoxFeature {
  id: string;
  type?: string;
  place_type?: string[];
  relevance?: number;
  properties?: Record<string, string>;
  text?: string;
  place_name?: string;
  center?: number[];
  geometry?: IMapBoxFeatureGeometry;
  address?: string;
  context?: IMapBoxFeatureContext[];
}

export interface IMapBoxResponse {
  type: string;
  query: string[];
  features: IMapBoxFeature[];
  attribution?: string;
}
