# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from libraries.database import Database
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "homepage", "digitalcard"]
testdata_list = ["login", "homepage", "database", "digitalcard", "signup"]
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
    page.login.login(mobile_number=login_data['mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True)


@pytest.mark.dependency(depends=["test_login"])
def test_digitalcard_for_cash_user(page):
    """
    The test is used to validate digital card UI against Database
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    database_data = copy.deepcopy(testdata["database"])
    database = Database()
    database_digicard_data = database.get_idcard_details(
        login_data['country_code_mobile'], login_data['mobile_number'],
        database_data['digital_card']['cash_user_rxgroup_type']
    )
    page.homepage.click_homepage_card("smart_price_card")
    page.digitalcard.digitalcard_validation(database_digicard_data)


def test_smart_card_edit_pin(page):
    """
    The test is used to edit login pin in smart card
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    digitalcard_data = copy.deepcopy(testdata["digitalcard"])
    page.digitalcard.smart_card_profile_edit(old_pin_no=login_data['pin_no'], new_pin_no=digitalcard_data['new_pin_no'])
    page.homepage.click_homepage_card("smart_price_card")
    page.digitalcard.smart_card_profile_edit(old_pin_no=digitalcard_data['new_pin_no'], new_pin_no=login_data['pin_no'])


def test_info_validation_smart_card(page):
    """
    The test is used to validate smart card UI against Database
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    signup_data = copy.deepcopy(testdata["signup"])
    smart_card_json_info_dict = page.digitalcard.smart_card_json_info_update(
        signup_data["email"], login_data["mobile_number"], signup_data["birth_month"],
        signup_data["birth_date"], signup_data["birth_year"]
    )
    page.homepage.click_homepage_card("smart_price_card")
    page.digitalcard.smart_card_validation(smart_card_json_info_dict)


def test_smart_card_edit_email(page):
    """
    The test is used to edit smart card email
    :param page: objects for provided page list
    """
    digitalcard_data = copy.deepcopy(testdata["digitalcard"])
    page.digitalcard.smart_card_email_edit(new_email=digitalcard_data["new_email"])


def test_logout(page):
    """
    Test method is used to close browser instance
    :param page: objects for provided page list
    """
    page.login.close_browser()
