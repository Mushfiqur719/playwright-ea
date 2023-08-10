const { spawn } = require('child_process');

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runScripts() {
  const scriptFiles = ['tests/script.js'];
  // const scriptFiles = ['tests/script.js', 'tests/script1.js','tests/script2.js', 'tests/script3.js'];

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
