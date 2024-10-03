// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import {
  CmsCommunicationFieldKeysEnum,
  cmsCommunicationValueConstants,
} from '../../../constants/cms-communication-content';
import { findContentValue } from '@phx/common/src/utils/content/cms-content-wrapper.helper';
import { searchAndCacheCMSContent } from '../../../controllers/content/helpers/search-and-cache-cms-content';
import { defaultLanguage, Language } from '@phx/common/src/models/language';
import { CmsGroupKey } from '@phx/common/src/experiences/guest-experience/state/cms-content/cms-group-key';
import { ICommunicationContent } from '@phx/common/src/models/cms-content/communication.content';

export const getCMSCommunicationContent = async (
  configuration: IConfiguration,
  language?: Language
): Promise<Partial<ICommunicationContent>> => {
  const communicationContentResponse = await searchAndCacheCMSContent(
    configuration,
    CmsGroupKey.communication,
    language ?? defaultLanguage,
    2
  );

  const communicationContentResponseContent =
    communicationContentResponse.content;

  const pbmTextInformationMessage =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.pbmTextInformationMessage,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.pbmTextInformationMessage)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const cashTextInformationMessage =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.cashTextInformationMessage,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.cashTextInformationMessage)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const couponTextInformationMessage =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.couponTextInformationMessage,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.couponTextInformationMessage)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const supportPBMPhone =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.supportPBMPhone,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.supportPBMPhone)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const supportCashPhone =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.supportCashPhone,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.supportCashPhone)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const groupNumberText =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.groupNumberText,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.groupNumberText)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const pcnText =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.pcnText,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.pcnText)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const memberIdText =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.memberIdText,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.memberIdText)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const binText =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.binText,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.binText)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  const questionsText =
    (communicationContentResponseContent &&
      findContentValue(
        CmsCommunicationFieldKeysEnum.questionsText,
        communicationContentResponseContent
      )) ||
    cmsCommunicationValueConstants
      .get(CmsGroupKey.communication)
      ?.get(CmsCommunicationFieldKeysEnum.questionsText)
      ?.find((communicationKey) => communicationKey.language === language)
      ?.text;

  return {
    pbmTextInformationMessage,
    cashTextInformationMessage,
    couponTextInformationMessage,
    supportPBMPhone,
    supportCashPhone,
    groupNumberText,
    pcnText,
    memberIdText,
    binText,
    questionsText,
  };
};
