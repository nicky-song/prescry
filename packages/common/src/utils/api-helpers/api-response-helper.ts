// Copyright 2021 Prescryptive Health, Inc.

export class ApiResponseHelper {
  public static async getErrorMessageFromResponse(
    response: Response
  ): Promise<string> {
    const responseData = await response.json();

    if (responseData.error) {
      return responseData.error.message;
    }

    return responseData.message || response.statusText;
  }
}
