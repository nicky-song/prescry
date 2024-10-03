// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  defaultMediaQueryContext,
  IMediaQueryContext,
  MediaQueryContext,
  MediaSize,
} from './media-query.context';

export const MediaQueryContextProvider: FunctionComponent = ({ children }) => {
  const [context, setContext] = useState<IMediaQueryContext>(
    defaultMediaQueryContext
  );

  useEffect(() => {
    const onWindowResize = () => {
      const mediaSize = getMediaSize(window.outerWidth);

      const updatedContext: IMediaQueryContext = {
        mediaSize,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
      setContext(updatedContext);
    };

    const {
      innerHeight: windowHeight,
      innerWidth: windowWidth,
      outerWidth,
    } = window;

    const mediaSize = getMediaSize(outerWidth);
    const updatedContext: IMediaQueryContext = {
      mediaSize,
      windowHeight,
      windowWidth,
    };
    setContext(updatedContext);

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <MediaQueryContext.Provider value={context}>
      {children}
    </MediaQueryContext.Provider>
  );
};

const getMediaSize = (currentWidth: number): MediaSize => {
  if (currentWidth >= 900) {
    return 'large';
  }

  return currentWidth >= 600 ? 'medium' : 'small';
};
