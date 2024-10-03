// Copyright 2020 Prescryptive Health, Inc.

import { MemberNameFormatter } from './member-name-formatter';

describe('MemberNameFormatter', () => {
  it('formats name', () => {
    expect(MemberNameFormatter.formatName(undefined, undefined)).toEqual('');
    expect(MemberNameFormatter.formatName('', '')).toEqual('');
    expect(MemberNameFormatter.formatName('Joe', undefined)).toEqual('Joe');
    expect(MemberNameFormatter.formatName('Joe', '')).toEqual('Joe');
    expect(MemberNameFormatter.formatName(undefined, 'Blogs')).toEqual('Blogs');
    expect(MemberNameFormatter.formatName('', 'Blogs')).toEqual('Blogs');
    expect(MemberNameFormatter.formatName('Joe', 'Blogs')).toEqual('Joe Blogs');
  });
});
