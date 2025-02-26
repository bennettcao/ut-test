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
      ExportDefaultDeclaration(path) {
        // Get name from default export
        if (path.node.declaration.type === 'Identifier') {
          componentInfo.name = path.node.declaration.name;
        } else if (path.node.declaration.type === 'ClassDeclaration') {
          componentInfo.name = path.node.declaration.id.name;
          componentInfo.isClass = true;
        } else if (path.node.declaration.type === 'FunctionDeclaration') {
          componentInfo.name = path.node.declaration.id.name;
        }
      },
      ExportNamedDeclaration(path) {
        // Get name from named export
        if (path.node.declaration) {
          if (path.node.declaration.type === 'ClassDeclaration') {
            componentInfo.name = path.node.declaration.id.name;
            componentInfo.isClass = true;
          } else if (path.node.declaration.type === 'FunctionDeclaration') {
            componentInfo.name = path.node.declaration.id.name;
          } else if (path.node.declaration.type === 'VariableDeclaration') {
            const declaration = path.node.declaration.declarations[0];
            if (declaration.init && 
                (declaration.init.type === 'ArrowFunctionExpression' || 
                 declaration.init.type === 'FunctionExpression')) {
              componentInfo.name = declaration.id.name;
            }
          }
        }
      },
      // Fallback to other declarations if no export is found
      ClassDeclaration(path) {
        if (!componentInfo.name) {
          componentInfo.name = path.node.id.name;
          componentInfo.isClass = true;
        }
      },
      FunctionDeclaration(path) {
        if (!componentInfo.name) {
          componentInfo.name = path.node.id.name;
        }
      },
      VariableDeclarator(path) {
        if (!componentInfo.name && 
            path.node.init && 
            (path.node.init.type === 'ArrowFunctionExpression' || 
             path.node.init.type === 'FunctionExpression')) {
          componentInfo.name = path.node.id.name;
        }
      },
      ObjectPattern(path) {
        // Collect destructured props
        path.node.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty') {
            componentInfo.props.push(prop.key.name);
          }
        });
      }
    });

    // Use filename as fallback if no component name is found
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

    // Calculate the relative path from test file to component file
    const componentDir = path.dirname(this.componentPath);
    const testDir = path.join(componentDir, './..', '__tests__');
    const componentRelativePath = path.relative(testDir, this.componentPath);
    
    // Remove extension and normalize path separators to forward slashes
    const importPath = componentRelativePath
      .replace(/\.(jsx?|tsx?)$/, '')
      .split(path.sep)
      .join('/');

    return `
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentInfo.name} from '${importPath}';

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