// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import { loadDefaultLanguageContentIfSpecifiedAbsent } from '../../../../../utils/cms-content.helper';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { getUIContent } from '../../../api/api-v1.get-ui-content';
import { IGetCMSContentAsyncActionArgs } from '../async-actions/get-cms-content.async-action';
import { setCMSContentDispatch } from './set-cms-content.dispatch';

export const getCMSContentDispatch = async ({
  sessionDispatch,
  reduxGetState,
  reduxDispatch,
  version,
  language,
  groupKey,
  uiCMSContentMap,
  experience,
  cmsRefreshInterval,
}: IGetCMSContentAsyncActionArgs): Promise<
  Map<string, IUIContentGroup> | undefined
> => {
  const specifiedLanguageArgs: IGetCMSContentAsyncActionArgs = {
    reduxDispatch,
    sessionDispatch,
    reduxGetState,
    version,
    language,
    groupKey,
    uiCMSContentMap,
    experience,
    cmsRefreshInterval,
  };
  const state = reduxGetState();
  const { config } = state;
  const apiConfig = config.apis.guestExperienceApi;

  let clonedUiCMSContentMap =
    uiCMSContentMap ?? new Map<string, IUIContentGroup>();

  const defaultUiContentGroup: IUIContentGroup = {
    content: [],
    isContentLoading: true,
    lastUpdated: 0,
  };

  try {
    if (groupKey) {
      const currentUiCMSContent = uiCMSContentMap?.get(groupKey);

      if (currentUiCMSContent) {
        clonedUiCMSContentMap.set(groupKey, {
          ...currentUiCMSContent,
          isContentLoading:
            currentUiCMSContent.content.length &&
            getNewDate().getTime() -
              (uiCMSContentMap?.get(groupKey)?.lastUpdated ?? 0) <
              (cmsRefreshInterval ?? 0)
              ? false
              : true,
        });
      }

      setCMSContentDispatch(
        sessionDispatch,
        groupKey,
        currentUiCMSContent
          ? {
              ...currentUiCMSContent,
              isContentLoading: currentUiCMSContent.content.length
                ? false
                : true,
            }
          : defaultUiContentGroup
      );

      const uiContent = await getUIContent(
        apiConfig,
        version,
        language,
        groupKey,
        clonedUiCMSContentMap,
        experience
      );

      if (uiContent) {
        const updatedUiContent = uiContent?.get(groupKey);
        if (updatedUiContent && updatedUiContent.content.length) {
          setCMSContentDispatch(sessionDispatch, groupKey, {
            ...updatedUiContent,
            isContentLoading: false,
          });
        } else {
          const replacedAbsentContentMap =
            await loadDefaultLanguageContentIfSpecifiedAbsent(
              reduxDispatch,
              reduxGetState,
              sessionDispatch,
              specifiedLanguageArgs,
              defaultLanguage,
              groupKey,
              uiCMSContentMap ?? new Map(),
              experience
            );

          const updatedReplacedUiContent =
            replacedAbsentContentMap?.get(groupKey);

          if (updatedReplacedUiContent) {
            clonedUiCMSContentMap = replacedAbsentContentMap;
            clonedUiCMSContentMap?.set(groupKey, {
              ...updatedReplacedUiContent,
              isContentLoading: false,
            });
          }
        }

        return uiContent;
      }
    }
  } catch {
    setCMSContentDispatch(sessionDispatch, groupKey ?? '', {
      ...defaultUiContentGroup,
      isContentLoading: false,
    });
    return undefined;
  }

  return undefined;
};
