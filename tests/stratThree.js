async function strategyThree(page) {
    async function analyzeBacktestResults2(page, NPthreshold, maxDrawdownThreshold, SRthreshold) {
      // Your analyzeBacktestResults2 function implementation
    }
  
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
      // Export portfolio
      // Download unfiltered collection
      // Uncheck performance filters
      // Download unfiltered collection again
    } else {
      // Criteria not met, perform the steps you've described in scenario 'e'
      // Download filtered collection
      // Delete portfolio and collection
      // Upload the downloaded collection
      // Adjust sharp ratio in acceptance criteria
      // Check other settings
      // Start the reactor
    }
  }
  
  