// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../../models/language';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { whatComesNextCMSContentWrapper } from '../../../../../state/cms-content/cms-content-wrappers/what-comes-next/what-comes-next.cms-content-wrapper';

export interface IPrescriptionAtThisPharmacySectionContent {
  instructions: string;
  heading: string;
  unAuthInformation: string;
  signUpButtonLabel: string;
}

export const usePrescriptionAtThisPharmacySectionContent = (): IPrescriptionAtThisPharmacySectionContent => {
  const { sessionState } = useSessionContext();
  const uiContent = whatComesNextCMSContentWrapper(
    defaultLanguage,
    sessionState.uiCMSContentMap
  );

  return {
    instructions: uiContent.prescriptionAtThisPharmacyInstructionsText,
    heading: uiContent.prescriptionAtThisPharmacyHeadingText,
    unAuthInformation:
      uiContent.prescriptionAtThisPharmacyUnAuthInformationText,
    signUpButtonLabel: uiContent.prescriptionAtThisPharmacySignUpText,
  };
};
