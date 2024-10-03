# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from libraries.database import Database
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "signup", "homepage", "join_employer_plan"]
testdata_list = ["login", "signup", "homepage", "join_employer_plan", "database"]
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
    # To delete data entry from database if data persist to signup
    data_obj = Database()
    data_obj.delete_person_data_database(login_data['country_code_mobile'], login_data['mobile_number'])
    # Delete device tokens for the registered number
    data_obj.delete_tokens_for_device(login_data['country_code_mobile'], login_data['mobile_number'])
    page.login.login(
        mobile_number=login_data['mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True,
        login='signup'
    )


@pytest.mark.dependency(depends=["test_login"])
def test_signup_negative_scenario(page):
    """
    Test method is used to cover all negative testing in signup form
    :param page: objects for provided page list
    """
    signup_data = copy.deepcopy(testdata["signup"])
    # Negative testing of signup page without entering signup details
    page.signup.signup_negative_scenario()
    # Negative scenario for email
    page.signup.signup_email_negative_scenario(
        first_name=signup_data['first_name'], last_name=signup_data['last_name'],
        birth_month=signup_data['birth_month'], email=signup_data['invalid_email'],
        birth_date=signup_data['birth_date'], birth_year=signup_data['birth_year']
    )


@pytest.mark.dependency(depends=["test_login"])
def test_validate_signup(page):
    """
    Test method is used to validate signup functionality
    :param page: objects for provided page list
    """
    signup_data = copy.deepcopy(testdata["signup"])
    login_data = copy.deepcopy(testdata["login"])
    # To enter signup details
    page.signup.enter_signup_details(
        first_name=signup_data['first_name'], last_name=signup_data['last_name'],
        birth_month=signup_data['birth_month'], email=signup_data['email'], birth_date=signup_data['birth_date'],
        birth_year=signup_data['birth_year']
    )
    # To create pin -enter pin
    page.login.enter_pin(pin_no=login_data['pin_no'], enter_value="create")
    # To create pin-re-enter pin
    page.login.enter_pin(pin_no=login_data['pin_no'], enter_value="re-enter")
    # To verify homepage elements are visible after signup
    homepage_data = copy.deepcopy(testdata["homepage"])
    page.homepage.homepage_validation(pdf_url=homepage_data["pdf_url"])


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
