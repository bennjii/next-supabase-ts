import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import execao from 'execa-output';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    });
}

async function copyPublicFiles(options) {
    return copy(`${options.templateDirectory}/public`, `${options.targetDirectory}/${options.projectName}/public`, {
        clobber: false
    });
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: `${options.targetDirectory}/${options.projectName}`
    });

    if(result.failed) {
        return Promise.reject(new Error('Failed to initialize Git'))
    }

    return;
}

async function createNextApp(options) {
    const result = await execao('npx', ['create-next-app', options.projectName, (options.template.toLowerCase() == 'typescript') ? '--ts' : ''], {
        cwd: options.targetDirectory
    });

    if(result.failed) {
        return Promise.reject(new Error('Failed to create next app'))
    }

    return;
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };

    const relativeDirectory = new URL(import.meta.url).pathname;
    
    const templateDir = path.resolve(
        relativeDirectory.substring(1, relativeDirectory.length),
        `../../templates/${options.template.toLowerCase()}`
    );

    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK)
    } catch(err) {
        console.error(`${chalk.red.bold("ERROR")} Invalid Template Name`);
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: "Create Next App",
            task: () => execao('npx', ['create-next-app', options.projectName, (options.template.toLowerCase() == 'typescript') ? '--ts' : ''], {
                cwd: options.targetDirectory
            }),
        },
        {
            title: "Install Supabase",
            task: () => execao('npm', ['install', '@supabase/supabase-js'], {
                cwd: `${options.targetDirectory}/${options.projectName}`
            }),
        },
        {
            title: "Initialize Git",
            task: () => initGit(options),
            enabled: () => options.git
        }
    ]);

    await tasks.run();

    console.log(`${chalk.green.bold("DONE")} Project Ready`);
    console.log(`\n\trun ${chalk.greenBright.cyan(`cd ./${options.projectName}`)}`)
    console.log(`\n\tand use ${chalk.greenBright.cyan(`npm run dev`)} or ${chalk.greenBright.cyan(`yarn dev`)} to start.`)
    return true;
}