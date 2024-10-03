// Copyright 2022 Prescryptive Health, Inc.

import { useIsFocused } from "@react-navigation/native";
import { updateURLWithFeatureFlagsAndLanguage } from "../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language";

export const useUrl = (url?: string) => {
  const isFocused = useIsFocused();

  if (isFocused && url !== undefined) {
    updateURLWithFeatureFlagsAndLanguage(url);
  }
};