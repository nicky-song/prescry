# Copyright 2021 Prescryptive Health Inc
import os
import time

import pytest

from libraries.common import Common
from libraries.logger import Log


@pytest.fixture(scope="session")
def log_level(request):
    return request.config.getoption("--log_level").upper()


@pytest.fixture(scope="module")
def log_location(request):
    log_location = request.config.getoption("--log_location")
    if log_location is None:
        current_test_file = f'{os.getenv("PYTEST_CURRENT_TEST").split(".")[0]}_{time.strftime("%Y%m%d%H%M%S")}'
        log_location = os.path.join(Common.project_path(), 'logs', current_test_file)
    return log_location


def _create_log_path(filename: str, location: str) -> str:
    return os.path.join(location, f"{filename}_{time.strftime('%Y%m%d%H%M%S')}.log")


@pytest.fixture(scope="function", autouse=True)
def logfile_setup_function(request, log_location, log_level):
    """
    If the Pytest Function is not wrapped around a class, create a folder with the Module name,
        then create a log with function_name.log
    """
    if request.cls or request.config.getoption("--disable_logger"):
        yield
        return
    assert request.function, f"{request.function}"
    current_log = Log()
    function_name = request.function.__name__
    current_log.logfile(_create_log_path(function_name, log_location), log_level)

    yield
    current_log.reset_logger()


@pytest.fixture(scope="class", autouse=True)
def logfile_setup_class(request, log_location, log_level):
    """
    If the Pytest function is wrapped around a class, use filename.log instead of function_name.log
    """
    if not request.cls or request.config.getoption("--disable_logger"):
        yield
        return
    assert request.cls, f"{request.cls}"
    current_log = Log()
    log_file_name = request.module.__name__.split(".")[-1]
    current_log.logfile(_create_log_path(log_file_name, log_location), log_level)

    yield
    current_log.reset_logger()


def pytest_addoption(parser):
    # Add command line arguments
    parser.addoption("--disable_logger", action="store_true", default=False, help="Disable the Pytest logger")
    parser.addoption("--log_level", type=str, default="INFO", help="Enter log level. Options: INFO(Default) or DEBUG")
    parser.addoption("--log_location", type=str, help="Enter log file directory location")

