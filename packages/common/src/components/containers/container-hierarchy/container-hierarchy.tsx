// Copyright 2020 Prescryptive Health, Inc.

import React, { ComponentType, FunctionComponent, ReactElement } from 'react';

export interface IContainerHierarchyProps {
  containerList: ComponentType[];
}

export const ContainerHierarchy: FunctionComponent<IContainerHierarchyProps> = ({
  containerList,
  children,
}): ReactElement => {
  let hierarchy = <>{children}</>;

  const reversedContainerList = [...containerList].reverse();
  reversedContainerList.forEach((Container) => {
    hierarchy = <Container>{hierarchy}</Container>;
  });

  return hierarchy;
};
