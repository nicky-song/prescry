// Copyright 2022 Prescryptive Health, Inc.

import { IContentWithIsLoading } from '../../../../../../models/cms-content/content-with-isloading.model';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { usePbmProfileCobrandingContent } from '../../../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { ISwitchYourMedicationSlideUpModalContent } from './switch-your-medication.slide-up-modal.content';

export type SwitchYourMedicationSlideUpModalCobrandingContent = Pick<
  IContentWithIsLoading<ISwitchYourMedicationSlideUpModalContent>,
  'content' | 'isContentLoading'
> & { isCobranding: boolean };

export const useSwitchYourMedicationSlideUpModalCobrandingContentHelper =
  (): SwitchYourMedicationSlideUpModalCobrandingContent => {
    const { content, isContentLoading } =
      useContent<ISwitchYourMedicationSlideUpModalContent>(
        CmsGroupKey.switchYourMedicationSlideUpModal,
        2
      );

    const {
      recommendedAltsSlideUpModalHeading,
      recommendedAltsSlideUpModalContent,
    } = usePbmProfileCobrandingContent();

    const isCobranding =
      !!recommendedAltsSlideUpModalContent &&
      !!recommendedAltsSlideUpModalHeading;

    const heading =
      isCobranding && recommendedAltsSlideUpModalHeading
        ? recommendedAltsSlideUpModalHeading
        : content.heading;
    const description =
      isCobranding && recommendedAltsSlideUpModalContent
        ? recommendedAltsSlideUpModalContent
        : content.description;

    return {
      content: {
        ...content,
        heading,
        description,
      },
      isContentLoading,
      isCobranding,
    };
  };
