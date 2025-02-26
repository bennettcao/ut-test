exports.basicTestTemplate = (componentName) => `
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  // Basic render test
  it('should render normally', () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeTruthy();
  });

  // Props test
  it('should handle all props correctly', () => {
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

  // Event handling test
  it('should respond to click events correctly', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<${componentName} onClick={handleClick} />);
    const element = getByRole('button');
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalled();
  });

  // State update test
  it('should update state correctly', () => {
    const { getByText, rerender } = render(<${componentName} text="Initial Text" />);
    expect(getByText('Initial Text')).toBeInTheDocument();
    
    rerender(<${componentName} text="Updated Text" />);
    expect(getByText('Updated Text')).toBeInTheDocument();
  });

  // Async operation test
  it('should handle async operations correctly', async () => {
    const mockAsyncFunction = jest.fn().mockResolvedValue('Async Result');
    const { getByRole } = render(<${componentName} onAsync={mockAsyncFunction} />);
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    await expect(mockAsyncFunction).toHaveBeenCalled();
  });
});
`;