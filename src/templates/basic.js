exports.basicTestTemplate = (componentName) => `
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  // 基础渲染测试
  it('应该正常渲染', () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeTruthy();
  });

  // 属性测试
  it('应该正确处理所有属性', () => {
    const props = {
      className: 'test-class',
      id: 'test-id',
      'data-testid': 'test-component'
    };
    const { getByTestId } = render(<${componentName} {...props} />);
    const element = getByTestId('test-component');
    expect(element).toHaveClass('test-class');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // 事件处理测试
  it('应该正确响应点击事件', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<${componentName} onClick={handleClick} />);
    const element = getByRole('button');
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalled();
  });

  // 状态更新测试
  it('应该正确更新状态', () => {
    const { getByText, rerender } = render(<${componentName} text="初始文本" />);
    expect(getByText('初始文本')).toBeInTheDocument();
    
    rerender(<${componentName} text="更新文本" />);
    expect(getByText('更新文本')).toBeInTheDocument();
  });

  // 异步操作测试
  it('应该正确处理异步操作', async () => {
    const mockAsyncFunction = jest.fn().mockResolvedValue('异步结果');
    const { getByRole } = render(<${componentName} onAsync={mockAsyncFunction} />);
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    await expect(mockAsyncFunction).toHaveBeenCalled();
  });
});
`;