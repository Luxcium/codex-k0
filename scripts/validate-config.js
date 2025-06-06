#!/usr/bin/env node

/**
 * VS Code Copilot Configuration Validator
 *
 * This script validates that all required files are present and properly configured
 * for the GitHub Copilot Chat instruction system.
 */

import fs from 'fs';
import { parse as parseJsonc } from 'jsonc-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
void __dirname ;
// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Configuration files to check
const requiredFiles = [
  {
    path: '.github/instructions/commit-message.instructions.md',
    description: 'Commit message generation with Conventional Commits + Emojis'
  },
  {
    path: '.github/instructions/code-generation.instructions.md',
    description: 'TypeScript/JavaScript code generation best practices'
  },
  {
    path: '.github/instructions/test-generation.instructions.md',
    description: 'Jest and React Testing Library patterns'
  },
  {
    path: '.github/instructions/code-review.instructions.md',
    description: 'Comprehensive code review guidelines'
  },
  {
    path: '.github/instructions/pr-description.instructions.md',
    description: 'Pull request description templates'
  },
  {
    path: '.vscode/settings.json',
    description: 'VS Code configuration with Copilot Chat settings'
  }
];

// VS Code settings to validate
const requiredSettings = [
  'chat.promptFiles',
  'chat.instructionsFilesLocations',
  'chat.promptFilesLocations',
  'github.copilot.chat.codeGeneration.instructions',
  'github.copilot.chat.testGeneration.instructions',
  'github.copilot.chat.reviewSelection.enabled',
  'github.copilot.chat.reviewSelection.instructions',
  'github.copilot.chat.commitMessageGeneration.instructions',
  'github.copilot.chat.pullRequestDescriptionGeneration.instructions'
];

function printHeader() {
  console.log(colors.cyan + colors.bold + '🔍 VS Code Copilot Configuration Validator' + colors.reset);
  console.log(colors.cyan + '=============================================' + colors.reset);
  console.log();
}

function printSuccess(message) {
  console.log(colors.green + '✅ ' + message + colors.reset);
}

function printError(message) {
  console.log(colors.red + '❌ ' + message + colors.reset);
}

function printWarning(message) {
  console.log(colors.yellow + '⚠️  ' + message + colors.reset);
}

function printInfo(message) {
  console.log(colors.blue + 'ℹ️  ' + message + colors.reset);
}

function checkFileExists(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    const stats = fs.statSync(fullPath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

function checkFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { exists: true, content };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

function validateInstructionFile(filePath) {
  const result = checkFileContent(filePath);

  if (!result.exists) {
    return { valid: false, error: 'File not found' };
  }

  // Check for Markdown content (should start with a header)
  const hasHeader = result.content.match(/^#\s+[^\n]+/m);
  const hasContent = result.content.trim().length > 0;

  return {
    valid: hasHeader && hasContent,
    hasHeader: !!hasHeader,
    hasContent,
    content: result.content
  };
}

function validateVSCodeSettings() {
  const settingsPath = '.vscode/settings.json';

  if (!checkFileExists(settingsPath)) {
    return { valid: false, error: 'settings.json not found' };
  }

  try {
    const content = fs.readFileSync(settingsPath, 'utf8');
    const settings = parseJsonc(content);

    const missingSettings = requiredSettings.filter(setting => {
      const keys = setting.split('.');
      let current = settings;

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return true; // Missing
        }
      }
      return false; // Found
    });

    // Check if instruction file paths are correct
    const instructionErrors = [];

    // Validate instruction arrays for each agent
    const agentSettings = [
      'github.copilot.chat.codeGeneration.instructions',
      'github.copilot.chat.testGeneration.instructions',
      'github.copilot.chat.reviewSelection.instructions',
      'github.copilot.chat.commitMessageGeneration.instructions',
      'github.copilot.chat.pullRequestDescriptionGeneration.instructions'
    ];

    for (const agentSetting of agentSettings) {
      if (settings[agentSetting]) {
        const instructions = settings[agentSetting];
        if (Array.isArray(instructions)) {
          for (const instruction of instructions) {
            if (instruction.file) {
              if (!checkFileExists(instruction.file)) {
                instructionErrors.push(`${agentSetting} file not found: ${instruction.file}`);
              }
            } else if (!instruction.text) {
              instructionErrors.push(`${agentSetting} instruction object missing both 'file' and 'text' properties`);
            }
          }
        } else {
          instructionErrors.push(`${agentSetting} should be an array of instruction objects`);
        }
      }
    }

    return {
      valid: missingSettings.length === 0 && instructionErrors.length === 0,
      missingSettings,
      instructionErrors,
      settings
    };
  } catch (error) {
    return { valid: false, error: `Invalid JSONC: ${error.message}` };
  }
}

function validateGitRepository() {
  return checkFileExists('.git') || checkFileExists('.git/config');
}

function validateNodeModules() {
  return checkFileExists('node_modules') || checkFileExists('package.json');
}

async function runValidation() {
  printHeader();

  let allValid = true;

  // Check Git repository
  console.log(colors.bold + '📁 Repository Structure' + colors.reset);
  if (validateGitRepository()) {
    printSuccess('Git repository detected');
  } else {
    printWarning('No Git repository found (optional)');
  }

  try {
    await import('jsonc-parser');
    printSuccess('Dependencies installed');
  } catch (e) {
    printError('Missing dependencies - run npm install first');
    process.exit(1);
  }
  console.log();

  // Check required files
  console.log(colors.bold + '📄 Required Files' + colors.reset);
  for (const file of requiredFiles) {
    if (checkFileExists(file.path)) {
      printSuccess(`${file.path} - ${file.description}`);
    } else {
      printError(`${file.path} - ${file.description}`);
      allValid = false;
    }
  }
  console.log();

  // Validate instruction files
  console.log(colors.bold + '🎯 Instruction File Validation' + colors.reset);
  const instructionFiles = requiredFiles.filter(f => f.path.includes('.instructions.md'));

  for (const file of instructionFiles) {
    if (checkFileExists(file.path)) {
      const validation = validateInstructionFile(file.path);

      if (validation.valid) {
        printSuccess(`${file.path} has valid Markdown structure`);
      } else {
        if (!validation.hasContent) {
          printError(`${file.path} is empty or missing content`);
          allValid = false;
        }
        if (!validation.hasHeader) {
          printError(`${file.path} is missing Markdown headers`);
          allValid = false;
        }
      }
    }
  }
  console.log();

  // Validate VS Code settings
  console.log(colors.bold + '⚙️  VS Code Settings Validation' + colors.reset);
  const settingsValidation = validateVSCodeSettings();

  if (settingsValidation.valid) {
    printSuccess('VS Code settings.json is properly configured');
  } else {
    if (settingsValidation.error) {
      printError(`VS Code settings error: ${settingsValidation.error}`);
    }

    if (settingsValidation.missingSettings && settingsValidation.missingSettings.length > 0) {
      printError('Missing required settings:');
      settingsValidation.missingSettings.forEach(setting => {
        console.log(`  - ${setting}`);
      });
    }

    if (settingsValidation.instructionErrors && settingsValidation.instructionErrors.length > 0) {
      settingsValidation.instructionErrors.forEach(error => {
        printError(error);
      });
    }

    allValid = false;
  }
  console.log();

  // Summary
  console.log(colors.bold + '📊 Validation Summary' + colors.reset);
  if (allValid) {
    printSuccess('All validation checks passed! Your configuration is ready to use.');
    console.log();
    printInfo('Next steps:');
    console.log('  1. Restart VS Code or reload the window');
    console.log('  2. Open Copilot Chat (Ctrl+Shift+P → "Copilot Chat: Open Chat")');
    console.log('  3. Try generating a commit message or code');
  } else {
    printError('Some validation checks failed. Please fix the issues above.');
    console.log();
    printInfo('Common fixes:');
    console.log('  1. Ensure all files are copied to the correct locations');
    console.log('  2. Check that .vscode/settings.json has the correct content');
    console.log('  3. Verify instruction files have proper Markdown headers (#)');
    console.log('  4. Run npm install to get required dependencies');
  }
  console.log();
  console.log(colors.cyan + 'For more help, see the README.md file.' + colors.reset);
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().catch(console.error);
}

export {
  checkFileExists, runValidation, validateInstructionFile,
  validateVSCodeSettings
};
