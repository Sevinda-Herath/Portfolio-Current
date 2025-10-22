import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TopBar with Logout button', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /log out/i });
  expect(btn).toBeDefined();
});
