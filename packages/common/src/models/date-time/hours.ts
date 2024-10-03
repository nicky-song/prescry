// Copyright 2018 Prescryptive Health, Inc.

export interface IHours {
  day: string;
  opens?: IHour;
  closes?: IHour;
}

export interface IHour {
  h?: number;
  m?: number;
  pm?: boolean;
}
