# Copyright 2021 Prescryptive Health Inc
import configparser
import logging
import os

import rapidjson as json

log = logging.getLogger(__name__)


class Common:

    @staticmethod
    def read_ini_file(file_path: str) -> configparser:
        """Function to read any .ini file and return a parser object

        Args:
            file_path (str): Name of ini file in /modules/ui/object_repo

        Returns:
            (dict): JSON file in dictionary format.
        """
        try:
            parser = configparser.ConfigParser()
            parser.read(file_path + '.ini')
            return parser
        except Exception:
            raise Exception("Unable to read file '{0}.{1}'".format(file_path, 'ini'))

    @staticmethod
    def read_ui_testdata(json_file: str) -> dict:
        """To convert json file to dictionary

        Args:
            json_file (str): Name of config_file in /testdata/ui/

        Returns:
            (dict): JSON file in dictionary format.
        """
        try:
            with open(Common.get_ui_testdata(json_file)) as f:
                return json.load(f)
        except FileNotFoundError:
            with open(os.path.abspath(json_file)) as f:
                return json.load(f)

    @staticmethod
    def get_ui_testdata(config_file: str) -> str:
        """Create Absolute file path of given config file.

        Args:
            config_file (str): Name of config_file in /tests/data

        Returns:
            (str): Absolute file path of given config file.
        """
        return os.path.join(Common.project_path(), "testdata/ui", config_file)

    @staticmethod
    def project_path():
        """ Get the project path for the current file"""
        try:
            project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            return project_path
        except Exception:
            raise Exception("Unable to get project path")

    @staticmethod
    def ui_test_data(data_list):
        """
        Method to take input from testdata/ui json files
        :param data_list: list of the test data files
        :return: test data from json file
        """
        testdata = {}
        for service in data_list:
            if service == "login":
                testdata[service] = Common.read_ui_testdata("login.json")
            elif service == "common":
                testdata[service] = Common.read_ui_testdata("common.json")
            elif service == "homepage":
                testdata[service] = Common.read_ui_testdata("homepage.json")
            elif service == "covidtest":
                testdata[service] = Common.read_ui_testdata("covidtest.json")
            elif service == "signup":
                testdata[service] = Common.read_ui_testdata("signup.json")
            elif service == "sidemenu":
                testdata[service] = Common.read_ui_testdata("sidemenu.json")
            elif service == "appointments":
                testdata[service] = Common.read_ui_testdata("appointments.json")
            elif service == "database":
                testdata[service] = Common.read_ui_testdata("database.json")
            elif service == "secretkey":
                testdata[service] = Common.read_ui_testdata("token_secret_key.json")
            elif service == "config":
                testdata[service] = Common.read_ui_testdata("config.json")
            elif service == "test_file":
                testdata[service] = Common.read_ui_testdata("test_file.json")
            elif service == "join_employer_plan":
                testdata[service] = Common.read_ui_testdata("join_employer_plan.json")
            elif service == "sie_user_database":
                testdata[service] = Common.read_ui_testdata("sie_user_database.json")
            elif service == "digitalcard":
                testdata[service] = Common.read_ui_testdata("digitalcard.json")
            else:
                raise ValueError(f'Test data not found for "{service}". Please verify the service name')
        return testdata
