import { useContext, useState } from "react";

import { DataContext } from "../../context/DataContext";

import styles from "./ReorderList.module.css";

function ReorderList() {
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const {
    reorderPlans,
    reorderLoading,
    reorderError,
    updateReorderPlan,
    deleteReorderPlan,
  } = useContext(DataContext);
  const handleStatusUpdate = async (planId, status) => {
    try {
      setPendingPlanId(planId);

      await updateReorderPlan(planId, {
        status,
      });
    } finally {
      setPendingPlanId(null);
    }
  };

  const handleDelete = async (planId) => {
    try {
      setPendingPlanId(planId);

      await deleteReorderPlan(planId);
    } finally {
      setPendingPlanId(null);
    }
  };

  if (reorderLoading) {
    return <div className={styles.page}>Loading reorder plans...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Reorder Plans</h1>

          <p>Review planned stock replenishment.</p>
        </div>
      </header>

      {reorderError && (
        <div className={styles.error} role="alert">
          {reorderError}
        </div>
      )}

      {reorderPlans.length === 0 ? (
        <div className={styles.empty}>
          <h2>No Reorder Plans</h2>

          <p>Create a plan from the Low Stock page.</p>
        </div>
      ) : (
        <div className={styles.planList}>
          {reorderPlans.map((plan) => (
            <article key={plan._id} className={styles.planCard}>
              <header>
                <div>
                  <h2>Reorder Plan</h2>

                  <small>
                    {new Date(plan.createdAt).toLocaleString("en-IN")}
                  </small>
                </div>

                <span>{plan.status}</span>
              </header>

              <div className={styles.summary}>
                <div>
                  <span>Products</span>

                  <strong>{plan.items.length}</strong>
                </div>

                <div>
                  <span>Units</span>

                  <strong>{plan.totalUnits}</strong>
                </div>
              </div>

              <div className={styles.items}>
                {plan.items.map((item) => (
                  <div key={item._id} className={styles.item}>
                    <div>
                      <strong>{item.productName}</strong>

                      <small>{item.sku}</small>
                    </div>

                    <div>
                      <span>Current</span>

                      <strong>{item.currentStock}</strong>
                    </div>

                    <div>
                      <span>Minimum</span>

                      <strong>{item.minimumStock}</strong>
                    </div>

                    <div>
                      <span>Order</span>

                      <strong>+{item.requiredQuantity}</strong>
                    </div>

                    <div>
                      <span>Supplier</span>

                      <strong>{item.supplierCompany || "Not assigned"}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                {plan.status === "DRAFT" && (
                  <button
                    type="button"
                    disabled={pendingPlanId === plan._id}
                    onClick={() => handleStatusUpdate(plan._id, "ORDERED")}
                  >
                    {pendingPlanId === plan._id
                      ? "Updating..."
                      : "Mark Ordered"}
                  </button>
                )}

                {plan.status === "ORDERED" && (
                  <button
                    type="button"
                    disabled={pendingPlanId === plan._id}
                    onClick={() => handleStatusUpdate(plan._id, "ORDERED")}
                  >
                    {pendingPlanId === plan._id
                      ? "Updating..."
                      : "Mark Completed"}
                  </button>
                )}

                <button
                  type="button"
                  disabled={pendingPlanId === plan._id}
                  onClick={() => handleDelete(plan._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReorderList;
