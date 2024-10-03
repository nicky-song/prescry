# Copyright 2021 Prescryptive Health Inc
import copy
from time import strptime

import pytest

from libraries.common import Common
from libraries.database import Database
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "signup", "sidemenu", "join_employer_plan", "homepage"]
testdata_list = ["login", "signup", "database", "sidemenu", "join_employer_plan", "homepage", "sie_user_database"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_list, driver)


@pytest.mark.dependency()
def test_update_already_created_sie_user_record(page):
    """
    Updating the sie user record which is already present in the database.
    Adding a blank string for mobile number, first name, last name and birth date of the sie user record
    :param page: objects for provided page list
    """
    sie_user_database_testdata = copy.deepcopy(testdata["sie_user_database"])
    data_obj = Database()
    # Update the record of the sie user details
    data_obj.update_already_created_sie_user_record(sie_user_database_testdata['sie_user_details']['identifier'])
    # Update the record of the sie dependent user details
    data_obj.update_already_created_sie_user_record(
        sie_user_database_testdata['child_identifier'], child_dependent=True
    )


@pytest.mark.dependency(depends=['test_update_already_created_sie_user_record'])
def test_add_sie_user(page):
    """
    Test method to add sie user details in person collection for the record
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata['login'])
    signup_data = copy.deepcopy(testdata['signup'])
    sie_user_database_data = copy.deepcopy(testdata['sie_user_database'])
    database = Database()
    birth_month = signup_data['birth_month']
    birth_date = signup_data['birth_date']
    birth_year = signup_data['birth_year']
    birth_month = str(strptime(birth_month[:3], '%b').tm_mon)
    if int(birth_month) < 10:
        birth_month = '0' + birth_month
    complete_birth_date = birth_year + "-" + birth_month + "-" + birth_date
    # Adding SIE user details in the person collection for the record
    database.create_sie_user(
        identifier=sie_user_database_data['sie_user_details']['identifier'],
        phone_number=login_data['waitlist_mobile_number'], country_code=login_data['country_code_mobile'],
        first_name=signup_data['first_name'].capitalize(), last_name=signup_data['last_name'].capitalize(),
        birth_date=complete_birth_date
    )


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_validate_sidemenu_sie_user_account(page):
    """
    The test is used to validate sidemenu elements
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(
        mobile_number=login_data['waitlist_mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True
    )
    page.sidemenu.verify_sidemenu_elements_sie_user()


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_health_plan_card_for_sie_user(page):
    """
    The test is used to validate health plan card for SIE user for UI against Database
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    database_data = copy.deepcopy(testdata["database"])
    database = Database()
    database_healthplancard_data = database.get_idcard_details(
        login_data['country_code_mobile'], login_data['waitlist_mobile_number'],
        database_data['digital_card']['sie_user_rxgroup_type']
    )
    page.sidemenu.health_plan_idcard_validation(database_healthplancard_data)


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_edit_profile_for_sie_user(page):
    """
    The test is used to edit users profile for SIE User
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    sidemenu_data = copy.deepcopy(testdata["sidemenu"])
    page.sidemenu.primary_profile_edit(old_pin_no=login_data['pin_no'], new_pin_no=sidemenu_data['new_pin_no'])
    page.sidemenu.primary_profile_edit(old_pin_no=sidemenu_data['new_pin_no'], new_pin_no=login_data['pin_no'])


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_validate_support_for_sie_user(page):
    """
    The test is used to validate support element for SIE User
    :param page: objects for provided page list
    """
    page.sidemenu.verify_support_for_sie_user()


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_view_benefit_plan_validation(page):
    """
    The test is used to validate benefit plan for SIE user
    :param page: objects for provided page list
    """
    sidemenu_data = copy.deepcopy(testdata["sidemenu"])
    page.sidemenu.validate_benefit_plan(member_portal_url=sidemenu_data['member_portal_url'])


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_validate_emp_plan_sie_user(page):
    """
    The method is used to validate join employer plan for SIE user
    :param page: objects for provided page list
    """
    page.homepage.navigate_back()
    sie_user_database_data = copy.deepcopy(testdata["sie_user_database"])
    database = Database()
    member_id_sie_user = database.update_database_values_for_join_emp_sie_user(
        sie_user_database_data['sie_user_details']['identifier']
    )
    employer_plan_data = copy.deepcopy(testdata['join_employer_plan'])
    page.homepage.click_homepage_card(employer_plan_data['join_employer_plan'])
    page.join_employer_plan.join_emp_sie_user(member_id_sie_user)
    assert (page.homepage.check_visiblity_of_card(employer_plan_data['join_employer_plan']),
            "Join employer plan card is still visible after joining employer plan")


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_add_sie_dependent_entry(page):
    """
    The method is used to validate join employer plan for SIE user
    :param page: objects for provided page list
    """
    sie_user_data = copy.deepcopy(testdata["sie_user_database"])
    database = Database()
    # Adding SIE dependent user details in the person collection for the record with
    # identifier = 60dee487156056521030ece3
    database.create_sie_dependent_user(
        sie_identifier=sie_user_data['sie_user_details']['identifier'], identifier=sie_user_data['child_identifier'],
        first_name=sie_user_data['child_first_name'].capitalize(),
        last_name=sie_user_data['child_last_name'].capitalize(), birth_date=sie_user_data['date_of_birth']
    )


@pytest.mark.dependency(depends=["test_add_sie_dependent_entry"])
def test_validate_sie_dependent_entry(page):
    """
    Test method to validate sie dependent entry
    :param page: Objects of the provided page list
    """
    sie_user_data = copy.deepcopy(testdata["sie_user_database"])
    page.sidemenu.verify_dependent_profile_entry(
        dependent_first_name=sie_user_data['child_first_name'].capitalize(),
        dependent_last_name=sie_user_data['child_last_name'].capitalize()
    )


@pytest.mark.dependency(depends=["test_add_sie_user"])
def test_update_created_sie_user_and_dependent_record(page):
    """
    Updating the sie user record which is already present in the database.
    Adding a blank string for mobile number, first name, last name and birth date of the sie user record
    :param page: objects for provided page list
    """
    sie_user_data = copy.deepcopy(testdata['sie_user_database'])
    data_obj = Database()
    # Update the record of the sie user details
    data_obj.update_already_created_sie_user_record(sie_user_data['sie_user_details']['identifier'])
    # Update the record of the sie dependent user details
    data_obj.update_already_created_sie_user_record(sie_user_data['child_identifier'], child_dependent=True)


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
