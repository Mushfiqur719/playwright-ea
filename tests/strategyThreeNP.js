const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo:100,
    // channel: "msedge",
  });
  
  //<-------------------To Open in non-incognito mode----------------------->
  // const browser = await chromium.launchPersistentContext('C:/Users/mushf/AppData/Local/Microsoft/Edge/User Data/Default', {
  //   headless: false,  // Set to true for headless mode, false for visible window
  //   // slowMo: 50,       // Slow down actions by 50ms (for better visualization)
  //   channel: "msedge"
  // });
  

  const NPthreshold = 50000;
  const maxDrawdownThreshold = 10;
  const SRthreshold = 0.1;

  const context = await browser.newContext({
    storageState: 'auth.json'
  });
  
  const page = await context.newPage();
  let collectionDownloadPath ='E:/Resources/EA/Mushfiqur/Archive/Promising/Strategy Collection 68 GBPCAD H1.json';

  await page.goto('https://expert-advisor-studio.com/');
  await page.getByLabel('Theme').selectOption('dark');
  await page.waitForTimeout(3000);

  async function initialSetup(){
    await page.getByRole('link', { name: 'Open the Generator, the Reactor, or the Validator' }).click();
    await page.getByRole('link', { name: 'Reactor', exact: true }).click();
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
    await page.getByLabel('Start date', { exact: true }).fill('2018-08-27');
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
    await page.locator('div').filter({ hasText: /^Minimum net profit$/ }).getByRole('spinbutton').fill('300');
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
    
      const downloadFolderPath = 'E:/Resources/EA/Automation Downloads/';
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

  async function uploadCollection(collectionDownloadPath){
    await page.waitForSelector('#eas-navbar-collection-link');
    await page.click('#eas-navbar-collection-link');
    await page.locator("input[type='file']").setInputFiles(collectionDownloadPath);
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

//   async function analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, SRthreshold) {
//     // Go to portfolio
//     await page.waitForSelector('#eas-navbar-portfolio-link');
//     await page.click('#eas-navbar-portfolio-link');
//     // Calculate collections
//     await page.waitForSelector('#button-calculate');
//     await page.click('#button-calculate');
//     await page.waitForTimeout(5000);

//     await page.waitForSelector('#backtest-output-table');

//     const evaluateThreshold = (value, threshold) => value > threshold;

//     const getValueAndThreshold = async (selector, threshold) => {
//         const valueText = await page.$eval(selector, element => element.textContent.trim());
//         const value = parseFloat(valueText.split(' ')[0].replace(',', ''));
//         return { value, meetsThreshold: evaluateThreshold(value, threshold) };
//     };

//     const { value: netProfit, meetsThreshold: isNetProfitGreater } = await getValueAndThreshold('#backtest-profit', NPthreshold);
//     const { value: maxDrawdown, meetsThreshold: isMaxDrawdownLess } = await getValueAndThreshold('#backtest-drawdown-percent', maxDrawdownThreshold);
//     const { value: sharpRatio, meetsThreshold: isSharpRatioGreater } = await getValueAndThreshold('#backtest-sharpe-ratio', SRthreshold);

//     console.log(`Net Profit: ${netProfit} | Max Drawdown: ${maxDrawdown}% | Sharp Ratio: ${sharpRatio}`);

//     return isNetProfitGreater && isMaxDrawdownLess && isSharpRatioGreater;
// }


//   async function strategyThree(page) {
//     //Go to collection page
//     await page.waitForSelector('#eas-navbar-collection-link');
//     await page.click('#eas-navbar-collection-link');
//     //Check performance filters
//     await page.getByLabel('Sort collection by').selectOption('SharpeRatio');
//     await page.getByLabel('Use performance filters.').check();
//     await page.getByRole('button', { name: '+ Add validation criteria' }).click();
//     await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();

//     console.log('starting strategy three');
//     const initialSRthreshold = 0.07;
//     const maxSRthreshold = 0.5;
//     const SRincrement = 0.02;

//     let currentSRthreshold = initialSRthreshold;
//     let isCriteriaMet = false;

//     while (!isCriteriaMet && currentSRthreshold <= maxSRthreshold) {
//         //Go to collection page
//         await page.waitForSelector('#eas-navbar-collection-link');
//         await page.click('#eas-navbar-collection-link');

//         await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold.toString());
//         await page.locator('#eas-main-container').click();
//         await page.waitForSelector('#eas-navbar-portfolio-link');
//         await page.click('#eas-navbar-portfolio-link');

//         isCriteriaMet = await analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, currentSRthreshold);

//         if (!isCriteriaMet) {
//             // Increase the Sharpe Ratio threshold by SRincrement
//             currentSRthreshold += SRincrement;
//             console.log(`files incremented to ${currentSRthreshold}`);
//         }
//     }

//     if (isCriteriaMet) {
//         // Criteria met, proceed with exporting portfolio and collection download
//         await downloadFiles();
//         console.log('Files downloaded');
//         // Uncheck performance filters
//         // Go to collection page
//         await page.waitForSelector('#eas-navbar-collection-link');
//         await page.click('#eas-navbar-collection-link');
//         // Uncheck performance filters
//         await page.getByLabel('Use performance filters.').uncheck();
//         // Download unfiltered collection again
//         await downloadFiles();
//         // Export Portfolio
//         await exportPortfolio();
//         // Uncheck performance filters
//         await page.getByLabel('Use performance filters.').uncheck();
//         // Download unfiltered collection again
//         await downloadFiles();
//         // Portfolio has graduated
//     } else {
//         // Criteria not met, perform the steps you've described in scenario 'e'
//         // Download filtered collection
//         await downloadFiles();
//         // Delete portfolio and collection
//         await clearPortfolio();
//         await clearCollection();
//         // Upload the downloaded collection

//         // Adjust sharp ratio in acceptance criteria
//         // Check other settings
//         // Start the reactor
//     }
// }

async function analyzeBacktestResults3(page, NPthreshold, maxDrawdownThreshold, SRthreshold) {
    // Go to portfolio
    await page.waitForSelector('#eas-navbar-portfolio-link');
    await page.click('#eas-navbar-portfolio-link');
    // Calculate collections
    await page.waitForSelector('#button-calculate');
    await page.click('#button-calculate');
    await page.waitForTimeout(5000);

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

    console.log(`Net Profit: ${netProfit} | Max Drawdown: ${maxDrawdown}% | Sharp Ratio: ${sharpRatio}`);

    return {
        netProfit: netProfit,
        maxDrawdown: maxDrawdown,
        sharpRatio: sharpRatio,
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

async function changeSharpRatioAcceptanceCriteria(SharptRatio){
  await page.waitForSelector('#eas-navbar-tools-link');
  await page.click('#eas-navbar-tools-link');
  await page.waitForSelector('#eas-navbar-acceptance-criteria-link');
  await page.click('#eas-navbar-acceptance-criteria-link');

  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').press('Control+Shift+ArrowLeft');
  await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(SharpRatio.toString());
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
  await page.getByRole('spinbutton').press('Control+Shift+ArrowLeft');
  await page.getByRole('spinbutton').fill('0.07');
  await page.locator('#eas-main-container').click();

}


// async function strategyThree(page) {
//     const NPthreshold = 20000;
//     const maxDrawdownThreshold = 20;
//     const initialSRthreshold = 0.07;
//     const maxSRthreshold = 0.5;
//     const SRincrement = 0.02;

//     let currentSRthreshold = initialSRthreshold;
//     let isCriteriaMet = false;

//     while (!isCriteriaMet && currentSRthreshold <= maxSRthreshold) {
//         // Go to collection page
//         await page.waitForSelector('#eas-navbar-collection-link');
//         await page.click('#eas-navbar-collection-link');

//         await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold.toString());
//         await page.locator('#eas-main-container').click();
//         await page.waitForSelector('#eas-navbar-portfolio-link');
//         await page.click('#eas-navbar-portfolio-link');

//         isCriteriaMet = await analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, currentSRthreshold);

//         if (!isCriteriaMet) {
//             // Increase the Sharpe Ratio threshold by SRincrement
//             currentSRthreshold += SRincrement;
//             console.log(`Sharpe Ratio threshold incremented to ${currentSRthreshold}`);
//         }
//     }

//     if (isCriteriaMet) {
//         // Criteria met, proceed with exporting portfolio and collection download
//         await downloadFiles();
//         // Delete collection and portfolio
//         await deleteCollection();
//         await deletePortfolio();
//     } else {
//         // Criteria not met, perform the steps described
//         // Open the Collection Menu and Check "Use Performance Filters"
//         await page.waitForSelector('#eas-navbar-collection-link');
//         await page.click('#eas-navbar-collection-link');
//         await page.waitForTimeout(5000);

//         await page.getByLabel('Use performance filters.').check();
//         console.log('Checked performance filters')
//         await page.locator('div').filter({ hasText: /^Minimum net profit$/ }).locator('i').click();
//         await page.getByRole('button', { name: '+ Add validation criteria' }).click();
//         await page.getByRole('link', { name: 'Minimum Sharpe ratio' }).click();
      


//         // Loop to adjust Sharpe Ratio and Max Drawdown
//         while (!isCriteriaMet && currentSRthreshold <= maxSRthreshold) {

//             await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill(currentSRthreshold.toString());
//             await page.locator('#eas-main-container').click();
//             await page.waitForSelector('#eas-navbar-portfolio-link');
//             await page.click('#eas-navbar-portfolio-link');

//             isCriteriaMet = await analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, currentSRthreshold);

//             if (!isCriteriaMet) {
//                 currentSRthreshold += SRincrement;
//                 console.log(`Sharpe Ratio threshold incremented to ${currentSRthreshold}`);
//             }
//         }

//         if (!isCriteriaMet && currentSRthreshold > maxSRthreshold) {
//             // Perform the steps mentioned in scenario 'e'
//             await downloadFiles();
//             await deletePortfolio();
//             await deleteCollection();
//             // Upload collection, adjust settings, start reactor
//             // (You need to implement these steps)
//         }
//     }
// }

async function strategyThree(page){
    const NPthreshold = 50000;
    const maxDrawdownThreshold = 10;
    const initialSRthreshold = 0.07;
    const maxSRthreshold = 0.5;
    const SRincrement = 0.02;

    let currentSRthreshold = initialSRthreshold;
    let isCriteriaMet = false;

    let analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold);
    await activatePerformanceFilter();

    if(analysisResults.isMaxDrawdownLess && analysisResults.isNetProfitGreater && analysisResults.sharpRatio>=0.1){
      console.log("All three conditions met");
      analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold);
      console.log(`Analysis results: ${analysisResults}`);
      await downloadFiles();
    }else{
      while(!(analysisResults.isMaxDrawdownLess && analysisResults.isSharpRatioGreater)){
        console.log("Increasing sharpe ratio in while loop");
        // Change sharp ratio
        currentSRthreshold = currentSRthreshold + SRincrement;
        await updateSharpRatio(currentSRthreshold);
        analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold);
        console.log(analysisResults);

      }
      analysisResults = await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold);
      if(analysisResults.netProfit<50000){
        console.log("Passed while loop");
        await downloadFiles();
        await clearPortfolio();
        await clearCollection();
        await uploadFiles(collectionDownloadPath);

        // Change sharp ratio in acceptance criteria
        await changeSharpRatioAcceptanceCriteria();
        await page.waitForSelector('#eas-navbar-tools-link');
        await page.click('#eas-navbar-tools-link');
        await page.waitForSelector('#eas-navbar-acceptance-criteria-link');
        await page.click('#eas-navbar-acceptance-criteria-link');

        await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').click();
        await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').press('Control+Shift+ArrowLeft');
        await page.locator('div').filter({ hasText: /^Minimum Sharpe ratio$/ }).getByRole('spinbutton').fill('1.01');
        
      }else{
        await downloadFiles();
      }
    }
}


  await initialSetup();
  await uploadCollection(collectionDownloadPath);
  await addAllCollections();
  await getCollectionNumber();
  console.log(await analyzeBacktestResults3(page,NPthreshold,maxDrawdownThreshold,SRthreshold));
  await strategyThree(page);
  
    
})();