// Copyright 2023 Prescryptive Health, Inc.

import fetch, { Response } from 'node-fetch';
import { PharmacyPortalTokenHandler } from './tokens/pharmacy-portal-token-handler';

export abstract class ProcedureService {
  public static recordProcedure = async (procedure: {
    operationName: string;
    variables: {
      id: string;
      procedureResults: {
        procedureResultId: string;
        text: string;
        answerId: string;
        answerText: string;
      }[];
    };
    query: string;
  }) => {
    const accessToken = await PharmacyPortalTokenHandler.getToken();
    if (accessToken === undefined) {
      throw new Error(`Cannot record procedure, Access Token was not acquired`);
    }

    const baseUrl = process.env.PHARMACY_PORTAL_BASE_API_URL;
    if (baseUrl === undefined)
      throw new Error('Pharmacy Portal URL is not defined');

    const apiResponse: Response = await fetch(
      `${baseUrl}/api/provider/graphql`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(procedure),
      }
    );

    if (!apiResponse.ok) {
      throw new Error(
        `Procedure not recorded. HTTP Error Response: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }
  };
}
