import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { api } from "../../src/lib/api";
import { ProductsPage } from "@/pages/products-page";

vi.mock("../../src/lib/api", () => ({
  api: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe("ProductsPage", () => {
  const mockProducts = [
    {
      id: "p1",
      name: "Product A",
      sku: "SKU001",
      quantity: 10,
      status: "In Stock",
    },
    {
      id: "p2",
      name: "Product B",
      sku: "SKU002",
      quantity: 2,
      status: "Low Stock",
    },
  ];

  beforeEach(() => vi.resetAllMocks());

  it("renders loading state initially", () => {
    (api.getProducts as any).mockReturnValue(new Promise(() => {}));
    render(<ProductsPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("displays fetched products", async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    render(<ProductsPage />);
    await waitFor(() =>
      expect(screen.getByText("Product A")).toBeInTheDocument()
    );
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("shows empty message when no products", async () => {
    (api.getProducts as any).mockResolvedValue([]);
    render(<ProductsPage />);
    await waitFor(() => screen.getByTestId("no-products"));
  });

  it("filters products by search", async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    render(<ProductsPage />);
    await waitFor(() => screen.getByText("Product A"));
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "B" },
    });
    expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("adds a new product", async () => {
    (api.getProducts as any).mockResolvedValue(mockProducts);
    (api.createProduct as any).mockResolvedValue({
      id: "p3",
      name: "Product C",
      sku: "SKU003",
      quantity: 5,
      status: "In Stock",
    });
    render(<ProductsPage />);
    await waitFor(() => screen.getByText("Product A"));

    fireEvent.click(screen.getByTestId("add-product-btn"));
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Product C" },
    });
    fireEvent.change(screen.getByLabelText("SKU"), {
      target: { value: "SKU003" },
    });
    fireEvent.click(screen.getByTestId("save-product-btn"));

    await waitFor(() => screen.getByText("Product C"));
    expect(api.createProduct).toHaveBeenCalled();
  });

  it("deletes a product", async () => {
    global.confirm = vi.fn(() => true);
    (api.getProducts as any).mockResolvedValue(mockProducts);
    (api.deleteProduct as any).mockResolvedValue({});
    render(<ProductsPage />);
    await waitFor(() => screen.getByText("Product A"));

    fireEvent.click(screen.getByTestId("delete-p1"));
    await waitFor(() => expect(api.deleteProduct).toHaveBeenCalledWith("p1"));
  });
});
