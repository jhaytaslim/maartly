// Suggested placement: Create a new folder `tests/unit` at the root level of the project (next to `src/` and `components/`), and place this file as `tests/unit/categories-page.test.tsx`.
// This follows common conventions for Vitest/Jest in Vite projects: separates unit tests, easy to run with `vitest tests/unit/**/*.test.tsx`.
// If you prefer colocated tests, place it as `components/pages/categories-page.test.tsx` next to the component.

// To set up testing, add the following to your package.json under "devDependencies":
// "vitest": "^1.6.0",
// "@testing-library/react": "^14.1.2",
// "@testing-library/jest-dom": "^6.4.2",
// "@testing-library/user-event": "^14.5.2",
// "jsdom": "^23.0.4"
//
// Add to package.json scripts: "test": "vitest"
//
// In vite.config.ts, add:
// export default defineConfig({
//   test: {
//     environment: 'jsdom',
//     setupFiles: ['./src/test-setup.ts'],
//     globals: true, // Enables vi globals
//   },
//   ...
// });
//
// Create src/test-setup.ts with:
// import '@testing-library/jest-dom';
// import { vi } from 'vitest';
// // Suppress Radix UI ref warnings in tests
// const originalWarn = console.warn;
// beforeAll(() => {
//   console.warn = (...args) => {
//     if (args[0]?.includes('Function components cannot be given refs')) {
//       return;
//     }
//     originalWarn.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.warn = originalWarn;
// });
//
// Run with: pnpm test or pnpm vitest.

// categories-page.test.tsx

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoriesPage } from "../../components/pages/categories-page";
import * as apiModule from "../../lib/api";
import "@testing-library/jest-dom"; // Import here to extend expect with toBeInTheDocument, etc.

// Mock the entire api module
vi.mock("../../lib/api", () => ({
  api: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

const mockApi = vi.mocked(apiModule.api);

const mockCategories = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    productCount: 5,
  },
  {
    id: "2",
    name: "Clothing",
    description: "Apparel and fashion items",
    productCount: 3,
  },
];

const updatedCategoriesAfterCreate = [
  ...mockCategories,
  {
    id: "3",
    name: "New Category",
    description: "Test desc",
    productCount: 0,
  },
];

const updatedCategoriesAfterUpdate = [
  { ...mockCategories[0], name: "Updated Electronics" },
  mockCategories[1],
];

describe("CategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    mockApi.getCategories.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockCategories), 1000)
        )
    ); // Simulate delay for loading

    render(<CategoriesPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays categories on mount", async () => {
    mockApi.getCategories.mockResolvedValue(mockCategories);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    // Check grid cards - use getAllByRole for headings to avoid duplicates with table
    expect(
      screen.getAllByRole("heading", { level: 4, name: /Electronics|Clothing/ })
    ).toHaveLength(2);
    expect(screen.getByText("5 products")).toBeInTheDocument();
    expect(screen.getByText("3 products")).toBeInTheDocument();

    // Check table
    expect(
      screen.getByRole("columnheader", { name: "Category ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Electronics" })
    ).toBeInTheDocument(); // Specific to table cell
  });

  it("handles empty categories list", async () => {
    mockApi.getCategories.mockResolvedValue([]);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    // No categories in grid or table body - check for " X products" pattern instead of /products/i to avoid header match
    expect(screen.queryAllByText(/\d+\s+products/)).toHaveLength(0);
    expect(screen.getByRole("table")).toBeInTheDocument();
    // Table has only header row
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1); // Header only
  });

  it("opens add dialog on button click", async () => {
    mockApi.getCategories.mockResolvedValue(mockCategories);
    const user = userEvent.setup();

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    const addButton = screen.getByRole("button", { name: /add category/i });
    await user.click(addButton);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Category")).toBeInTheDocument();
  });

  it("creates a new category on add dialog submit", async () => {
    mockApi.getCategories.mockResolvedValueOnce(mockCategories); // Initial fetch
    mockApi.createCategory.mockResolvedValue({
      id: "3",
      name: "New Category",
      description: "Test desc",
      productCount: 0,
    });
    mockApi.getCategories.mockResolvedValueOnce(updatedCategoriesAfterCreate); // Refetch after create
    const user = userEvent.setup();

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    const addButton = screen.getByRole("button", { name: /add category/i });
    await user.click(addButton);

    const nameInput = screen.getByLabelText(/category name/i);
    const descInput = screen.getByLabelText(/description/i);
    await user.type(nameInput, "New Category");
    await user.type(descInput, "Test desc");

    const submitButton = screen.getByRole("button", { name: /add category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApi.createCategory).toHaveBeenCalledOnce();
      expect(mockApi.createCategory).toHaveBeenCalledWith({
        name: "New Category",
        description: "Test desc",
      });
      expect(mockApi.getCategories).toHaveBeenCalledTimes(2); // Initial + refetch
    });

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // New category appears - use heading for specificity
    expect(
      screen.getByRole("heading", { level: 4, name: "New Category" })
    ).toBeInTheDocument();
  });

  it("opens edit dialog and updates category on save", async () => {
    mockApi.getCategories.mockResolvedValueOnce(mockCategories); // Initial
    mockApi.updateCategory.mockResolvedValue({
      ...mockCategories[0],
      name: "Updated Electronics",
    });
    mockApi.getCategories.mockResolvedValueOnce(updatedCategoriesAfterUpdate); // Refetch
    const user = userEvent.setup();

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    // Click edit in card (first one) - Query by role=button containing lucide-square-pen icon
    const editButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-square-pen"));
    const editButton = editButtons[0]; // First edit button
    if (!editButton)
      throw new Error(
        'Edit button not found for test - consider adding data-testid="edit-category"'
      );
    await user.click(editButton);

    expect(await screen.findByText("Edit Category")).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/category name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Electronics");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockApi.updateCategory).toHaveBeenCalledOnce();
      expect(mockApi.updateCategory).toHaveBeenCalledWith("1", {
        name: "Updated Electronics",
        description: "Electronic devices and gadgets",
      });
      expect(mockApi.getCategories).toHaveBeenCalledTimes(2);
    });

    expect(
      screen.getByRole("heading", { level: 4, name: "Updated Electronics" })
    ).toBeInTheDocument();
  });

  it("deletes a category on delete button click after confirmation", async () => {
    mockApi.getCategories.mockResolvedValue(mockCategories);
    mockApi.deleteCategory.mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    // Click delete in card (first one) - Query by role=button containing lucide-trash2 icon
    const deleteButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) =>
          btn.querySelector('svg[class*="trash2"]') ||
          btn.querySelector("svg.lucide-trash2")
      );
    const deleteButton = deleteButtons[0]; // First delete button
    if (!deleteButton)
      throw new Error(
        'Delete button not found for test - consider adding data-testid="delete-category"'
      );
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockApi.deleteCategory).toHaveBeenCalledOnce();
      expect(mockApi.deleteCategory).toHaveBeenCalledWith("1");
    });

    // Category removed (state update filters it out - no refetch in delete, so manual filter works)
    expect(
      screen.queryByRole("heading", { level: 4, name: "Electronics" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Clothing" })
    ).toBeInTheDocument();
  });

  it("cancels delete if confirm returns false", async () => {
    mockApi.getCategories.mockResolvedValue(mockCategories);
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockImplementation(() => false);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    const deleteButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) =>
          btn.querySelector('svg[class*="trash2"]') ||
          btn.querySelector("svg.lucide-trash2")
      );
    const deleteButton = deleteButtons[0];
    if (!deleteButton)
      throw new Error(
        'Delete button not found for test - consider adding data-testid="delete-category"'
      );
    await user.click(deleteButton);

    expect(mockApi.deleteCategory).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { level: 4, name: "Electronics" })
    ).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mockApi.getCategories.mockRejectedValue(new Error("Failed to fetch"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(mockApi.getCategories).toHaveBeenCalledOnce();
    });

    // Renders empty state on error (no categories)
    expect(
      screen.queryByRole("heading", { level: 4, name: "Electronics" })
    ).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch categories:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
