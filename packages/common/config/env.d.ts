// Copyright 2020 Prescryptive Health, Inc.

declare module '@phx/common/config/env' {
  export type EnvironmentMode = 'development' | 'production';
  export interface IEnvironment {
    mode: EnvironmentMode;
    isDev: boolean;
  }

  export default function env(): IEnvironment;
}
