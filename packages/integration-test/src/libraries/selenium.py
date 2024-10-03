# Copyright 2021 Prescryptive Health Inc
import base64
import os
import pathlib
import random
import time
from json import loads, dumps

import allure
import math
from allure_commons.types import AttachmentType
from msedge.selenium_tools import Edge, EdgeOptions
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as expected
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait as Wait

from libraries import logger
from libraries.common import Common
from modules.ui.page_library import messages

log = logger.logging


class BaseController:
    """ This class contains all common Methods mainly related to selenium used by page or test scripts """

    def __init__(self):
        self.driver = None
        self.replace_pattern = '##data##'
        self.replace_pattern2 = '##data2##'

    def get_object_repo(self, file_name, ini_tag_name):
        """
        Method to get all page level element locator values
        :param file_name: ini file name contains element locators
        :param ini_tag_name: Tag which is print in ini file to parse the data in dictionary format
        :return: dict of locators
        """
        try:
            """Read object repo file"""
            file_path = os.path.join(Common.project_path(), 'modules/ui/object_repo', file_name)
            page_parser = Common.read_ini_file(file_path)[ini_tag_name]
            page_locators = {key: val for key, val in page_parser.items()}
            common_path = os.path.join(Common.project_path(), 'modules/ui/object_repo', "common")
            common_parser = Common.read_ini_file(common_path)["Common"]
            common_locators = {key: val for key, val in common_parser.items()}
            # Merge and return page level and common locators
            return {**page_locators, **common_locators}
        except Exception as e:
            error_message = f"Failed while reading object repository file. Error: '{e}'"
            log.error(error_message)
            raise Exception(error_message)

    def open_remote_url(self, url=None, browser_name=None, platform=None, hub_ip="127.0.0.1", hub_port="4444"):
        """
        Method to open browser instance using selenium grid command and login to url if passed
        :param url: URL to launch
        :param browser_name: Chrome / Firefox / Edge / Safari
        :param platform: linux / windows / MAC
        :param hub_ip: Selenium hub IP where it is hosted
        :param hub_port: Selenium Hub Port number (Default is 4444)
        :return: Driver object
        """
        try:
            browser_name = browser_name.lower()
            log.info(f"Opening URL in '{browser_name}' browser")
            command_executor = f"http://{hub_ip}:{hub_port}/wd/hub"
            headless_option = False
            clean_ff_profile = None
            desired_capabilities = None

            if browser_name is None:
                raise ValueError("Please provide browser name")

            if "headless" in browser_name:
                optbrowser = browser_name.split("_")
                browser_name = optbrowser[0]
                headless_option = True

            if browser_name in ("ff", "firefox"):
                clean_ff_profile = webdriver.firefox.firefox_profile.FirefoxProfile()
                clean_ff_profile.set_preference("browser.download.folderList", 1)
                clean_ff_profile.set_preference("browser.download.manager.showWhenStarting", False)
                clean_ff_profile.set_preference("browser.helperApps.neverAsk.openFile", "text/plain")
                clean_ff_profile.set_preference("browser.helperApps.neverAsk.saveToDisk", "text/plain")
                desired_capabilities = DesiredCapabilities.FIREFOX
                desired_capabilities["acceptInsecureCerts"] = True

            elif browser_name == "ie":
                desired_capabilities = DesiredCapabilities.INTERNETEXPLORER
                desired_capabilities["ignoreProtectedModeSettings"] = True
                desired_capabilities["InternetExplorerDriver.ENABLE_PERSISTENT_HOVERING"] = False
                desired_capabilities["requireWindowFocus"] = False
                desired_capabilities["InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS"] = True
                desired_capabilities["InternetExplorerDriver.UNEXPECTED_ALERT_BEHAVIOR"] = True

            elif browser_name in ("gc", "chrome"):
                desired_capabilities = DesiredCapabilities.CHROME
                desired_capabilities['acceptInsecureCerts'] = True
                if headless_option:
                    desired_capabilities["chromeOptions"] = {
                        "args": ["--no-sandbox", "--headless", "--window-size=1350, 1000"],
                        "extensions": []
                    }
                else:
                    desired_capabilities["chromeOptions"] = {"args": ["--no-sandbox", "start-maximized"]}

            elif browser_name == "edge":
                desired_capabilities = DesiredCapabilities.EDGE
                desired_capabilities["maxInstances"] = 5

            elif browser_name == "opera":
                desired_capabilities = DesiredCapabilities.OPERA

            elif browser_name == "safari":
                desired_capabilities = DesiredCapabilities.SAFARI
                desired_capabilities["acceptSSLCerts"] = True
                desired_capabilities["maxInstances"] = 5

            desired_capabilities["platform"] = platform
            desired_capabilities["loggingPrefs"] = {"browser_name": "ALL"}

            if clean_ff_profile is not None:
                self.driver = webdriver.Remote(
                    command_executor=command_executor,
                    desired_capabilities=desired_capabilities, browser_profile=clean_ff_profile)
            else:
                self.driver = webdriver.Remote(
                    command_executor=command_executor,
                    desired_capabilities=desired_capabilities)

            if url is not None:
                self.driver.get(url)
            if not headless_option and browser_name != "chrome":
                self.driver.maximize_window()
            return self.driver
        except Exception as e:
            error_message = f"Failed while launching URL, Error: {e}"
            log.error(error_message)
            raise Exception(error_message)

    def open_mobile_emulation_url(self, url=None, browser_name=None, device_name=None):
        """
        The function is use to open mobile emulation browser with url
        :param url: URL to launch
        :param browser_name: chrome/firefox/edge/ie
        :param device_name: Name of the android and iOS device
        :return:driver object
        """
        try:
            browser_name = browser_name.lower()
            log.info(f"Opening URL in '{browser_name}' browser")
            if browser_name is None:
                raise ValueError("Please provide browser name")
            elif browser_name in ("gc", "chrome"):
                mobile_emulation = {"deviceName": device_name}
                chrome_options = webdriver.ChromeOptions()
                chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
                self.driver = webdriver.Chrome(options=chrome_options)
            elif browser_name in ("Edge", "edge"):
                var = {"deviceName": device_name}
                options = EdgeOptions()
                edgedriverpath = os.path.join(self.get_project_path(), 'drivers', 'msedgedriver.exe')
                options.use_chromium = True
                options.add_experimental_option("mobileEmulation", var)
                self.driver = Edge(executable_path=edgedriverpath, options=options)
            self.driver.implicitly_wait(10)
            if url is not None:
                self.driver.get(url)
            self.driver.maximize_window()
            log.info(f"Browser = '{browser_name}' launched with device = {device_name}")
            return self.driver
        except Exception as e:
            error_message = f"Failed while launching URL, Error: {e}"
            log.error(error_message)
            raise Exception(error_message)

    def get_project_path(self):
        """ Get the project path for the current project"""
        try:
            project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            return project_path
        except Exception:
            raise Exception("Unable to get project path")

    def get_current_url(self):
        """
        This Method is used to get the current url
        :return: current_url
        """
        return self.driver.current_url

    def maximize_browser(self):
        """
        Method to maximize browser window
        :return: Boolean (True:for success)
        """
        try:
            self.driver.set_window_size(4096, 2160)
            self.driver.maximize_window()  # windows +chrome
            return True
        except Exception as e:
            error_message = f"Failed while maximize browser window, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot("maximize_browser_error")
            raise Exception(error_message)

    def open_url(self, url):
        """
        Method to hit given url
        :return: Boolean (True:for success)
        """
        try:
            self.driver.get(url)
            return True
        except Exception as e:
            error_message = f"Failed while opening the '{url}' url, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot("open_url_error")
            raise Exception(error_message)

    def reload_page(self):
        """
        This Method will refresh Page
        :return:
        """
        try:
            log.info("Refreshing page ...")
            self.driver.refresh()
            time.sleep(5)
        except Exception as e:
            error_message = f"Failed while refreshing page, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot("reload_error")
            raise Exception(error_message)

    def close_browser(self):
        """
        Method to close or quite browser instance
        :return:Boolean (True:for success)
        """
        try:
            self.driver.quit()
            self.driver = None
            log.info("Closing Browser")
            return True
        except Exception as e:
            error_message = f"Failed while closing browser, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot("close_browser_error")
            raise Exception(error_message)

    def get_browser_log(self):
        """
        This Method returns captured browser log as string
        :return: log_string
        """
        log_string = []
        log_entries = self.driver.get_log('browser')
        # convert log entries from unicode to string
        for entries in log_entries:
            string_data = dict([(str(k), str(v)) for k, v in list(entries.items())])
            log_string.append(string_data)
        return log_string

    def is_page_title(self, page_title):
        """
        Method to verify page title
        :param page_title: page title to verify
        :return:Boolean (True:for success)
        """
        try:
            element = Wait(self.driver, 30).until(expected.title_is(page_title))
            if element:
                return True
            else:
                return False
        except Exception as e:
            error_message = f"Failed while verifying ({page_title}) page title, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot("is_page_title_error")
            raise Exception(error_message)

    def kill_safari_instances_already_open(self):
        """
        Method is to kill safari instances if already open
        :return: response
        """
        try:
            response = os.system("pkill -9 Safari".format())
            return response
        except Exception as e:
            raise Exception("Unable to to kill safari instances if already open ", e)

    def get_safari_on_foreground(self):
        """
        Method is to get safari on foreground
        :return: response
        """
        try:
            response = os.system("open -a Safari".format())
            return response
        except Exception as e:
            raise Exception("Unable to get safari on foreground", e)

    def get_search_type_and_element_identifier(self, locator_value):
        """
        Method to return tuple of search_type and element_identifier
        :param locator_value: Element locator value to parse
        :return: tuple of search_type and element_identifier
        """
        search_type = str(locator_value).split('|')[0].lower()
        element_identifier = str(locator_value).split('|')[1]
        locator_type = {
            "id": By.ID,
            "xpath": By.XPATH,
            "link_text": By.LINK_TEXT,
            "partial_link_text": By.PARTIAL_LINK_TEXT,
            "name": By.NAME,
            "tag_name": By.TAG_NAME,
            "class_name": By.CLASS_NAME,
            "css": By.CSS_SELECTOR
        }
        search_type = locator_type[search_type]
        return search_type, element_identifier

    def is_visible(self, locator_value, locator_name, timeout=60):
        """
        Wait for the object to be visible. If it is visible in the given time, return true. Else return false.
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return: True if "visible" else False
        """
        locator_value = self.get_search_type_and_element_identifier(locator_value)
        wait_obj = Wait(self.driver, timeout)
        try:
            wait_obj.until(expected.presence_of_element_located(locator_value))
            wait_obj.until(expected.visibility_of_element_located(locator_value))
            return True
        except TimeoutException:
            log.error(messages.VISIBILITY_ERROR.format(locator_name, locator_value))
            return False

    def is_not_visible(self, locator_value, locator_name, timeout=20):
        """
        Method for checking that an element is either invisible or not present on the DOM.
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return: True if "invisible" else False
        """
        locator_value = self.get_search_type_and_element_identifier(locator_value)
        wait_obj = Wait(self.driver, timeout)
        try:
            wait_obj.until(expected.invisibility_of_element_located(locator_value))
            return True
        except TimeoutException:
            log.error(messages.INVISIBILITY_ERROR.format(locator_name, locator_value))
            return False

    def is_clickable(self, locator_value, locator_name, timeout=20):
        """
        Wait for the object to be rendered and become clickable.
        If it becomes clickable in the given time, return true. Else return false.
        :param locator_value: element Object
        :param locator_name: object Name
        :param timeout:
        :return:
        """
        try:
            if self.is_visible(locator_value, locator_name):
                locator_value = self.get_search_type_and_element_identifier(locator_value)
                Wait(self.driver, timeout).until(expected.element_to_be_clickable(locator_value))
            else:
                return False
        except Exception as e:
            log.error(f"{messages.CLICKABILITY_ERROR.format(locator_name, locator_value)}. Exception: {e}")
            return False

    def find_element(self, locator_value, locator_name, timeout=20):
        """
        Method to find element for provided locator_value
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return: element
        """
        try:
            search_type, element_identifier = self.get_search_type_and_element_identifier(locator_value)
            wait_obj = Wait(self.driver, timeout)
            wait_obj.until(expected.presence_of_element_located((search_type, element_identifier)))
            wait_obj.until(expected.visibility_of_element_located((search_type, element_identifier)))
            if search_type == "id":
                element = self.driver.find_element_by_id(element_identifier)
            elif search_type == "name":
                element = self.driver.find_element_by_name(element_identifier)
            elif search_type == "xpath":
                element = self.driver.find_element_by_xpath(element_identifier)
            elif search_type == "css":
                element = self.driver.find_element_by_css_selector(element_identifier)
            elif search_type == "link_text":
                element = self.driver.find_element_by_link_text(element_identifier)
            elif search_type == "class_name":
                element = self.driver.find_element_by_class_name(element_identifier)
            else:
                raise NotImplemented(f"search type '{search_type}' is not implemented")
            return element
        except Exception as e:
            error_message = f"Unable to find element for '{locator_name}' with value {locator_value}. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def find_elements(self, locator_value, locator_name, timeout=15):
        """
        Method to find elements by giving 'path'
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return: elements
        """
        try:
            search_type, element_identifier = self.get_search_type_and_element_identifier(locator_value)
            wait_obj = Wait(self.driver, timeout)
            wait_obj.until(expected.presence_of_element_located((search_type, element_identifier)))
            wait_obj.until(expected.visibility_of_element_located((search_type, element_identifier)))
            if search_type == "id":
                elements = self.driver.find_elements_by_id(element_identifier)
            elif search_type == "name":
                elements = self.driver.find_elements_by_name(element_identifier)
            elif search_type == "xpath":
                elements = self.driver.find_elements_by_xpath(element_identifier)
            elif search_type == "css":
                elements = self.driver.find_elements_by_css_selector(element_identifier)
            elif search_type == "link text":
                elements = self.driver.find_elements_by_link_text(element_identifier)
            elif search_type == "class name":
                elements = self.driver.find_elements_by_class_name(element_identifier)
            else:
                raise NotImplemented(f"search type '{search_type}' is not implemented")
            return elements
        except Exception as e:
            error_message = f"Unable to find elements for '{locator_value}' locator, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def click(self, locator_value, locator_name, timeout=25):
        """
        Method to click on element
        :param locator_value: Element locator value for click
        :param locator_name: name of the locator
        :param timeout:
        :return: Boolean (True:for success)
        """
        flag = False
        try:
            element = self.find_element(locator_value, locator_name, timeout)
            flag = True
            self.is_clickable(locator_value, locator_name, timeout)
            element.click()
            log.info(f"Button [{locator_name}] clicked")
            return True
        except Exception as e:
            # Added flag to identify the exception. If element found then retry click otherwise raise Exception
            if not flag:
                raise TimeoutException(locator_name)
            log.warning(f"Retrying click operation using ActionChains class for '{locator_value}'")
            self.click_with_actionchains(locator_value, timeout)

    def click_with_actionchains(self, locator_value, locator_name, timeout=20):
        """
        Method to click on element using ActionChains class
        :param locator_value: Element locator value for click
        :param locator_name: name of the locator
        :param timeout:
        :return:
        """
        try:
            log.info(f"Clicking element '{locator_value}' using ActionChains class")
            element = self.find_element(locator_value, locator_name, timeout)
            actions = ActionChains(self.driver)
            actions.click(element).perform()
            return True
        except Exception as e:
            log.warning(f"Retrying click operation using Java Script for '{locator_value}'")
            self.click_using_execute_script(locator_value, timeout)

    def click_using_execute_script(self, locator_value, locator_name, timeout=20):
        """
        Method to click on element using execute_script
        :param locator_value: Element locator value for click
        :param locator_name: name of the locator
        :param timeout:
        :return:
        """
        try:
            log.info(f"Clicking element '{locator_value}' using javascript")
            element = self.find_element(locator_value, locator_name, timeout)
            self.driver.execute_script("arguments[0].click();", element)
            log.info("Button using javascript clicked")
        except Exception as e:
            error_message = f"Click operation failed for '{locator_value}' element. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def click_with_scroll(self, locator_value, locator_name, timeout=20):
        """
        Method to click on element
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return:Boolean (True:for success)
        """
        try:
            element = self.find_element(locator_value, locator_name, timeout)
            self.driver.execute_script("arguments[0].scrollIntoView(true);", element)
            element.click()
            return True
        except Exception as e:
            log.warning(f"Retrying click operation using ActionChains class for '{locator_value}'")
            self.click_with_actionchains(locator_value, timeout)

    def click_link(self, link_text, locator_name):
        """
        Method to click on link
        :param link_text: link text to click
        :param locator_name: name of the locator
        :return:Boolean (True:for success)
        """
        try:
            self.click('{0}''|{1}'.format("link_text", link_text), "click_link")
            return True
        except Exception as e:
            error_message = f"Unable to click on '{link_text}' link. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def enter_text(self, locator_value, locator_name, text_to_enter):
        """
        Method to send text to element
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param text_to_enter: text to enter
        :return: Boolean (True:for success)
        """
        try:
            element = self.find_element(locator_value, locator_name)
            element.send_keys(Keys.CONTROL + "a")
            element.send_keys(Keys.DELETE)
            element.send_keys(text_to_enter)
            log.info(f"Text '{text_to_enter}' entered")
            return True
        except Exception as e:
            error_message = f"Enter '{text_to_enter}' text operation failed for '{locator_value}' element. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def execute_script(self, token):
        """
        Method to set automation token to the local storage of the browser
        :param token: Token which needs to set in the browser
        """
        script = 'window.localStorage.setItem("appSettings", JSON.stringify({"automationToken" :"##data##"}));'
        script = script.replace(self.replace_pattern, token)
        self.driver.execute_script(script)
        self.driver.refresh()

    def get_text(self, locator_value, locator_name):
        """
        Method to get element text
        :param locator_value: search element path
        :param locator_name: name of the locator
        :return:element text
        """
        try:
            element_text = self.find_element(locator_value, locator_name).text
            return element_text
        except Exception as e:
            error_message = f"Failed while getting text for '{locator_value}' element. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def get_attribute(self, locator_value, locator_name, attribute_name):
        """
        Method to get element attribute
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param attribute_name: attribute name
        :return:attribute_name
        """
        try:
            element = self.find_element(locator_value, locator_name)
            return element.get_attribute(attribute_name)
        except Exception as e:
            error_message = f"Failed while getting '{attribute_name}' attribute. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def set_focus(self, locator_value, locator_name):
        """
        Method to set focus on element
        :param locator_value: search element path
        :param locator_name: name of the locator
        :return:Boolean (True:for success)
        """
        try:
            self.find_element(locator_value, locator_name).send_text('focus')
        except Exception as e:
            error_message = f"Unable to set focus for '{locator_value}' element. Error: '{e}'"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def scroll_to_end(self):
        """
        Scrolls the webpage to the end
        :return:
        """
        command = (
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;"
        )
        page_len = self.driver.execute_script(command)
        match = False
        while match is False:
            last_count = page_len
            time.sleep(3)
            page_len = self.driver.execute_script(command)
            if last_count == page_len:
                match = True

    def scroll_to_text(self, locator_value, locator_name):
        """
        Method to scroll to the given text on the screen
        :param locator_value: of text to which scroll action is performed
        :param locator_name: name of the locator
        :return:Boolean (True:For success or False:For failure)
        """
        try:
            actions = ActionChains(self.driver)
            element = self.find_element(locator_value, locator_name, 65)
            self.driver.execute_script("arguments[0].scrollIntoView();", element)
            actions.move_to_element(element).perform()
            return True
        except Exception as e:
            error_message = f"Unable to scroll down to find text for '{locator_value}' element.  Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def wait_for_spinner_to_load(self, locator_name, disappear_locator_name, timeout=20):
        """
        Method to wait for element to disappear from UI
        :param locator_name: search element path
        :param disappear_locator_name:
        :param timeout:
        :return: element if unavailability is confirmed
        """
        try:
            locator_name = self.get_search_type_and_element_identifier(locator_name)
            disappear_locator_name = self.get_search_type_and_element_identifier(disappear_locator_name)
            wait_obj = Wait(self.driver, timeout)
            wait_obj.until(expected.visibility_of_element_located(locator_name))
            wait_obj.until(expected.invisibility_of_element_located(locator_name))
            wait_obj.until(expected.invisibility_of_element_located(disappear_locator_name))
        except TimeoutException:
            self.allure_attach_screen_shot("wait_for_spinner_to_load_error")
            error_message = f"Unable to find spinner for '{locator_name}' element"
            log.error(error_message)
            raise Exception(error_message)

    def get_checkbox_status(self, locator_value, locator_name):
        """
        Method to get current status of checkbox whether it's tick marked or not
        :param locator_value: Checkbox element locator_value
        :param locator_name: name of the locator
        :return: True if "checked" else False
        """
        try:
            return self.find_element(locator_value, locator_name).is_selected()
        except Exception as e:
            error_message = f"Unable to get status of checkbox for '{locator_value}' element.  Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def click_checkbox(self, locator_value, locator_name):
        """
        This Method is used to click checkbox using javascript executor
        :param locator_value: search element path
        :param locator_name: name of the locator
        :return:
        """
        try:
            element_identifier = str(locator_value).split('|')[1]
            self.driver.execute_script("document.getElementById('{0}').click()".format(element_identifier))
        except Exception as e:
            error_message = f"Unable to click on checkbox using javascript executor. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def get_dropdown_values(self, locator_value, locator_name):
        """
        This Method return list of options available in dropdown
        :param locator_value: path to retrieve option list
        :param locator_name: name of the locator
        :return: list of visible options in dropdown
        """
        option_list = []
        menuitem_elements = self.find_elements(locator_value, locator_name)
        for option in menuitem_elements:
            option_list.append(option.text)
        return option_list

    def mouse_hover(self, locator_value, locator_name):
        """
         Hover the mouse over the given object. Typically used where there's a menu dropdown to be accessed
         which opens up after mouse hover.
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return:
        """
        try:
            browser = self.driver.capabilities["browserName"].lower()
            log.info(f"Mouse hovering on locator [{locator_value}]. Browser: {browser}")
            # TODO: Will enable once tested with Safari
            # if browser == "safari":  # hover element on safari
            #     from pyautogui import _pyautogui_osx
            #     x = element.location.get('x') + (element.size.get('width') / 2)
            #     y = element.location.get('y') + (element.size.get('height') / 2)
            #     _pyautogui_osx._moveTo(x, y)
            #     time.sleep(2)
            # else:
            element = self.find_element(locator_value, locator_name)
            act_hover = ActionChains(self.driver).move_to_element(element)
            act_hover.perform()
            log.info("Mouse hover done")
        except Exception as e:
            mouse_hover_error_message = f"Error: while doing mouseHover operation, Error: {e}"
            log.error(mouse_hover_error_message)
            time.sleep(2)
            # Handled "stale element reference: element is not attached to the page document" issue
            self.retry_mouse_hover(locator_value)

    def retry_mouse_hover(self, locator_value, locator_name):
        """
         Retry hover the mouse over the given object. Typically used where there's a menu dropdown to be accessed
         which opens up after mouse hover.
        :param locator_value: search element path
        :param locator_name: name of the locator
        :return:
        """
        try:
            log.info(f"Retrying mouse hovering on locator [{locator_value}]")
            element = self.find_element(locator_value, locator_name)
            self.driver.execute_script("arguments[0].scrollIntoView();", element)
            act_hover = ActionChains(self.driver).move_to_element(element)
            act_hover.perform()
            log.info("Retry mouse hover done")
        except Exception as e:
            error_message = f"Error: while doing mouseHover operation for locator {locator_value}, Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def mouse_hover_click(self, menu_locator, click_locator):
        """
        Method perform focusing,mouser over to element on web page and then click on provided element
        :param menu_locator: Where user needs to hover
        :param click_locator: Where user needs to click
        :return: void
        """
        try:
            actions = ActionChains(self.driver)
            element = self.find_element(menu_locator, "menu_locator")
            self.driver.execute_script("arguments[0].scrollIntoView(false);", element)
            actions.move_to_element(element).perform()
            log.info("Mouse hover done")
            time.sleep(2)
            actions.move_to_element(self.find_element(click_locator, "click_locator")).perform()
            self.click(click_locator, "click")
            log.info("Click operation done")
            time.sleep(6)
        except Exception as e:
            self.allure_attach_screen_shot("mouse_hover_click_error")
            mouse_hover_click_error_message = f"Error: while doing mouseOverAndClick operation, Error: {e}"
            log.error(mouse_hover_click_error_message)
            raise Exception(mouse_hover_click_error_message)

    def mouse_hover_and_double_click(self, element_to_mouse_over, element_to_click):
        """
        This Method will mouseover and double click on the given element
        :param element_to_mouse_over:
        :param element_to_click:
        :return:
        """
        try:
            actions = ActionChains(self.driver)
            element_hover = self.find_element(element_to_mouse_over)
            # # # For now commenting below line. Will enable it if required
            # self.driver.execute_script("arguments[0].scrollIntoView(false);", element_hover)
            actions.move_to_element(element_hover).perform()
            element_click = self.find_element(element_to_click)
            hov2 = actions.move_to_element(element_click)
            hov3 = actions.double_click(element_click)
            hov2.perform()
            hov3.perform()
            log.info("Mouse hover and then double click operation done")
        except Exception as e:
            self.allure_attach_screen_shot("mouse_hover_and_double_click_error")
            mouse_hover_click_error_message = f"Error: while doing mouseOverAndDoubleClick operation, Error: {e}"
            log.error(mouse_hover_click_error_message)
            raise Exception(mouse_hover_click_error_message)

    def wait_until_presence(self, locator_value, locator_name, timeout=20):
        """
        Wait for the element to be present in DOM, raise Exception if not present after timeout value
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        """
        try:
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            Wait(self.driver, timeout).until(expected.presence_of_element_located(locator_value))
        except Exception as e:
            log.error(f"{messages.PRESENCE_ERROR.format(locator_name, locator_value)}. Exception: {e}")
            raise Exception(messages.PRESENCE_ERROR.format(locator_name, locator_value))

    def wait_until_visible(self, locator_value, locator_name, timeout=60):
        """
        Wait for the element to be visible on page, raise Exception if not visible after timeout value
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        """
        try:
            self.wait_until_presence(locator_value, locator_name, timeout)
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            Wait(self.driver, timeout).until(expected.visibility_of_element_located(locator_value))
        except Exception as e:
            log.error(f"{messages.VISIBILITY_ERROR.format(locator_name, locator_value)}. Exception: {e}")
            self.allure_attach_screen_shot(locator_name)
            raise Exception(messages.VISIBILITY_ERROR.format(locator_name, locator_value))

    def wait_until_clickable(self, locator_value, locator_name, timeout=20):
        """
        Wait for the element to be clickable, raise Exception if not clickable after timeout value
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        """
        try:
            self.wait_until_visible(locator_value, locator_name, timeout)
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            Wait(self.driver, timeout).until(expected.element_to_be_clickable(locator_value))
        except Exception as e:
            log.error(f"{messages.CLICKABILITY_ERROR.format(locator_value)}. Exception: {e}")
            self.allure_attach_screen_shot(locator_name)
            raise Exception(messages.CLICKABILITY_ERROR.format(locator_value))

    def wait_until_invisible(self, locator_value, locator_name, timeout=20):
        """
        Wait for the element to be invisible on page, raise Exception if still visible after timeout value
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        """
        try:
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            Wait(self.driver, timeout).until(expected.invisibility_of_element_located(locator_value))
        except Exception as e:
            log.error(f"{messages.INVISIBILITY_ERROR.format(locator_name, locator_value)}. Exception: {e}")
            self.allure_attach_screen_shot(locator_name)
            raise Exception(messages.INVISIBILITY_ERROR.format(locator_name, locator_value))

    def get_base64_encoded_screen_shot(self, file_name):
        abs_file_path = os.path.join(Common.project_path(), 'tests/ui/screen_shots', file_name + ".png")
        log.info(f"abs_file_path is: {abs_file_path}")
        dirname = os.path.dirname(abs_file_path)
        pathlib.Path(dirname).mkdir(parents=True, exist_ok=True)
        self.driver.get_screenshot_as_file(abs_file_path)

        with open(abs_file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
        img_element = "b64EncodedStart{0}b64EncodedEnd".format(encoded_string)
        log.info("End of get_base64_encoded_screen_shot method")
        return img_element

    def select_value_from_dropdown(self, drop_down_path, drop_down_name, dropdown_value):
        """
        Method to select given value from given drop-down
        :return:Boolean (True:for success)
        """
        try:
            log.info(f"Selecting [{dropdown_value}] value from dropdown list")
            element = self.find_element(drop_down_path)
            self.driver.execute_script("arguments[0].scrollIntoView();", element)
            log.info(f"scrollIntoView for locator [{drop_down_path}] done")
            cbo_select = Select(self.find_element(drop_down_path))
            cbo_select.select_by_visible_text(dropdown_value)
            log.info(f"Value [{dropdown_value}] Selected")
            return True
        except Exception as e:
            self.allure_attach_screen_shot(drop_down_name)
            error_message = f"Unable to select option {dropdown_value} from {drop_down_path} drop-down. Error: {e}"
            log.error(error_message)
            raise Exception(error_message)

    def find_elements_by_xpath(self, locator_value, locator_name, timeout=20):
        """
        This method return element when xpath is passed as argument
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return:
        """
        try:
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            wait_obj = Wait(self.driver, timeout)
            wait_obj.until(expected.presence_of_element_located(locator_value))
            wait_obj.until(expected.visibility_of_element_located(locator_value))
            elements = self.driver.find_elements_by_xpath(locator_value[1])
            return elements
        except Exception as e:
            error_message = f"Unable to find element for '{locator_name}' with value {locator_value}. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def find_element_by_xpath(self, locator_value, locator_name, timeout=20):
        """
        This method return element when xpath is passed as argument
        :param locator_value: search element path
        :param locator_name: name of the locator
        :param timeout:
        :return:
        """
        try:
            locator_value = self.get_search_type_and_element_identifier(locator_value)
            wait_obj = Wait(self.driver, timeout)
            wait_obj.until(expected.presence_of_element_located(locator_value))
            wait_obj.until(expected.visibility_of_element_located(locator_value))
            element = self.driver.find_element_by_xpath(locator_value[1])
            return element
        except Exception as e:
            error_message = f"Unable to find elements for {locator_value}. Error: {e}"
            log.error(error_message)
            self.allure_attach_screen_shot(locator_name)
            raise Exception(error_message)

    def assert_with_snapshot(self, status, message):
        """
        Method to raise and capture screenshot if assert condition is False
        :param status: True / False
        :param message: Message to print if case of failure
        """
        try:
            assert status, message
        except Exception as e:
            log.error(f"Exception: {e}")
            self.allure_attach_screen_shot("assert_with_snapshot")
            raise Exception(f"Exception: {e}")

    def in_assert(self, expected_cond, actual):
        """
        Find expected value in actual and raise if not found with screenshot
        :param expected_cond: Expected condition
        :param actual: Actual condition
        """
        try:
            assert expected in actual, f"Value mismatch. Expected: {expected_cond} value not found in Actual: {actual}"
        except Exception as e:
            log.error(f"Exception: {e}")
            self.allure_attach_screen_shot("in_assertion")
            raise Exception(f"Exception: {e}")

    def equal_assert(self, expected_cond, actual):
        """
        Compare expected and actual value and raise if mismatch with screenshot
        :param expected_cond: Expected condition
        :param actual: Actual condition
        """
        try:
            assert expected == actual, f"Value mismatch. Expected: {expected_cond} and Actual: {actual} are not equal"
        except Exception as e:
            log.error(f"Exception: {e}")
            self.allure_attach_screen_shot("equal_assertion")
            raise Exception(f"Exception: {e}")

    def to_dict(self, input_ordered_dict):
        return loads(dumps(input_ordered_dict))

    def set_file_download_location(self):
        """
        This Method defines and returns path where file should be downloaded
        :return: download location
        """
        download_location = os.path.join(Common.project_path(), 'testdata', 'downloads')
        return download_location

    def sigfigs(self, value, digits):
        """driver.capabilities["browserName"].lower()
        Method round given value to a given number of significant digits
        :param value: value to be rounded
        :param digits: number of significant digit
        :return: round_value
        """
        try:
            return round(value, int(digits - math.ceil(math.log10(abs(value)))))
        except ValueError as e:
            return 0.0

    def to_sd(self, num, precision):
        """
        The Method is used to round off values
        :param num: decimal
        :param precision: precision
        :return: roundoff number
        """
        try:
            str_num = str(num)
            if precision == str_num[::1].find('.') - 1:
                return num
            if num != 0:
                return self.to_sd(round(num, -int(math.floor(math.log10(abs(num)))) + (precision - 1)), precision - 1)
            else:
                return 0.0
        except Exception as e:
            raise Exception(f"Failed to round off number {num} and precision {precision}. {e}") from None

    def value_comparison(self, api_value, ui_value):
        """
        The Method is used to round off values
        :param api_value: value from api dict
        :param ui_value: value from web or csv dict
        :return: boolean value (True/False)
        """
        try:
            if api_value is None:
                api_value = 0.0
            if str(ui_value).__contains__('%'):
                api_value = float(api_value) * 100
                ui_value = ui_value.replace('%', '')
            elif str(ui_value).__contains__('Mbps'):
                ui_value = ui_value.replace('Mbps', '')
            elif str(ui_value).__contains__('s'):
                ui_value = ui_value.replace('s', '')

            if self.to_sd(abs(float(api_value)), len(str(abs(float(api_value))))) == (
                    self.to_sd(abs(float(ui_value)), len(str(abs(float(ui_value)))))
            ):
                return True
            elif round(abs(float(api_value)), 5) == round(abs(float(ui_value)), 5):
                return True
            elif round(abs(float(api_value)), 4) == round(abs(float(ui_value)), 4):
                return True
            elif round(abs(float(api_value)), 3) == round(abs(float(ui_value)), 3):
                return True
            elif round(abs(float(api_value)), 2) == round(abs(float(ui_value)), 2):
                return True
            elif round(abs(float(api_value)), 1) == round(abs(float(ui_value)), 1):
                return True
            elif round(abs(float(api_value))) == round(abs(float(ui_value))):
                return True
            elif math.ceil(abs(float(api_value))) == math.ceil(abs(float(ui_value))):
                return True
            else:
                return False
        except Exception as e:
            raise Exception(f"Failed to round off number {api_value} and precision {ui_value}. {e}") from None

    def reset_implicit_wait(self, wait_time):
        """
        This Method resets the implicit wait time
        :param wait_time:
        :return:
        """
        try:
            self.driver.implicitly_wait(wait_time)
        except Exception as e:
            raise Exception("Unable to reset implicit wait time")

    def allure_attach_screen_shot(self, filename):
        """
        Method to get attach the allure screenshot
        Returns    : True - for success
        """
        self.get_base64_encoded_screen_shot(f"{filename}_{random.randrange(100)}")
        allure.attach(
            self.driver.get_screenshot_as_png(), name='Screenshot', attachment_type=AttachmentType.PNG)
        return True

    def add_allure_enviornment_properties(self, browser, device_name):
        """
        The function is used to add enviornment properties to the allure report
        :return:
        """
        try:
            allurepath = os.path.join(self.get_project_path(), 'allure_reports')
            if not os.path.exists(allurepath):
                os.makedirs(allurepath)
            f = open(allurepath + "\\environment.properties", "w")
            f.write(f"\nBrowser:{browser}")
            f.write(f"\nDeviceName:{device_name}")
            f.write(f"\nSuiteName:Regression")
            f.close()
        except Exception as e:
            raise Exception(f"Unable to add allure properties browser={browser} and device ={device_name}")

    def get_window_handles(self):
        """
        The function is used to get the window handles and to switch to the new opened browser tab
        :return:handles,number of open browser instances
        """
        try:
            handles = self.driver.window_handles
            return handles
        except Exception as e:
            raise Exception(f"Unable to get window handlesand switch between windows :{e}")

    def navigate_back(self):
        """
        The function is used to navigate back
        """
        try:
            self.driver.back()
        except Exception as e:
            raise Exception("Unable to navigate back on the browser")

    def switch_to_tab_no(self, tab_no: int):
        """
        The method is used to switch to the tab number
        :param tab_no: Tab number which we have to switch
        """
        try:
            handles = self.get_window_handles()
            self.driver.switch_to_window(handles[tab_no])
        except Exception as e:
            raise Exception("Unable to switch to the tab no provided")

    def open_two_tabs(self):
        """
        The method is used to open two window in the browser
        """
        try:
            # Adding sleep so that tab will open in mobile emulator mode
            time.sleep(5)
            self.driver.execute_script("window.open('https://test.myrx.io/','second_tab');")
            self.driver.switch_to.window("second_tab")
            time.sleep(5)
            self.driver.execute_script("window.open('https://test.myrx.io/','third_tab');")
            self.driver.switch_to.window("third_tab")
            time.sleep(5)
        except Exception as e:
            raise Exception("Unable to open two tabs in browser for given url")
