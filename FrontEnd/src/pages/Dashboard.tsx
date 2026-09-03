import { useQuery } from "@tanstack/react-query";
import StockChart from "../components/dashboard/StockChart";
import { fetchMedicines } from "../services/medicine.service";
import { fetchSales } from "../services/sale.service";

export default function Dashboard() {
  const { data: medicines = [], isLoading: loadingMedicines } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
  });

  const { data: sales = [], isLoading: loadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  const lowStockItems = medicines.filter((medicine) => medicine.quantity <= medicine.reorderLevel);
  const inventoryValue = medicines.reduce((sum, medicine) => sum + medicine.price * medicine.quantity, 0);
  const totalTodaySales = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="headline">Pharmacy dashboard</h1>
          <p className="subtitle">Overview of stock, customers, and revenue performance.</p>
        </div>
        <span className="pill">{loadingMedicines ? "Loading..." : `${medicines.length} items tracked`}</span>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Inventory value</span>
          <span className="value">₹{inventoryValue.toFixed(2)}</span>
          <div className="meta">
            <span>Medicine stock</span>
            <strong>{medicines.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="label">Low stock</span>
          <span className="value">{lowStockItems.length}</span>
          <div className="meta">
            <span>Needs review</span>
            <strong>{lowStockItems.length > 0 ? "Alert" : "Healthy"}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="label">Sales</span>
          <span className="value">₹{totalTodaySales.toFixed(2)}</span>
          <div className="meta">
            <span>Recent cash flow</span>
            <strong>{sales.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="label">Reorder risk</span>
          <span className="value">{Math.max(0, 100 - (lowStockItems.length * 25))}%</span>
          <div className="meta">
            <span>Risk index</span>
            <strong>{lowStockItems.length > 0 ? "Monitoring" : "Stable"}</strong>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <section className="content-card">
          <div className="card-title-row">
            <h2 className="card-title">Stock overview</h2>
            <span className="badge">Updated</span>
          </div>
          <StockChart />
        </section>

        <aside className="content-card">
          <div className="card-title-row">
            <h2 className="card-title">Low stock</h2>
            <span className="badge alert">{lowStockItems.length}</span>
          </div>

          {loadingMedicines ? (
            <div className="empty-state">Loading low stock items...</div>
          ) : lowStockItems.length === 0 ? (
            <div className="empty-state">All medicines are within reorder thresholds.</div>
          ) : (
            <div className="data-list">
              {lowStockItems.slice(0, 5).map((medicine) => (
                <div key={medicine.id} className="list-item">
                  <div>
                    <strong>{medicine.name}</strong>
                    <small>{medicine.category}</small>
                  </div>
                  <div className="right">
                    <strong className="low-stock">{medicine.quantity}</strong>
                    <small>left</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "1.2rem" }}>
            <div className="card-title-row" style={{ marginBottom: "0.75rem" }}>
              <h3 className="card-title">Sales activity</h3>
            </div>
            {loadingSales ? (
              <div className="empty-state">Loading sales...</div>
            ) : sales.length === 0 ? (
              <div className="empty-state">No sales recorded yet.</div>
            ) : (
              <div className="data-list">
                {sales.slice(0, 4).map((sale) => (
                  <div key={sale.id} className="list-item">
                    <div>
                      <strong>{sale.medicine.name}</strong>
                      <small>{new Date(sale.soldAt).toLocaleDateString()}</small>
                    </div>
                    <div className="right">
                      <strong>${sale.total.toFixed(2)}</strong>
                      <small>{sale.quantity} qty</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
