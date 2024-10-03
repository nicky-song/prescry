// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { whatComesNextCMSContentWrapper } from '../../../state/cms-content/cms-content-wrappers/what-comes-next/what-comes-next.cms-content-wrapper';

export interface IWhatComesNextScreenContent {
  anotherPharmacyLabel: string;
  anotherPharmacySubtitle: string;
  getStartedLabel: string;
  newPrescriptionLabel: string;
  newPrescriptionSubtitle: string;
}

export const useWhatComesNextScreenContent =
  (): IWhatComesNextScreenContent => {
    const { sessionState } = useSessionContext();
    const uiContent = whatComesNextCMSContentWrapper(
      defaultLanguage,
      sessionState.uiCMSContentMap
    );

    return {
      anotherPharmacyLabel: uiContent.whatComesNextAnotherPharmacy,
      anotherPharmacySubtitle: uiContent.whatComesNextAnotherPharmacySubtitle,
      newPrescriptionLabel: uiContent.whatComesNextNewPrescription,
      newPrescriptionSubtitle: uiContent.whatComesNextNewPrescriptionSubtitle,
      getStartedLabel: 'Get started',
    };
  };
