// Copyright 2018 Prescryptive Health, Inc.

export const testExpressValidatorMiddleware = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middlewares: any
) => {
  await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middlewares.map(async (middleware: any) => {
      await middleware(request, response, () => undefined);
    })
  );
};
