import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchFilter } from "@/features/podcast-list/components/SearchFilter/SearchFilter";

describe("SearchFilter", () => {
  it("renders with default placeholder", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("Filter podcasts...");
    expect(input).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    const mockOnChange = vi.fn();
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        placeholder="Search here..."
      />,
    );

    const input = screen.getByPlaceholderText("Search here...");
    expect(input).toBeInTheDocument();
  });

  it("displays the current value", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="test search" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue("test search");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("Filter podcasts...");
    fireEvent.change(input, { target: { value: "new search" } });

    expect(mockOnChange).toHaveBeenCalledWith("new search");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("has correct input type", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="" onChange={mockOnChange} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("type", "search");
  });

  it("applies correct CSS classes", () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <SearchFilter value="" onChange={mockOnChange} />,
    );

    expect((container.firstChild as HTMLElement)?.className).toContain(
      "container",
    );
    expect(screen.getByRole("searchbox").className).toContain("input");
  });

  it("handles multiple onChange events", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="" onChange={mockOnChange} />);

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.change(input, { target: { value: "abc" } });

    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, "a");
    expect(mockOnChange).toHaveBeenNthCalledWith(2, "ab");
    expect(mockOnChange).toHaveBeenNthCalledWith(3, "abc");
  });

  it("has proper accessibility attributes", () => {
    const mockOnChange = vi.fn();
    render(<SearchFilter value="" onChange={mockOnChange} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute(
      "aria-label",
      "Search podcasts by title or author",
    );
    expect(input).toHaveAttribute("autoComplete", "off");

    // Check that label is properly associated
    const label = screen.getByLabelText("Search podcasts by title or author");
    expect(label).toBe(input);
  });
});
