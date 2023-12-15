#!/usr/bin/env node

// Usage: npx create-my-template my-app

const fs = require("fs");
const path = require("path");
// const inquirer = require("inquirer");

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();

const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });


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
  },
  {
    type: "input",
    name: "username",
    message: "Git username",
    validate: (name) => typeof name === "string",
  },
];

async function packagePrompts() {
  const inquirer = await import("inquirer");
  const answers = await inquirer.createPromptModule(questions)

  // Update the project's package.json with the answers
  const packageJsonPath = path.join(projectDir, "../package.json");
  if (fs.existsSync(packageJsonPath)) {
    const projectPackageJson = require(packageJsonPath);
    projectPackageJson.name = answers.name;
    projectPackageJson.author = answers.author;
    projectPackageJson.description = answers.description;
    projectPackageJson.repository = `https://github.com/${answers.username}/${answers.name}.git`;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(projectPackageJson, null, 2)
    );
  } else {
    console.error("Error: package.json not found.");
  }
}

async function run() {
  await packagePrompts();


  /** A common approach to building a starter template is to
  create a `template` folder which will house the template
  and the files we want to create.*/
  const templateDir = path.resolve(__dirname, "../");
  fs.cpSync(templateDir, projectDir, { recursive: true });

  //delete this file
  fs.unlink(`${projectDir}/bin/index.js`, (err) => {
    if (err) throw err;
  });

  console.log("Success! Your new project is ready.");
  console.log(`Created ${projectName} at ${projectDir}`);
}

run();