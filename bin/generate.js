#!/usr/bin/env node

const { program } = require('commander');
const TestGenerator = require('../src/core/generator');
const path = require('path');

program
  .version('1.0.0')
  .argument('<component-path>', '要生成测试的组件路径')
  .action(async (componentPath) => {
    try {
      const absolutePath = path.resolve(process.cwd(), componentPath);
      const generator = new TestGenerator(absolutePath);
      await generator.generate();
      console.log('✅ 测试文件生成成功！');
    } catch (error) {
      console.error('❌ 生成测试文件时出错:', error);
      process.exit(1);
    }
  });

program.parse(process.argv); 