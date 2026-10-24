import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { DataContext } from "./DataContext";
import {
  createSupplier as createSupplierApi,
  deleteSupplier as deleteSupplierApi,
  getSuppliers as getSuppliersApi,
  updateSupplier as updateSupplierApi,
} from "../api/supplierApi";
import { useAuth } from "../hooks/useAuth";
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getProducts as getProductsApi,
  updateProduct as updateProductApi,
} from "../api/productApi";
import {
  adjustInventoryStock,
  getInventoryTransactions,
} from "../api/inventoryApi";
import {
  createSale as createSaleApi,
  getSales as getSalesApi,
  getSalesSummary as getSalesSummaryApi,
} from "../api/saleApi";
import {
  getDeadStock as getDeadStockApi,
  getReportSummary as getReportSummaryApi,
} from "../api/reportApi";
import {
  createReorderPlan as createReorderPlanApi,
  deleteReorderPlan as deleteReorderPlanApi,
  getReorderPlans as getReorderPlansApi,
  updateReorderPlan as updateReorderPlanApi,
} from "../api/reorderApi";

const readStorage = (key, fallback) => {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
};
const normalizeProduct = (product) => {
  const populatedSupplier =
    product?.supplierId && typeof product.supplierId === "object"
      ? product.supplierId
      : null;

  return {
    ...product,

    supplier: populatedSupplier,

    supplierId: populatedSupplier?._id || product?.supplierId || null,

    price: Number(product?.price || 0),

    stock: Number(product?.stock || 0),

    minStock: Number(product?.minStock || 0),
  };
};
const normalizeInventoryTransaction = (transaction) => {
  const populatedProduct =
    transaction?.productId && typeof transaction.productId === "object"
      ? transaction.productId
      : null;

  return {
    ...transaction,

    product: populatedProduct,

    productId: populatedProduct?._id || transaction?.productId || null,

    quantity: Number(transaction?.quantity || 0),

    previousStock: Number(transaction?.previousStock || 0),

    newStock: Number(transaction?.newStock || 0),
    date: transaction?.createdAt || transaction?.date,
  };
};
const normalizeSale = (sale) => {
  const populatedProduct =
    sale?.productId && typeof sale.productId === "object"
      ? sale.productId
      : null;

  return {
    ...sale,

    product: populatedProduct,

    productId: populatedProduct?._id || sale?.productId || null,

    quantity: Number(sale?.quantity || 0),

    unitPrice: Number(sale?.unitPrice || 0),

    revenue: Number(sale?.revenue || 0),

    date: sale?.soldAt || sale?.createdAt || sale?.date,
  };
};
export function DataProvider({ children }) {
  const { user, isAuthenticated, updatePreferences } = useAuth();
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);

  const [productsLoading, setProductsLoading] = useState(false);

  const [productsError, setProductsError] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const [suppliersError, setSuppliersError] = useState("");
  const [sales, setSales] = useState([]);

  const [salesLoading, setSalesLoading] = useState(false);

  const [salesError, setSalesError] = useState("");

  const [salesSummary, setSalesSummary] = useState(null);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const [inventoryLoading, setInventoryLoading] = useState(false);

  const [inventoryError, setInventoryError] = useState("");
  const [reportData, setReportData] = useState(null);

  const [reportLoading, setReportLoading] = useState(false);

  const [reportError, setReportError] = useState("");

  const [backendDeadStockProducts, setBackendDeadStockProducts] = useState([]);

  const [deadStockLoading, setDeadStockLoading] = useState(false);

  const [deadStockError, setDeadStockError] = useState("");

  const [reorderPlans, setReorderPlans] = useState([]);

  const [reorderLoading, setReorderLoading] = useState(false);

  const [reorderError, setReorderError] = useState("");

  const darkMode = Boolean(user?.preferences?.darkMode);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  const addActivity = useCallback((message) => {
    setActivities((current) => [
      { id: crypto.randomUUID(), message, date: new Date().toISOString() },
      ...current,
    ]);
  }, []);
  const loadProducts = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      return;
    }

    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await getProductsApi();

      const productList = Array.isArray(response.data)
        ? response.data.map(normalizeProduct)
        : [];

      setProducts(productList);
    } catch (error) {
      setProducts([]);

      setProductsError(error.message || "Unable to load products");
    } finally {
      setProductsLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) {
      setProducts([]);
      setProductsError("");
      return;
    }

    loadProducts();
  }, [isAuthenticated, user?._id, loadProducts]);
  const addProduct = useCallback(
    async (productData) => {
      try {
        setProductsError("");

        const response = await createProductApi({
          name: productData.name.trim(),

          sku: productData.sku.trim().toUpperCase(),

          category: productData.category.trim(),

          supplierId: productData.supplierId || "",

          price: Number(productData.price),

          stock: Number(productData.stock),

          minStock: Number(productData.minStock),
        });

        const createdProduct = normalizeProduct(response.data);

        setProducts((current) => [createdProduct, ...current]);

        addActivity(`Added product: ${createdProduct.name}`);

        toast.success("Product added");

        return createdProduct;
      } catch (error) {
        setProductsError(error.message || "Unable to add product");

        throw error;
      }
    },
    [addActivity],
  );
  const updateProduct = useCallback(
    async (productId, productData) => {
      try {
        setProductsError("");

        const response = await updateProductApi(productId, {
          name: productData.name.trim(),

          sku: productData.sku.trim().toUpperCase(),

          category: productData.category.trim(),

          supplierId: productData.supplierId || "",

          price: Number(productData.price),

          minStock: Number(productData.minStock),
        });

        const updatedProduct = normalizeProduct(response.data);

        setProducts((current) =>
          current.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product,
          ),
        );

        addActivity(`Updated product: ${updatedProduct.name}`);

        toast.success("Product updated");

        return updatedProduct;
      } catch (error) {
        setProductsError(error.message || "Unable to update product");

        throw error;
      }
    },
    [addActivity],
  );
  const deleteProduct = useCallback(
    async (productId) => {
      try {
        setProductsError("");

        const productToDelete = products.find(
          (product) => String(product._id) === String(productId),
        );

        await deleteProductApi(productId);

        setProducts((current) =>
          current.filter(
            (product) => String(product._id) !== String(productId),
          ),
        );
        addActivity(`Deleted product: ${productToDelete?.name || productId}`);

        toast.success("Product deleted");

        return true;
      } catch (error) {
        setProductsError(error.message || "Unable to delete product");

        throw error;
      }
    },
    [products, addActivity],
  );
  const loadSuppliers = useCallback(async () => {
    if (!isAuthenticated) {
      setSuppliers([]);
      return;
    }

    try {
      setSuppliersLoading(true);
      setSuppliersError("");

      const response = await getSuppliersApi();

      setSuppliers(response.data || []);
    } catch (error) {
      setSuppliers([]);
      setSuppliersError(error.message || "Unable to load suppliers");
    } finally {
      setSuppliersLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSuppliers([]);
      setSuppliersError("");
      return;
    }

    loadSuppliers();
  }, [isAuthenticated, user?._id, loadSuppliers]);

  const addSupplier = async (supplierData) => {
    try {
      setSuppliersError("");

      const response = await createSupplierApi(supplierData);

      const createdSupplier = response.data;

      setSuppliers((current) => [createdSupplier, ...current]);

      toast.success("Supplier added");

      return createdSupplier;
    } catch (error) {
      setSuppliersError(error.message || "Unable to add supplier");

      throw error;
    }
  };

  const updateSupplier = async (supplierId, supplierData) => {
    try {
      setSuppliersError("");

      const response = await updateSupplierApi(supplierId, supplierData);

      const updatedSupplier = response.data;

      setSuppliers((current) =>
        current.map((supplier) =>
          supplier._id === updatedSupplier._id ? updatedSupplier : supplier,
        ),
      );

      toast.success("Supplier updated");

      return updatedSupplier;
    } catch (error) {
      setSuppliersError(error.message || "Unable to update supplier");

      throw error;
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      setSuppliersError("");

      await deleteSupplierApi(supplierId);

      setSuppliers((current) =>
        current.filter((supplier) => supplier._id !== supplierId),
      );

      toast.success("Supplier deleted");

      return true;
    } catch (error) {
      setSuppliersError(error.message || "Unable to delete supplier");

      throw error;
    }
  };
  const loadInventoryLogs = useCallback(async () => {
    if (!isAuthenticated) {
      setInventoryLogs([]);
      return;
    }

    try {
      setInventoryLoading(true);
      setInventoryError("");

      const response = await getInventoryTransactions();

      const logs = Array.isArray(response.data)
        ? response.data.map(normalizeInventoryTransaction)
        : [];

      setInventoryLogs(logs);
    } catch (error) {
      setInventoryLogs([]);

      setInventoryError(error.message || "Unable to load inventory history");
    } finally {
      setInventoryLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) {
      setInventoryLogs([]);
      setInventoryError("");

      return;
    }

    loadInventoryLogs();
  }, [isAuthenticated, user?._id, loadInventoryLogs]);
  const adjustStock = useCallback(
    async ({ productId, quantity, type, note = "" }) => {
      try {
        setInventoryError("");

        const numericQuantity = Number(quantity);

        if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
          throw new Error("Enter a valid quantity");
        }

        const response = await adjustInventoryStock({
          productId,

          quantity: numericQuantity,

          type,

          note,
        });

        const updatedProduct = normalizeProduct(response.data.product);

        const transaction = normalizeInventoryTransaction(
          response.data.transaction,
        );

        setProducts((current) =>
          current.map((product) =>
            String(product._id) === String(updatedProduct._id)
              ? updatedProduct
              : product,
          ),
        );

        setInventoryLogs((current) => [transaction, ...current]);

        const actionText =
          type === "STOCK_IN"
            ? "Added"
            : type === "STOCK_OUT"
              ? "Removed"
              : "Adjusted";

        addActivity(
          `${actionText} ${numericQuantity} units of ${updatedProduct.name}`,
        );

        toast.success("Inventory updated");

        return {
          product: updatedProduct,

          transaction,
        };
      } catch (error) {
        setInventoryError(error.message || "Unable to update inventory");

        toast.error(error.message || "Unable to update inventory");

        throw error;
      }
    },
    [addActivity],
  );
  const loadSales = useCallback(async () => {
    if (!isAuthenticated) {
      setSales([]);
      setSalesSummary(null);
      return;
    }

    try {
      setSalesLoading(true);
      setSalesError("");

      const [salesResponse, summaryResponse] = await Promise.all([
        getSalesApi(),
        getSalesSummaryApi(),
      ]);

      const saleList = Array.isArray(salesResponse.data)
        ? salesResponse.data.map(normalizeSale)
        : [];

      setSales(saleList);

      setSalesSummary(summaryResponse.data || null);
    } catch (error) {
      setSales([]);
      setSalesSummary(null);

      setSalesError(error.message || "Unable to load sales");
    } finally {
      setSalesLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) {
      setSales([]);
      setSalesSummary(null);
      setSalesError("");

      return;
    }

    loadSales();
  }, [isAuthenticated, user?._id, loadSales]);
  const recordSale = useCallback(
    async ({ productId, quantity, note = "" }) => {
      try {
        setSalesError("");

        const numericQuantity = Number(quantity);

        if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
          throw new Error("Enter a valid sale quantity");
        }

        const response = await createSaleApi({
          productId,
          quantity: numericQuantity,
          note,
        });

        const createdSale = normalizeSale(response.data.sale);

        const updatedProduct = normalizeProduct(response.data.product);

        const transaction = normalizeInventoryTransaction(
          response.data.transaction,
        );

        setSales((current) => [createdSale, ...current]);

        setProducts((current) =>
          current.map((product) =>
            String(product._id) === String(updatedProduct._id)
              ? updatedProduct
              : product,
          ),
        );

        setInventoryLogs((current) => [transaction, ...current]);

        setSalesSummary((current) => ({
          totalRevenue:
            Number(current?.totalRevenue || 0) + createdSale.revenue,

          totalUnitsSold:
            Number(current?.totalUnitsSold || 0) + createdSale.quantity,

          totalSaleTransactions:
            Number(current?.totalSaleTransactions || 0) + 1,

          averageSale: 0,

          topProducts: current?.topProducts || [],
        }));

        await loadSales();

        addActivity(
          `Recorded sale of ${createdSale.quantity} units of ${updatedProduct.name}`,
        );

        toast.success("Sale recorded");

        return createdSale;
      } catch (error) {
        setSalesError(error.message || "Unable to record sale");

        toast.error(error.message || "Unable to record sale");

        throw error;
      }
    },
    [addActivity, loadSales],
  );
  const loadReport = useCallback(async () => {
    if (!isAuthenticated) {
      setReportData(null);
      return null;
    }

    try {
      setReportLoading(true);
      setReportError("");

      const response = await getReportSummaryApi();

      setReportData(response.data || null);

      return response.data;
    } catch (error) {
      setReportData(null);

      setReportError(error.message || "Unable to load report");

      throw error;
    } finally {
      setReportLoading(false);
    }
  }, [isAuthenticated]);
  const loadDeadStock = useCallback(
    async (days = 90) => {
      if (!isAuthenticated) {
        setBackendDeadStockProducts([]);

        return [];
      }

      try {
        setDeadStockLoading(true);

        setDeadStockError("");

        const response = await getDeadStockApi(days);

        const productList = Array.isArray(response.data?.products)
          ? response.data.products.map(normalizeProduct)
          : [];

        setBackendDeadStockProducts(productList);

        return productList;
      } catch (error) {
        setBackendDeadStockProducts([]);

        setDeadStockError(error.message || "Unable to load dead stock");

        throw error;
      } finally {
        setDeadStockLoading(false);
      }
    },
    [isAuthenticated],
  );
  const loadReorderPlans = useCallback(async () => {
    if (!isAuthenticated) {
      setReorderPlans([]);
      return [];
    }

    try {
      setReorderLoading(true);

      setReorderError("");

      const response = await getReorderPlansApi();

      const plans = Array.isArray(response.data) ? response.data : [];

      setReorderPlans(plans);

      return plans;
    } catch (error) {
      setReorderPlans([]);

      setReorderError(error.message || "Unable to load reorder plans");

      throw error;
    } finally {
      setReorderLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) {
      setReportData(null);

      setBackendDeadStockProducts([]);

      setReorderPlans([]);

      return;
    }

    loadDeadStock();
    loadReorderPlans();
  }, [isAuthenticated, user?._id, loadDeadStock, loadReorderPlans]);
  const createReorderPlan = useCallback(async (planData = {}) => {
    try {
      setReorderError("");

      const response = await createReorderPlanApi(planData);

      const createdPlan = response.data;

      setReorderPlans((current) => [createdPlan, ...current]);

      toast.success("Reorder plan created");

      return createdPlan;
    } catch (error) {
      setReorderError(error.message || "Unable to create reorder plan");

      toast.error(error.message || "Unable to create reorder plan");

      throw error;
    }
  }, []);

  const updateReorderPlan = useCallback(async (reorderId, updates) => {
    try {
      setReorderError("");

      const response = await updateReorderPlanApi(reorderId, updates);

      const updatedPlan = response.data;

      setReorderPlans((current) =>
        current.map((plan) =>
          String(plan._id) === String(updatedPlan._id) ? updatedPlan : plan,
        ),
      );

      toast.success("Reorder plan updated");

      return updatedPlan;
    } catch (error) {
      setReorderError(error.message || "Unable to update reorder plan");

      throw error;
    }
  }, []);

  const deleteReorderPlan = useCallback(async (reorderId) => {
    try {
      setReorderError("");

      await deleteReorderPlanApi(reorderId);

      setReorderPlans((current) =>
        current.filter((plan) => String(plan._id) !== String(reorderId)),
      );

      toast.success("Reorder plan deleted");

      return true;
    } catch (error) {
      setReorderError(error.message || "Unable to delete reorder plan");

      throw error;
    }
  }, []);

  const toggleDarkMode = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      await updatePreferences({
        darkMode: !darkMode,
      });
    } catch (error) {
      toast.error(error.message || "Unable to update theme");
    }
  }, [user, darkMode, updatePreferences]);
  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) => product.stock > 0 && product.stock <= product.minStock,
      ),
    [products],
  );
  const outOfStockProducts = useMemo(
    () => products.filter((product) => product.stock === 0),
    [products],
  );
  const deadStockProducts = backendDeadStockProducts;
  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.price * product.stock,
        0,
      ),
    [products],
  );
  const analytics = useMemo(() => {
    const totalRevenue = sales.reduce(
      (total, sale) => total + Number(sale.revenue),
      0,
    );

    const totalUnitsSold = sales.reduce(
      (total, sale) => total + Number(sale.quantity),
      0,
    );

    const topProducts = products
      .map((product) => {
        const productSales = sales.filter(
          (sale) => String(sale.productId) === String(product._id),
        );

        const sold = productSales.reduce(
          (total, sale) => total + Number(sale.quantity),
          0,
        );

        const salesRevenue = productSales.reduce(
          (total, sale) => total + Number(sale.revenue),
          0,
        );

        return {
          ...product,
          sold,
          salesRevenue,
        };
      })
      .sort((first, second) => second.sold - first.sold)
      .slice(0, 5);

    return {
      totalRevenue,

      totalUnitsSold,

      totalSaleTransactions: sales.length,

      averageSale: sales.length > 0 ? totalRevenue / sales.length : 0,

      topProducts,
    };
  }, [products, sales]);
  const inventoryHealthScore = useMemo(
    () =>
      Math.max(
        0,
        100 -
          lowStockProducts.length * 5 -
          outOfStockProducts.length * 8 -
          deadStockProducts.length * 10,
      ),
    [
      lowStockProducts.length,
      outOfStockProducts.length,
      deadStockProducts.length,
    ],
  );
  const dashboardStats = useMemo(
    () => ({
      totalProducts: products.length,
      totalSuppliers: suppliers.length,
      totalSales: sales.length,
      totalRevenue: analytics.totalRevenue,
      inventoryValue,
      lowStockCount: lowStockProducts.length,
      deadStockCount: deadStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
    }),
    [
      products.length,
      suppliers.length,
      sales.length,
      analytics.totalRevenue,
      inventoryValue,
      lowStockProducts.length,
      deadStockProducts.length,
      outOfStockProducts.length,
    ],
  );
  const value = useMemo(
    () => ({
      products,
      productsLoading,
      productsError,
      loadProducts,

      suppliers,
      suppliersLoading,
      suppliersError,

      sales,
      salesLoading,
      salesError,
      salesSummary,
      loadSales,
      inventoryLoading,
      inventoryError,
      loadInventoryLogs,
      inventoryLogs,
      activities,
      darkMode,

      lowStockProducts,
      outOfStockProducts,
      deadStockProducts,

      inventoryValue,
      inventoryHealthScore,

      analytics,
      dashboardStats,

      addProduct,
      updateProduct,
      deleteProduct,

      loadSuppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      reportData,
      reportLoading,
      reportError,
      loadReport,
      deadStockLoading,
      deadStockError,
      loadDeadStock,

      reorderPlans,
      reorderLoading,
      reorderError,
      loadReorderPlans,
      createReorderPlan,
      updateReorderPlan,
      deleteReorderPlan,
      adjustStock,
      recordSale,
      toggleDarkMode,
    }),
    [
      products,
      productsLoading,
      productsError,
      loadProducts,

      suppliers,
      suppliersLoading,
      suppliersError,

      sales,
      salesLoading,
      salesError,
      salesSummary,
      loadSales,

      inventoryLoading,
      inventoryError,
      loadInventoryLogs,
      inventoryLogs,

      activities,
      darkMode,

      lowStockProducts,
      outOfStockProducts,
      deadStockProducts,

      inventoryValue,
      inventoryHealthScore,

      analytics,
      dashboardStats,

      addProduct,
      updateProduct,
      deleteProduct,

      loadSuppliers,
      reportData,
      reportLoading,
      reportError,
      loadReport,
      deadStockLoading,
      deadStockError,
      loadDeadStock,

      reorderPlans,
      reorderLoading,
      reorderError,
      loadReorderPlans,
      createReorderPlan,
      updateReorderPlan,
      deleteReorderPlan,

      adjustStock,
      recordSale,
      toggleDarkMode,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
