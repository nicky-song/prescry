// Copyright 2023 Prescryptive Health, Inc.

export const recordProcedureTemplate = {
  operationName: 'recordProcedure',
  variables: {
    id: '',
    procedureResults: [
      {
        procedureResultId: 'test-result',
        text: 'Test result',
        answerId: '',
        answerText: '',
      },
      {
        procedureResultId: 'provider-npi',
        text: 'Prescriber NPI',
        answerId: '',
        answerText: '',
      },
      {
        procedureResultId: 'prescriber-first-name',
        text: 'Prescriber first name',
        answerId: '',
        answerText: '',
      },
      {
        procedureResultId: 'prescriber-last-name',
        text: 'Prescriber last name',
        answerId: '',
        answerText: '',
      },
      {
        procedureResultId: 'procedure-date',
        text: 'Date of service',
        answerId: '',
        answerText: '',
      },
    ],
  },
  query:
    'mutation recordProcedure($id: ID, $procedureResults: [ProcedureResultInput]) {\n  recordProcedure(id: $id, procedureResults: $procedureResults) {\n    id\n    procedure {\n      results {\n        procedureResultId\n        text\n        answerId\n        answerText\n        type\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
};
