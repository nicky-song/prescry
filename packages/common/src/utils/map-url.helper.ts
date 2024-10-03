// Copyright 2020 Prescryptive Health, Inc.

import { Platform } from 'react-native';

export class MapUrlHelper {
  public static getUrl(...args: string[]): string {
    const query = `?q=${args.join('+')}`;

    return (
      Platform.select({
        android: `maps.google.com/${query}`,
        ios: `maps.google.com/${query}`,
        web: `https://maps.google.com/${query}`,
      }) || `https://maps.google.com/${query}`
    );
  }
}
