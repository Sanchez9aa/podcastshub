import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText("Podcaster")).toBeInTheDocument();
  });

  it("should show loading indicator", () => {
    render(<App />);
    expect(screen.getByLabelText("Cargando...")).toBeInTheDocument();
  });
});
