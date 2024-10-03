# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_testdata_list = ["login", "covidtest"]
testdata_list = ["login", "config"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_testdata_list, driver)


@pytest.mark.parametrize(
    "login_type", testdata["login"]["login_with_invalid_number"].values()
)
def test_login_using_invalid_number(page, login_type):
    """
    Test method to validate login with invalid number - short_number,empty_number,alphanumeric_number,
    without_accepting_terms_and_conditions
    :param page: objects for provided page list
    :param login_type: Type of number - short,empty,alphanumeric,without_accepting_terms_and_conditions
    """
    config_data = copy.deepcopy(testdata['config'])
    page.login.login_with_invalid_number(
        mobile_number=login_type['mobile_number'], terms_condition_flag=login_type['terms_condition_flag']
    )
    page.covidtest.hit_url_in_browser(config_data['url'])


def test_login_with_landline_number(page):
    """
    Test method to login with landline number
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata['login'])
    page.login.login_with_landline_number(mobile_number=login_data['landline_number'], terms_condition_flag=True)


@pytest.mark.parametrize(
    "login", testdata["login"]["login_with_invalid_otp"].values()
)
def test_login_using_invalid_otp(page, login):
    """
    Test method to login with invalid otp - short_otp,empty_otp,alphanumeric_otp,wrong_otp
    :param page: objects for provided page list
    :param login: Type of otp - short_otp,empty_otp,alphanumeric_otp,wrong_otp
    """
    login_data = copy.deepcopy(testdata["login"])
    config_data = copy.deepcopy(testdata['config'])
    negative_data = login['negative_test_data']
    page.login.login_with_invalid_otp(
        mobile_number=login_data['mobile_number'], terms_condition_flag=True,
        invalid_otp=negative_data['otp'], otp_type=negative_data['otp_type']
    )
    page.covidtest.hit_url_in_browser(config_data['url'])


@pytest.mark.dependency()
def test_user_login(page):
    """
    Test method to login to the prescryptive
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(mobile_number=login_data['mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True)


@pytest.mark.dependency(depends=["test_user_login"])
def test_logout(page):
    """
    Test method is used to close browser instance
    :param page: objects for provided page list
    """
    page.login.close_browser()
