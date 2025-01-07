// src/components/Header/index.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { Header } from "./index";

describe("Header Component", () => {
  const setOpenMock = jest.fn();

  beforeEach(() => {
    setOpenMock.mockClear();
  });

  test("renders the Header component", () => {
    render(<Header open={false} setOpen={setOpenMock} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("applies correct class when open is true", () => {
    render(<Header open={true} setOpen={setOpenMock} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("backdrop-blur-md");
  });

  test("applies correct class when open is false", () => {
    render(<Header open={false} setOpen={setOpenMock} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("backdrop-blur-sm");
  });

  test("handleOpenSearch sets showSearch to true and calls setOpen with false", () => {
    render(<Header open={false} setOpen={setOpenMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });

  test("renders Search component when showSearch is true", () => {
    render(<Header open={false} setOpen={setOpenMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(document.body.style.overflow).toBe("hidden");
  });
});
