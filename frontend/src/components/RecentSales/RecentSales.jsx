import { useContext } from "react";

import { DataContext } from "../../context/DataContext";

function RecentSales() {
  const { sales, products } = useContext(DataContext);

  const recentSales = sales.slice(0, 5);

  const productName = (sale) => {
    if (sale.product?.name) {
      return sale.product.name;
    }

    return (
      products.find((product) => String(product._id) === String(sale.productId))
        ?.name || "Deleted product"
    );
  };

  return (
    <section>
      <h2>Recent sales</h2>

      {recentSales.map((sale) => (
        <article key={sale._id}>
          <strong>{productName(sale)}</strong>

          <span>
            {sale.quantity} units, ₹
            {Number(sale.revenue).toLocaleString("en-IN")}
          </span>
        </article>
      ))}
    </section>
  );
}

export default RecentSales;
