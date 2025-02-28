# React Jest 测试脚本生成器

本项目作为React项目的子目录，用于自动生成Jest测试脚本。

## 功能特点
- 自动分析React组件结构
- 生成基础Jest测试用例
- 支持组件属性测试
- 支持事件处理测试
- 支持异步操作测试

## 项目结构

```
ut-generator/
├── src/
│ ├── core/ # 核心解析和生成逻辑
│ ├── templates/ # 测试用例模板
│ └── utils/ # 工具函数
├── bin/ # CLI工具
└── package.json
```

使用说明：

1. 首先安装依赖：
```
cd ut-generator
npm install
node bin/generate.js src/components/YourComponent.jsx
```


这个基础项目提供了：
1. 自动分析React组件结构
2. 提取组件的方法和属性
3. 生成基础的Jest测试用例
4. 支持JSX和TypeScript

你可以根据需要扩展以下功能：
1. 添加更多测试模板
2. 支持更复杂的组件分析
3. 添加配置文件支持
4. 增加测试覆盖率检查