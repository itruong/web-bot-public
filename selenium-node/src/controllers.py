import os
from collections import deque
import requests
from flask import Response
from .constants import PROGRAMS_BASE_URL

def send_health_update():
    url = f'{os.getenv("WEB_BASE_URL")}/node-health'
    res = requests.post(url)
    if res.status_code == 200:
        return {'Result': 'Successfully updated node up-time.'}, 200
    else:
        return {'Status': 'Failed to update node up-time.'}, 400

def load_test():
    sample_test = [
        lambda driver: driver.get("https://www.google.com/"),
        lambda driver: driver.set_window_size(880, 623),
        lambda driver: driver.find_element(By.NAME, "q").send_keys("https://www.google.com/recaptcha/api2/demo"),
        lambda driver: driver.find_element(By.NAME, "q").send_keys(Keys.ENTER),
        lambda driver: driver.find_element(By.CSS_SELECTOR, ".g:nth-child(1) .LC20lb > span").click(),
        lambda driver: driver.find_element(By.ID, "recaptcha-demo-submit").click()
    ]

    return deque(sample_test)

def execute_command(driver, command_function):
    try:
        command_function(driver)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return False
    return True

def run_test():
    import time
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.action_chains import ActionChains
    from selenium.webdriver.support import expected_conditions
    from selenium.webdriver.support.wait import WebDriverWait
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support import expected_conditions as EC

    test_queue = load_test()
    if not test_queue:
        return 'No tests loaded.', 400

    driver = webdriver.Chrome()
    while test_queue:
        result = execute_command(driver, test_queue[0])
        if result:
            test_queue.popleft()
        else:
            pass

    driver.quit()
    print('finished running test')
