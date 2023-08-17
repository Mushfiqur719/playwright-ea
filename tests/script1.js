const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: "msedge",
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
  await page.getByLabel('Symbol').selectOption('USDCAD');
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
  await page.getByLabel('Working minutes').fill('720');
  await page.getByRole('link', { name: 'Data', exact: true }).click();
  await page.getByRole('link', { name: 'Data Horizon' }).click();
  await page.getByLabel('Maximum data bars').click();
  await page.getByLabel('Maximum data bars').press('Control+a');
  await page.getByLabel('Maximum data bars').fill('200000');
  await page.getByLabel('Start date', { exact: true }).fill('2022-08-11');
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

  // <-----------------------Validating Strategies------------------------->


  // <--------------------Scenario 1: Strategies < 30---------------------->
  await page.waitForTimeout(1000*60*60*0.3); // 12 hours after reactors been running

  // Get the value from collection notification
  const producedStrategies = await page.$eval('#eas-collection-notification', element => element.textContent.trim());

  if (producedStrategies <= 30) {
    console.log("No. of strategies produced: ", producedStrategies);
  } else {
    console.log("No. of strategies produced: ", producedStrategies);
  }

  // <-----------------------Add strategies to Portfolio and do checkup; After 12 hours------------------------->
  // await page.waitForTimeout(1000*60*60*12); // 12 hours

  await page.waitForSelector('#eas-navbar-collection-link');
  await page.click('#eas-navbar-collection-link');
  await page.waitForTimeout(3000);
  
  await page.getByRole('button', { name: '+ Portfolio' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('link', { name: 'Add all' }).click();
  await page.waitForTimeout(3000);
  await page.waitForSelector('#eas-navbar-portfolio-link');
  await page.click('#eas-navbar-portfolio-link');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Calculate' }).click();

  // <-----------------------After adding to the collection check NetProfit,MaxDrawdown,SharpRatio------------------------->
  
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

    //Export the portfolio and download the unfiltered collection
    await page.waitForSelector('#portfolio-toolbar-export');
    await page.click('#portfolio-toolbar-export');
    await page.waitForSelector('#export-portfolio-expert-mt5');
    await page.click('#export-portfolio-expert-mt5');
  

  // if(SharpRatio>SRthreshold && MaxDrawdownPercentValue>MDthreshold && netProfitValue>NPthreshold){
  //   //<-----------------Section 1-------------------->
  //   //Export the portfolio and download the unfiltered collection
  //   await page.waitForSelector('#portfolio-toolbar-export');
  //   await page.click('#portfolio-toolbar-export');
  //   await page.waitForSelector('#export-portfolio-expert-mt5');
  //   await page.click('#export-portfolio-expert-mt5');

  //   //<-----------------Section 2-------------------->
  //   //Verify in the downloads folder that both files for that currency pair and time frame are downloaded
  //   // const expectedFileName1 = 'your-expected-file-name1.extension';
  //   // const expectedFileName2 = 'your-expected-file-name2.extension';
  //   // const downloadDirectory = 'path-to-your-download-directory';

  //   // // Wait for a reasonable time for the download to complete
  //   // await page.waitForTimeout(10000); // Adjust the timeout as needed

  //   // // Check if both expected files are downloaded
  //   // const file1Downloaded = fs.existsSync(path.join(downloadDirectory, expectedFileName1));
  //   // const file2Downloaded = fs.existsSync(path.join(downloadDirectory, expectedFileName2));

  //   // if (file1Downloaded && file2Downloaded) {
  //   //     console.log('Both files have been downloaded successfully.');
  //   // } else {
  //   //     console.log('One or both files might have failed to download.');
  //   // }
    
  //   //<-----------------Section 3-------------------->
  //   //Now, Delete the portfolio and collection
  //   await page.waitForSelector('#remove-all-button');
  //   await page.click('#remove-all-button');
  //   // Go to collection page
  //   await page.waitForSelector('#eas-navbar-collection-link');
  //   await page.click('#eas-navbar-collection-link');
  //   // Clear collections
  //   await page.waitForSelector('#remove-all-button');
  //   await page.click('#remove-all-button')
    
  // }else{
  //   //Check performance filters
  // }
  


  // <---------Uncomment below if browser needed to be closed------------>
  // await context.close();
  // await browser.close();
})();