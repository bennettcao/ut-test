# React Jest Test Script Generator

This project serves as a subdirectory of React projects, used for automatically generating Jest test scripts.

## Features
- Automatically analyze React component structure
- Generate basic Jest test cases
- Support component props testing
- Support event handling testing
- Support async operation testing

## Project Structure

```
ut-generator/
├── src/
│ ├── core/ # Core parsing and generation logic
│ ├── templates/ # Test case templates
│ └── utils/ # Utility functions
├── bin/ # CLI tools
└── package.json
```

Usage Instructions:

1. First install dependencies:
```
cd ut-generator
npm install
node bin/generate.js src/components/YourComponent.jsx
```


This base project provides:
1. Automatic analysis of React component structure
2. Extraction of component methods and props
3. Generation of basic Jest test cases
4. Support for JSX and TypeScript

You can extend the following features as needed:
1. Add more test templates
2. Support more complex component analysis
3. Add configuration file support
4. Add test coverage checking