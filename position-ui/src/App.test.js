import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios so we don’t hit the real backend
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: [] }))
}));

beforeEach(() => {
  jest.clearAllMocks();
});

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

test('shows validation error when submitting empty form', () => {
  render(<App />);
  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  expect(screen.getByText(/TradeId must be positive/i)).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});

test('calls axios.post when valid transaction is submitted', async () => {
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/TradeId/i), { target: { value: '1' } });
  fireEvent.change(screen.getByPlaceholderText(/Version/i), { target: { value: '1' } });
  fireEvent.change(screen.getByPlaceholderText(/SecurityCode/i), { target: { value: 'REL' } });
  fireEvent.change(screen.getByPlaceholderText(/Quantity/i), { target: { value: '50' } });

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:5130/api/transactions",
    expect.objectContaining({
      tradeId: 1,
      version: 1,
      securityCode: "REL",
      quantity: 50,
      action: "INSERT",
      buySell: "Buy"
    })
  );
});
