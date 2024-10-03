// Copyright 2018 Prescryptive Health, Inc.

import { ImageSourcePropType } from 'react-native';
import {
  ExpectedFileKeys,
  ExpectedObjectFileKeys,
  ImageInstanceNames,
  ImageKeysMap,
  ObjectInstanceNames,
  ObjectKeysMap,
} from '../theming/assets';

export const ResolvedImagesMap = new Map<string, ImageSourcePropType>();
export const ResolvedObjectsMap = new Map<string, unknown[]>();

export function requireFiles<TKeys = ExpectedFileKeys>(
  requirer: (requirePath: string) => ImageSourcePropType,
  files: Map<TKeys, string>,
  path: string,
  ...params: string[]
): Map<TKeys, ImageSourcePropType> {
  const fileMap = new Map<TKeys, ImageSourcePropType>();
  files.forEach((fileName: string, fileKey: TKeys) => {
    const source: ImageSourcePropType = requireAsset(
      requirer,
      fileName,
      path,
      ...params
    );
    if (source) {
      fileMap.set(fileKey, source);
    }
  });
  return fileMap;
}

export function requireAsset(
  requirer: (requirePath: string) => ImageSourcePropType,
  file: string,
  path: string,
  ...params: string[]
) {
  const asset = [`${path}${file}`, ...params].join('');
  return requirer(asset);
}

export function getResolvedImageSource(
  name: ImageInstanceNames
): ImageSourcePropType {
  const image = ResolvedImagesMap.get(name);
  return image || -1;
}

export function getResolvedObjectSource(name: ObjectInstanceNames): unknown[] {
  const staticObject = ResolvedObjectsMap.get(name) ?? [];
  return staticObject;
}

export function initializeObjectAssets(
  fileKeyMap: Map<ExpectedObjectFileKeys, unknown[]>
) {
  fileKeyMap.forEach((source: unknown[], key: ExpectedObjectFileKeys) => {
    ObjectKeysMap.forEach(
      (fileKey: ExpectedObjectFileKeys, objectName: ObjectInstanceNames) => {
        if (fileKey === key) {
          ResolvedObjectsMap.set(objectName, source);
        }
      }
    );
  });
}

export function initializeImageAssets(
  fileKeyMap: Map<ExpectedFileKeys, ImageSourcePropType>
) {
  fileKeyMap.forEach((source: ImageSourcePropType, key: ExpectedFileKeys) => {
    ImageKeysMap.forEach(
      (fileKey: ExpectedFileKeys, imageName: ImageInstanceNames) => {
        if (fileKey === key) {
          ResolvedImagesMap.set(imageName, source);
        }
      }
    );
  });
}
