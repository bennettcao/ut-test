import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import * as React from 'react';

// 配置 Testing Library
configure({ 
  asyncUtilTimeout: 5000,
  eventWrapper: cb => React.act(cb)
}); 