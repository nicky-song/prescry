// Copyright 2020 Prescryptive Health, Inc.

export function convertOutlookTimezoneToIANATimezone(
  timezone?: string
): string {
  switch (timezone) {
    case 'Pacific Standard Time':
      return 'America/Los_Angeles';
    case 'Mountain Standard Time':
      return 'America/Denver';
    case 'U.S. Mountain Standard Time':
      return 'America/Phoenix';
    case 'Central Standard Time':
      return 'America/Chicago';
    case 'U.S. Eastern Standard Time':
      return 'America/Indiana/Indianapolis';
    case 'Alaskan Standard Time':
      return 'America/Anchorage';
    case 'Hawaiian Standard Time':
      return 'Pacific/Honolulu';
    case 'Eastern Standard Time':
      return 'America/New_York';
  }
  return 'America/Los_Angeles';
}
