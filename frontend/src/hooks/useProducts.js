import { useContext } from "react";
import { DataContext } from "../context/DataContext";
export function useProducts() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useProducts must be used inside DataProvider");
    }
    return {
        products: context.products,
        suppliers: context.suppliers,
        addProduct: context.addProduct,
        updateProduct: context.updateProduct,
        deleteProduct: context.deleteProduct,
    };
}
