// Copyright 2018 Prescryptive Health, Inc.

import { mapServiceTypeToEventType } from './service-to-event-type-map.helper';
import { EventTypes } from '@phx/common/src/models/provider-location';

describe('mapServiceTypeToEventType', () => {
  it.each([
    ['COVID-19 Antibody Testing', EventTypes.covid],
    ['COVID-19 Antigen Testing', EventTypes.antigen],
    ['test-covid19-pcr-cquentia', EventTypes.pcr],
    ['abbott_antigen', EventTypes.antigen],
    ['medicare_abbott_antigen', EventTypes.antigen],
    ['medicaid_abbott_antigen', EventTypes.antigen],
    ['covid-antigen-25', EventTypes.antigen],
    ['covid-antigen-30', EventTypes.antigen],
    ['C19Vaccine', 'consent/C19Vaccine'],
    ['c19-vaccine-dose1', 'consent/c19-vaccine-dose1'],
    ['c19-vaccine-dose2', 'consent/c19-vaccine-dose2'],
    [undefined, 'consent/undefined'],
  ])(
    'should return the expected event type for given service type',
    (stringFromUI: string | undefined, eventType: string) => {
      expect(mapServiceTypeToEventType(stringFromUI)).toEqual(eventType);
    }
  );
});
