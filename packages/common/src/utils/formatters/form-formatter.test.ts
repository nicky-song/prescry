// Copyright 2019 Prescryptive Health, Inc.

import { IDrugForm } from '../../models/drug-form';
import { FormFormatter } from './form-formatter';

const tb12Form: IDrugForm = {
  abbreviation: 'Tablet ER 12HR',
  description: 'Tablet Extended Release 12 Hour',
  formCode: 'TB12',
};

const drugForms: IDrugForm[] = [
  { abbreviation: 'Tape', description: 'Tape', formCode: 'TAPE' },
  { abbreviation: 'Tar', description: 'Tar', formCode: 'TAR' },
  tb12Form,
];

describe('FormFormatter', () => {
  it('formats with long names', () => {
    expect(FormFormatter.formatWithLongName(undefined)).toEqual('');
    expect(
      FormFormatter.formatWithLongName(tb12Form.formCode, undefined)
    ).toEqual(tb12Form.formCode);
    expect(FormFormatter.formatWithLongName(tb12Form.formCode, [])).toEqual(
      tb12Form.formCode
    );
    expect(FormFormatter.formatWithLongName('', drugForms)).toEqual('');
    expect(
      FormFormatter.formatWithLongName(tb12Form.formCode, drugForms)
    ).toEqual(tb12Form.description);
    expect(FormFormatter.formatWithLongName('XXX', drugForms)).toEqual('XXX');
  });

  it('formats with short names', () => {
    expect(FormFormatter.formatWithShortName(undefined)).toEqual('');
    expect(FormFormatter.formatWithShortName('')).toEqual('');
    expect(FormFormatter.formatWithShortName('', drugForms)).toEqual('');
    expect(
      FormFormatter.formatWithShortName(tb12Form.formCode, drugForms)
    ).toEqual(tb12Form.abbreviation);
    expect(FormFormatter.formatWithShortName('XXX', drugForms)).toEqual('XXX');
  });
});
