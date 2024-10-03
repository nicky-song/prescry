// Copyright 2020 Prescryptive Health, Inc.

import { convertOutlookTimezoneToIANATimezone } from './appointment-timezone.helper';

describe('convertOutlookTimezoneToIANATimezone', () => {
  it.each([
    ['Pacific Standard Time', 'America/Los_Angeles'],
    ['Mountain Standard Time', 'America/Denver'],
    ['Central Standard Time', 'America/Chicago'],
    ['U.S. Eastern Standard Time', 'America/Indiana/Indianapolis'],
    ['Alaska - Annette Island', 'America/Los_Angeles'],
  ])(
    'converts to IANA timezone from Outlook timezone',
    (outlookTimezone: string, expectedIANATimezone: string) => {
      expect(convertOutlookTimezoneToIANATimezone(outlookTimezone)).toEqual(
        expectedIANATimezone
      );
    }
  );
});
