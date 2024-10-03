// Copyright 2018 Prescryptive Health, Inc.

import { defaultClient, setup } from 'applicationinsights';
import { IConfiguration } from '../configuration';
import { ApiConstants } from '../constants/api-constants';
import {
  logTelemetryEvent,
  logTelemetryException,
  setTelemetryId,
  setupAppInsightService,
} from './app-insight-helper';

const OLD_ENV = process.env;

const configurationMock: IConfiguration = {
  appInsightInstrumentationKey: 'fakeKey',
  appInsightServiceName: 'appInsightServiceName',
  insuranceEligibilityApiRequestUrl:
    'insurance-eligibility-api-request-url-mock',
} as IConfiguration;

jest.mock('applicationinsights', () => ({
  DistributedTracingModes: { AI: 'fake-AI' },
  defaultClient: {
    context: {
      keys: { cloudRole: 'ai-cloud-role' },
      tags: { 'ai-cloud-role': '' },
    },
    trackEvent: jest.fn(),
    trackException: jest.fn(),
    addTelemetryProcessor: jest.fn(),
  },
  setup: jest.fn().mockReturnValue({
    setAutoCollectRequests: jest.fn().mockReturnValue({
      setAutoCollectExceptions: jest.fn().mockReturnValue({
        setAutoCollectDependencies: jest.fn().mockReturnValue({
          setAutoCollectConsole: jest.fn().mockReturnValue({
            setUseDiskRetryCaching: jest.fn().mockReturnValue({
              setAutoDependencyCorrelation: jest.fn().mockReturnValue({
                setSendLiveMetrics: jest.fn().mockReturnValue({
                  setDistributedTracingMode: jest
                    .fn()
                    .mockReturnValue({ start: jest.fn() }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
}));
const mockedSetup = setup as jest.Mock;
const mockedDefaultClient = defaultClient as jest.Mocked<typeof defaultClient>;
const addTelemetryProcessorMock =
  mockedDefaultClient.addTelemetryProcessor as jest.Mock;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe('setupAppInsightService()', () => {
  it('initializes a AppInsights service once', () => {
    setupAppInsightService(configurationMock);
    expect(mockedSetup).toHaveBeenNthCalledWith(
      1,
      configurationMock.appInsightInstrumentationKey
    );
    expect(addTelemetryProcessorMock).toHaveBeenCalled();
  });

  it('should have cloud role key', () => {
    expect(mockedDefaultClient.context.keys.cloudRole).toBe('ai-cloud-role');
  });

  it('should assign custome ai cloud role to app-insights service', () => {
    expect(defaultClient.context.tags['ai-cloud-role']).toBe(
      configurationMock.appInsightServiceName
    );
  });

  it.each([
    [configurationMock.insuranceEligibilityApiRequestUrl, false],
    [
      'tags-waystar-insurance-eligibility-api-url-envelope-tag-key-value-mock',
      true,
    ],
  ])(
    "Function removeStackTraces returns correct boolean value determining whether to report to appinsights (true = report, false = don't report)",
    (
      tagsWaystarInsuranceEligibilityApiUrlEnvelopeTagKeyValue: string,
      expected: boolean
    ) => {
      setupAppInsightService(configurationMock);
      const removeStackTraces = addTelemetryProcessorMock.mock.calls[0][0];
      const tagsMock: {
        [key: string]: string;
      } = {
        [ApiConstants.WAYSTAR_INSURANCE_ELIGIBILITY_API_URL_ENVELOPE_TAG_KEY]:
          tagsWaystarInsuranceEligibilityApiUrlEnvelopeTagKeyValue,
      };
      const envelopeMock = {
        data: {
          baseData: {
            data: configurationMock.insuranceEligibilityApiRequestUrl,
          },
        },
        tags: tagsMock,
      };
      const actual = removeStackTraces(envelopeMock);
      expect(actual).toBe(expected);
    }
  );
});

describe('setTelemetryId()', () => {
  const mockFakeOperationId = 'mock-fake-operation-id';
  it('should set appinsights operation id', () => {
    setTelemetryId('operationId', mockFakeOperationId);
    expect(defaultClient.context.keys.operationId);
  });

  it('should set appinsights parent operation id', () => {
    setTelemetryId('operationParentId', mockFakeOperationId);
    expect(defaultClient.context.keys.operationParentId);
  });
});

describe('logTelemetryEvent()', () => {
  it('should call defaultClient.trackevent()', () => {
    logTelemetryEvent('MockEvent', { MockProperty: 'test1' });
    expect(defaultClient.trackEvent).toHaveBeenNthCalledWith(1, {
      name: 'GuestAPI_MockEvent',
      properties: { MockProperty: 'test1' },
    });
  });
});

describe('logTelemetryException()', () => {
  it('should call defaultClient.trackException()', () => {
    const mockError = new Error('MockEvent');
    logTelemetryException({ exception: mockError });
    expect(defaultClient.trackException).toHaveBeenNthCalledWith(1, {
      exception: mockError,
    });
  });
});
