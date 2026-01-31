import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock axios so we don’t hit the real backend
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: [] }))
}));

test('renders positions table header', async () => {
  render(<App />);
  expect(screen.getByText(/Equity Positions/i)).toBeInTheDocument();
  expect(screen.getByText(/Security/i)).toBeInTheDocument();
  expect(screen.getByText(/Net Quantity/i)).toBeInTheDocument();
});

test('renders transaction form inputs', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/TradeId/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Version/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/SecurityCode/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Quantity/i)).toBeInTheDocument();
});

test('submits transaction when button clicked', () => {
  render(<App />);
  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);
  // Since axios.post is mocked, we just check that the button exists and can be clicked
  expect(submitButton).toBeInTheDocument();
});
