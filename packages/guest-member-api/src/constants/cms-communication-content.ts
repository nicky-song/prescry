// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '@phx/common/src/experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '@phx/common/src/models/language';

export enum CmsCommunicationFieldKeysEnum {
  supportCashPhone = 'support-cash-phone',
  supportPBMPhone = 'support-pbm-phone',
  pbmTextInformationMessage = 'pbm-text-information-message',
  cashTextInformationMessage = 'cash-text-information-message',
  couponTextInformationMessage = 'coupon-text-information-message',
  groupNumberText = 'group-number-text',
  pcnText = 'pcn-text',
  memberIdText = 'member-id-text',
  binText = 'bin-text',
  questionsText = 'questions-text',
}

export interface CmsCommunicationContent {
  fieldKey: string;
  text: string;
  language: Language;
}

const cmsCommunicationFieldKeyValues = new Map<
  CmsCommunicationFieldKeysEnum,
  CmsCommunicationContent[]
>([
  [
    CmsCommunicationFieldKeysEnum.supportCashPhone,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.supportCashPhone,
        text: '+14256552300',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.supportCashPhone,
        text: '+14256552300',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.supportPBMPhone,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.supportPBMPhone,
        text: '+12066869016',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.supportPBMPhone,
        text: '+12066869016',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.pbmTextInformationMessage,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.pbmTextInformationMessage,
        text: 'Share your insurance card with your pharmacy when you pick up your medication.',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.pbmTextInformationMessage,
        text: 'Comparta la tarjeta de su seguro con su farmacia al momento de recoger su medicamento.',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.cashTextInformationMessage,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.cashTextInformationMessage,
        text: 'Share your SmartPRICE™ card with your pharmacy when you pick up your medication.',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.cashTextInformationMessage,
        text: 'Comparta su tarjeta SmartPRICE™ con su farmacia al momento de recoger su medicamento.',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.couponTextInformationMessage,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.couponTextInformationMessage,
        text: 'Thank you for transferring your prescription. Please share this info with your pharmacy to save on medications:',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.couponTextInformationMessage,
        text: 'Gracias por transferir su prescripción. Por favor comparta esta información con su farmacia para ahorrar en sus medicaciones:',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.groupNumberText,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.groupNumberText,
        text: 'Group Number:',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.groupNumberText,
        text: 'Grupo:',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.pcnText,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.pcnText,
        text: 'PCN:',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.pcnText,
        text: 'PCN:',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.memberIdText,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.memberIdText,
        text: 'Member ID:',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.memberIdText,
        text: 'ID de miembro:',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.binText,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.binText,
        text: 'BIN:',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.binText,
        text: 'BIN:',
        language: 'Spanish',
      },
    ],
  ],
  [
    CmsCommunicationFieldKeysEnum.questionsText,
    [
      {
        fieldKey: CmsCommunicationFieldKeysEnum.questionsText,
        text: 'Questions?',
        language: 'English',
      },
      {
        fieldKey: CmsCommunicationFieldKeysEnum.questionsText,
        text: '¿Preguntas?',
        language: 'Spanish',
      },
    ],
  ],
]);

export const cmsCommunicationValueConstants = new Map<
  CmsGroupKey,
  Map<CmsCommunicationFieldKeysEnum, CmsCommunicationContent[]>
>([[CmsGroupKey.communication, cmsCommunicationFieldKeyValues]]);
