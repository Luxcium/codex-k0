#!/usr/bin/env node

/**
 * VS Code Copilot Configuration Validator
 *
 * This script validates that all required files are present and properly configured
 * for the GitHub Copilot Chat instruction system.
 */

const fs = require('fs');
const path = require('path');

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
  'github.copilot.chat.codeGeneration.useInstructionFiles',
  'chat.instructionsFilesLocations',
  'github.copilot.chat.codeGeneration.instructions',
  'github.copilot.chat.commitMessageGeneration.instructions'
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

function checkFileContent(filePath, requiredContent = []) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const missing = requiredContent.filter(item => !content.includes(item));
    return { exists: true, content, missing };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

function validateInstructionFile(filePath) {
  const result = checkFileContent(filePath, ['---', 'applyTo:']);

  if (!result.exists) {
    return { valid: false, error: 'File not found' };
  }

  const hasYamlFrontMatter = result.content.startsWith('---');
  const hasApplyTo = result.content.includes('applyTo:');

  return {
    valid: hasYamlFrontMatter && hasApplyTo,
    hasYamlFrontMatter,
    hasApplyTo,
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
    const settings = JSON.parse(content);

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

    if (settings['github.copilot.chat.codeGeneration.instructions']) {
      const codeGenInstructions = settings['github.copilot.chat.codeGeneration.instructions'];
      if (Array.isArray(codeGenInstructions) && codeGenInstructions.length > 0) {
        const filePath = codeGenInstructions[0].file;
        if (!checkFileExists(filePath)) {
          instructionErrors.push(`Code generation instruction file not found: ${filePath}`);
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
    return { valid: false, error: `Invalid JSON: ${error.message}` };
  }
}

function validateGitRepository() {
  const gitPath = '.git';
  return checkFileExists(gitPath) || checkFileExists('.git/config');
}

function validateNodeModules() {
  return checkFileExists('node_modules') || checkFileExists('package.json');
}

function runValidation() {
  printHeader();

  let allValid = true;

  // Check Git repository
  console.log(colors.bold + '📁 Repository Structure' + colors.reset);
  if (validateGitRepository()) {
    printSuccess('Git repository detected');
  } else {
    printWarning('No Git repository found (optional)');
  }

  if (validateNodeModules()) {
    printSuccess('Node.js project detected');
  } else {
    printWarning('No Node.js project detected (optional)');
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
        printSuccess(`${file.path} has valid YAML front matter`);
      } else {
        if (!validation.hasYamlFrontMatter) {
          printError(`${file.path} missing YAML front matter (---)`);
          allValid = false;
        }
        if (!validation.hasApplyTo) {
          printError(`${file.path} missing 'applyTo:' directive`);
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
    console.log('  3. Verify instruction files have YAML front matter (---)');
  }

  console.log();
  console.log(colors.cyan + 'For more help, see the README.md file.' + colors.reset);

  // Exit with appropriate code
  process.exit(allValid ? 0 : 1);
}

// Run validation if called directly
if (require.main === module) {
  runValidation();
}

module.exports = {
  runValidation,
  checkFileExists,
  validateInstructionFile,
  validateVSCodeSettings
};
