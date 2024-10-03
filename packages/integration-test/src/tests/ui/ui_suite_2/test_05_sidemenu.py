# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "sidemenu", "digitalcard", "homepage", "covidtest"]
testdata_list = ["login", "sidemenu", "database", "config"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_list, driver)


@pytest.mark.dependency()
def test_login(page):
    """
    Test method to login to the prescryptive login
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(
        mobile_number=login_data['waitlist_mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True
    )


@pytest.mark.dependency(depends=["test_login"])
def test_validate_sidemenu(page):
    """
    The test is used to validate sidemenu elements
    :param page: objects for provided page list
    """
    page.sidemenu.verify_sidemenu_elements()


@pytest.mark.dependency(depends=["test_login"])
def test_validate_support(page):
    """
    The test is used to validate support element
    :param page: objects for provided page list
    """
    page.sidemenu.verify_support()


@pytest.mark.dependency(depends=["test_login"])
def test_edit_profile(page):
    """
    The test is used to edit users profile
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    sidemenu_data = copy.deepcopy(testdata["sidemenu"])
    page.sidemenu.primary_profile_edit(old_pin_no=login_data['pin_no'], new_pin_no=sidemenu_data['new_pin_no'])
    page.sidemenu.primary_profile_edit(old_pin_no=sidemenu_data['new_pin_no'], new_pin_no=login_data['pin_no'])


@pytest.mark.dependency(depends=["test_login"])
def test_edit_pin_negative_scenario(page):
    """
    The test is used to edit users profile pin-While changing pin if the new pin is same as old pin then error message
    appear(Negative Scenario)
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    sidemenu_data = copy.deepcopy(testdata["sidemenu"])
    # Negative scenario for pin edit
    page.sidemenu.primary_profile_edit(
        old_pin_no=login_data['pin_no'], new_pin_no=sidemenu_data['new_pin_no'], scenario=sidemenu_data['scenario']
    )


@pytest.mark.dependency(depends=["test_login"])
def test_tc_privacy_links(page):
    """
    The method is used to verify terms and privacy links in side menu page
    :param page: objects for provided page list
    """
    sidemenu_data = copy.deepcopy(testdata["sidemenu"])
    page.sidemenu.verify_terms_conditions_and_privacy_links(
        terms_url=sidemenu_data['terms_url'], privacy_url=sidemenu_data['privacy_url']
    )


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
