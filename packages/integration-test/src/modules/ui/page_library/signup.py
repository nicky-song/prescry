# Copyright 2021 Prescryptive Health Inc
import logging

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class Signup(BaseController):
    """ This class contains all login page functions """
    
    def __init__(self, driver):
        super().__init__()
        file_name = 'signup'
        ini_tag_name = 'Signup'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver
    
    def enter_signup_details(
            self, first_name: str, last_name: str, email: str, birth_month: str, birth_date: str, birth_year: str
    ):
        """
        The method is used to fill all the details in the signup form
        :param first_name: first name of user
        :param last_name: last name of user
        :param email:email of the user
        :param birth_month: birth month of user
        :param birth_date: birthdate of user
        :param birth_year: birth year of user
        """
        self.enter_text(self.element_parser.get('first_name'), 'first_name', first_name)
        self.enter_text(self.element_parser.get('last_name'), 'last_name', last_name)
        self.enter_text(self.element_parser.get('email'), 'email', email)
        self.click(self.element_parser.get('birth_date_month'), 'birth_date_month')
        self.click(
            self.element_parser.get('birth_date_month_value').replace(self.replace_pattern, birth_month),
            'birth_date_month_value'
        )
        self.click(self.element_parser.get('birth_date'), 'birth_date')
        self.click(
            self.element_parser.get('birth_date_value').replace(self.replace_pattern, birth_date),
            'birth_date_value'
        )
        self.click(self.element_parser.get('birth_date_year'), 'birth_date_year')
        self.click(
            self.element_parser.get('birth_date_year_value').replace(self.replace_pattern, birth_year),
            'birth_date_year_value'
        )
        self.click(self.element_parser.get('create_account_button'), 'create_account_button')

    def signup_negative_scenario(self):
        """
        The method used for negative testing of signup page without entering signup details
        """
        is_enabled = self.get_attribute(
            self.element_parser.get('create_account_button'), 'create_account_button', "aria-disabled"
        )
        assert is_enabled, "Create account button is enabled even if signup details are not filled"
        logging.info("Create account button is disabled if user not fill signup details")

    def signup_email_negative_scenario(
            self, first_name: str, last_name: str, email: str, birth_month: str, birth_date: str, birth_year: str
    ):
        """
        The method is used to fill invalid email and other details in the signup form and validate error message
        :param first_name: first name of user
        :param last_name: last name of user
        :param email:email of the user
        :param birth_month: birth month of user
        :param birth_date: birthdate of user
        :param birth_year: birth year of user
        """
        self.enter_text(self.element_parser.get('first_name'), 'first_name', first_name)
        self.enter_text(self.element_parser.get('last_name'), 'last_name', last_name)
        self.enter_text(self.element_parser.get('email'), 'email', email)
        self.click(self.element_parser.get('birth_date_month'), 'birth_date_month')
        self.click(
            self.element_parser.get('birth_date_month_value').replace(self.replace_pattern, birth_month),
            'birth_date_month_value'
        )
        self.click(self.element_parser.get('birth_date'), 'birth_date')
        self.click(
            self.element_parser.get('birth_date_value').replace(self.replace_pattern, birth_date),
            'birth_date_value'
        )
        self.click(self.element_parser.get('birth_date_year'), 'birth_date_year')
        self.click(
            self.element_parser.get('birth_date_year_value').replace(self.replace_pattern, birth_year),
            'birth_date_year_value'
        )
        self.click(self.element_parser.get('create_account_button'), 'create_account_button')
        assert self.is_visible(self.element_parser.get('invalid_email_error'), 'invalid_email_error'), (
            "'Please enter valid email' is not visible "
        )
        logging.info("'Please enter valid email' is visible")
