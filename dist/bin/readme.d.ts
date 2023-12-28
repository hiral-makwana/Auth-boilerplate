interface Answers {
    name: string;
    description: string;
}
declare function createReadme(answers: Answers, projectDir: string): Promise<void>;
export { createReadme };
