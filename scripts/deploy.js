#!/usr/bin/env node

const { execSync } = require("node:child_process");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const CLOUD_FLARE_URL = "https://redhorse-assembly-builder-prototype.pages.dev/assembly";
const DEFAULT_PROJECT = "redhorse-assembly-builder-prototype";

const run = (command, options = {}) => {
  return execSync(command, { stdio: "inherit", ...options });
};

const output = (command) => {
  return execSync(command, { encoding: "utf8" }).trim();
};

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return undefined;
};

const getTrailingMessage = () => {
  const markerIndex = process.argv.indexOf("--");
  if (markerIndex >= 0 && process.argv.length > markerIndex + 1) {
    return process.argv.slice(markerIndex + 1).join(" ").trim();
  }
  return undefined;
};

const ensureClean = () => {
  const status = output("git status --porcelain");
  if (status.length > 0) {
    console.error("\nUncommitted changes detected. Aborting deploy.\n");
    run("git status -sb");
    run("git --no-pager diff");
    process.exit(1);
  }
};

const runBuild = () => {
  console.log("\nRunning Cloudflare build guard...\n");
  run("npm run build:cf");
};

const commitChanges = async () => {
  const messageArg = getArgValue("--message") || getTrailingMessage();
  let message = messageArg;

  if (!message) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    message = (await rl.question("Commit message: ")).trim();
    rl.close();
  }

  if (!message) {
    console.error("Commit message is required.");
    process.exit(1);
  }

  run("git add -A");
  const staged = output("git diff --cached --name-only");
  if (!staged) {
    console.error("No changes staged to commit.");
    process.exit(1);
  }
  run(`git commit -m "${message.replace(/\"/g, '\\"')}"`);
};

const pushChanges = () => {
  ensureClean();
  run("git push origin main");
};

const printStatus = () => {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || DEFAULT_PROJECT;

  if (!token) {
    console.log("\nCLOUDFLARE_API_TOKEN is not set.");
    console.log("Create a Cloudflare API token with Pages read access and set it in .env.local:");
    console.log("  CLOUDFLARE_API_TOKEN=your_token_here\n");
    console.log("Then run:\n  npx wrangler pages deployment list --project-name " + projectName);
    return;
  }

  console.log("\nFetching latest Pages deployment status...\n");
  try {
    const json = output(
      `npx wrangler pages deployment list --project-name ${projectName} --format json`,
    );
    const deployments = JSON.parse(json);
    if (!Array.isArray(deployments) || deployments.length === 0) {
      console.log("No deployments found.");
      return;
    }
    const latest = deployments[0];
    console.log(`Latest deployment: ${latest.id}`);
    console.log(`Status: ${latest.status}`);
    if (latest.created_on) {
      console.log(`Created: ${latest.created_on}`);
    }
    if (latest.url) {
      console.log(`URL: ${latest.url}`);
    }
  } catch (error) {
    console.error("Unable to fetch deployment status.");
    console.error(error.message);
  }
};

const main = async () => {
  const command = process.argv[2];

  if (!command || ["commit", "push", "deploy", "status"].indexOf(command) === -1) {
    console.log("Usage: node scripts/deploy.js <commit|push|deploy|status> [--message \"msg\"]");
    process.exit(1);
  }

  if (command === "commit") {
    await commitChanges();
    return;
  }

  if (command === "push") {
    pushChanges();
    console.log(`\nCloudflare Pages URL: ${CLOUD_FLARE_URL}`);
    return;
  }

  if (command === "deploy") {
    runBuild();
    await commitChanges();
    ensureClean();
    run("git push origin main");
    console.log(`\nCloudflare Pages URL: ${CLOUD_FLARE_URL}`);
    printStatus();
    return;
  }

  if (command === "status") {
    printStatus();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
