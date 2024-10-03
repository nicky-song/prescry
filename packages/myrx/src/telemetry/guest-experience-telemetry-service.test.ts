// Copyright 2022 Prescryptive Health, Inc.

import { MiddlewareAPI } from 'redux';
import {
  ApplicationInsights,
  IConfig,
  IConfiguration,
  ITelemetryPlugin,
} from '@microsoft/applicationinsights-web';
import { History } from 'history';
import {
  ILogAction,
  ILogActionNext,
  ILogDispatcher,
} from '@phx/common/src/experiences/store/store-logger.middleware';
import { GuestExperienceTelemetryService } from './guest-experience-telemetry-service';

const appInsightsMock = {
  loadAppInsights: jest.fn(),
  trackEvent: jest.fn(),
  trackTrace: jest.fn(),
  trackException: jest.fn(),
  context: {
    telemetryTrace: {
      parentID: undefined,
      traceID: undefined,
    },
  },
};

jest.mock('@microsoft/applicationinsights-web', () => ({
  ApplicationInsights: jest.fn(),
}));
const ApplicationInsightsMock = ApplicationInsights as jest.Mock;

jest.mock(
  '@phx/common/src/experiences/guest-experience/guest-experience-config',
  () => ({
    GuestExperienceConfig: {
      allowedActionTypeList: ['fakeType'],
      allowedParamsForRoutes: ['loginPinScreen'],
    },
  })
);

const mockConfig: IConfiguration & IConfig = {
  instrumentationKey: 'fake-key',
} as IConfiguration & IConfig;
const mockReactPlugin: ITelemetryPlugin = {
  fakeReactPlugin: 'fakeReactPlugin',
  identifier: 'fakeIdentifier',
} as unknown as ITelemetryPlugin;
const mockHistoryObj: History = 'fakeHistory' as unknown as History;

describe('GuestExperienceTelemetryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApplicationInsightsMock.mockReturnValue(appInsightsMock);
  });

  it('calls ApplicationInsights constructor and loads', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    expect(ApplicationInsights).toBeCalledWith({
      config: {
        extensionConfig: { fakeIdentifier: { history: mockHistoryObj } },
        extensions: [mockReactPlugin],
        instrumentationKey: mockConfig.instrumentationKey,
      },
    });

    expect(telemetryService.appInsights).toEqual(appInsightsMock);
    expect(appInsightsMock.loadAppInsights).toHaveBeenCalledTimes(1);
  });

  it('calls app-insights track event on middleware invokation', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: { key: 'fakePayload' },
      type: 'fakeType',
    } as ILogAction;
    const dispatcher: ILogDispatcher = jest.fn();
    const fakeActionArray = [fakeAction.type];

    const middlewareBuilder =
      telemetryService.getLogActionMiddlewareBuilder(fakeActionArray);
    const dispatchHandler: ILogActionNext = middlewareBuilder(
      {} as MiddlewareAPI
    );
    const actionHandler = dispatchHandler(dispatcher);
    actionHandler(fakeAction);
    expect(appInsightsMock.trackEvent).toHaveBeenCalledTimes(
      fakeActionArray.length
    );
    expect(appInsightsMock.trackEvent).toHaveBeenCalledWith({
      name: fakeAction.type,
      properties: { payload: '{"key":"fakePayload"}' },
    });
    expect(dispatcher).toHaveBeenNthCalledWith(1, fakeAction);
  });

  it('handles trackEvent', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: 'fakePayload',
      type: 'fakeType',
    };

    telemetryService.trackEvent(fakeAction.type, fakeAction.payload);
    expect(appInsightsMock.trackEvent).toBeCalledWith({
      name: fakeAction.type,
      properties: { payload: fakeAction.payload },
    });
  });

  it('handles trackCustomEvent', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const actionTypeMock = 'action-type';
    type IPropsMock = {
      x: string;
    };
    const propsMock: IPropsMock = {
      x: 'yo!',
    };
    telemetryService.trackCustomEvent(actionTypeMock, propsMock);

    expect(appInsightsMock.trackEvent).toHaveBeenCalledWith({
      name: actionTypeMock,
      properties: propsMock,
    });
  });

  it('handles trackTrace', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: { key: 'fakePayload' },
      routeName: 'routeName',

      type: 'fakeType',
    } as ILogAction;

    telemetryService.trackTrace(fakeAction);
    expect(appInsightsMock.trackTrace).toBeCalledWith({
      message:
        'Redux action type: fakeType,Route name: routeName,Action payload: {"key":"fakePayload"}',
    });
  });

  it('calls trackEvent with truncated payload', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: { key: 'fakePayload' },
      type: 'fakeType',
    } as ILogAction;

    telemetryService.trackEvent = jest.fn();
    telemetryService.truncatePayload(fakeAction, 12);

    expect(telemetryService.trackEvent).toBeCalledWith(
      fakeAction.type,
      '{"key":"fake'
    );
  });

  it('calls trackEvent with truncated payload (unsupported action)', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: { key: 'notsupported' },
      type: 'notsupported',
    } as ILogAction;

    telemetryService.trackEvent = jest.fn();
    telemetryService.truncatePayload(fakeAction, 12);

    expect(telemetryService.trackEvent).toBeCalledWith(fakeAction.type, '""');
  });

  it('calls trackEvent with truncated payload (action with routename)', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const fakeAction = {
      payload: { key: 'fakePayload' },
      routeName: 'route',
      params: { a: '1', b: '2' },
      type: 'fakeType',
    } as ILogAction;

    telemetryService.trackEvent = jest.fn();
    telemetryService.truncatePayload(fakeAction, 46);

    expect(telemetryService.trackEvent).toBeCalledWith(
      fakeAction.type,
      '{"routeName":"route","params":{"a":"1","b":"2"'
    );
  });

  it('handles trackCustomException', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const error = new Error();
    telemetryService.trackCustomException(error);
    expect(appInsightsMock.trackException).toBeCalledWith({
      exception: error,
    });
  });

  it('handles setTelemetryId', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const requestCounterMock = 1;
    telemetryService.requestCounter = requestCounterMock;

    const operationIdMock = 'operation-id';
    const newOperationId = telemetryService.setTelemetryId(operationIdMock);

    const expectedRequestCounter = requestCounterMock + 1;
    const expectedOperationId = `${operationIdMock}.${expectedRequestCounter}_`;

    expect(telemetryService.requestCounter).toEqual(expectedRequestCounter);
    expect(newOperationId).toEqual(expectedOperationId);

    expect(appInsightsMock.context.telemetryTrace.parentID).toEqual(
      operationIdMock
    );
    expect(appInsightsMock.context.telemetryTrace.traceID).toEqual(
      expectedOperationId
    );
  });
});

describe('getNavigationActionPayload()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApplicationInsightsMock.mockReturnValue(appInsightsMock);
  });

  it('should return undefined if no routeName in action', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const mockAction = {
      type: 'actionType',
    } as ILogAction;

    const payload = telemetryService.getNavigationActionPayload(mockAction);

    expect(payload).toBeUndefined();
  });

  it('should return routeName if routeName present in action', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const mockAction = {
      routeName: 'routeName',
      type: 'actionType',
    } as ILogAction;

    const payload = telemetryService.getNavigationActionPayload(mockAction);

    expect(payload).toEqual({ routeName: 'routeName' });
  });

  it('should return routeName and params if routeName and params present in action', () => {
    const telemetryService = new GuestExperienceTelemetryService(
      mockConfig,
      mockReactPlugin,
      {
        history: mockHistoryObj,
      }
    );

    const mockAction = {
      params: 'params',
      routeName: 'loginPinScreen',
      type: 'actionType',
    } as ILogAction;

    const payload = telemetryService.getNavigationActionPayload(mockAction);

    expect(payload).toEqual({ routeName: 'loginPinScreen', params: 'params' });
  });
});
