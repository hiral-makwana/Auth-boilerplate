import * as fs from "fs";
import * as path from "path";

interface Answers {
    name: string;
    description: string;
}

async function createReadme(answers: Answers, projectDir: string): Promise<void> {
    const readmeContent = `# ${answers.name}

## Project Description
${answers.description}`;

    const readmePath = path.join(projectDir, "README.md");
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
}

export { createReadme };
