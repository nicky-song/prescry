# Copyright 2021 Prescryptive Health Inc
import logging

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class Sidemenu(BaseController):
    """ This class contains all sidemenu page functions """

    def __init__(self, driver):
        super().__init__()
        file_name = 'sidemenu'
        ini_tag_name = 'Sidemenu'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver

    def verify_sidemenu_elements(self):
        """
        The method is used to validate sidemenu elements
        """
        self.is_visible(self.element_parser.get("userprofile"), "userprofile", timeout=90)
        self.click(self.element_parser.get("userprofile"), "userprofile")
        tab_list = ["support", "profile"]
        for element in tab_list:
            assert self.is_visible(self.element_parser.get(element), element), f"{element} is not visible"

    def click_idcard(self):
        """
        The method is used to click id card in the sidemenu page
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        visiblity_status = self.is_visible(self.element_parser.get("id_card"), "id_card")
        if visiblity_status:
            self.click(self.element_parser.get("idcard"), "idcard")
            logging.info("There is Id card for the user")
        else:
            logging.info("There is no Id card present for the user")
        return visiblity_status

    def verify_support(self):
        """
        The method is used to verify the support
        """
        self.click(self.element_parser.get("support"), "support")
        assert self.is_visible(self.element_parser.get("contact_us"),
                               "contact_us"), f"prescryptive email is not visible"
        self.click(self.element_parser.get('support_back_button'), 'support_back_button')

    def primary_profile_edit(self, old_pin_no: str = '', new_pin_no: str = '', scenario: str = ''):
        """
        The method is used to edit profile of primary member
        :param old_pin_no: old pin number to be entered
        :param new_pin_no : new pin number to be entered
        :param scenario :negative scenario for pin change
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("profile"), "profile")
        assert self.is_visible(self.element_parser.get("primary_edit"), "primary_edit")
        self.click(self.element_parser.get("primary_edit"), "primary_edit")
        self.is_visible(self.element_parser.get("pin_edit"), "pin_edit")
        self.click(self.element_parser.get("pin_edit"), "pin_edit")
        if scenario == 'negative':
            # Enter old pin as new pin and verify error message
            self.enter_pin(pin_screen='enter_old_pin', pin_no=old_pin_no)
            self.enter_pin(pin_screen='enter_new_pin', pin_no=old_pin_no)
            self.enter_pin(pin_screen='confirm_new_pin', pin_no=old_pin_no)
            assert self.is_visible(self.element_parser.get("pin_change_error_message"), "pin_change_error_message"), \
                "Error message does not appear when we try to change new pin same as old pin"
            logging.info("Error message appear when we try to change new pin same as old pin")
            self.reload_page()
        else:
            self.enter_pin(pin_screen='enter_old_pin', pin_no=old_pin_no)
            self.enter_pin(pin_screen='enter_new_pin', pin_no=new_pin_no)
            self.enter_pin(pin_screen='confirm_new_pin', pin_no=new_pin_no)
            assert self.is_visible(self.element_parser.get("pin_changed_successful"), "pin_changed_successful")
            self.click(self.element_parser.get("userprofile"), "userprofile")

    def dependent_profile_edit(self):
        """
        The method is used to edit the dependents profile
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("users"), "users")
        assert self.is_visible(self.element_parser.get("dependent_members"), "dependent_members")
        self.click(self.element_parser.get("dependent_profile_edit"), "dependent_profile_edit")
        self.driver.back()

    def enter_pin(self, pin_screen: str = '', pin_no: str = ''):
        """
        The method is used to enter pin number
        :param pin_screen: pin_screen type to be entered
        :param pin_no: pin number to be entered
        """
        for pin in pin_no:
            self.click(self.element_parser.get(pin_screen).replace(self.replace_pattern, pin), pin_screen)
        self.click(self.element_parser.get('next_button'), 'next_button')

    def verify_terms_conditions_and_privacy_links(self, terms_url: str = '', privacy_url: str = ''):
        """
        The function is used to verify terms and privacy links in side menu page
        :param terms_url: Term and conditions url
        :param privacy_url: privacy url
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("terms_condition_link"), "terms_condition_link")
        if not self.get_current_url() == terms_url:
            raise Exception(
                f"The application is not navigating to the terms url {terms_url}. Browser should navigate to the "
                f"{self.get_current_url()} url"
            )
        logging.info(f"Application is successfully navigating to the {terms_url} url")
        self.driver.back()
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("privacy_link"), "privacy_link")
        if not self.get_current_url() == privacy_url:
            raise Exception(
                f"The application is not navigating to the terms url {privacy_url}. Browser should navigate to the "
                f"{self.get_current_url()} url"
            )
        logging.info(f"Application is successfully navigating to the {privacy_url} url")

    def health_plan_idcard_validation(self, database_health_plan_idcard_dict: dict):
        """
        The method is used to validate health plan id card details for SIE user UI vs Database
        :param database_health_plan_idcard_dict:dictionary fetched from database for health plan idcard
        """
        self.click(self.element_parser.get('health_plan_card'), 'health_plan_Card')
        assert self.is_visible(self.element_parser.get("healthplan_card_screen"), "healthplan_card_screen")
        issuer_no = int(self.get_text(self.element_parser.get("issuer_no"), "issuer_no"))
        ui_dict = {"issuer_no": issuer_no,
                   "name": self.get_text(self.element_parser.get("name"), "name").replace(" ", ""),
                   "rx_group": self.get_text(self.element_parser.get("rx_group"), "rx_group"),
                   "rx_id": self.get_text(self.element_parser.get("id_no"), "id_no").replace(" ", ""),
                   "rx_bin": self.get_text(self.element_parser.get("rx_bin"), "rx_bin"),
                   "rx_pcn": self.get_text(self.element_parser.get("rx_pcn"), "rx_pcn")}
        for element in database_health_plan_idcard_dict:
            if not database_health_plan_idcard_dict[element] == ui_dict[element]:
                raise Exception(
                    f"The idcard details for {element} is different for UI = {ui_dict[element]} "
                    f"and database = {database_health_plan_idcard_dict[element]}")
        self.click(self.element_parser.get('support_back_button'), 'support_back_button')

    def verify_sidemenu_elements_sie_user(self):
        """
        The method is used to validate sidemenu elements for SIE User
        """
        self.is_visible(self.element_parser.get("userprofile"), "userprofile", timeout=90)
        self.click(self.element_parser.get("userprofile"), "userprofile")
        tab_list = ["support", "profile", "view_benefit_plan", "health_plan_card"]
        for element in tab_list:
            assert self.is_visible(self.element_parser.get(element), element), f"{element} is not visible"

    def validate_benefit_plan(self, member_portal_url):
        """
        The method is used to validate view benefit plan url for SIE user
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get('view_benefit_plan'), 'view_benefit_plan')
        if not self.get_current_url() == member_portal_url:
            raise Exception(f"The application is not navigated to the member portal pdf {member_portal_url}")

    def verify_support_for_sie_user(self):
        """
        The method is used to verify the support for SIE User
        """
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("support"), "support")
        assert self.is_visible(self.element_parser.get("contact_us_for_sie_user"),
                               "contact_us_for_sie_user"), f"prescryptive email is not visible"
        assert self.is_visible(self.element_parser.get("member_portal_link"),
                               "member_portal_link"), f"Member portal is not visible"
        self.click(self.element_parser.get('support_back_button'), 'support_back_button')

    def verify_dependent_profile_entry(self, dependent_first_name: str, dependent_last_name: str):
        """
        The method is used to verify the dependent profile entry
        :param dependent_first_name: First name of the dependent
        :param dependent_last_name: Last name of the dependent
        """
        self.reload_page()
        self.click(self.element_parser.get("userprofile"), "userprofile")
        self.click(self.element_parser.get("profile"), "profile")
        dependent_complete_name = dependent_first_name + " " + dependent_last_name
        self.is_visible(
            self.element_parser.get('sie_user_dependent_entry').replace(self.replace_pattern, dependent_complete_name),
            'sie_user_dependent_entry'
        )
        logging.info(
            f"Successfully verified entry of child dependent entry of name {dependent_complete_name} in the profile tab"
        )
