import arg from 'arg';
import inquierer from 'inquirer'
import { createProject } from './main'

function parseArguments(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean
        },
        {
            argv: rawArgs.slice(2)
        }
    );

    return {
        skipPromps: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        projectName: "",
    }
}

async function promptForMissingOptions(options) {
    const defaultTemplate = "javascript";

    if(options.skipPromps) {
        return {
            ...options,
            template: options.template || defaultTemplate,
            projectName: "my-next-app",
        }
    }

    const questions = [];
    if(!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Which language do you prefer?',
            choices: ["Typescript", "Javascript"],
            default: defaultTemplate
        })
    }

    if(!options.git) {
        questions.push({
            type: "confirm",
            name: "git",
            message: "Initialise a git repository?",
            default: true
        })
    }

    if(!options.projectName) {
        questions.push({
            type: "input",
            name: "projectName",
            message: "What do you wish to call the project?",
            default: "my-next-app"
        })
    }

    const answers = await inquierer.prompt(questions);

    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
        projectName: options.projectName || answers.projectName
    }
} 

export async function cli(args) {
    let options = parseArguments(args);
    options = await promptForMissingOptions(options);

    await createProject(options);
}