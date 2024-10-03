// Copyright 2023 Prescryptive Health, Inc.

export interface CreateFreeMemberAppointmentFixtureProps {
  primaryMemberData: {
    phoneNumber: string;
    address1: string;
    county: string;
    city: string;
    state: string;
    zip: string;
  };
  providerIdentifier: string;
  providerServiceType: string;
  requiredQuestionAnswers: {
    questionId: string;
    questionText: string;
    answer: string;
  }[];
  createCancellable: boolean;
}
