# Copyright 2021 Prescryptive Health Inc
import logging

from libraries.selenium import BaseController
from utilities import generate_token, generate_otp

log = logging.getLogger(__name__)


class Login(BaseController):
    """ This class contains all login page functions """

    def __init__(self, driver):
        super().__init__()
        file_name = 'login'
        ini_tag_name = 'Login'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver

    def login(self, mobile_number='', pin_no='', terms_condition_flag=False, login=""):
        """
        Method to login to the application
        :param mobile_number: Mobile number required for login
        :param terms_condition_flag: For true value it will click on the terms and condition flag
        :param login: Flag for first time login
        :param pin_no: Pin number required for login
        """
        otp_num = generate_otp()
        token = generate_token(phoneNumber=mobile_number, code=str(otp_num))
        self.execute_script(token)
        self.is_visible(self.element_parser.get('mobile_number'), 'mobile_number')
        self.enter_text(self.element_parser.get('mobile_number'), 'mobile_number', mobile_number)
        if terms_condition_flag:
            self.click(self.element_parser.get('terms_and_conditions'), 'terms_and_conditions')
        self.click(self.element_parser.get('next_button'), 'next_button')
        self.is_visible(self.element_parser.get('otp_input'), 'otp_input')
        self.enter_text(self.element_parser.get('otp_input'), 'otp_input', otp_num)
        self.click(self.element_parser.get('verify_button'), 'verify_button')
        if not login == "signup":
            for pin in pin_no:
                self.click(self.element_parser.get('pin_button').replace(self.replace_pattern, pin), 'pin_button')
            self.click(self.element_parser.get('login_button'), 'login_button')

    def login_with_invalid_number(self, mobile_number='', terms_condition_flag=False):
        """
        Method to check login with negative scenarios
        :param mobile_number: Invalid/empty mobile number
        :param terms_condition_flag: For true value it will click on the terms and condition flag
        """
        self.landing_page()
        self.enter_text(self.element_parser.get('mobile_number'), 'mobile_number', mobile_number)
        if terms_condition_flag:
            self.click(self.element_parser.get('terms_and_conditions'), 'terms_and_conditions')
        is_enabled = self.get_attribute(self.element_parser.get('next_button'), 'next_button', "aria-disabled")
        assert is_enabled, "Next button is enabled for invalid number"
        logging.info("Next button is disabled for invalid number")

    def login_with_landline_number(self, mobile_number: str = '', terms_condition_flag: bool = False):
        """
        Method to check invalid login with landline no
        :param mobile_number: landline number
        :param terms_condition_flag: For true value it will click on the terms and condition flag
        """
        self.landing_page()
        self.enter_text(self.element_parser.get('mobile_number'), 'mobile_number', mobile_number)
        if terms_condition_flag:
            self.click(self.element_parser.get('terms_and_conditions'), 'terms_and_conditions')
        is_enabled = self.get_attribute(self.element_parser.get('next_button'), 'next_button', "data-focusable")
        assert is_enabled, "Next button is enabled for invalid number"
        self.click(self.element_parser.get('next_button'), 'next_button')
        assert self.is_visible(self.element_parser.get("error_message"), "error_message")

    def enter_pin(self, pin_no: str = '', enter_value: str = ''):
        """
        The method is used to enter pin number
        :param pin_no: pin number to be entered
        :param enter_value :pin enter screen type to be entered
        """
        if enter_value == "create":
            for pin in pin_no:
                self.click(self.element_parser.get('pin_button').replace(self.replace_pattern, pin), 'pin_button')
        elif enter_value == "re-enter":
            for pin in pin_no:
                self.click(self.element_parser.get('reneter_pin_button').replace(
                    self.replace_pattern, pin), 'reneter_pin_button'
                )
        self.click(self.element_parser.get('signup_next_button'), 'signup_next_button')

    def landing_page(self):
        """
        The Method to click on go button when landing page is visible
        """
        go_button_list = self.find_elements(self.element_parser.get('go_button_list'), 'go_button_list')
        if go_button_list != []:
            go_button_list[0].click()

    def login_with_invalid_otp(self, mobile_number='', terms_condition_flag=False, invalid_otp='', otp_type: str = ''):
        """
        Method to login to the application with invalid/wrong otp
        :param mobile_number: Mobile number required for login
        :param terms_condition_flag: For true value it will click on the terms and condition flag
        :param invalid_otp: Pin number required for login
        :param otp_type: Type of otp wrong/invalid otp
        """
        otp_num = generate_otp()
        token = generate_token(phoneNumber=mobile_number, code=str(otp_num))
        self.execute_script(token)
        self.is_visible(self.element_parser.get('mobile_number'), 'mobile_number')
        self.enter_text(self.element_parser.get('mobile_number'), 'mobile_number', mobile_number)
        if terms_condition_flag:
            self.click(self.element_parser.get('terms_and_conditions'), 'terms_and_conditions')
        self.click(self.element_parser.get('next_button'), 'next_button')
        self.is_visible(self.element_parser.get('otp_input'), 'otp_input')
        self.enter_text(self.element_parser.get('otp_input'), 'otp_input', invalid_otp)
        if otp_type == 'wrong':
            self.click(self.element_parser.get('verify_button'), 'verify_button')
            assert self.is_visible(self.element_parser.get('invalid_otp_error'), 'invalid_otp_error'), (
                "Failed to see invalid otp error message"
            )
            logging.info("'Enter the correct code' error message is visible")
        else:
            is_enabled = self.get_attribute(
                self.element_parser.get('verify_button'), 'verify_button', "aria-disabled"
            )
            assert is_enabled, "Verify button is enabled for invalid otp"
            logging.info("Verify button is disabled for invalid otp")
