# Copyright 2021 Prescryptive Health Inc
import logging
import re
from time import strptime

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class Digitalcard(BaseController):
    """ This class contains all Digital card functions """

    def __init__(self, driver):
        super().__init__()
        file_name = 'digitalcard'
        ini_tag_name = 'Digitalcard'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver

    def digitalcard_validation(self, database_digitalcard_dict: dict):
        """
        The method is used to validate digital card details UI vs Database
        :param database_digitalcard_dict:dictionary fetched from database for digital card
        """
        assert self.is_visible(self.element_parser.get("smart_card"), "smart_card")
        ui_dict = {"name": self.get_text(self.element_parser.get("smart_name"), "smart_name").replace(" ", "").upper(),
                   "rx_group": self.get_text(self.element_parser.get("smart_group"), "smart_group"),
                   "rx_id": self.get_text(self.element_parser.get("smart_member_id"), "smart_member_id").replace(" ",
                                                                                                                 ""),
                   "rx_bin": self.get_text(self.element_parser.get("smart_bin"), "smart_bin"),
                   "rx_pcn": self.get_text(self.element_parser.get("smart_pcn"), "smart_pcn")}
        for ele in database_digitalcard_dict:
            if not database_digitalcard_dict[ele] == ui_dict[ele]:
                raise Exception(
                    f"The idcard details for {ele} is different for UI={ui_dict[ele]} and database ={database_digitalcard_dict[ele]}")

    def smart_card_validation(self, smart_card_ui_info_dict):
        """
        The method is used to validate smart  card details UI vs Database
        :param smart_card_ui_info_dict:dictionary fetched from database
        """
        assert self.is_visible(self.element_parser.get("manage_info_btn"), "manage_info_btn")
        self.click(self.element_parser.get("manage_info_btn"), "manage_info_btn")
        assert self.is_visible(self.element_parser.get("mob_no"), "mob_no")
        assert self.is_visible(self.element_parser.get("birth_date"), "birth_date")
        mob_no = self.get_text(self.element_parser.get("mob_no"), "mob_no")
        updated_mob_no = re.sub("\W", "", mob_no)
        ui_data = {"mobile_number": updated_mob_no,
                   "date_of_birth": self.get_text(self.element_parser.get("birth_date"),
                                                  "birth_date"),
                   "email": self.get_text(self.element_parser.get("email_txt"), "email_txt")}
        if not ui_data == smart_card_ui_info_dict:
            raise Exception("The smart card details different for UI")
        logging.info(f"The smart card details are ={ui_data}")

    def smart_card_profile_edit(self, old_pin_no: str = '', new_pin_no: str = ''):
        """
        The method is used to edit smart card pin
        :param old_pin_no: old pin number to be entered
        :param new_pin_no : new pin number to be entered
        """
        self.is_visible(self.element_parser.get("manage_info_btn"), "manage_info_btn")
        self.click(self.element_parser.get("manage_info_btn"), "manage_info_btn")
        self.is_visible(self.element_parser.get("change_pin_btn"), "change_pin_btn")
        self.click(self.element_parser.get("change_pin_btn"), "change_pin_btn")
        self.enter_pin(pin_screen='enter_old_pin', pin_no=old_pin_no)
        self.enter_pin(pin_screen='enter_new_pin', pin_no=new_pin_no)
        self.enter_pin(pin_screen='confirm_new_pin', pin_no=new_pin_no)
        assert self.is_visible(self.element_parser.get("pin_changed_successful"), "pin_changed_successful")
        self.click(self.element_parser.get("userprofile"), "userprofile")

    def smart_card_email_edit(self, new_email: str = ''):
        """
        The method is used to edit smart card
        :param new_email : new email for edit
        """
        self.is_visible(self.element_parser.get("change_email_btn"), "change_email_btn")
        self.click(self.element_parser.get("change_email_btn"), "change_email_btn")
        self.enter_text(self.element_parser.get("edit_email"), "edit_email", new_email)
        self.is_visible(self.element_parser.get("save_btn"), "save_btn")
        self.click(self.element_parser.get("save_btn"), "save_btn")

    def enter_pin(self, pin_screen: str = '', pin_no: str = ''):
        """
        The method is used to enter pin number
        :param pin_screen: pin_screen type to be entered
        :param pin_no: pin number to be entered
        """
        for pin in pin_no:
            self.click(self.element_parser.get(pin_screen).replace(self.replace_pattern, pin), pin_screen)
        self.click(self.element_parser.get('next_button'), 'next_button')

    def smart_card_json_info_update(self, email: str, mobile_number: str, birth_month: str, birth_date: str,
                                    birth_year: str):
        """
         Method to modify the smart card ui info data
        :param email:email id
        :param mobile_number: Mobile number
        :param birth_month: Birth month
        :param birth_year: Birth year
        :param birth_date: Birth date
        :return: dictionary of card details
        """
        mobile_number = mobile_number.replace("X", "")
        birth_month = str(strptime(birth_month[:3], '%b').tm_mon)
        if int(birth_month) < 10:
            birth_month = '0' + birth_month
        complete_birth_date = birth_month + "/" + birth_date + "/" + birth_year
        return dict(mobile_number=mobile_number, date_of_birth=complete_birth_date, email=email)
