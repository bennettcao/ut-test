
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Steps from './Steps';

describe('Steps 组件测试', () => {
  it('应该正常渲染', () => {
    const { container } = render(<Steps size="testsize" steps="teststeps" rounding="testrounding" percent="testpercent" strokeWidth="teststrokeWidth" strokeColor="teststrokeColor" trailColor="testtrailColor" prefixCls="testprefixCls" children="testchildren" />);
    expect(container).toBeTruthy();
  });

  
  it('应该正确处理 size 属性', () => {
    const testsize = 'testsize';
    render(<Steps size={testsize} />);
    expect(screen.getByText(testsize)).toBeInTheDocument();
  });

  it('应该正确处理 steps 属性', () => {
    const teststeps = 'teststeps';
    render(<Steps steps={teststeps} />);
    expect(screen.getByText(teststeps)).toBeInTheDocument();
  });

  it('应该正确处理 rounding 属性', () => {
    const testrounding = 'testrounding';
    render(<Steps rounding={testrounding} />);
    expect(screen.getByText(testrounding)).toBeInTheDocument();
  });

  it('应该正确处理 percent 属性', () => {
    const testpercent = 'testpercent';
    render(<Steps percent={testpercent} />);
    expect(screen.getByText(testpercent)).toBeInTheDocument();
  });

  it('应该正确处理 strokeWidth 属性', () => {
    const teststrokeWidth = 'teststrokeWidth';
    render(<Steps strokeWidth={teststrokeWidth} />);
    expect(screen.getByText(teststrokeWidth)).toBeInTheDocument();
  });

  it('应该正确处理 strokeColor 属性', () => {
    const teststrokeColor = 'teststrokeColor';
    render(<Steps strokeColor={teststrokeColor} />);
    expect(screen.getByText(teststrokeColor)).toBeInTheDocument();
  });

  it('应该正确处理 trailColor 属性', () => {
    const testtrailColor = 'testtrailColor';
    render(<Steps trailColor={testtrailColor} />);
    expect(screen.getByText(testtrailColor)).toBeInTheDocument();
  });

  it('应该正确处理 prefixCls 属性', () => {
    const testprefixCls = 'testprefixCls';
    render(<Steps prefixCls={testprefixCls} />);
    expect(screen.getByText(testprefixCls)).toBeInTheDocument();
  });

  it('应该正确处理 children 属性', () => {
    const testchildren = 'testchildren';
    render(<Steps children={testchildren} />);
    expect(screen.getByText(testchildren)).toBeInTheDocument();
  });

  it('点击时应该触发onClick事件', () => {
    const handleClick = jest.fn();
    render(<Steps onClick={handleClick} text="测试按钮" />);
    
    const button = screen.getByText('测试按钮');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
