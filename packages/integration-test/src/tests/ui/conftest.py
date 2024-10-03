# Copyright 2021 Prescryptive Health Inc
import pytest

from libraries.selenium import BaseController
from libraries.common import Common


@pytest.fixture(scope="session")
def browser(request):
    """
    Initialize and return browser name. Default is chrome
    """
    return request.config.getoption("--browser").lower()


@pytest.fixture(scope="session")
def device_name(request):
    """
    Initialize and return device name
    """
    return request.config.getoption("--device_name")


@pytest.fixture(scope="module")
def driver(browser, device_name):
    """
    Launch browser based on passed argument
    :param browser: Browser name
    :param device_name: Name of the device
    :return: Web driver session object
    """
    base_obj = BaseController()
    base_obj.add_allure_enviornment_properties(browser, device_name)
    testdata = Common.ui_test_data(["config"])
    url = testdata['config']['url']
    return base_obj.open_mobile_emulation_url(url=url, browser_name=browser, device_name=device_name)


def pytest_addoption(parser):
    # Add command line arguments
    parser.addoption("--browser", type=str, default="chrome", help="Enter execution browser name")
    parser.addoption("--device_name", type=str, default="iPhone X", help="Enter execution device name")
