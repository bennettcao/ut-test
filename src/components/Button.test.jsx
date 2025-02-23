
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button.jsx';

describe('Button 组件测试', () => {
  it('应该正常渲染', () => {
    const { container } = render(<Button onClick={jest.fn()} text="testtext" />);
    expect(container).toBeTruthy();
  });

  
  it('应该正确处理 onClick 属性', () => {
    const handleonClick = jest.fn();
    render(<Button onClick={handleonClick} text="测试按钮" />);
    
    const button = screen.getByText('测试按钮');
    fireEvent.click(button);
    
    expect(handleonClick).toHaveBeenCalledTimes(1);
  });

  it('应该正确处理 text 属性', () => {
    const testtext = 'testtext';
    render(<Button text={testtext} />);
    expect(screen.getByText(testtext)).toBeInTheDocument();
  });

  it('点击时应该触发onClick事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} text="测试按钮" />);
    
    const button = screen.getByText('测试按钮');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
