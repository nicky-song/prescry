// Copyright 2022 Prescryptive Health, Inc.

export type Validator<OT> = (fields: OT) => boolean;

export type Validators<Out> = Record<string, (fields: Out) => boolean>;

export type ScenarioGenerator<In, Out> = (input: In) => Out;

export type TestScenarioFactory<IT, OT> = {
  generate: (source: IT) => OT;
  validate: (item: OT) => boolean;
  format: (item: OT) => OT;
};

export type AlternativesInput = {
  ndc: string;
  price: number;
  coverage: number;
};

export type ScenarioItems<In, Out> = {
  input: In;
  generator: ScenarioGenerator<In, Out>;
  validators: Validator<Out>[];
};

export type ScenarioSet<In, Out> = Record<string, ScenarioItems<In, Out>>;

export type ScenarioFactory<In, Out> = (
  scenarios: ScenarioSet<In, Out>
) => Record<string, Out>;

export function scenarioFactory<In, Out>(scenarios: ScenarioSet<In, Out>) {
  const scenarioData: { [index: string]: Out } = {};
  for (const key in scenarios) {
    const currentScenario = scenarios[key];
    const { generator, input } = currentScenario;
    const generatedData = generator(input);

    runValidators(key, generatedData, currentScenario);

    scenarioData[key] = generator(input);
  }
  return scenarioData;
}

export function runValidators<In, Out>(
  key: string,
  generatedData: Out,
  scenario: ScenarioItems<In, Out>
) {
  const { input, validators } = scenario;
  for (const validator of validators) {
    const validationResult = validator(generatedData);
    if (!validationResult) {
      const inputsJson = JSON.stringify(input);
      const generatedJson = JSON.stringify(generatedData);
      throw new Error(
        `Validation ${key} failed for the generated object:'${generatedJson}'. The input parameters used were:'${inputsJson}'.`
      );
    }
  }
}
