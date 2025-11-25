import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SuppliersPage } from "@/pages/suppliers-page";
import * as apiModule from "@/lib/api";

// Mock the entire api module
vi.mock("@/lib/api", () => ({
  api: {
    getSuppliers: vi.fn(),
    createSupplier: vi.fn(),
    updateSupplier: vi.fn(),
    deleteSupplier: vi.fn(),
    createOrder: vi.fn(),
  },
}));

const mockApi = vi.mocked(apiModule.api);

const mockSuppliers = [
  {
    id: "1",
    name: "Supplier A",
    contact: "John Doe",
    email: "a@example.com",
    phone: "+1-123-4567",
    productsSupplied: 10,
    status: "Active",
  },
  {
    id: "2",
    name: "Supplier B",
    contact: "Jane Smith",
    email: "b@example.com",
    phone: "+1-987-6543",
    productsSupplied: 5,
    status: "Inactive",
  },
];

const newSupplier = {
  id: "3",
  name: "New Supplier",
  contact: "New Contact",
  email: "new@example.com",
  phone: "+1-111-2222",
  productsSupplied: 0,
  status: "Active",
};

describe("SuppliersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    mockApi.getSuppliers.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockSuppliers), 1000))
    ); // Simulate delay for loading

    render(<SuppliersPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays suppliers on mount", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    // Check supplier cards - use role heading level 4
    expect(
      screen.getByRole("heading", { level: 4, name: "Supplier A" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Supplier B" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("John Doe")).toHaveLength(2);
    expect(screen.getAllByText("a@example.com")).toHaveLength(2);
    expect(screen.getAllByText("+1-123-4567")).toHaveLength(2);
    expect(screen.getByText("10 products supplied")).toBeInTheDocument();
    expect(screen.getAllByText("Active")).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: /contact for order/i })
    ).toHaveLength(2);

    // Check table
    expect(
      screen.getByRole("columnheader", { name: "Supplier ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Supplier A" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "John Doe" })).toBeInTheDocument();
  });

  it("handles empty suppliers list", async () => {
    mockApi.getSuppliers.mockResolvedValue([]);

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    // No suppliers in grid or table body
    expect(screen.queryAllByText(/products supplied/)).toHaveLength(0);
    expect(screen.getByRole("table")).toBeInTheDocument();
    // Table has only header row
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1); // Header only
    expect(screen.getByText("No suppliers found.")).toBeInTheDocument();
  });

  it("displays low stock alert information", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    expect(screen.getByText("Low Stock Alert System")).toBeInTheDocument();
    expect(
      screen.getByText(/When products reach low stock levels/)
    ).toBeInTheDocument();
  });

  it("opens add dialog on button click", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);
    const user = userEvent.setup();

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    const addButton = screen.getByRole("button", { name: /add supplier/i });
    await user.click(addButton);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Supplier")).toBeInTheDocument();
    expect(screen.getByLabelText("Supplier Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Person")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
  });

  it("creates a new supplier on add dialog submit", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers); // Initial fetch
    mockApi.createSupplier.mockResolvedValue(newSupplier);
    const user = userEvent.setup();

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    const addButton = screen.getByRole("button", { name: /add supplier/i });
    await user.click(addButton);

    const nameInput = screen.getByLabelText("Supplier Name");
    const contactInput = screen.getByLabelText("Contact Person");
    const emailInput = screen.getByLabelText("Email");
    const phoneInput = screen.getByLabelText("Phone");
    const addressInput = screen.getByLabelText("Address");
    await user.type(nameInput, "New Supplier");
    await user.type(contactInput, "New Contact");
    await user.type(emailInput, "new@example.com");
    await user.type(phoneInput, "+1-111-2222");
    await user.type(addressInput, "Test Address");

    const submitButton = screen.getByRole("button", { name: "Add Supplier" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApi.createSupplier).toHaveBeenCalledOnce();
      expect(mockApi.createSupplier).toHaveBeenCalledWith({
        name: "New Supplier",
        contact: "New Contact",
        email: "new@example.com",
        phone: "+1-111-2222",
        address: "Test Address",
        status: "Active",
        productsSupplied: 0,
      });
      expect(mockApi.getSuppliers).toHaveBeenCalledTimes(1); // No refetch
    });

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // New supplier appears
    expect(
      screen.getByRole("heading", { level: 4, name: "New Supplier" })
    ).toBeInTheDocument();
  });

  it("opens contact dialog on Contact for Order button click", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);
    const user = userEvent.setup();

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    const contactButtons = screen.getAllByRole("button", {
      name: /contact for order/i,
    });
    await user.click(contactButtons[0]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create Purchase Order")).toBeInTheDocument();
    expect(
      screen.getByText(/Contact Supplier A for restocking/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Warehouse capacity check: Main Warehouse has 2,155 units of available space"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Product")).toBeInTheDocument();
    expect(screen.getByLabelText("Order Quantity")).toBeInTheDocument();
    expect(screen.getByLabelText("Estimated Cost")).toBeInTheDocument();
    expect(screen.getByLabelText("Order Notes")).toBeInTheDocument();
  });

  it("creates a purchase order on contact dialog submit", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers); // Initial fetch
    mockApi.createOrder.mockResolvedValue({ id: "order-1" });
    const user = userEvent.setup();

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    const contactButtons = screen.getAllByRole("button", {
      name: /contact for order/i,
    });
    await user.click(contactButtons[0]);

    const productInput = screen.getByLabelText("Product");
    const quantityInput = screen.getByLabelText("Order Quantity");
    const notesInput = screen.getByLabelText("Order Notes");
    await user.type(productInput, "Test Product");
    await user.type(quantityInput, "100");
    await user.type(notesInput, "Urgent order");

    const submitButton = screen.getByRole("button", {
      name: /send order request/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApi.createOrder).toHaveBeenCalledOnce();
      expect(mockApi.createOrder).toHaveBeenCalledWith({
        supplierId: "1",
        product: "Test Product",
        quantity: 100,
        notes: "Urgent order",
      });
    });

    // Dialog closes
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  //   it("opens edit dialog and updates supplier on save", async () => {
  //     mockApi.getSuppliers.mockResolvedValue(mockSuppliers); // Initial
  //     mockApi.updateSupplier.mockResolvedValue({
  //       ...mockSuppliers[0],
  //       name: "Updated Supplier A",
  //     });
  //     const user = userEvent.setup();

  //     render(<SuppliersPage />);

  //     await waitFor(() => {
  //       expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
  //     });

  //     // Click edit in table (first one) - Query by role=button containing edit icon
  //     const editButtons = screen.getAllByRole("button").filter((btn) => {
  //       const svg = btn.querySelector("svg");
  //       return svg && svg.classList.contains("lucide-edit");
  //     });
  //     const editButton = editButtons[0]; // First edit button
  //     if (!editButton)
  //       throw new Error(
  //         'Edit button not found for test - consider adding data-testid="edit-supplier"'
  //       );
  //     await user.click(editButton);

  //     expect(await screen.findByText("Edit Supplier")).toBeInTheDocument();

  //     const nameInput = screen.getByLabelText("Supplier Name");
  //     await user.clear(nameInput);
  //     await user.type(nameInput, "Updated Supplier A");

  //     const saveButton = screen.getByRole("button", { name: /save changes/i });
  //     await user.click(saveButton);

  //     await waitFor(() => {
  //       expect(mockApi.updateSupplier).toHaveBeenCalledOnce();
  //       expect(mockApi.updateSupplier).toHaveBeenCalledWith("1", {
  //         name: "Updated Supplier A",
  //         contact: "John Doe",
  //         email: "a@example.com",
  //         phone: "+1-123-4567",
  //         address: undefined,
  //       });
  //       expect(mockApi.getSuppliers).toHaveBeenCalledTimes(1);
  //     });

  //     expect(
  //       screen.getByRole("heading", { level: 4, name: "Updated Supplier A" })
  //     ).toBeInTheDocument();
  //   });

  it("opens edit dialog and updates supplier on save", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);
    mockApi.updateSupplier.mockResolvedValue({
      ...mockSuppliers[0],
      name: "Updated Supplier A",
    });
    const user = userEvent.setup();
    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    const editButton = screen.getByTestId("edit-supplier-1");
    await user.click(editButton);

    expect(await screen.findByText("Edit Supplier")).toBeInTheDocument();
    // const nameInput = screen.getByLabelText("Supplier Name");

    const nameInput = screen.getByLabelText("Name");
    // const contactInput = screen.getByLabelText("Contact Person");

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Supplier A");

    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockApi.updateSupplier).toHaveBeenCalledWith("1", {
        name: "Updated Supplier A",
        contact: "John Doe",
        email: "a@example.com",
        phone: "+1-123-4567",
        address: undefined,
      });
    });

    // Dialog closes and updated supplier name appears
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Updated Supplier A" })
    ).toBeInTheDocument();
  });

  it("deletes a supplier on delete button click after confirmation", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);
    mockApi.deleteSupplier.mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    // Click delete in table (first one) - Query by role=button containing lucide-trash2 icon
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
        'Delete button not found for test - consider adding data-testid="delete-supplier"'
      );
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockApi.deleteSupplier).toHaveBeenCalledOnce();
      expect(mockApi.deleteSupplier).toHaveBeenCalledWith("1");
    });

    // Supplier removed
    expect(
      screen.queryByRole("heading", { level: 4, name: "Supplier A" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Supplier B" })
    ).toBeInTheDocument();
  });

  it("cancels delete if confirm returns false", async () => {
    mockApi.getSuppliers.mockResolvedValue(mockSuppliers);
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockImplementation(() => false);

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
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
        'Delete button not found for test - consider adding data-testid="delete-supplier"'
      );
    await user.click(deleteButton);

    expect(mockApi.deleteSupplier).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { level: 4, name: "Supplier A" })
    ).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mockApi.getSuppliers.mockRejectedValue(new Error("Failed to fetch"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SuppliersPage />);

    await waitFor(() => {
      expect(mockApi.getSuppliers).toHaveBeenCalledOnce();
    });

    // Renders empty state on error (no suppliers)
    expect(
      screen.queryByRole("heading", { level: 4, name: "Supplier A" })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Failed to load suppliers/)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch suppliers:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
