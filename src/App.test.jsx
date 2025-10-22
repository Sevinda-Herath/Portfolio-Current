import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders TopBar with Logout button', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /log out/i });
  expect(btn).toBeDefined();
});

test('opens and closes About window via desktop icon', async () => {
  render(<App />);
  const user = userEvent.setup();
  const aboutIcon = await screen.findByRole('button', { name: /open about/i });
  await user.click(aboutIcon);
  // window appears
  const aboutHeading = await screen.findByRole('heading', { name: /about me/i });
  expect(aboutHeading).toBeDefined();
  // close window
  const closeBtn = screen.getByRole('button', { name: /close about/i });
  await user.click(closeBtn);
  const queryHeading = screen.queryByRole('heading', { name: /about me/i });
  expect(queryHeading).toBeNull();
});
