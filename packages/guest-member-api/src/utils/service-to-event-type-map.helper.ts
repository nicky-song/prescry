// Copyright 2018 Prescryptive Health, Inc.

import {
  ServiceTypes,
  EventTypes,
} from '@phx/common/src/models/provider-location';

export function mapServiceTypeToEventType(value: string | undefined): string {
  switch (value) {
    case ServiceTypes.covid:
      return EventTypes.covid;
    case ServiceTypes.pcr:
      return EventTypes.pcr;
    case ServiceTypes.antigen:
    case ServiceTypes.abbottAntigen:
    case ServiceTypes.abbottAntigen30:
    case ServiceTypes.medicareAbbottAntigen:
    case ServiceTypes.medicaidAbbottAntigen:
    case ServiceTypes.covidAntigen25:
    case ServiceTypes.covidAntigen30:
    case ServiceTypes.covidAntigen35:
    case ServiceTypes.covidAntigen40:
    case ServiceTypes.covidAntigen45:
    case ServiceTypes.covidAntigen50:
    case ServiceTypes.covidAntigen55:
    case ServiceTypes.covidAntigen60:
    case ServiceTypes.covidAntigen65:
      return EventTypes.antigen;
    default:
      return `consent/${value}`;
  }
}
