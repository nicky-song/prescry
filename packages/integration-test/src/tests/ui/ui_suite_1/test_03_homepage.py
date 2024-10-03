# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_testdata_list = ["login", "homepage"]
testdata = Common.ui_test_data(page_testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_testdata_list, driver)


@pytest.mark.dependency()
def test_login(page):
    """
    Test method to login to the prescryptive login
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(mobile_number=login_data['mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True)


@pytest.mark.dependency(depends=["test_login"])
def test_homepage(page):
    """
    Test method is used to validate home page elements,tab text,link text
    :param page: objects for provided page list
    """
    homepage_data = copy.deepcopy(testdata["homepage"])
    page.homepage.homepage_validation(pdf_url=homepage_data["pdf_url"])


def test_logout(page):
    """
    Test method is used to close browser instance
    :param page: objects for provided page list
    """
    page.login.close_browser()
