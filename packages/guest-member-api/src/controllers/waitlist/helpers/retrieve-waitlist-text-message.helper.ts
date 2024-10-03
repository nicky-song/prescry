// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '@phx/common/src/models/language';
import { waitlistFieldKeyValues } from '../../../content/waitlist.content';

export function retrieveWaitlistTextMessage(
  fieldKey: string,
  language: Language
): string {
  return (
    waitlistFieldKeyValues
      ?.get(fieldKey)
      ?.find((waitlistKey) => waitlistKey.language === language)?.text || ''
  );
}
