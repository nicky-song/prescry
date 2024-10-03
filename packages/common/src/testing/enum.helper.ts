// Copyright 2021 Prescryptive Health, Inc.

export function intEnumLength(e: Record<string, unknown>): number {
  return Object.values(e).filter((v) => !isNaN(Number(v))).length;
}
