const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: "msedge"
  });
  const context = await browser.newContext({
    storageState: 'auth.json'
  });
  const page = await context.newPage();
  await page.goto('https://expert-advisor-studio.com/');
  await page.getByLabel('Theme').selectOption('dark');
  await page.getByRole('link', { name: 'Open the Generator, the Reactor, or the Validator' }).click();
  await page.getByRole('link', { name: 'Reactor', exact: true }).click();
  
  // Change the Data Source, Symbol and Period here
  await page.getByLabel('Data source').selectOption('FXView-Demo');
  await page.getByLabel('Symbol').selectOption('USDSGD');
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
  await page.getByLabel('Start date', { exact: true }).fill('2022-08-03');
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
  await page.getByRole('button', { name: 'Start' }).click();
  await page.setViewportSize({ width: 500, height: 250});
  await page.getByRole('button', { name: 'Confirm' }).click();
  
  // await context.setGeolocation({latitude:0,longitude:0});

  // Zoom in and out of the window
  // await page.evaluate(() => {
  //   const currentZoom = parseFloat(window.getComputedStyle(document.documentElement).zoom);
  //   const newZoom = currentZoom - 0.8;
  //   document.documentElement.style.zoom = newZoom;
  // });

  // ---------------------
//   await context.close();
//   await browser.close();
})();