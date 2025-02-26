
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button.jsx';

describe('Button Component Test', () => {
  it('should render normally', () => {
    const { container } = render(<Button onClick={jest.fn()} text="testtext" />);
    expect(container).toBeTruthy();
  });

  
  it('should handle onClick prop correctly', () => {
    const handleonClick = jest.fn();
    render(<Button onClick={handleonClick} text="Test Button" />);
    
    const button = screen.getByText('Test Button');
    fireEvent.click(button);
    
    expect(handleonClick).toHaveBeenCalledTimes(1);
  });

  it('should handle text prop correctly', () => {
    const testtext = 'testtext';
    render(<Button text={testtext} />);
    expect(screen.getByText(testtext)).toBeInTheDocument();
  });

  it('should trigger onClick event when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} text="Test Button" />);
    
    const button = screen.getByText('Test Button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
