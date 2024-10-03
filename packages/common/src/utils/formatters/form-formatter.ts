// Copyright 2019 Prescryptive Health, Inc.

import { IDrugForm } from '../../models/drug-form';

export class FormFormatter {
  public static formatWithLongName(
    formCode = '',
    allForms?: IDrugForm[]
  ): string {
    const drugForm = FormFormatter.getDrugForm(formCode, allForms);
    return drugForm ? drugForm.description : formCode;
  }

  public static formatWithShortName(
    formCode = '',
    allForms?: IDrugForm[]
  ): string {
    const drugForm = FormFormatter.getDrugForm(formCode, allForms);
    return drugForm ? drugForm.abbreviation : formCode;
  }

  private static getDrugForm(
    formCode: string,
    allForms: IDrugForm[] = []
  ): IDrugForm | undefined {
    const drugForms: IDrugForm[] = allForms || [];
    return drugForms.find((form) => form.formCode === formCode);
  }
}
