#!/usr/bin/env node

const { program } = require('commander');
const TestGenerator = require('../src/core/generator');
const path = require('path');

program
  .version('1.0.0')
  .argument('<component-path>', 'Path to the component to generate tests for')
  .action(async (componentPath) => {
    try {
      const absolutePath = path.resolve(process.cwd(), componentPath);
      const generator = new TestGenerator(absolutePath);
      await generator.generate();
      console.log('✅ Test file generated successfully！');
    } catch (error) {
      console.error('❌ Error generating test file:', error);
      process.exit(1);
    }
  });

program.parse(process.argv); 