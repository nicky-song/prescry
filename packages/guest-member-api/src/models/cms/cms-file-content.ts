// Copyright 2022 Prescryptive Health, Inc.

export interface ICmsFileContent {
  _id: string;
  name: string;
  alternativeText: string;
  caption: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  provider: string;
  width?: number;
  height?: number;
  related: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
