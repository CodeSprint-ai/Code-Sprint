#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const program = new Command();

// Utility to copy files/directories with template replacement
function copyDirectory(src, dest, name = '') {
  if (!fs.existsSync(src)) {
    console.error(chalk.red(`readdir error: ${src} does not exist`));
    return;
  }

  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file.replace(/{{name}}/g, name));
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, name);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/{{name}}/g, name);
      fs.writeFileSync(destPath, content);
    }
  });
}

// Utility to detect existing ORMs
function getInstalledOrm() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (deps['@prisma/client']) return 'prisma';
  if (deps['mongoose']) return 'mongoose';
  if (deps['typeorm']) return 'typeorm';

  return null;
}

// Create a new NestJS project and inject common module
program
  .command('new <name>')
  .description('Generate a new NestJS project')
  .action((name) => {
    console.log(chalk.blue(`Creating NestJS project: ${name}`));
    exec(`npx @nestjs/cli new ${name} --skip-install`, (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red(`Nest CLI failed: ${err.message}`));
        return;
      }

      console.log(stdout);
      const projectPath = path.join(process.cwd(), name);
      const commonPath = path.join(__dirname, 'templates', 'common');
      const targetPath = path.join(projectPath, 'src', 'common');

      console.log(chalk.yellow('Injecting common module...'));
      copyDirectory(commonPath, targetPath, 'common');

      exec(`cd ${name} && npm install`, (err2) => {
        if (err2) console.error(chalk.red('npm install failed'));
        else console.log(chalk.green(`✅ Project "${name}" created with common module.`));
      });
    });
  });

// Generate module like Angular style
program
  .command('generate:module <name>')
  .alias('g:m')
  .description('Generate a new module')
  .action((name) => {
    console.log(chalk.blue(`Generating module ${name}...`));
    const templatePath = path.join(__dirname, 'templates', 'module');
    const outputPath = path.join(process.cwd(), 'src', name);
    copyDirectory(templatePath, outputPath, name);
    console.log(chalk.green(`✅ Module "${name}" created.`));
  });

// Add Prisma ORM
program
  .command('add:prisma')
  .description('Add Prisma ORM support')
  .action(() => {
    const orm = getInstalledOrm();
    if (orm) return console.log(chalk.red(`❌ ${orm} already installed. Cannot add Prisma.`));

    console.log(chalk.blue('Installing Prisma...'));
    exec('npm install prisma @prisma/client', (err) => {
      if (err) return console.error(chalk.red('Failed to install Prisma'));

      const prismaDir = path.join(process.cwd(), 'prisma');
      const prismaSrcDir = path.join(process.cwd(), 'src', 'prisma');
      fs.mkdirSync(prismaDir, { recursive: true });
      fs.mkdirSync(prismaSrcDir, { recursive: true });

      copyDirectory(path.join(__dirname, 'templates/prisma'), prismaDir);
      copyDirectory(path.join(__dirname, 'templates/prisma'), prismaSrcDir);

      // Write .env
      const envPath = path.join(process.cwd(), '.env');
      if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n');
      }

      console.log(chalk.green('✅ Prisma setup complete.'));
    });
  });

// Add Mongoose ORM
program
  .command('add:mongoose')
  .description('Add Mongoose (MongoDB) support')
  .action(() => {
    const orm = getInstalledOrm();
    if (orm) return console.log(chalk.red(`❌ ${orm} already installed. Cannot add Mongoose.`));

    console.log(chalk.blue('Installing Mongoose...'));
    exec('npm install @nestjs/mongoose mongoose', (err) => {
      if (err) return console.error(chalk.red('Failed to install Mongoose'));

      const schemaDir = path.join(process.cwd(), 'src', 'schemas');
      fs.mkdirSync(schemaDir, { recursive: true });

      copyDirectory(path.join(__dirname, 'templates/mongoose'), schemaDir);
      console.log(chalk.green('✅ Mongoose setup complete.'));
    });
  });

// Add TypeORM (PostgreSQL)
program
  .command('add:typeorm')
  .description('Add TypeORM (PostgreSQL) support')
  .action(() => {
    const orm = getInstalledOrm();
    if (orm) return console.log(chalk.red(`❌ ${orm} already installed. Cannot add TypeORM.`));

    console.log(chalk.blue('Installing TypeORM...'));
    exec('npm install typeorm pg @nestjs/typeorm', (err) => {
      if (err) return console.error(chalk.red('Failed to install TypeORM'));

      const entityDir = path.join(process.cwd(), 'src', 'entities');
      fs.mkdirSync(entityDir, { recursive: true });

      copyDirectory(path.join(__dirname, 'templates/typeorm'), entityDir);

      const envPath = path.join(process.cwd(), '.env');
      if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n');
      }

      console.log(chalk.green('✅ TypeORM setup complete.'));
    });
  });

program.parse(process.argv);
