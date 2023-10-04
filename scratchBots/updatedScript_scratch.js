const fs = require("fs").promises;
const path = require("path");
const { chromium } = require("playwright");

//<-----------------Change the required setups here----------------->
const channelName = "msedge";
const speed = 600;
const timer = 12; //hours

//<---------------Reactor page---------------->
//<---------------Historical Data---------------->
const dataSource = "FXView-Demo";
const symbol = "USDCHF";
const period = "H1";
//<---------------Strategy Properties---------------->
const entrylots = "0.01";
const oppEntrySignalOption = "2";
const stopLossOption = "0";
const typeOption = "3";
const minPips = "1";
const maxPips = "1000";
const takeProfitOptions = "0";
const tpRangeMin = "2";
const tpRangeMax = "1000";
//<---------------Generator Settings---------------->
const searchBestOption = "4";
const maxEntryOption = "8";
const maxExitOption = "4";
const runTime = "720";
//<----------------Data Horizon------------------->
const maxDataBars = "200000";
const startDate = "2018-09-14";
//
const collectionCapacity = "300";
const accMinNetProfit = "250";
const minCountOfTrade = "50";
const minSharpeRatio = "0.01";
const montCarloMinNetProfit = "50";
const montCarloMinCountOfTrade = "50";
const minProfitFactor = "1.01";
//ViewPort size setup
const vpWidth = 550;
const vpHeight = 250;
//<-----------------Change the required setups here----------------->

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: channelName,
    slowMo: speed,
  });

  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  await page.goto("https://expert-advisor-studio.com/");
  await page.getByLabel("Theme").selectOption("dark");

  // <------------------------Initial Setup------------------------->
  async function RunOrStopReactor() {
    //Go to reactor page
    await page.waitForSelector("#acquisition-link");
    await page.click("#acquisition-link");
    //Stop the reactor
    await page.waitForSelector("#button-start-stop");
    await page.click("#button-start-stop");
  }

  async function initialSetup() {
    await page
      .getByRole("link", {
        name: "Open the Generator, the Reactor, or the Validator",
      })
      .click();
    await page.getByRole("link", { name: "Reactor", exact: true }).click();

    // Change the Data Source, Symbol and Period here
    await page.getByLabel("Data source").selectOption(`${dataSource}`);
    await page.getByLabel("Symbol").selectOption(`${symbol}`);
    await page.getByLabel("Period").selectOption(`${period}`);
    // Strategy properties
    await page
      .locator("div")
      .filter({ hasText: /^2\. Strategy properties$/ })
      .click();
    await page.getByLabel("Entry lots").click();
    await page.getByLabel("Entry lots").press("ArrowLeft");
    await page.getByLabel("Entry lots").fill(`${entrylots}`); //<----------------|entrylots
    await page
      .getByLabel("Opposite entry signal")
      .selectOption(`${oppEntrySignalOption}`); //<----------------|
    await page
      .getByLabel("Stop Loss", { exact: true })
      .selectOption(`${stopLossOption}`); //<----------------|
    await page.getByLabel("Type").selectOption(`${typeOption}`); //<----------------|
    await page.getByRole("spinbutton", { name: "Min (pips)" }).click();
    await page
      .getByRole("spinbutton", { name: "Min (pips)" })
      .fill(`${minPips}`); //<----------------|
    await page.getByRole("spinbutton", { name: "Max (pips)" }).click();
    await page
      .getByRole("spinbutton", { name: "Max (pips)" })
      .fill(`${maxPips}`); //<----------------|
    await page
      .getByLabel("Take Profit", { exact: true })
      .selectOption(`${takeProfitOptions}`); //<----------------|
    await page.locator("#tp-range-min").click();
    await page.locator("#tp-range-min").fill(`${tpRangeMin}`); //<----------------|
    await page.locator("#tp-range-max").click();
    await page.locator("#tp-range-max").fill(`${tpRangeMax}`); //<----------------|
    // Generator Settings
    await page
      .locator("div")
      .filter({ hasText: /^3\. Generator settings$/ })
      .click();
    await page.locator("#search-best").selectOption(`${searchBestOption}`);
    await page
      .getByLabel("Max entry indicators")
      .selectOption(`${maxEntryOption}`); //<----------------|
    await page
      .getByLabel("Max exit indicators")
      .selectOption(`${maxExitOption}`); //<----------------|
    await page
      .getByLabel("Generate strategies with\nPreset Indicators")
      .uncheck();
    await page.getByLabel("Working minutes").click();
    await page.getByLabel("Working minutes").fill(`${runTime}`); //<----------------|
    await page.getByRole("link", { name: "Data", exact: true }).click();
    await page.getByRole("link", { name: "Data Horizon" }).click();
    await page.getByLabel("Maximum data bars").click();
    await page.getByLabel("Maximum data bars").press("Control+a");
    await page.getByLabel("Maximum data bars").fill(`${maxDataBars}`); //<----------------|
    await page.getByLabel("Start date", { exact: true }).fill(`${startDate}`); //<----------------|
    await page.getByLabel("Use start date limit").check();
    // Tools
    await page.getByRole("link", { name: "Tools" }).click();
    // await page.getByLabel("Leverage").selectOption("6");
    await page
      .getByLabel("Collection capacity")
      .selectOption(`${collectionCapacity}`); //<----------------|
    await page.getByRole("link", { name: "Acceptance Criteria" }).click();
    await page
      .locator("#validation-metrics-base div")
      .filter({ hasText: /^Minimum net profit$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("#validation-metrics-base div")
      .filter({ hasText: /^Minimum net profit$/ })
      .getByRole("spinbutton")
      .fill(`${accMinNetProfit}`); //<----------------|
    await page
      .locator("div")
      .filter({ hasText: /^Minimum count of trades$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum count of trades$/ })
      .getByRole("spinbutton")
      .fill(`${minCountOfTrade}`); //<----------------|
    await page
      .locator("#validation-metrics-base")
      .getByRole("button", { name: "+ Add acceptance criteria" })
      .click();
    await page.getByRole("link", { name: "Minimum Sharpe ratio" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum Sharpe ratio$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum Sharpe ratio$/ })
      .getByRole("spinbutton")
      .fill(`${minSharpeRatio}`); //<----------------|

    await page.getByRole("link", { name: "Available Indicators" }).click();
    await page.locator("#toggle-entries").click();
    await page.locator("#toggle-entries").click();
    await page.locator("#toggle-exits").click();
    await page.locator("#toggle-exits").click();
    await page
      .getByRole("row", { name: "Do not Exit" })
      .getByRole("checkbox")
      .uncheck();
    await page
      .getByRole("row", { name: "Exit Time" })
      .getByRole("checkbox")
      .uncheck();

    await page.getByRole("link", { name: "Strategy ID -" }).click();
    await page.getByRole("link", { name: "Monte Carlo" }).click();
    await page.getByLabel("Randomize history data").uncheck();
    await page.getByLabel("Randomize spread").uncheck();
    await page.getByLabel("Randomize slippage").uncheck();
    await page.getByLabel("Randomly skip position entry").uncheck();
    await page.getByLabel("Randomly skip position exit").uncheck();
    await page.getByLabel("Randomize indicator parameters").check();
    await page.getByLabel("Randomize backtest starting bar").check();
    await page.getByRole("link", { name: "Validation" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum net profit$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum net profit$/ })
      .getByRole("spinbutton")
      .fill(`${montCarloMinNetProfit}`); //<----------------|
    await page
      .locator("div")
      .filter({ hasText: /^Minimum count of trades$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum count of trades$/ })
      .getByRole("spinbutton")
      .fill(`${montCarloMinCountOfTrade}`); //<----------------|
    await page
      .getByRole("button", { name: "+ Add validation criteria" })
      .click();
    await page.getByRole("link", { name: "Minimum profit factor" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum profit factor$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Minimum profit factor$/ })
      .getByRole("spinbutton")
      .fill(`${minProfitFactor}`); //<----------------|
    await page.getByRole("link", { name: "Reactor", exact: true }).click();
    await page.waitForTimeout(5000);
    await page.getByRole("button", { name: "Confirm" }).click();
    await RunOrStopReactor();
    await page.setViewportSize({ width: vpWidth, height: vpHeight }); //<----------------|
  }

  // <------------------------End: Initial Setup------------------------->

  async function analyzeBacktestResults2(
    page,
    NPthreshold,
    maxDrawdownThreshold,
    SRthreshold
  ) {
    await page.waitForSelector("#backtest-output-table");

    const evaluateThreshold = (value, threshold) => value > threshold;

    const getValueAndThreshold = async (selector, threshold) => {
      const valueText = await page.$eval(selector, (element) =>
        element.textContent.trim()
      );
      const value = parseFloat(valueText.split(" ")[0].replace(",", ""));
      return evaluateThreshold(value, threshold);
    };

    const isNetProfitGreater = await getValueAndThreshold(
      "#backtest-profit",
      NPthreshold
    );
    const isMaxDrawdownLess = await getValueAndThreshold(
      "#backtest-drawdown-percent",
      maxDrawdownThreshold
    );
    const isSharpRatioGreater = await getValueAndThreshold(
      "#backtest-sharpe-ratio",
      SRthreshold
    );

    return isNetProfitGreater && isMaxDrawdownLess && isSharpRatioGreater;
  }

  async function clearPortfolio() {
    await page.waitForSelector("#eas-navbar-portfolio-link");
    await page.click("#eas-navbar-portfolio-link");
    //Now, Delete the portfolio and collection
    await page.waitForSelector("#remove-all-button");
    await page.click("#remove-all-button");
    console.log("Portfolio deleted");
  }

  async function clearCollection() {
    // Go to collection page
    await page.waitForSelector("#eas-navbar-collection-link");
    await page.click("#eas-navbar-collection-link");
    // Clear collections
    await page.waitForSelector("#remove-all-button");
    await page.click("#remove-all-button");
    console.log("Collection Deleted");
  }

  async function downloadFiles() {
    //Export the portfolio and download the unfiltered collection
    await page.waitForSelector("#portfolio-toolbar-export");
    await page.click("#portfolio-toolbar-export");
    await page.waitForSelector("#export-portfolio-expert-mt5");

    // Wait for download to start
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click("#export-portfolio-expert-mt5"),
    ]);

    const downloadFolderPath =
      "C:/Users/FCTwin1001/Downloads/automation_downloads/USDCHF/";
    await fs.mkdir(downloadFolderPath, { recursive: true });
    const suggestedFileName = download.suggestedFilename();
    const fullDownloadPath = path.join(downloadFolderPath, suggestedFileName);
    await download.saveAs(fullDownloadPath);
    console.log("Download saved to:", fullDownloadPath);

    await page.waitForSelector("#eas-navbar-collection-link");
    await page.click("#eas-navbar-collection-link");
    await page.waitForSelector("#download-collection");
    await page.click("#download-collection");

    const [collection_download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Collection", exact: true }).click(),
    ]);

    await fs.mkdir(downloadFolderPath, { recursive: true });
    const collectionFileName = collection_download.suggestedFilename();
    const collectionDownloadPath = path.join(
      downloadFolderPath,
      collectionFileName
    );
    await collection_download.saveAs(collectionDownloadPath);
    console.log("Collected strategies saved to:", collectionDownloadPath);

    console.log("Script1 download finished");
  }

  async function uploadCollection() {
    await page.waitForSelector("#eas-navbar-collection-link");
    await page.click("#eas-navbar-collection-link");
    await page
      .locator("input[type='file']")
      .setInputFiles(collectionDownloadPath);
  }

  async function strategyOne() {
    //<-------------------Change the stop loss and take profit------------------->
    await page
      .locator("div")
      .filter({ hasText: /^2\. Strategy properties$/ })
      .click();
    await page.getByLabel("Stop Loss", { exact: true }).selectOption("1");
    await page.getByLabel("Take Profit", { exact: true }).selectOption("1");
    await RunOrStopReactor();
  }

  async function strategyThree(page) {
    const PFthreshold = 2;
    const NPthreshold = 30000;
    const SRthreshold = 0.1;
    const maxDrawdownThreshold = 10;
    const initialSRthreshold = 0.07;
    const maxSRthreshold = 0.5;
    const SRincrement = 0.02;

    let currentSRthreshold = initialSRthreshold;
    let isCriteriaMet = false;

    let analysisResults = await analyzeBacktestResults3(
      page,
      NPthreshold,
      maxDrawdownThreshold,
      SRthreshold,
      PFthreshold
    );

    if (
      analysisResults.isMaxDrawdownLess &&
      analysisResults.isProfitFactorGreater &&
      analysisResults.isSharpRatioGreater
    ) {
      console.log("All three conditions met");
      analysisResults = await analyzeBacktestResults3(
        page,
        NPthreshold,
        maxDrawdownThreshold,
        SRthreshold,
        PFthreshold
      );
      console.log(`Analysis results: ${analysisResults}`);
      await downloadFiles();
      await clearCollection();
      await clearPortfolio();
    } else {
      console.log("Inside Else");
      await activatePerformanceFilter();
      while (
        analysisResults.maxDrawdown >= 10.0 &&
        analysisResults.sharpRatio < 0.1
      ) {
        console.log("Increasing sharpe ratio.....");
        // Change sharp ratio
        currentSRthreshold = currentSRthreshold + SRincrement;
        await updateSharpRatio(currentSRthreshold);
        analysisResults = await analyzeBacktestResults3(
          page,
          NPthreshold,
          maxDrawdownThreshold,
          SRthreshold,
          PFthreshold
        );
        console.log(analysisResults);
      }
      analysisResults = await analyzeBacktestResults3(
        page,
        NPthreshold,
        maxDrawdownThreshold,
        SRthreshold,
        PFthreshold
      );

      if (!analysisResults.isProfitFactorGreater) {
        console.log("Profit factor is greater downloading files.");
        await downloadFiles();
        await uncheckPerformanceFilter();
        await downloadFiles();
      } else {
        console.log("Profit factor is smaller re-running reactor.");
        let files = await downloadFiles();
        await clearPortfolio();
        await clearCollection();
        console.log(files.collectionDownloadPath);
        await uploadCollection(files.collectionDownloadPath);

        // Change sharp ratio in acceptance criteria
        await changeSharpRatioAcceptanceCriteria(currentSRthreshold - 0.01);
        await RunOrStopReactor();
      }
    }
  }

  async function strategyFour(page) {
    const PFthreshold = 2;
    const NPthreshold = 30000;
    const SRthreshold = 0.1;
    const maxDrawdownThreshold = 10;
    const initialSRthreshold = 0.15;
    const maxSRthreshold = 0.5;
    const SRincrement = 0.05;

    let currentSRthreshold = initialSRthreshold;
    let isCriteriaMet = false;

    let analysisResults = await analyzeBacktestResults3(
      page,
      NPthreshold,
      maxDrawdownThreshold,
      SRthreshold,
      PFthreshold
    );

    if (
      analysisResults.isMaxDrawdownLess &&
      analysisResults.isProfitFactorGreater &&
      analysisResults.isSharpRatioGreater
    ) {
      await activatePerformanceFilter();
      let strategies = await getStrategies();
      while (strategies < 90) {
        currentSRthreshold = currentSRthreshold + SRincrement;
        await updateSharpRatio(currentSRthreshold);
        strategies = await getStrategies();
      }

      await downloadFiles();
      await clearCollection();
      await clearPortfolio();
      await uploadCollection();
      await changeSharpRatioAcceptanceCriteria(currentSRthreshold);
      await RunOrStopReactor();
    }
  }

  await initialSetup();
  await page.waitForTimeout(1000 * 60 * 60 * timer); // Set the timer for checkup
  await RunOrStopReactor();

  // Get the value from collection notification
  const producedStrategies = await page.$eval(
    "#eas-collection-notification",
    (element) => element.textContent.trim()
  );

  if (producedStrategies <= 30) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyOne();
  } else if (producedStrategies <= 40) {
    console.log("No. of strategies produced: ", producedStrategies);
  } else if (producedStrategies <= 200) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyThree();
  } else if (producedStrategies > 200) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyFour();
  }

  // <---------Uncomment below if browser needed to be closed------------>
  // await context.close();
  // await browser.close();
})();
