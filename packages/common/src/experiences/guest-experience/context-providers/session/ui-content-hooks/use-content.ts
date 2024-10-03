// Copyright 2022 Prescryptive Health, Inc.

import { useEffect } from 'react';
import { CMSContentVersion } from '../../../../../models/cms-content/content-version';
import { IContentWithIsLoading } from '../../../../../models/cms-content/content-with-isloading.model';
import {
  CMSExperience,
  CMSExperienceEnum,
} from '../../../../../models/cms-content/experience.cms-content';
import { defaultLanguage, Language } from '../../../../../models/language';
import {
  getCMSContent,
  IGetCMSContent,
} from '../../../../../utils/cms-content.helper';
import { mapUIContentMap } from '../../../../../utils/content/map-ui-content-map.helper';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { useConfigContext } from '../../config/use-config-context.hook';
import { useReduxContext } from '../../redux/use-redux-context.hook';
import { useSessionContext } from '../use-session-context.hook';

export type IContent = Map<string, IContentWithIsLoading<unknown>>;

/**
 * Generic Custom hook to lazy load content from Strapi.
 * @param groupKey strapi groupKey of the content.
 * @param contentVersion defines Strapi content version
 * @param experience experience key of the content (when experience is MyRxCobranding it adds co branding content).
 * @typeparam useContent<`TContent`>(groupKey) - Interface parameter that defines the returned content interface.
 *
 * e.g.
 * ```
 * const { content, isContentLoading } =
 * useContent<IOrderConfirmationContent>(groupKey)
 * ```
 * Accepted interfaces:
 * ```
 * IOrderConfirmationContent | ITransferFlowContent | ISmartPriceScreenContent | IWhatComesNextScreenContent
 * IVerifyPrescriptionScreenContent | IGetStartedModalContent | ICobrandingContent | IGlobalContent | ISignUpContent | ISignInContent
 * ```
 */
export const useContent = <TContent>(
  groupKey: string,
  contentVersion?: CMSContentVersion,
  experience?: CMSExperience,
  useCurrentLanguage?: boolean
): IContentWithIsLoading<TContent> => {
  const isCobrandingExperience =
    experience === CMSExperienceEnum.MYRX_COBRANDING;

  const {
    configState: { cmsRefreshInterval },
  } = useConfigContext();

  const { getState: reduxGetState, dispatch: reduxDispatch } =
    useReduxContext();
  const {
    sessionState: { currentLanguage, uiCMSContentMap },
    sessionDispatch,
  } = useSessionContext();

  const usedLanguage = useCurrentLanguage ? currentLanguage : defaultLanguage;

  const fetchCMSContent = async (lang?: Language) => {
    const args: IGetCMSContent = {
      reduxDispatch,
      reduxGetState,
      sessionDispatch,
      language: lang ?? usedLanguage,
      groupKey,
      uiCMSContentMap,
      experience,
      version: contentVersion,
      cmsRefreshInterval,
    };

    await getCMSContent(args);
  };

  useEffect(() => {
    const isContentNotLoaded =
      (groupKey.length &&
        !uiCMSContentMap.get(groupKey)?.isContentLoading &&
        !uiCMSContentMap.get(groupKey)?.content.length) ||
      (groupKey.length &&
        !uiCMSContentMap.get(groupKey)?.isContentLoading &&
        getNewDate().getTime() -
          (uiCMSContentMap?.get(groupKey)?.lastUpdated ?? 0) >
          cmsRefreshInterval);

    if (isContentNotLoaded) {
      void fetchCMSContent();
    }
  }, []);

  const contentMap = mapUIContentMap(
    usedLanguage,
    uiCMSContentMap,
    isCobrandingExperience ? groupKey : undefined
  );

  return {
    ...contentMap.get(groupKey),
    fetchCMSContent,
  } as IContentWithIsLoading<TContent>;
};
