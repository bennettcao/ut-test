const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');

class TestGenerator {
  constructor(componentPath) {
    this.componentPath = componentPath;
  }

  async generate() {
    const content = fs.readFileSync(this.componentPath, 'utf-8');
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const componentInfo = this.analyzeComponent(ast);
    const testContent = this.generateTest(componentInfo);

    // Create __tests__ directory if it doesn't exist
    const componentDir = path.dirname(path.join(this.componentPath, '../..', '__tests__'));
    const testDir = path.join(componentDir, '__tests__');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }

    // Generate test file in __tests__ directory
    const componentFileName = path.basename(this.componentPath);
    const testPath = path.join(testDir, componentFileName.replace(/\.(jsx?|tsx?)$/, '.test.$1'));
    fs.writeFileSync(testPath, testContent);
  }

  analyzeComponent(ast) {
    const componentInfo = {
      name: '',
      props: [],
      methods: [],
      isClass: false
    };

    traverse(ast, {
      ClassDeclaration(path) {
        componentInfo.name = path.node.id.name;
        componentInfo.isClass = true;
      },
      FunctionDeclaration(path) {
        if (!componentInfo.name) {
          componentInfo.name = path.node.id.name;
        }
      },
      // Add support for arrow function components
      VariableDeclarator(path) {
        if (path.node.init && 
            (path.node.init.type === 'ArrowFunctionExpression' || 
             path.node.init.type === 'FunctionExpression')) {
          componentInfo.name = path.node.id.name;
        }
      },
      ObjectPattern(path) {
        // Collecting Destructured Props
        path.node.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty') {
            componentInfo.props.push(prop.key.name);
          }
        });
      }
    });

    // If the component name is still not found, use the file name as the component name
    if (!componentInfo.name) {
      componentInfo.name = path.basename(this.componentPath, path.extname(this.componentPath));
    }

    return componentInfo;
  }

  generateTest(componentInfo) {
    const propsString = componentInfo.props.length > 0 
      ? componentInfo.props.map(prop => {
          if (prop === 'onClick') {
            return `${prop}={jest.fn()}`;
          }
          return `${prop}="test${prop}"`;
        }).join(' ')
      : 'text="Test Button"';

    return `
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentInfo.name} from './${path.basename(this.componentPath)}';

describe('${componentInfo.name} Component Test', () => {
  it('should render normally', () => {
    const { container } = render(<${componentInfo.name} ${propsString} />);
    expect(container).toBeTruthy();
  });

  ${componentInfo.props.map(prop => {
    if (prop === 'onClick') {
      return `
  it('should handle ${prop} prop correctly', () => {
    const handle${prop} = jest.fn();
    render(<${componentInfo.name} ${prop}={handle${prop}} text="Test Button" />);
    
    const button = screen.getByText('Test Button');
    fireEvent.click(button);
    
    expect(handle${prop}).toHaveBeenCalledTimes(1);
  });`;
    }
    return `
  it('should handle ${prop} prop correctly', () => {
    const test${prop} = 'test${prop}';
    render(<${componentInfo.name} ${prop}={test${prop}} />);
    expect(screen.getByText(test${prop})).toBeInTheDocument();
  });`;
  }).join('\n')}

  it('should trigger onClick event when clicked', () => {
    const handleClick = jest.fn();
    render(<${componentInfo.name} onClick={handleClick} text="Test Button" />);
    
    const button = screen.getByText('Test Button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
`;
  }
}

module.exports = TestGenerator; 