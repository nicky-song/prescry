// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '@phx/common/src/models/language';

export enum WaitlistFieldKeysEnum {
  waitlistAddedDifferentPhoneText = 'waitlist-added-different-phone-text',
  waitlistAddedSamePhoneText = 'waitlist-added-same-phone-text',
  waitlistRemoveSuccessText = 'waitlist-remove-success-text',
  waitlistRemoveFailureText = 'waitList-remove-failure-text',
}

export interface WaitlistContent {
  text: string;
  language: Language;
}

export const waitlistFieldKeyValues = new Map<string, WaitlistContent[]>([
  [
    WaitlistFieldKeysEnum.waitlistAddedDifferentPhoneText,
    [
      {
        text: 'Hi {first-name} {last-name}, you have been added to {service-name} waitlist by {added-by-first-name} {added-by-last-name}. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"',
        language: 'English',
      },
      {
        text: 'Hola {first-name} {last-name}, usted ha sido añadido a la lista de espera de {service-name} por {added-by-first-name} {added-by-last-name}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"',
        language: 'Spanish',
      },
    ],
  ],
  [
    WaitlistFieldKeysEnum.waitlistAddedSamePhoneText,
    [
      {
        text: 'Hi {first-name} {last-name}, you have been added to {service-name} waitlist. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"',
        language: 'English',
      },
      {
        text: 'Hola {first-name} {last-name}, usted ha sido añadido a la lista de espera de {service-name}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"',
        language: 'Spanish',
      },
    ],
  ],
  [
    WaitlistFieldKeysEnum.waitlistRemoveSuccessText,
    [
      {
        text: '{first-name} {last-name} has been removed from {service-name} waitlist',
        language: 'English',
      },
      {
        text: '{first-name} {last-name} ha sido removido de la lista de espera de {service-name}',
        language: 'Spanish',
      },
    ],
  ],
  [
    WaitlistFieldKeysEnum.waitlistRemoveFailureText,
    [
      {
        text: 'We were unable to remove {first-name} {last-name} from the waitlist. For further assistance, please contact support@prescryptive.com',
        language: 'English',
      },
      {
        text: 'No ha sido posible remover {first-name} {last-name} de la lista de espera. Para más ayuda por favor contacte support@prescryptive.com',
        language: 'Spanish',
      },
    ],
  ],
]);
