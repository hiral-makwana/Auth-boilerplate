#!/usr/bin/env node

// Usage: npx create-my-template my-app

const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");

// The first argument will be the project name.
const projectName = process.argv[2];
//console.log(projectName)
// Create a project directory with the project name.
const currentDir = process.cwd();
//console.log(currentDir)
const projectDir = path.resolve(currentDir, projectName);
//console.log(projectDir)
fs.mkdirSync(projectDir, { recursive: true });

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const templateDir = path.resolve(__dirname, "./");
//console.log(templateDir)
fs.cpSync(templateDir, projectDir, { recursive: true });

const projectPackageJson = require(path.join(projectDir, "package.json"));
//console.log(projectPackageJsonPath)
// Update the project's package.json with the new project name
projectPackageJson.name = projectName;
projectPackageJson.description = "";
projectPackageJson.main = "";
projectPackageJson.bin = {};
projectPackageJson.files = [];
projectPackageJson.repository = "";
//console.log(projectPackageJson)
fs.writeFileSync(
  path.join(projectDir, "package.json"),
  JSON.stringify(projectPackageJson, null, 2)
);


//delete this file
const indexPath = path.join(__dirname, 'index.js')
//console.log(indexPath)
fs.unlink(indexPath, (err) => {
  if (err) throw err;
});
console.log("Success! Your new project is ready.");
console.log(`Created ${projectName} at ${projectDir}`);
