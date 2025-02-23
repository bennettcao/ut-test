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

    const testPath = this.componentPath.replace(/\.(jsx?|tsx?)$/, '.test.$1');
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
      // 添加对箭头函数组件的支持
      VariableDeclarator(path) {
        if (path.node.init && 
            (path.node.init.type === 'ArrowFunctionExpression' || 
             path.node.init.type === 'FunctionExpression')) {
          componentInfo.name = path.node.id.name;
        }
      },
      ObjectPattern(path) {
        // 收集解构的props
        path.node.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty') {
            componentInfo.props.push(prop.key.name);
          }
        });
      }
    });

    // 如果还是没有找到组件名，使用文件名作为组件名
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
      : 'text="测试按钮"';

    return `
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentInfo.name} from './${path.basename(this.componentPath)}';

describe('${componentInfo.name} 组件测试', () => {
  it('应该正常渲染', () => {
    const { container } = render(<${componentInfo.name} ${propsString} />);
    expect(container).toBeTruthy();
  });

  ${componentInfo.props.map(prop => {
    if (prop === 'onClick') {
      return `
  it('应该正确处理 ${prop} 属性', () => {
    const handle${prop} = jest.fn();
    render(<${componentInfo.name} ${prop}={handle${prop}} text="测试按钮" />);
    
    const button = screen.getByText('测试按钮');
    fireEvent.click(button);
    
    expect(handle${prop}).toHaveBeenCalledTimes(1);
  });`;
    }
    return `
  it('应该正确处理 ${prop} 属性', () => {
    const test${prop} = 'test${prop}';
    render(<${componentInfo.name} ${prop}={test${prop}} />);
    expect(screen.getByText(test${prop})).toBeInTheDocument();
  });`;
  }).join('\n')}

  it('点击时应该触发onClick事件', () => {
    const handleClick = jest.fn();
    render(<${componentInfo.name} onClick={handleClick} text="测试按钮" />);
    
    const button = screen.getByText('测试按钮');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
`;
  }
}

module.exports = TestGenerator; 