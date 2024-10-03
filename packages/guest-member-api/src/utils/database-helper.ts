// Copyright 2018 Prescryptive Health, Inc.

export type DatabaseConnectCallbackConnector = (
  connectionString: string,
  options: Record<string, unknown>,
  callback: (error?: Error) => void
) => void;

export type DatabaseConnectPromiseConnector = (
  connectionString: string,
  options: Record<string, unknown>
) => Promise<void>;

export function connectDatabaseWithCallback(
  connectionString: string,
  connect: DatabaseConnectCallbackConnector,
  options: Record<string, unknown>
): Promise<void> {
  return new Promise(
    (resolve: () => void, reject: (error: Error | string) => void) => {
      connect(connectionString, options, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }
  );
}
