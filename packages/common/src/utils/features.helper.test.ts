// Copyright 2018 Prescryptive Health, Inc.

import { applyQuerySwitches } from './features.helper';

describe('applyQuerySwitches', () => {
  it('should set query-string switches that are "1" to true', () => {
    const features = {
      test1: false,
      test2: false,
      test3: false,
      test4: false,
      test5: false,
      test6: false,
    };

    applyQuerySwitches(
      features,
      '?other=yy&f=test1:1,test2:0,test3:,test4:1,test5:0,test6:&dummy=x'
    );

    expect(features).toEqual({
      test1: true,
      test2: false,
      test3: '',
      test4: true,
      test5: false,
      test6: '',
    });
  });

  it('should apply query-string switches that are "0" to false', () => {
    const features = {
      test1: true,
      test2: true,
      test3: true,
      test4: true,
      test5: true,
      test6: true,
    };

    applyQuerySwitches(
      features,
      '?other=yy&f=test1:1,test2:0,test3:,test4:1,test5:0,test6:&dummy=x'
    );

    expect(features).toEqual({
      test1: true,
      test2: false,
      test3: '',
      test4: true,
      test5: false,
      test6: '',
    });
  });

  it('should not require all features to be specified in the querystring', () => {
    const features = {
      test1: false,
      test2: false,
      test3: false,
      test4: false,
      test5: false,
      test6: false,
    };

    applyQuerySwitches(features, '?x=test&f=test1:1,other:2&y=test2');

    expect(features).toEqual({
      test1: true,
      test2: false,
      test3: false,
      test4: false,
      test5: false,
      test6: false,
      other: '2',
    });
  });

  it('should support unknown keys', () => {
    const features = {
      test1: false,
    };

    applyQuerySwitches(
      features,
      '?other=yy&f=test1:1,test2:0,test3:,test4:1,test5:0,test6:&dummy=x'
    );

    expect(features).toEqual({
      test1: true,
      test2: false,
      test3: '',
      test4: true,
      test5: false,
      test6: '',
    });
  });

  it('should work without ? prefix', () => {
    const features = {
      test1: false,
    };

    applyQuerySwitches(
      features,
      'other=yy&f=test1:1,test2:0,test3:,test4:1,test5:0,test6:&dummy=x'
    );

    expect(features).toEqual({
      test1: true,
      test2: false,
      test3: '',
      test4: true,
      test5: false,
      test6: '',
    });
  });

  describe('can restrict features via optionalRestrictPattern regex', () => {
    it('can specify the name of a flag', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
      };
      applyQuerySwitches(
        features,
        'other=yy&f=test1:1,test2:1,test3:1&dummy=x',
        [],
        true,
        'test1'
      );
      expect(features).toEqual({
        test1: true,
        test2: false,
        test3: false,
        other1: false,
      });
    });

    it('can specify more than 1 flag using regex |', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
      };
      applyQuerySwitches(
        features,
        'other=yy&f=test1:1,test2:1,test3:1&dummy=x',
        [],
        true,
        'test1|test2'
      );
      expect(features).toEqual({
        test1: true,
        test2: true,
        test3: false,
        other1: false,
      });
    });

    it('can specify a partial flag', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
      };
      applyQuerySwitches(
        features,
        'other=yy&f=test1:1,test2:1,test3:1&dummy=x',
        [],
        true,
        'test'
      );
      expect(features).toEqual({
        test1: true,
        test2: true,
        test3: true,
        other1: false,
      });
    });

    it('can exclude a flag', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
      };
      applyQuerySwitches(
        features,
        'other=yy&f=test1:1,test2:1,test3:1,other1:1&dummy=x',
        [],
        true,
        '^(?!test).*$'
      );
      expect(features).toEqual({
        test1: false,
        test2: false,
        test3: false,
        other1: true,
      });
    });
  });
  describe('can allow features via allowed feature flags if passed in switches', () => {
    it('applies always allowed feature flags if passed in switches', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
      };
      applyQuerySwitches(
        features,
        '?f=test1:1,test2:1,test3:1&dummy=x',
        ['test3'],
        false
      );
      expect(features).toEqual({
        test1: false,
        test2: false,
        test3: true,
        other1: false,
      });
    });

    it('does not applies aloways allowed feature flags if not passed in switches', () => {
      const features = {
        test1: false,
        test2: false,
        test3: false,
        other1: false,
        test4: false,
        test5: false,
      };
      applyQuerySwitches(
        features,
        '?f=test1:1,test2:1,test3:1&dummy=x',
        ['test5,test4'],
        false
      );
      expect(features).toEqual({
        test1: false,
        test2: false,
        test3: false,
        other1: false,
        test4: false,
        test5: false,
      });
    });
  });
});
