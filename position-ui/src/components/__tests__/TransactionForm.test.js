import { render, screen, fireEvent } from "@testing-library/react";
import TransactionForm from "../TransactionForm";

test("renders form inputs", () => {
  const transaction = { tradeId: "", version: "", securityCode: "", quantity: "", action: "INSERT", buySell: "Buy" };
  const setTransaction = jest.fn();
  const onSubmit = jest.fn();

  render(<TransactionForm transaction={transaction} setTransaction={setTransaction} onSubmit={onSubmit} />);

  expect(screen.getByPlaceholderText("TradeId")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Version")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("SecurityCode")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Quantity")).toBeInTheDocument();
});

test("calls onSubmit when button clicked", () => {
  const transaction = { tradeId: "", version: "", securityCode: "", quantity: "", action: "INSERT", buySell: "Buy" };
  const setTransaction = jest.fn();
  const onSubmit = jest.fn();

  render(<TransactionForm transaction={transaction} setTransaction={setTransaction} onSubmit={onSubmit} />);
  fireEvent.click(screen.getByText(/Submit/i));
  expect(onSubmit).toHaveBeenCalled();
});
