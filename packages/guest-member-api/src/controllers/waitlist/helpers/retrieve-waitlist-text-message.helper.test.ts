// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '@phx/common/src/models/language';
import { WaitlistFieldKeysEnum } from '../../../content/waitlist.content';
import { retrieveWaitlistTextMessage } from './retrieve-waitlist-text-message.helper';

describe('retrieveWaitlistTextMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    [
      WaitlistFieldKeysEnum.waitlistAddedDifferentPhoneText,
      'English' as Language,
      'Hi {first-name} {last-name}, you have been added to {service-name} waitlist by {added-by-first-name} {added-by-last-name}. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"',
    ],
    [
      WaitlistFieldKeysEnum.waitlistAddedDifferentPhoneText,
      'Spanish' as Language,
      'Hola {first-name} {last-name}, usted ha sido añadido a la lista de espera de {service-name} por {added-by-first-name} {added-by-last-name}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"',
    ],
    [
      WaitlistFieldKeysEnum.waitlistAddedSamePhoneText,
      'English' as Language,
      'Hi {first-name} {last-name}, you have been added to {service-name} waitlist. If you would like to be removed from the waitlist and not receive text messages regarding that list, reply "remove"',
    ],
    [
      WaitlistFieldKeysEnum.waitlistAddedSamePhoneText,
      'Spanish' as Language,
      'Hola {first-name} {last-name}, usted ha sido añadido a la lista de espera de {service-name}. Si le gustaría ser removido de esta lista de espera y no recibir mensajes de texto acerca de esa lista, responda "remover"',
    ],
    [
      WaitlistFieldKeysEnum.waitlistRemoveSuccessText,
      'English' as Language,
      '{first-name} {last-name} has been removed from {service-name} waitlist',
    ],
    [
      WaitlistFieldKeysEnum.waitlistRemoveSuccessText,
      'Spanish' as Language,
      '{first-name} {last-name} ha sido removido de la lista de espera de {service-name}',
    ],
    [
      WaitlistFieldKeysEnum.waitlistRemoveFailureText,
      'English' as Language,
      'We were unable to remove {first-name} {last-name} from the waitlist. For further assistance, please contact support@prescryptive.com',
    ],
    [
      WaitlistFieldKeysEnum.waitlistRemoveFailureText,
      'Spanish' as Language,
      'No ha sido posible remover {first-name} {last-name} de la lista de espera. Para más ayuda por favor contacte support@prescryptive.com',
    ],
  ])(
    'should return correct text when WaitlistFieldKeysEnum is %p and Language is %p',
    (
      fieldKeyMock: string,
      languageMock: Language,
      waitlistFieldTextMessageExpected: string
    ) => {
      const waitlistFieldTextMessageActual = retrieveWaitlistTextMessage(
        fieldKeyMock,
        languageMock
      );

      expect(waitlistFieldTextMessageActual).toEqual(
        waitlistFieldTextMessageExpected
      );
    }
  );
});
