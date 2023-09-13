const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    //========> Change the number below to slowdown or go faster(lesser to go faster)
    slowMo:600,
    // channel: "msedge",
  });
  
  //<-------------------To Open in non-incognito mode(Under Development)----------------------->
  // const browser = await chromium.launchPersistentContext('C:/Users/mushf/AppData/Local/Microsoft/Edge/User Data/Default', {
  //   headless: false,  // Set to true for headless mode, false for visible window
  //   // slowMo: 50,       // Slow down actions by 50ms (for better visualization)
  //   channel: "msedge"
  // });
  

  const PFthreshold = 2;
  const NPthreshold = 30000;
  const maxDrawdownThreshold = 10;
  const SRthreshold = 0.1;

  const context = await browser.newContext({
    storageState: 'auth.json'
  });
  
  const page = await context.newPage();

  //<--------------------------Start Here-------------------------------->
  
  //======> Change this line for a new collection
  const collection = 'Strategy Collection 54 GBPCAD H1.json';
  //======> Copy the path of the collection and change backslashe with forward slash
  const Path = 'C:/Users/FCTwin1001/Downloads/automation_downloads/Collections';
  //======> Set the path to download files here
  const downloadFolderPath = 'C:/Users/FCTwin1001/Downloads/automation_downloads/';

  let initCollectionDownloadPath =`${Path}/${collection}`;

  await page.goto('https://expert-advisor-studio.com/');
  await page.getByLabel('Theme').selectOption('dark');
  await page.waitForTimeout(3000);

  async function getFileNames(){
    const inputString = "Strategy Collection 54 GBPCAD H1.json"; // Example input string
const regex = /([A-Z]+\d+)/g;
const matches = inputString.match(regex);

if (matches && matches.length >= 2) {
  const name1 = matches[0];
  const name2 = matches[1];
  console.log(name1); // Output: GBPCAD
  console.log(name2); // Output: H1
} else {
  console.log("No matches found.");
}

  }

  async function initialSetup(){
    await page.getByRole('link', { name: 'Open the Generator, the Reactor, or the Validator' }).click();
    await page.getByRole('link', { name: 'Reactor', exact: true }).click();
    
    //=====> Change the Data Source here
    await page.getByLabel('Data source').selectOption('FXView-Demo');
    //=====> Change the Symbol here
    await page.getByLabel('Symbol').selectOption('GBPCAD');
    //=====> Change the  Period here
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
    // Change the time here
    await page.getByLabel('Working minutes').fill('720');
    await page.getByRole('link', { name: 'Data', exact: true }).click();
    await page.getByRole('link', { name: 'Data Horizon' }).click();
    await page.getByLabel('Maximum data bars').click();
    await page.getByLabel('Maximum data bars').press('Control+a');
    await page.getByLabel('Maximum data bars').fill('200000');
    await page.getByLabel('Start date', { exact: true }).fill('2018-08-27');
    await page.getByLabel('Use start date limit').check();
    // Tools
    await page.getByRole('link', { name: 'Tools' }).click();
    await page.getByLabel('Leverage').selectOption('1');
    await page.getByLabel('Collection capacity').selectOption('300');
    //Acceptance criteria
    await page.getByRole('link', { name: 'Acceptance Criteria' }).click();
    await page.locator('#validation-metrics-base div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').click();
    await page.locator('#validation-metrics-base div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').fill('300');
    await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').click();
    await page.locator('div').filter({ hasText: /^Minimum count of trades$/ }).getByRole('spinbutton').fill('50');
    await page.locator('#validation-metrics-base').getByRole('button', { name: '+ Add acceptance criteria' }).click();
    await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
    await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
    await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill('.05');
    
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
  }

  async function RunOrStopReactor(){
    //Go to reactor page
    await page.waitForSelector('#acquisition-link');
    await page.click('#acquisition-link');
    //Stop the reactor
    await page.waitForSelector('#button-start-stop');
    await page.click('#button-start-stop');
  }

  //<----------------------Download Files Section---------------------->
  async function downloadFiles(){
      //Export the portfolio and download the unfiltered collection
      await page.waitForTimeout(3000);
      await page.waitForSelector('#portfolio-toolbar-export');
      await page.click('#portfolio-toolbar-export');
      await page.waitForSelector('#export-portfolio-expert-mt5');
    
      // Wait for download to start
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('#export-portfolio-expert-mt5')
      ]);
    
      await fs.mkdir(downloadFolderPath, { recursive: true });
      const suggestedFileName = download.suggestedFilename();
      const portfolioDownloadPath = path.join(downloadFolderPath, suggestedFileName);
      await download.saveAs(portfolioDownloadPath);
      console.log('Portfolio saved to:', portfolioDownloadPath);
    
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
      return{
        portfolioDownloadPath: portfolioDownloadPath,
        collectionDownloadPath: collectionDownloadPath
      };
    }

  async function uploadCollection(downloadPath){
    await page.waitForSelector('#eas-navbar-collection-link');
    await page.click('#eas-navbar-collection-link');
    await page.locator("input[type='file']").setInputFiles(downloadPath);
    console.log('Files uploaded');
  }

  async function clearPortfolio(){
    await page.waitForSelector('#eas-navbar-portfolio-link');
    await page.click('#eas-navbar-portfolio-link');
    //Now, Delete the portfolio and collection
    await page.waitForSelector('#remove-all-button');
    await page.click('#remove-all-button');
    console.log("Portfolio deleted");
  }

  async function addAllCollections(){
    // Go to collection page
    await page.waitForSelector('#eas-navbar-collection-link');
    await page.click('#eas-navbar-collection-link');
    await page.getByRole('button', { name: '+ Portfolio' }).click();
    await page.getByRole('link', { name: 'Add all' }).click();

    // Go to portfolio
    await page.waitForSelector('#eas-navbar-portfolio-link');
    await page.click('#eas-navbar-portfolio-link');

    // Calculate collections
    await page.waitForSelector('#button-calculate');
    await page.click('#button-calculate');
    await page.waitForTimeout(50000);
    
    console.log('Collections added to portfolio');
  }

  async function getCollectionNumber(){
    // Get the value from collection notification
    const producedStrategies = await page.$eval('#eas-collection-notification', element => element.textContent.trim());

    if (producedStrategies <= 30) {
        console.log("No. of strategies produced: ", producedStrategies);
        // await strategyOne();
    } else if(producedStrategies<=150){
        console.log("No. of strategies produced: ", producedStrategies);
    } else if(producedStrategies <= 240){
        console.log("No. of strategies produced: ", producedStrategies);
        // await strategyThree();
    }
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

async function analyzeBacktestResults3(page, NPthreshold, maxDrawdownThreshold, SRthreshold, PFthreshold) {
    // Go to portfolio
    await page.waitForSelector('#eas-navbar-portfolio-link');
    await page.click('#eas-navbar-portfolio-link');
    // // Calculate collections
    // await page.waitForSelector('#button-calculate');
    // await page.click('#button-calculate');
    // await page.waitForTimeout(10000);

    await page.waitForSelector('#backtest-output-table');

    const evaluateThreshold = (value, threshold) => value > threshold;

    const getValueAndThreshold = async (selector, threshold) => {
        const valueText = await page.$eval(selector, element => element.textContent.trim());
        const value = parseFloat(valueText.split(' ')[0].replace(',', ''));
        return { value, meetsThreshold: evaluateThreshold(value, threshold) };
    };

    const { value: netProfit, meetsThreshold: isNetProfitGreater } = await getValueAndThreshold('#backtest-profit', NPthreshold);
    const { value: maxDrawdown, meetsThreshold: isMaxDrawdownLess } = await getValueAndThreshold('#backtest-drawdown-percent', maxDrawdownThreshold);
    const { value: sharpRatio, meetsThreshold: isSharpRatioGreater } = await getValueAndThreshold('#backtest-sharpe-ratio', SRthreshold);
    const { value: profitFactor, meetsThreshold: isProfitFactorGreater } = await getValueAndThreshold('#backtest-profit-factor', PFthreshold);

    console.log(`Net Profit: ${netProfit} | Max Drawdown: ${maxDrawdown}% | Sharp Ratio: ${sharpRatio} | Profit Factor: ${profitFactor}`);

    return {
        netProfit: netProfit,
        maxDrawdown: maxDrawdown,
        sharpRatio: sharpRatio,
        profitFactor: profitFactor,
        isProfitFactorGreater: isProfitFactorGreater,
        isNetProfitGreater: isNetProfitGreater,
        isMaxDrawdownLess: isMaxDrawdownLess,
        isSharpRatioGreater: isSharpRatioGreater
    };
}

async function updateSharpRatio(currentSRthreshold){
        await page.waitForSelector('#eas-navbar-collection-link');
        await page.click('#eas-navbar-collection-link');

        await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold.toString());
        await page.locator('#eas-main-container').click();
}

async function changeSharpRatioAcceptanceCriteria(SharpeRatio){
  await page.waitForSelector('#eas-navbar-tools-link');
  await page.click('#eas-navbar-tools-link');
  await page.waitForSelector('#eas-navbar-acceptance-criteria-link');
  await page.click('#eas-navbar-acceptance-criteria-link');

  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').press('Control+A');
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(SharpeRatio.toString());
}

async function activatePerformanceFilter(){
  // Go to collection page
  await page.waitForSelector('#eas-navbar-collection-link');
  await page.click('#eas-navbar-collection-link');

  await page.getByLabel('Sort collection by').selectOption('SharpeRatio');
  await page.getByLabel('Use performance filters.').check();
  await page.locator('div').filter({ hasText: /^Minimum net profit$/ }).locator('i').click();
  await page.getByRole('button', { name: '+ Add validation criteria' }).click();
  await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').press('Control+A');
  await page.getByRole('spinbutton').fill('0.07');
  await page.locator('#eas-main-container').click();

}

async function checkPerformanceFilter(){
  // Go to collection page
  await page.waitForSelector('#eas-navbar-collection-link');
  await page.click('#eas-navbar-collection-link');

  await page.getByLabel('Use performance filters.').check();
}

async function uncheckPerformanceFilter(){
  // Go to collection page
  await page.waitForSelector('#eas-navbar-collection-link');
  await page.click('#eas-navbar-collection-link');

  await page.getByLabel('Use performance filters.').uncheck();
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

async function strategyThree(page){
  const PFthreshold = 2;
  const NPthreshold = 50000;
  const SRthreshold = 0.1;
  const maxDrawdownThreshold = 10;
  const initialSRthreshold = 0.07;
  const maxSRthreshold = 0.5;
  const SRincrement = 0.02;

  let currentSRthreshold = initialSRthreshold;
  let isCriteriaMet = false;

  let analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold);
  

  if(analysisResults.isMaxDrawdownLess && analysisResults.isProfitFactorGreater && analysisResults.isSharpRatioGreater){
    console.log("All three conditions met");
    analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold);
    console.log(`Analysis results: ${analysisResults}`);
    await downloadFiles();
    await clearCollection();
    await clearPortfolio();
  }else{
    console.log("Inside Else");
    await activatePerformanceFilter();
    while((analysisResults.maxDrawdown>10.0 && analysisResults.sharpRatio<0.1)){
      console.log("Increasing sharpe ratio in while loop");
      // Change sharp ratio
      currentSRthreshold = currentSRthreshold + SRincrement;
      await updateSharpRatio(currentSRthreshold);
      analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold);
      console.log(analysisResults);

    }
    analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold);
    
    if(!analysisResults.isProfitFactorGreater){
      console.log("Inside if after while loop");
      let files = await downloadFiles();
      await clearPortfolio();
      await clearCollection();
      console.log(files.collectionDownloadPath)
      await uploadCollection(files.collectionDownloadPath);

      // Change sharp ratio in acceptance criteria
      await changeSharpRatioAcceptanceCriteria(currentSRthreshold-0.02);
      await RunOrStopReactor();
    }else{
      console.log("Inside else after while loop");
      await downloadFiles();
      await uncheckPerformanceFilter();
      await downloadFiles();

    }
  }
}

async function strategyFour(page) {
  const PFthreshold = 2;
  const NPthreshold = 50000;
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

  if (analysisResults.isMaxDrawdownLess && analysisResults.isProfitFactorGreater && analysisResults.isSharpRatioGreater) {
    await activatePerformanceFilter();
    let strategies = await getStrategies();
    while(strategies<90){
      currentSRthreshold = currentSRthreshold+SRincrement;
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
  await uploadCollection(initCollectionDownloadPath);
  await addAllCollections();

  // Get the value from collection notification
  const producedStrategies = await page.$eval(
    "#eas-collection-notification",
    (element) => element.textContent.trim()
  );

  if (producedStrategies <= 30) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyOne(page);
  } else if (producedStrategies <= 150) {
    console.log("No. of strategies produced: ", producedStrategies);
  } else if (producedStrategies <= 240) {
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyThree(page);
  }else if(producedStrategies > 240){
    console.log("No. of strategies produced: ", producedStrategies);
    await strategyFour(page);
  }


  console.log(await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold));
  console.log(await getCollectionNumber());
  console.log(await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold,PFthreshold));
})();