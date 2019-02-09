const path = require("path");
const { Builder } = require("selenium-webdriver");
const { Eyes } = require("@applitools/eyes-selenium");

class DriverFactory {
  constructor(config) {
    this.config = config;
    this.eyes = new Eyes();
    this.eyes.setApiKey(config.applitools.accessKey);
  }

  _configure() {
    let builder;
    switch (this.config.host) {
      case "saucelabs":
        const url = "http://ondemand.saucelabs.com:80/wd/hub";
        builder = new Builder().usingServer(url);
        builder.withCapabilities(this.config.sauce);
        break;
      case "localhost":
        process.env.PATH +=
          path.delimiter + path.join(__dirname, "..", "vendor");
        builder = new Builder().forBrowser(this.config.browser);
        break;
    }
    return builder;
  }

  async build(testName, hasEyesCommands = false) {
    this.testName = testName;
    this.driver = await this._configure().build();
    const session = await this.driver.getSession();
    this.sessionId = session.id_;
    if (hasEyesCommands) {
      await this.eyes.open(
        this.driver,
        this.config.applitools.appName,
        testName,
        this.config.applitools.viewportSize
      );
    }
    return this.driver;
  }

  async quit(testPassed) {
    try {
      if (this.config.host === "saucelabs") {
        this.driver.executeScript("sauce:job-name=" + this.testName);
        this.driver.executeScript("sauce:job-result=" + testPassed);
        if (!testPassed)
          console.log(
            "See a video of the run at https://saucelabs.com/tests/" +
              this.sessionId
          );
      }
    } finally {
      await this.driver.quit();
      await this.eyes.abortIfNotClosed();
    }
  }
}

module.exports = DriverFactory;