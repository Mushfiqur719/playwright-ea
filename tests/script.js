const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    // channel: "msedge",
  });
  
  //<-------------------To Open in non-incognito mode----------------------->
  // const browser = await chromium.launchPersistentContext('C:/Users/mushf/AppData/Local/Microsoft/Edge/User Data/Default', {
  //   headless: false,  // Set to true for headless mode, false for visible window
  //   // slowMo: 50,       // Slow down actions by 50ms (for better visualization)
  //   channel: "msedge"
  // });
  
  const context = await browser.newContext({
    storageState: 'auth.json'
  });
  
  const page = await context.newPage();

  await page.goto('https://expert-advisor-studio.com/');
  await page.getByLabel('Theme').selectOption('dark');

  // <------------------------Initial Setup------------------------->
  await page.getByRole('link', { name: 'Open the Generator, the Reactor, or the Validator' }).click();
  await page.getByRole('link', { name: 'Reactor', exact: true }).click();
  
  // Change the Data Source, Symbol and Period here
  await page.getByLabel('Data source').selectOption('FXView-Demo');
  await page.getByLabel('Symbol').selectOption('USDCHF');
  await page.getByLabel('Period').selectOption('H1');
  // Strategy properties
  await page.locator('div').filter({ hasText: /^2\. Strategy properties$/ }).click();
  await page.getByLabel('Entry lots').click();
  await page.getByLabel('Entry lots').press('ArrowLeft');
  await page.getByLabel('Entry lots').fill('0.01');
  await page.getByLabel('Opposite entry signal').selectOption('2');
  await page.getByLabel('Stop Loss', { exact: true }).selectOption('0');
  await page.getByLabel('Type').selectOption('3');
  await page.getByRole('spinbutton', { name: 'Min (pips)' }).click();
  await page.getByRole('spinbutton', { name: 'Min (pips)' }).fill('1');
  await page.getByRole('spinbutton', { name: 'Max (pips)' }).click();
  await page.getByRole('spinbutton', { name: 'Max (pips)' }).fill('1000');
  await page.getByLabel('Take Profit', { exact: true }).selectOption('0');
  await page.locator('#tp-range-min').click();
  await page.locator('#tp-range-min').fill('2');
  await page.locator('#tp-range-max').click();
  await page.locator('#tp-range-max').fill('1000');
  // Generator Settings
  await page.locator('div').filter({ hasText: /^3\. Generator settings$/ }).click();
  await page.locator('#search-best').selectOption('4');
  await page.getByLabel('Max entry indicators').selectOption('8');
  await page.getByLabel('Max exit indicators').selectOption('4');
  await page.getByLabel('Generate strategies with\nPreset Indicators').uncheck();
  await page.getByLabel('Working minutes').click();
  await page.getByLabel('Working minutes').fill('120');
  await page.getByRole('link', { name: 'Data', exact: true }).click();
  await page.getByRole('link', { name: 'Data Horizon' }).click();
  await page.getByLabel('Maximum data bars').click();
  await page.getByLabel('Maximum data bars').press('Control+a');
  await page.getByLabel('Maximum data bars').fill('200000');
  await page.getByLabel('Start date', { exact: true }).fill('2022-08-21');
  await page.getByLabel('Use start date limit').check();
  // Tools
  await page.getByRole('link', { name: 'Tools' }).click();
  await page.getByLabel('Leverage').selectOption('1');
  await page.getByLabel('Collection capacity').selectOption('300');
  await page.getByRole('link', { name: 'Acceptance Criteria' }).click();
  await page.locator('#validation-metrics-base div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').click();
  await page.locator('#validation-metrics-base div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').fill('50');
  await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').fill('50');
  await page.locator('#validation-metrics-base').getByRole('button', { name: '+ Add acceptance criteria' }).click();
  await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill('.01');
  
  await page.getByRole('link', { name: 'Strategy ID -' }).click();
  await page.getByRole('link', { name: 'Monte Carlo' }).click();
  await page.getByLabel('Randomize history data').uncheck();
  await page.getByLabel('Randomize spread').uncheck();
  await page.getByLabel('Randomize slippage').uncheck();
  await page.getByLabel('Randomly skip position entry').uncheck();
  await page.getByLabel('Randomly skip position exit').uncheck();
  await page.getByLabel('Randomize indicator parameters').check();
  await page.getByLabel('Randomize backtest starting bar').check();
  await page.getByRole('link', { name: 'Validation' }).click();
  await page.locator('div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').fill('50');
  await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').fill('50');
  await page.getByRole('button', { name: '+ Add validation criteria' }).click();
  await page.getByRole('link', { name: 'Minimum profit factor' }).click();
  await page.locator('div').filter({ hasText: /^Minimum profit factor$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum profit factor$/ }).getByRole('spinbutton').fill('1.01');
  await page.getByRole('link', { name: 'Reactor', exact: true }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForSelector('#button-start-stop')
  await page.click('#button-start-stop')
  await page.setViewportSize({ width: 550, height: 250});

  // <------------------------End: Initial Setup------------------------->
  await page.waitForTimeout(1000*60*60*2); // Set the timer for checkup
  
  async function RunOrStopReactor(){
    //Go to reactor page
    await page.waitForSelector('#acquisition-link');
    await page.click('#acquisition-link');
    //Stop the reactor
    await page.waitForSelector('#button-start-stop');
    await page.click('#button-start-stop');
  }


  async function analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, SRthreshold) {
    await page.waitForSelector('#backtest-output-table');
  
    const evaluateThreshold = (value, threshold) => value > threshold;
  
    const getValueAndThreshold = async (selector, threshold) => {
      const valueText = await page.$eval(selector, element => element.textContent.trim());
      const value = parseFloat(valueText.split(' ')[0].replace(',', ''));
      return evaluateThreshold(value, threshold);
    };
  
    const isNetProfitGreater = await getValueAndThreshold('#backtest-profit', NPthreshold);
    const isMaxDrawdownLess = await getValueAndThreshold('#backtest-drawdown-percent', maxDrawdownThreshold);
    const isSharpRatioGreater = await getValueAndThreshold('#backtest-sharpe-ratio', SRthreshold);
  
    return isNetProfitGreater && isMaxDrawdownLess && isSharpRatioGreater;
  }

  async function clearPortfolio(){
    await page.waitForSelector('#eas-navbar-portfolio-link');
    await page.click('#eas-navbar-portfolio-link');
      //Now, Delete the portfolio and collection
    await page.waitForSelector('#remove-all-button');
    await page.click('#remove-all-button');
    console.log("Portfolio deleted");

  }

  async function clearCollection(){
        // Go to collection page
    await page.waitForSelector('#eas-navbar-collection-link');
    await page.click('#eas-navbar-collection-link');
      // Clear collections
    await page.waitForSelector('#remove-all-button');
    await page.click('#remove-all-button');
    console.log("Collection Deleted");

  }

  //<----------------------Download Files Section---------------------->
  async function downloadFiles(){
  //Export the portfolio and download the unfiltered collection
  await page.waitForSelector('#portfolio-toolbar-export');
  await page.click('#portfolio-toolbar-export');
  await page.waitForSelector('#export-portfolio-expert-mt5');

  // Wait for download to start
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-portfolio-expert-mt5')
  ]);

  const downloadFolderPath = 'C:/Users/FCTwin1001/Downloads/automation_downloads/USDCHF/';
  await fs.mkdir(downloadFolderPath, { recursive: true });
  const suggestedFileName = download.suggestedFilename();
  const fullDownloadPath = path.join(downloadFolderPath, suggestedFileName);
  await download.saveAs(fullDownloadPath);
  console.log('Download saved to:', fullDownloadPath);

  await page.waitForSelector('#eas-navbar-collection-link');
  await page.click('#eas-navbar-collection-link');
  await page.waitForSelector('#download-collection');
  await page.click('#download-collection');

  const [collection_download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'Collection', exact: true }).click()
  ]);

  await fs.mkdir(downloadFolderPath, { recursive: true });
  const collectionFileName = collection_download.suggestedFilename();
  const collectionDownloadPath = path.join(downloadFolderPath, collectionFileName);
  await collection_download.saveAs(collectionDownloadPath);
  console.log('Collected strategies saved to:', collectionDownloadPath);

  console.log("Script1 download finished");
  }
  
//<----------------------End: Download Files Section--------------------------->

  async function uploadCollection(){
    await page.waitForSelector('#eas-navbar-collection-link');
    await page.click('#eas-navbar-collection-link');
    await page.locator("input[type='file']").setInputFiles(collectionDownloadPath);
  }
  //<------------------------Stop The Reactor------------------>
  await RunOrStopReactor();





  // <-----------------------Validating Strategies------------------------->

  //<------------------------------Strategies------------------------------>
  
  //<------------------------------Strategy One---------------------------->
  async function strategyOne(){
    //<-------------------Change the stop loss and take profit------------------->
    await page.locator('div').filter({ hasText: /^2\. Strategy properties$/ }).click();
    await page.getByLabel('Stop Loss', { exact: true }).selectOption('1');
    await page.getByLabel('Take Profit', { exact: true }).selectOption('1');
    await RunOrStopReactor();
  }

  async function strategyThree(page) {
    // async function analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, SRthreshold) {
    //   // Your analyzeBacktestResults2 function implementation
    // }
  
    // <-----------------------Add strategies to Portfolio------------------------->
  
    // ... your existing code ...
  
    // Define threshold values
    const NPthreshold = 20000;
    const maxDrawdownThreshold = 20;
    const initialSRthreshold = 0.07;
    const maxSRthreshold = 0.5;
    const SRincrement = 0.02;
  
    let currentSRthreshold = initialSRthreshold;
    let isCriteriaMet = false;
  
    while (!isCriteriaMet && currentSRthreshold <= maxSRthreshold) {
      await page.getByLabel('Sort collection by').selectOption('SharpeRatio');
      await page.getByLabel('Use performance filters.').check();
      await page.getByRole('button', { name: '+ Add validation criteria' }).click();
      await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
      await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
      await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold);
      await page.locator('#eas-main-container').click();
      await page.waitForSelector('#eas-navbar-portfolio-link');
      await page.click('#eas-navbar-portfolio-link');
  
      isCriteriaMet = await analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, SRthreshold);
  
      if (!isCriteriaMet) {
        // Increase the Sharpe Ratio threshold by SRincrement
        currentSRthreshold += SRincrement;
      }
    }
  
    if (isCriteriaMet) {
      // Criteria met, proceed with exporting portfolio and collection download
      await downloadFiles();
      // Uncheck performance filters
        //Go to collection page
      await page.waitForSelector('#eas-navbar-collection-link');
      await page.click('#eas-navbar-collection-link');
        //Uncheck performance filters
      await page.getByLabel('Use performance filters.').uncheck();
      // Download unfiltered collection again
      await downloadFiles();
    } else {
      // Criteria not met, perform the steps you've described in scenario 'e'
      // Download filtered collection
      await downloadFiles();
      // Delete portfolio and collection
      await clearPortfolio();
      await clearCollection();
      // Upload the downloaded collection
      await uploadCollection();
      // Adjust sharp ratio in acceptance criteria
      await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
      await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold-0.02);
      // Check other settings
      // Start the reactor
      await RunOrStopReactor();
    }
  }
  //<------------------------------End: Strategies---------------------------->


  // <--------------------Scenario 1: Strategies < 30---------------------->
  

  // Get the value from collection notification
  const producedStrategies = await page.$eval('#eas-collection-notification', element => element.textContent.trim());

  if (producedStrategies <= 30) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyOne();
  } else if(producedStrategies<=150){
    console.log("No. of strategies produced: ", producedStrategies);
  } else if(producedStrategies <= 240){
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyThree();
  }

  

  // <-----------------------After adding to the collection check NetProfit,MaxDrawdown,SharpRatio------------------------->
  async function analyzeBacktestResults(){

    await page.waitForSelector('#backtest-output-table');
    // Compare if the net profit is more than 20 thousand or not.
    const netProfit = await page.$eval('#backtest-profit', element => element.textContent.trim());
    const netProfitValue = parseFloat(netProfit.split(' ')[0].replace(',', ''));
    const NPthreshold = 20000;
    if (netProfitValue > NPthreshold) {
      console.log("Net profit is greater than 200000, Netprofit: ", netProfit);
    } else {
      console.log("Net profit is not greater than 200000, Netprofit: ", netProfit);
    }

    // Compare if Max drawdown % is more than 20 or not.
    const MaxDrawdownPercent = await page.$eval('#backtest-drawdown-percent', element => element.textContent.trim());
    // Convert and compare the Max drawdon % value
    const MaxDrawdownPercentValue = parseFloat(MaxDrawdownPercent.split(' ')[0].replace(',', ''));
    const MDthreshold = 20;

    if (MaxDrawdownPercentValue > MDthreshold) {
      console.log("Max drawdown% is greater than 20:", MaxDrawdownPercentValue);
    } else {
      console.log("Max drawdown% is not greater than 20:", MaxDrawdownPercentValue);
    }

    // Compare if the Sharp Ratio is more than 0.10 or not
    const SharpRatio = await page.$eval('#backtest-sharpe-ratio', element => element.textContent.trim());
    const SRthreshold = 0.10;
    if (SharpRatio > SRthreshold) {
      console.log("Sharp Ratio is greater than 0.01:", SharpRatio);
    } else {
      console.log("Sharp Ratio is not greater than 0.01:", SharpRatio);
    }

  }

  // await analyzeBacktestResults();

  // async function analyzeBacktestResults2() {
  
  //   await page.waitForSelector('#backtest-output-table');
  
  //   const evaluateThreshold = (value, threshold) => value > threshold;
  
  //   const getValueAndThreshold = async (selector, threshold) => {
  //     const valueText = await page.$eval(selector, element => element.textContent.trim());
  //     const value = parseFloat(valueText.split(' ')[0].replace(',', ''));
  //     return evaluateThreshold(value, threshold);
  //   };
  
  //   const NPthreshold = 20000;
  //   const isNetProfitGreater = await getValueAndThreshold('#backtest-profit', NPthreshold);
  
  //   const MDthreshold = 20;
  //   const isMaxDrawdownLess = await getValueAndThreshold('#backtest-drawdown-percent', MDthreshold);
  
  //   const SRthreshold = 0.10;
  //   const isSharpRatioGreater = await getValueAndThreshold('#backtest-sharpe-ratio', SRthreshold);
  
  //   return isNetProfitGreater && isMaxDrawdownLess && isSharpRatioGreater;
  // }
  
  const result = await analyzeBacktestResults2();
  console.log('All conditions met:', result);
  
  


  //<------------------------Start: Stop The Reactor----------------------------->


  //<------------------------End: Stop The Reactor------------------------------->

  //<-----------------------------Remove Porfolio and Collections-------------------------->
    //Go to portfolio page


    await clearPortfolio();
    await clearCollection();
  //<-----------------------------Remove Porfolio and Collections-------------------------->

  //<----------------------Use Performance Filters-------------------------->
  // go to collection page
  // await page.waitForSelector('#eas-navbar-collection-link');
  // await page.click('#eas-navbar-collection-link');


  // // Sort collection by Sharp Ratio
  // await page.getByLabel('Sort collection by').selectOption('SharpeRatio');
  // // Check performance filters
  // await page.getByLabel('Use performance filters.').check();
  // // Add validation criteria
  // await page.getByRole('button', { name: '+ Add validation criteria' }).click();
  // await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
  // //<---------------------------------------------->
  
  // // Set validation criteria 
  // await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
  // await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill('0.07');
  // // Click outside the container to see change
  // await page.locator('#eas-main-container').click();
  // // go to portfolio page
  // await page.waitForSelector('#eas-navbar-portfolio-link');
  // await page.click('#eas-navbar-portfolio-link');

  // await analyzeBacktestResults();

  //<----------------------End of performance filters usage-------------------------->

  //<-------------------------Upload Files Section----------------------->

    //Go to collections page
  await uploadCollection();
    
  //<------------------------End-Upload Files Section--------------------->


  // <---------Uncomment below if browser needed to be closed------------>
  // await context.close();
  // await browser.close();
})();