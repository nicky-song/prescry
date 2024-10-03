// Copyright 2022 Prescryptive Health, Inc.

import { JwksClient } from 'jwks-rsa';
import type { JSONWebKey } from 'jwks-rsa';

const jwksJsonMock = [
  {
    kty: 'RSA',
    e: 'AQAB',
    use: 'sig',
    kid: 'test1234',
    alg: 'RS256',
    n: 'pJITgELt650fZkH8mKxjz3ZewQHQvhmHetGg9yT8t-I2JCIuwd98XN0GfKhL05GjrfKH86s7yHndxRtxqBrBXBi4YijBJL_aprkwi8XOU5vJ5d8m26uoHd3ylvcNGY6QzpDTwNk8n_gM9pDAdl4c7SXijWYOJEtuDC6aOHbF7Pths2yIBW16SzbpgPqUduWxlWKd_Z3EO4lGFqonyadQI1P0eY9Y1yje52J11K4nm3KRfgHM3QnwfanXRX5D1soGzxTX_psiYUhXsGm3c7VWKukyzflsd6J3dP7SWp18Qi_WRQKBVPIDUK8tRDHjrAxjtUCFfKAYKVbyqOsN5Hwqpw',
  } as JSONWebKey,
];

export const jwksClientMock = {
  clientKey: 'Test_Partner',
  client: new JwksClient({
    jwksUri: 'http://localhost:881/.wellknown/jwks.json',
    cache: true,
    cacheMaxAge: 900000,
    rateLimit: true,
    jwksRequestsPerMinute: 8,
    timeout: 12000,
    getKeysInterceptor: () =>
      Promise.resolve(jwksJsonMock).then((keys) => keys),
  }),
};
