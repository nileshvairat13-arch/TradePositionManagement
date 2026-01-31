import { render, screen } from "@testing-library/react";
import PositionsTable from "../PositionsTable";

test("renders empty positions message", () => {
  render(<PositionsTable positions={[]} />);
  expect(screen.getByText(/No positions available/i)).toBeInTheDocument();
});

test("renders positions in table", () => {
  const positions = [{ securityCode: "REL", netQuantity: 50 }];
  render(<PositionsTable positions={positions} />);
  expect(screen.getByText("REL")).toBeInTheDocument();
  expect(screen.getByText("50")).toBeInTheDocument();
});
