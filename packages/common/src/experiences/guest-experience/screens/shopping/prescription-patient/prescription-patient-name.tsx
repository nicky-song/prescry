// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { ImageAsset } from '../../../../../components/image-asset/image-asset';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IPrescriptionPatientNameContent } from './prescription-patient-name.content';
import { styles } from './prescription-patient-name.styles';

interface IPrescriptionPatientNameProps {
  prescriptionPatient: ILimitedPatient;
}

export function PrescriptionPatientName({
  prescriptionPatient,
}: IPrescriptionPatientNameProps) {
  const { content, isContentLoading } =
    useContent<IPrescriptionPatientNameContent>(
      CmsGroupKey.prescriptionPatientName,
      2
    );
  return (
    <View style={styles.forPatientViewStyle}>
      <ImageAsset name={'profileIcon'} style={styles.profileIconStyle} />
      {prescriptionPatient ? (
        <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
          {StringFormatter.format(
            content.forPatient,
            new Map([
              ['firstName', prescriptionPatient.firstName],
              ['lastName', prescriptionPatient.lastName],
            ])
          )}
        </BaseText>
      ) : (
        ''
      )}
    </View>
  );
}
