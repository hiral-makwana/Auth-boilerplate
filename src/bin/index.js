#!/usr/bin/env node

async function createReadme(answers, projectDir) {
    const readmeContent = `# ${answers.name}

## Project Description
${answers.description}`;

    const readmePath = path.join(projectDir, "README.md");
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
}

const util = require('util');
const path = require('path');
const fs = require('fs');
const inquirer = require("inquirer");
const { createReadme } = require('./readme');

// Utility functions
const exec = util.promisify(require('child_process').exec);

async function runCmd(command) {
    try {
        const { stdout, stderr } = await exec(command);
        //console.log(stdout);
        console.log(stderr);
    } catch {
        (error) => {
            console.log(error);
        };
    }
}
async function hasYarn() {
    try {
        await execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Validate arguments
if (process.argv.length < 3) {
    console.log('Please specify the target project directory.');
    console.log('For example:');
    console.log('    npx create-nodejs-app my-app');
    console.log('    OR');
    console.log('    npm init nodejs-app my-app');
    process.exit(1);
}

// Define constants
const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/hiral-makwana/NodeAuthBase-JS.git';

// Check if directory already exists
try {
    fs.mkdirSync(appPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log('Directory already exists. Please choose another name for the project.');
    } else {
        console.log(error);
    }
    process.exit(1);
}

// Prompts
const questions = [
    {
        type: "input",
        name: "name",
        message: "Name of the project",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "author",
        message: "Name of the author",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "description",
        message: "Description",
        validate: (name) => typeof name === "string",
    }
];

async function packagePrompts() {
    return await inquirer.prompt(questions);
}

async function setup() {
    try {
        const answers = await packagePrompts();
        // Clone repo
        console.log(`Downloading files from repo ${repo}`);
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
        console.log('Cloned successfully.');
        console.log('');

        // Change directory
        process.chdir(appPath);

        // Install dependencies
        const useYarn = await hasYarn();
        console.log('Installing dependencies...');
        if (useYarn) {
            await runCmd('yarn install');
        } else {
            await runCmd('npm install');
        }
        console.log('Dependencies installed successfully.');
        console.log();

        // Read the existing package.json file
        const packageJsonPath = path.join(appPath, "package.json");
        const existingPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        // Update the properties with answers
        existingPackageJson.name = answers.name;
        existingPackageJson.author = answers.author;
        existingPackageJson.description = answers.description;
        existingPackageJson.version = "1.0.0";

        // Write the updated package.json file
        fs.writeFileSync(packageJsonPath, JSON.stringify(existingPackageJson, null, 2));

        await createReadme(answers, appPath);

        console.log('Installation is now complete!');
        console.log();

        console.log('We suggest that you start by typing:');
        console.log(`    cd ${folderName}`);
        console.log(useYarn ? '    yarn dev' : '    npm run dev');
    } catch (error) {
        console.log(error);
    }
}

setup();