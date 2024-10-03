// Copyright 2022 Prescryptive Health, Inc.

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Animated,
  GestureResponderEvent,
  NativeTouchEvent,
  NativeSyntheticEvent,
  PanResponderCallbacks,
  PanResponderInstance,
  GestureResponderHandlers,
  PanResponderGestureState,
} from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../../text/base-text/base-text';
import { BaseSlider, IBaseSliderProps, ISliderDimensions } from './base.slider';
import {
  baseSliderStyles as styles,
  pointerStyles,
  TickMarkColors,
  tickMarkDiameter,
} from './base.slider.styles';
import { baseSliderMeasurements as measurements } from './base.slider.measurements';
import { ITestContainer } from '../../../testing/test.container';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useRef: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useRefMock = useRef as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('react-native', () => ({
  PanResponder: {
    create: jest.fn().mockImplementation((config: PanResponderCallbacks) => {
      const gestureResponderHandlers: GestureResponderHandlers = {
        onStartShouldSetResponder: jest
          .fn()
          .mockImplementation(config.onStartShouldSetPanResponder),
        onMoveShouldSetResponder: jest.fn(),
        onResponderEnd: jest.fn(),
        onResponderGrant: jest
          .fn()
          .mockImplementation(config.onPanResponderGrant),
        onResponderReject: jest.fn(),
        onResponderMove: jest
          .fn()
          .mockImplementation(config.onPanResponderMove),
        onResponderRelease: jest
          .fn()
          .mockImplementation(config.onPanResponderRelease),
        onResponderStart: jest.fn(),
        onResponderTerminationRequest: jest.fn(),
        onResponderTerminate: jest.fn(),
        onStartShouldSetResponderCapture: jest.fn(),
        onMoveShouldSetResponderCapture: jest.fn(),
      };
      const panResponderInstance: PanResponderInstance = {
        panHandlers: gestureResponderHandlers,
      };
      return panResponderInstance;
    }),
  },
  Animated: {
    View: () => <div />,
    Value: jest.fn().mockImplementation(() => {
      return {
        setOffset: jest.fn(),
        setValue: jest.fn(),
      };
    }),
  },
  Platform: {
    select: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({}),
  },
  View: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../theming/theme', () => ({
  ...jest.requireActual<Record<string, unknown>>('../../../theming/theme'),
  LocalDimensions: { width: 1300 },
}));

const nativeTouchEventMock1: NativeTouchEvent = {
  changedTouches: [],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 1,
  touches: [],
};
const nativeTouchEventMock2: NativeTouchEvent = {
  changedTouches: [],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 2,
  touches: [],
};
const nativeTouchEventMock3: NativeTouchEvent = {
  changedTouches: [],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 3,
  touches: [],
};
const nativeTouchEventMockA: NativeTouchEvent = {
  changedTouches: [
    nativeTouchEventMock1,
    nativeTouchEventMock2,
    nativeTouchEventMock3,
  ],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 4,
  touches: [
    nativeTouchEventMock1,
    nativeTouchEventMock2,
    nativeTouchEventMock3,
  ],
};
const nativeTouchEventMockB: NativeTouchEvent = {
  changedTouches: [
    nativeTouchEventMock1,
    nativeTouchEventMock2,
    nativeTouchEventMock3,
  ],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 5,
  touches: [
    nativeTouchEventMock1,
    nativeTouchEventMock2,
    nativeTouchEventMock3,
  ],
};
const nativeTouchEventMockC: NativeTouchEvent = {
  changedTouches: [
    nativeTouchEventMock1,
    nativeTouchEventMock2,
    nativeTouchEventMock3,
  ],
  identifier: 'identifier-mock',
  locationX: 250,
  locationY: 0,
  pageX: 250,
  pageY: 0,
  target: 'target-mock',
  timestamp: 6,
  touches: [],
};

const onSelectedValueMock = jest.fn();
const onSliderChangeMock = jest.fn();

const distanceSliderExampleProps: IBaseSliderProps = {
  defaultPosition: 25,
  minimumPosition: 1,
  maximumPosition: 100,
  onSelectedValue: onSelectedValueMock,
  showCurrentValue: true,
  unit: 'mi',
  onSliderChange: onSliderChangeMock,
};

const onlyRequiredProps: IBaseSliderProps = {
  defaultPosition: 25,
  minimumPosition: 1,
  maximumPosition: 100,
  onSelectedValue: onSelectedValueMock,
};

type moveXTestList = [string, number][];

const generatePointerMoveXPositionList = (width: number): moveXTestList => {
  const pointerMoveXPositionList: moveXTestList = [
    ['isInitialLoad', -1],
    ['isInitialLoad', 0],
  ];

  pointerMoveXPositionList.push([
    'isMostLeftPosition',
    0.005 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMostLeftPosition',
    0.0099 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMiddlePosition',
    0.01 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMiddlePosition',
    0.33 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMiddlePosition',
    0.66 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMostRightPosition',
    0.92 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMostRightPosition',
    0.925 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isMostRightPosition',
    0.929 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isFurtherRightPosition',
    1 * width + measurements.moveXDifference(24),
  ]);
  pointerMoveXPositionList.push([
    'isFurtherRightPosition',
    1.01 * width + measurements.moveXDifference(24),
  ]);

  return pointerMoveXPositionList;
};

describe('BaseSlider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([25, jest.fn()]);
    useStateMock.mockReturnValueOnce([25, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      {
        width: 100,
        left: 0,
        right: 100,
      } as ISliderDimensions,
      jest.fn(),
    ]);

    const animatedPointerMock = new Animated.Value(72);

    useRefMock.mockReset();
    useRefMock.mockReturnValue({
      current: animatedPointerMock,
    });

    useEffectMock.mockReset();
  });
  it('renders expected components with expected example DistanceSlider props', () => {
    const positionMock = 25;

    const setSliderDimensionsMock = jest.fn();

    const sliderDimensionsMock: ISliderDimensions = {
      width: 100,
      left: 0,
      right: 100,
    };

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      sliderDimensionsMock,
      setSliderDimensionsMock,
    ]);

    const testRenderer = renderer.create(
      <BaseSlider {...distanceSliderExampleProps} />
    );

    const views = testRenderer.root.findAllByType(View);

    expect(views.length).toEqual(3);

    const baseSlider = views[0];

    expect(baseSlider.props.style).toEqual(
      distanceSliderExampleProps.viewStyle
    );
    expect(baseSlider.props.children).toBeDefined();
    expect(baseSlider.props.children.length).toBeUndefined();

    const sliderView = baseSlider.props.children;

    expect(sliderView.type).toEqual(View);
    expect(sliderView.props.style).toEqual(styles.sliderViewStyle);
    expect(sliderView.props.onLayout).toEqual(expect.any(Function));
    expect(sliderView.props.children.length).toEqual(2);

    const pointerResponderAnimatedView = sliderView.props.children[0];

    expect(pointerResponderAnimatedView.type).toEqual(Animated.View);
    expect(pointerResponderAnimatedView.props.onMoveShouldSetResponder).toEqual(
      expect.any(Function)
    );
    expect(
      pointerResponderAnimatedView.props.onMoveShouldSetResponderCapture
    ).toEqual(expect.any(Function));
    expect(pointerResponderAnimatedView.props.onResponderEnd).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderGrant).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderMove).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderReject).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderRelease).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderStart).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderTerminate).toEqual(
      expect.any(Function)
    );
    expect(
      pointerResponderAnimatedView.props.onResponderTerminationRequest
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.onStartShouldSetResponder
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.onStartShouldSetResponderCapture
    ).toEqual(expect.any(Function));
    expect(pointerResponderAnimatedView.props.style).toEqual({
      transform: [
        {
          translateX: expect.any(Object),
        },
      ],
      width: 0,
    });
    expect(
      Object.keys(
        pointerResponderAnimatedView.props.style.transform[0].translateX
      ).length
    ).toEqual(2);
    expect(
      pointerResponderAnimatedView.props.style.transform[0].translateX.setOffset
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.style.transform[0].translateX.setValue
    ).toEqual(expect.any(Function));

    const pointerAndPositionView = pointerResponderAnimatedView.props.children;

    expect(pointerAndPositionView.type).toEqual(View);
    expect(pointerAndPositionView.props.style).toEqual(
      pointerStyles.pointerAndPositionViewStyle
    );

    const cursorView = pointerAndPositionView.props.children;

    expect(cursorView.type).toEqual(View);
    expect(cursorView.props.style).toEqual(pointerStyles.cursorViewStyle);
    expect(cursorView.props.children.length).toEqual(2);

    const positionText = cursorView.props.children[0];

    expect(positionText.type).toEqual(BaseText);
    expect(positionText.props.style).toEqual(styles.valueTextStyle);
    expect(positionText.props.children).toEqual(
      measurements.distanceText(positionMock, 'mi')
    );

    const outsidePointerView = cursorView.props.children[1];

    expect(outsidePointerView.type).toEqual(View);
    expect(outsidePointerView.props.style).toEqual(
      pointerStyles.outsideViewStyle
    );

    const insidePointerView = outsidePointerView.props.children;

    expect(insidePointerView.type).toEqual(View);
    expect(insidePointerView.props.style).toEqual(
      pointerStyles.insideViewStyle
    );

    const barView = sliderView.props.children[1];

    expect(barView.type).toEqual(View);
    expect(barView.props.style).toEqual(styles.barViewStyle);

    const barAnimatedView = barView.props.children;

    expect(barAnimatedView.type).toEqual(Animated.View);
    expect(barAnimatedView.props.style).toEqual([
      styles.barFillViewStyle,
      {
        width: expect.any(Object),
      },
    ]);
  });
  it('renders expected components with only required props', () => {
    const positionMock = 55;

    const setSliderDimensionsMock = jest.fn();

    const sliderDimensionsMock: ISliderDimensions = {
      width: 100,
      left: 0,
      right: 100,
    };

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      sliderDimensionsMock,
      setSliderDimensionsMock,
    ]);

    const testRenderer = renderer.create(<BaseSlider {...onlyRequiredProps} />);

    const views = testRenderer.root.findAllByType(View);

    expect(views.length).toEqual(3);

    const baseSlider = views[0];

    expect(baseSlider.props.style).toEqual(onlyRequiredProps.viewStyle);
    expect(baseSlider.props.children).toBeDefined();
    expect(baseSlider.props.children.length).toBeUndefined();

    const sliderView = baseSlider.props.children;

    expect(sliderView.type).toEqual(View);
    expect(sliderView.props.style).toEqual(styles.sliderViewStyle);
    expect(sliderView.props.onLayout).toEqual(expect.any(Function));
    expect(sliderView.props.children.length).toEqual(2);

    const pointerResponderAnimatedView = sliderView.props.children[0];

    expect(pointerResponderAnimatedView.type).toEqual(Animated.View);
    expect(pointerResponderAnimatedView.props.onMoveShouldSetResponder).toEqual(
      expect.any(Function)
    );
    expect(
      pointerResponderAnimatedView.props.onMoveShouldSetResponderCapture
    ).toEqual(expect.any(Function));
    expect(pointerResponderAnimatedView.props.onResponderEnd).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderGrant).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderMove).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderReject).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderRelease).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderStart).toEqual(
      expect.any(Function)
    );
    expect(pointerResponderAnimatedView.props.onResponderTerminate).toEqual(
      expect.any(Function)
    );
    expect(
      pointerResponderAnimatedView.props.onResponderTerminationRequest
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.onStartShouldSetResponder
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.onStartShouldSetResponderCapture
    ).toEqual(expect.any(Function));
    expect(pointerResponderAnimatedView.props.style).toEqual({
      transform: [
        {
          translateX: expect.any(Object),
        },
      ],
      width: 0,
    });
    expect(
      Object.keys(
        pointerResponderAnimatedView.props.style.transform[0].translateX
      ).length
    ).toEqual(2);
    expect(
      pointerResponderAnimatedView.props.style.transform[0].translateX.setOffset
    ).toEqual(expect.any(Function));
    expect(
      pointerResponderAnimatedView.props.style.transform[0].translateX.setValue
    ).toEqual(expect.any(Function));

    const pointerAndPositionView = pointerResponderAnimatedView.props.children;

    expect(pointerAndPositionView.type).toEqual(View);
    expect(pointerAndPositionView.props.style).toEqual(
      pointerStyles.pointerAndPositionViewStyle
    );

    const cursorView = pointerAndPositionView.props.children;

    expect(cursorView.type).toEqual(View);
    expect(cursorView.props.style).toEqual(pointerStyles.cursorViewStyle);
    expect(cursorView.props.children.length).toEqual(2);

    const positionText = cursorView.props.children[0];

    expect(positionText).toBeNull();

    const outsidePointerView = cursorView.props.children[1];

    expect(outsidePointerView.type).toEqual(View);
    expect(outsidePointerView.props.style).toEqual(
      pointerStyles.outsideViewStyle
    );
    expect(outsidePointerView.props.testID).toEqual('baseSliderPointerCircle');

    const insidePointerView = outsidePointerView.props.children;

    expect(insidePointerView.type).toEqual(View);
    expect(insidePointerView.props.style).toEqual(
      pointerStyles.insideViewStyle
    );

    const barView = sliderView.props.children[1];

    expect(barView.type).toEqual(View);
    expect(barView.props.style).toEqual(styles.barViewStyle);

    const barAnimatedView = barView.props.children;

    expect(barAnimatedView.type).toEqual(Animated.View);
    expect(barAnimatedView.props.style).toEqual([
      styles.barFillViewStyle,
      {
        width: expect.any(Object),
      },
    ]);
  });
  it('calls setCurrentPosition, setOffsetMock, and setValueMock within pointerResponder', () => {
    const setOffsetMock = jest.fn();
    const setValueMock = jest.fn();

    const animatedPointerMock = {
      setOffset: setOffsetMock,
      setValue: setValueMock,
    };

    useRefMock.mockReset();
    useRefMock.mockReturnValueOnce({
      current: animatedPointerMock,
    });

    const positionMock = 25;
    const setCurrentPositionMock = jest.fn();
    const setCurrentCallbackPositionMock = jest.fn();
    const setSliderDimensionsMock = jest.fn();
    const sliderDimensionsMock: ISliderDimensions = {
      width: 1000,
      left: 0,
      right: 1000,
    };
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([positionMock, setCurrentPositionMock]);
    useStateMock.mockReturnValueOnce([
      positionMock,
      setCurrentCallbackPositionMock,
    ]);
    useStateMock.mockReturnValueOnce([
      sliderDimensionsMock,
      setSliderDimensionsMock,
    ]);
    const onSliderChangeOnResponderMock = jest.fn();
    const testRenderer = renderer.create(
      <BaseSlider
        {...onlyRequiredProps}
        onSliderChange={onSliderChangeOnResponderMock}
      />
    );
    const views = testRenderer.root.findAllByType(View);
    const baseSlider = views[0];
    const sliderView = baseSlider.props.children;
    const pointerResponderAnimatedView = sliderView.props.children[0];
    const onResponderMove = pointerResponderAnimatedView.props.onResponderMove;
    const onResponderRelease =
      pointerResponderAnimatedView.props.onResponderRelease;
    const nativeTouchEventMock: NativeTouchEvent = {
      changedTouches: [
        nativeTouchEventMockA,
        nativeTouchEventMockB,
        nativeTouchEventMockC,
      ],
      identifier: 'identifier-mock',
      locationX: 250,
      locationY: 0,
      pageX: 250,
      pageY: 0,
      target: 'target-mock',
      timestamp: 0,
      touches: [
        nativeTouchEventMockA,
        nativeTouchEventMockB,
        nativeTouchEventMockC,
      ],
    };
    const nativeSyntheticEventMock: NativeSyntheticEvent<NativeTouchEvent> = {
      nativeEvent: nativeTouchEventMock,
      currentTarget: 0,
      target: 0,
      bubbles: false,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      preventDefault: jest.fn(),
      isDefaultPrevented: jest.fn().mockReturnValue(false),
      stopPropagation: jest.fn(),
      isPropagationStopped: jest.fn().mockReturnValue(false),
      persist: jest.fn(),
      timeStamp: 0,
      type: 'type-mock',
    };
    const gestureResponderEventMock: GestureResponderEvent =
      nativeSyntheticEventMock;

    const panResponderGestureStateMock: PanResponderGestureState = {
      stateID: 0,
      moveX: 230,
      moveY: 0,
      x0: 0,
      y0: 0,
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      numberActiveTouches: 1,
      _accountsForMovesUpTo: 1,
    };

    onResponderMove(gestureResponderEventMock, panResponderGestureStateMock);

    expect(onSliderChangeOnResponderMock).toHaveBeenNthCalledWith(1, 'sliding');

    const setCurrentPositionMockCalls = setCurrentPositionMock.mock.calls;
    expect(setCurrentPositionMockCalls[0][0]).toEqual(4);

    onResponderRelease();

    expect(onSliderChangeOnResponderMock).toHaveBeenNthCalledWith(2, 'stopped');

    const setCurrentCallbackPositionMockCalls =
      setCurrentCallbackPositionMock.mock.calls;
    expect(setCurrentCallbackPositionMockCalls[0][0]).toEqual(positionMock);

    expect(onSelectedValueMock).not.toHaveBeenCalled();

    const callSetSelectedValue = useEffectMock.mock.calls[0][0];

    callSetSelectedValue();

    expect(onSelectedValueMock).toHaveBeenNthCalledWith(1, positionMock);

    const setValueMockCalls = setValueMock.mock.calls;
    expect(setValueMockCalls[0][0]).toEqual(182);

    const onResponderGrant =
      pointerResponderAnimatedView.props.onResponderGrant;

    onResponderGrant();

    expect(setOffsetMock).toHaveBeenCalledWith(0);
  });
  it.each(generatePointerMoveXPositionList(100))(
    `setCurrentPositionFromOffset calculates '%s' and sets expected position when moveX is '%d'`,
    (_scenario: string, moveX: number) => {
      const setOffsetMock = jest.fn();
      const setValueMock = jest.fn();

      const animatedPointerMock = {
        setOffset: setOffsetMock,
        setValue: setValueMock,
      };

      useRefMock.mockReset();
      useRefMock.mockReturnValue({
        current: animatedPointerMock,
      });

      const parentPaddingMock = 24;
      const positionMock = 25;
      const setCurrentPositionMock = jest.fn();
      const setSliderDimensionsMock = jest.fn();
      const sliderDimensionsMock: ISliderDimensions = {
        width: 100,
        left: 0,
        right: 100,
      };
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([positionMock, setCurrentPositionMock]);
      useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
      useStateMock.mockReturnValueOnce([
        sliderDimensionsMock,
        setSliderDimensionsMock,
      ]);
      const defaultPositionMock = 25;
      const minimumPositionMock = 1;
      const maximumPositionMock = 100;
      const testRenderer = renderer.create(
        <BaseSlider
          onSelectedValue={onSelectedValueMock}
          defaultPosition={defaultPositionMock}
          minimumPosition={minimumPositionMock}
          maximumPosition={maximumPositionMock}
        />
      );
      const views = testRenderer.root.findAllByType(View);
      const baseSlider = views[0];
      const sliderView = baseSlider.props.children;
      const pointerResponderAnimatedView = sliderView.props.children[0];
      const onResponderMove =
        pointerResponderAnimatedView.props.onResponderMove;
      const nativeTouchEventMock: NativeTouchEvent = {
        changedTouches: [
          nativeTouchEventMockA,
          nativeTouchEventMockB,
          nativeTouchEventMockC,
        ],
        identifier: 'identifier-mock',
        locationX: 250,
        locationY: 0,
        pageX: 250,
        pageY: 0,
        target: 'target-mock',
        timestamp: 0,
        touches: [
          nativeTouchEventMockA,
          nativeTouchEventMockB,
          nativeTouchEventMockC,
        ],
      };
      const nativeSyntheticEventMock: NativeSyntheticEvent<NativeTouchEvent> = {
        nativeEvent: nativeTouchEventMock,
        currentTarget: 0,
        target: 0,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: true,
        preventDefault: jest.fn(),
        isDefaultPrevented: jest.fn().mockReturnValue(false),
        stopPropagation: jest.fn(),
        isPropagationStopped: jest.fn().mockReturnValue(false),
        persist: jest.fn(),
        timeStamp: 0,
        type: 'type-mock',
      };
      const gestureResponderEventMock: GestureResponderEvent =
        nativeSyntheticEventMock;

      const panResponderGestureStateMock: PanResponderGestureState = {
        stateID: 0,
        moveX,
        moveY: 0,
        x0: 0,
        y0: 0,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
        numberActiveTouches: 1,
        _accountsForMovesUpTo: 1,
      };

      onResponderMove(gestureResponderEventMock, panResponderGestureStateMock);

      const pointerActual =
        moveX - measurements.moveXDifference(parentPaddingMock);

      const setValueMockCalls = setValueMock.mock.calls;

      const setCurrentPositionMockCalls = setCurrentPositionMock.mock.calls;

      const correctedPointerActual = pointerActual + tickMarkDiameter / 2;

      const ratio = sliderDimensionsMock.width
        ? correctedPointerActual / sliderDimensionsMock.width
        : -1;

      const tickMarkValues: number[] = [5, 10, 25, 50];

      const segmentRanges = [
        [minimumPositionMock, tickMarkValues[0], 1],
        [tickMarkValues[0], tickMarkValues[1], 1],
        [tickMarkValues[1], tickMarkValues[2], 5],
        [tickMarkValues[2], tickMarkValues[3], 5],
        [tickMarkValues[3], maximumPositionMock, 10],
      ];

      const getSegmentFromRatio = (ratio: number) => {
        const perSegmentRatio = 1 / segmentRanges.length;

        return Math.floor(ratio / perSegmentRatio) + 1;
      };

      const getRoundedPositionFromSegment = (
        segment: number,
        ratio: number
      ) => {
        const minSegment = segmentRanges[segment - 1][0];
        const maxSegment = segmentRanges[segment - 1][1];
        const roundSegment = segmentRanges[segment - 1][2];
        const segmentRange = maxSegment - minSegment;

        const nextRatio = ratio - (1 / segmentRanges.length) * (segment - 1);
        const segmentRatio = nextRatio / (1 / segmentRanges.length);
        const nextPosition = segmentRatio * segmentRange;
        const segmentPosition = nextPosition + minSegment;

        return Math.floor(segmentPosition / roundSegment) * roundSegment;
      };

      const determinedPositionMock =
        ratio < 0
          ? defaultPositionMock
          : ratio >= 0.99
          ? maximumPositionMock
          : getRoundedPositionFromSegment(getSegmentFromRatio(ratio), ratio);

      const isInitialLoad = ratio <= 0;
      const isMostLeftPosition = ratio > 0 && ratio < 0.01;
      const isMiddlePosition = ratio >= 0.01 && ratio < 0.99;
      const isMostRightPosition = ratio >= 0.99 && ratio < 1;
      const furtherRightPosition = ratio >= 1;

      if (isInitialLoad || furtherRightPosition) {
        expect(setValueMockCalls).toEqual([]);
        expect(setCurrentPositionMockCalls).toEqual([]);
      } else if (isMostLeftPosition) {
        expect(setValueMockCalls[0][0]).toEqual(pointerActual);
        expect(setCurrentPositionMockCalls[0][0]).toEqual(minimumPositionMock);
      } else if (isMiddlePosition) {
        expect(setValueMockCalls[0][0]).toEqual(pointerActual);
        expect(setCurrentPositionMockCalls[0][0]).toEqual(
          determinedPositionMock
        );
      } else if (isMostRightPosition) {
        expect(setValueMockCalls[0][0]).toEqual(pointerActual);
        expect(setCurrentPositionMockCalls[0][0]).toEqual(maximumPositionMock);
      }
    }
  );
  it.each([
    ['only', '!==', true, 25, 1, 100],
    ['not', '===', false, 100, 1, 100],
  ])(
    'setOffset should %s be called in onPanResponderGrant when currentPosition %s maximumPosition',
    (
      _condition1: string,
      _condition2: string,
      shouldBeCalled: boolean,
      currentPosition: number,
      minimumPosition: number,
      maximumPosition: number
    ) => {
      const setOffsetMock = jest.fn();
      const setValueMock = jest.fn();

      const animatedPointerMock = {
        setOffset: setOffsetMock,
        setValue: setValueMock,
      };

      useRefMock.mockReset();
      useRefMock.mockReturnValueOnce({
        current: animatedPointerMock,
      });

      const positionMock = currentPosition;
      const minimumPositionMock = minimumPosition;
      const maximumPositionMock = maximumPosition;
      const setCurrentPositionMock = jest.fn();
      const setSliderDimensionsMock = jest.fn();
      const sliderDimensionsMock: ISliderDimensions = {
        width: 1000,
        left: 0,
        right: 1000,
      };
      const onSliderChangeOnResponderMock = jest.fn();
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([positionMock, setCurrentPositionMock]);
      useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
      useStateMock.mockReturnValueOnce([
        sliderDimensionsMock,
        setSliderDimensionsMock,
      ]);
      const testRenderer = renderer.create(
        <BaseSlider
          onSelectedValue={onSelectedValueMock}
          defaultPosition={positionMock}
          minimumPosition={minimumPositionMock}
          maximumPosition={maximumPositionMock}
          onSliderChange={onSliderChangeOnResponderMock}
        />
      );
      const views = testRenderer.root.findAllByType(View);
      const baseSlider = views[0];
      const sliderView = baseSlider.props.children;
      const pointerResponderAnimatedView = sliderView.props.children[0];
      const onResponderGrant =
        pointerResponderAnimatedView.props.onResponderGrant;

      onResponderGrant();

      if (shouldBeCalled) expect(setOffsetMock).toHaveBeenCalled();
      else expect(setOffsetMock).not.toHaveBeenCalled();

      expect(onSliderChangeOnResponderMock).toHaveBeenCalledWith('started');
    }
  );
  it('renders slider tick marks when sliderDimensions is defined', () => {
    const positionMock = 1;

    const setSliderDimensionsMock = jest.fn();

    const sliderDimensionsMock: ISliderDimensions = {
      width: 100,
      left: 0,
      right: 100,
    };

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      sliderDimensionsMock,
      setSliderDimensionsMock,
    ]);

    const testRenderer = renderer.create(
      <BaseSlider {...distanceSliderExampleProps} />
    );

    const views = testRenderer.root.findAllByType(View);
    const baseSlider = views[0];
    const sliderView = baseSlider.props.children;

    const barView = sliderView.props.children[1];

    expect(barView.type).toEqual(View);
    expect(barView.props.style).toEqual(styles.barViewStyle);

    const barAnimatedView = barView.props.children;

    expect(barAnimatedView.type).toEqual(Animated.View);
    expect(barAnimatedView.props.style).toEqual([
      styles.barFillViewStyle,
      {
        width: expect.any(Object),
      },
    ]);

    const sliderTickMarks = barAnimatedView.props.children;

    expect(sliderTickMarks).toEqual(expect.any(Array));

    const numberOfTickMarks = 4;

    const barSegmentWidth =
      sliderDimensionsMock.width / (numberOfTickMarks + 1);

    sliderTickMarks.forEach((tickMark: ReactTestInstance, index: number) => {
      const barSegmentMargin = (index + 1) * barSegmentWidth;

      expect(tickMark.type).toEqual(View);
      expect(tickMark.props.style).toEqual(
        styles.tickMarkContainerViewStyle(index, barSegmentMargin)
      );

      const tickMarkChildren = tickMark.props.children;

      expect(tickMarkChildren.length).toEqual(2);

      const tickMarkView = tickMarkChildren[0];
      const tickMarkText = tickMarkChildren[1];

      expect(tickMarkView.type).toEqual(View);
      expect(tickMarkView.props.style).toEqual(
        styles.tickMarkViewStyle(GrayScaleColor.disabledGray)
      );
      expect(tickMarkText.type).toEqual(BaseText);
      expect(tickMarkText.props.style).toEqual(styles.tickMarkTextStyle(index));
      expect(tickMarkText.props.children).toEqual(expect.any(Number));
    });
  });
  it.each([[1], [6], [11], [26], [51]])(
    'renders expected tick mark colors (currentPosition: %d)',
    (positionMock: number) => {
      const setSliderDimensionsMock = jest.fn();

      const sliderDimensionsMock: ISliderDimensions = {
        width: 100,
        left: 0,
        right: 100,
      };

      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
      useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
      useStateMock.mockReturnValueOnce([
        sliderDimensionsMock,
        setSliderDimensionsMock,
      ]);

      const testRenderer = renderer.create(
        <BaseSlider {...distanceSliderExampleProps} />
      );

      const views = testRenderer.root.findAllByType(View);
      const baseSlider = views[0];
      const sliderView = baseSlider.props.children;

      const barView = sliderView.props.children[1];

      expect(barView.type).toEqual(View);
      expect(barView.props.style).toEqual(styles.barViewStyle);

      const barAnimatedView = barView.props.children;

      expect(barAnimatedView.type).toEqual(Animated.View);
      expect(barAnimatedView.props.style).toEqual([
        styles.barFillViewStyle,
        {
          width: expect.any(Object),
        },
      ]);

      const sliderTickMarks = barAnimatedView.props.children;

      expect(sliderTickMarks).toEqual(expect.any(Array));

      const numberOfTickMarks = 4;

      const barSegmentWidth =
        sliderDimensionsMock.width / (numberOfTickMarks + 1);

      const tickMarkValues: number[] = [5, 10, 25, 50];

      const segmentRanges = [
        [1, tickMarkValues[0], 1],
        [tickMarkValues[0], tickMarkValues[1], 1],
        [tickMarkValues[1], tickMarkValues[2], 5],
        [tickMarkValues[2], tickMarkValues[3], 5],
        [tickMarkValues[3], 100, 10],
      ];

      sliderTickMarks.forEach((tickMark: ReactTestInstance, index: number) => {
        const barSegmentMargin = (index + 1) * barSegmentWidth;
        const tickMarkColor: TickMarkColors =
          positionMock < segmentRanges[index][1]
            ? GrayScaleColor.disabledGray
            : PrimaryColor.prescryptivePurple;

        expect(tickMark.type).toEqual(View);
        expect(tickMark.props.style).toEqual(
          styles.tickMarkContainerViewStyle(index, barSegmentMargin)
        );

        const tickMarkChildren = tickMark.props.children;

        expect(tickMarkChildren.length).toEqual(2);

        const tickMarkView = tickMarkChildren[0];

        expect(tickMarkView.type).toEqual(View);
        expect(tickMarkView.props.style).toEqual(
          styles.tickMarkViewStyle(tickMarkColor)
        );
      });
    }
  );
  it('does not render slider tick marks when sliderDimensions is undefined', () => {
    const positionMock = 25;

    const setSliderDimensionsMock = jest.fn();

    const sliderDimensionsMock = undefined;

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([positionMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      sliderDimensionsMock,
      setSliderDimensionsMock,
    ]);

    const testRenderer = renderer.create(
      <BaseSlider {...distanceSliderExampleProps} />
    );

    const views = testRenderer.root.findAllByType(View);
    const baseSlider = views[0];
    const sliderView = baseSlider.props.children;

    const barView = sliderView.props.children[1];

    expect(barView.type).toEqual(View);
    expect(barView.props.style).toEqual(styles.barViewStyle);

    const barAnimatedView = barView.props.children;

    expect(barAnimatedView.type).toEqual(Animated.View);
    expect(barAnimatedView.props.style).toEqual([
      styles.barFillViewStyle,
      {
        width: expect.any(Object),
      },
    ]);

    const sliderTickMarks = barAnimatedView.props.children;

    expect(sliderTickMarks).toBeNull();
  });
});
