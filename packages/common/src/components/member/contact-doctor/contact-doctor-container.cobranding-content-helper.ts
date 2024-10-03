// Copyright 2022 Prescryptive Health, Inc.

import { IContentWithIsLoading } from '../../../models/cms-content/content-with-isloading.model';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IContactDoctorContainerContent } from './contact-doctor-container.content';
import { usePbmProfileCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';

export type ContactDoctorContainerCobrandingContent = Pick<
  IContentWithIsLoading<
    IContactDoctorContainerContent & {
      switchYourMedsProviderName?: string;
      switchYourMedsPhoneNumber?: string;
    }
  >,
  'content' | 'isContentLoading'
> & { isCobranding: boolean };

export const useContactDoctorContainerCobrandingContentHelper =
  (): ContactDoctorContainerCobrandingContent => {
    const { content, isContentLoading } =
      useContent<IContactDoctorContainerContent>(CmsGroupKey.contactDoctor, 2);

    const {
      switchYourMedsCallButtonLabel,
      switchYourMedsDescription: cobrandingSwitchYourMedsDescription,
      switchYourMedsProviderName: cobrandingSwitchYourMedsProviderName,
      switchYourMedsPhoneNumber: cobrandingSwitchYoursMedsPhoneNumber,
    } = usePbmProfileCobrandingContent();

    const isCobranding =
      !!switchYourMedsCallButtonLabel &&
      !!cobrandingSwitchYourMedsDescription &&
      !!cobrandingSwitchYourMedsProviderName &&
      !!cobrandingSwitchYoursMedsPhoneNumber;

    const callNowButtonLabel =
      isCobranding && switchYourMedsCallButtonLabel
        ? switchYourMedsCallButtonLabel
        : content.callNowButtonLabel;

    const switchYourMedsDescription =
      isCobranding && cobrandingSwitchYourMedsDescription
        ? cobrandingSwitchYourMedsDescription
        : content.switchYourMedsDescription;

    const switchYourMedsProviderName =
      isCobranding && cobrandingSwitchYourMedsProviderName
        ? cobrandingSwitchYourMedsProviderName
        : undefined;

    const switchYourMedsPhoneNumber =
      isCobranding && cobrandingSwitchYoursMedsPhoneNumber
        ? cobrandingSwitchYoursMedsPhoneNumber
        : undefined;

    return {
      content: {
        ...content,
        callNowButtonLabel,
        switchYourMedsDescription,
        switchYourMedsProviderName,
        switchYourMedsPhoneNumber,
      },
      isContentLoading,
      isCobranding,
    };
  };
