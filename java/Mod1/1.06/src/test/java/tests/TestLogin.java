//filename: tests/TestLogin.java
package tests;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import pageobjects.Login;
import static org.junit.Assert.assertTrue;

public class TestLogin {

    private WebDriver driver;
    private Login login;

    @Before
    public void setUp() {
      System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        ChromeOptions browserOptions = new ChromeOptions();
        browserOptions.setCapability("browserVersion", "90.0");
        driver = new ChromeDriver(browserOptions);
        login = new Login(driver);
    }

    @Test
    public void succeededLogin() {
        login.with("tomsmith", "SuperSecretPassword!");
        assertTrue("success message not present",
                login.successMessagePresent());
    }

    @Test
    public void failedLogin() {
        login.with("tomsmith", "bad password");
        assertTrue("failure message wasn't present after providing bogus credentials",
                login.failureMessagePresent());
    }

    @After
    public void tearDown() {
        driver.quit();
    }
}
