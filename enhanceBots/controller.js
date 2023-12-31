const { spawn } = require('child_process');

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runScripts() {
  // const scriptFiles = ['scratchBots/script.js'];
  const scriptFiles = ['enhanceBots/eScriptPF.js', 'enhanceBots/eScriptPF1.js','enhanceBots/eScriptPF2.js'];

  for (const file of scriptFiles) {
    console.log(`Running ${file}...`);
    const scriptProcess = spawn('node', [file], {
      stdio: ['inherit', 'inherit', 'inherit'],
    });

    scriptProcess.on('error', (err) => {
      console.error(`Error running ${file}:`, err);
    });

    await delay(15000); // Replace the number with the desired delay in milliseconds before running the next script.
  }
}

runScripts();
