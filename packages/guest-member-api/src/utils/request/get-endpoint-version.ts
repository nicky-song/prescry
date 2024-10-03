// Copyright 2023 Prescryptive Health, Inc.

import { Request } from 'express';
import { RequestHeaders } from "@phx/common/src/experiences/guest-experience/api/api-request-headers";
import { EndpointVersion } from "../../models/endpoint-version";

export function getEndpointVersion(request: Request): EndpointVersion {
  if (request.headers) {
    const endpointVersion: EndpointVersion | undefined = request.headers[RequestHeaders.apiVersion] as EndpointVersion;
    return endpointVersion || 'v1';
  }

  return 'v1';
}
