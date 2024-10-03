# Copyright 2021 Prescryptive Health Inc
import base64
import os
import time

from authlib.jose import jwt

from libraries.common import Common


def generate_token(headers: dict = None, **options):
    """
    Method to generate the automation token
    :param headers: Headers
    :param options: payload of extra parameters such as mobile number, otp
    :return:
    """
    # Setting expiry time of the token
    jwt_valid_seconds = 3600
    expiry_time = round(time.time()) + jwt_valid_seconds

    # Reading key from jwt_secret.txt file
    file_path_secret = os.path.join(Common.project_path(), "testdata/ui/jwt_secret.txt")
    secret_key_file_data = open(file_path_secret, 'r')
    base64_secret_key = secret_key_file_data.read()
    key = base64.b64decode(base64_secret_key).decode('utf-8')
    if not key:
        raise Exception("Key not Found.")
    payload = {
        "name": "AUTOMATION_USER",
        "exp": expiry_time
    }
    header = {
        "alg": "HS256"
    }
    if options:
        payload.update(**options)
    if headers:
        header.update(**headers)
    return (jwt.encode(header=header, payload=payload, key=key)).decode('UTF-8')
