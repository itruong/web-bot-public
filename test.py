import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC


hits = 0

def check(driver):
    global hits
    hits += 1
    if hits == 10:
        return True
    return False


chrome_options = webdriver.ChromeOptions()
driver = webdriver.Remote(
    command_executor='http://localhost:4444/wd/hub',
    options=chrome_options
)
try:
    driver.get("https://www.google.com/")
    driver.set_window_size(880, 623)
    driver.find_element(By.NAME, "q").send_keys("https://www.google.com/recaptcha/api2/demo")
    driver.find_element(By.NAME, "q").send_keys(Keys.ENTER)
    driver.find_element(By.CSS_SELECTOR, ".g:nth-child(1) .LC20lb > span").click()

    WebDriverWait(driver, 30).until(
        check
    )

    driver.find_element(By.ID, "recaptcha-demo-submit").click()
    driver.get("https://www.google.com/")
    driver.set_window_size(880, 623)
    driver.find_element(By.NAME, "q").send_keys("test ivan")
    driver.find_element(By.NAME, "q").send_keys(Keys.ENTER)
    driver.find_element(By.LINK_TEXT, "Images").click()
    driver.find_element(By.CSS_SELECTOR, ".PKhmud:nth-child(4) .hIOe2").click()
    driver.find_element(By.CSS_SELECTOR, ".isv-r:nth-child(2) .rg_i").click()
    driver.execute_script("window.scrollTo(0,133)")

    driver.close()
except Exception as e:
    import traceback
    traceback.print_exc()

driver.quit()
print('finished running test')
