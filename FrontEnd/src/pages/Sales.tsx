import { FormEvent, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchCustomers } from "../services/customer.service";
import { fetchMedicines } from "../services/medicine.service";
import { createSale, fetchSales, updateSale } from "../services/sale.service";

export default function Sales() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "PHARMACIST";

  const { data: medicines = [], isLoading: isLoadingMedicines } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const { data: sales = [], isLoading: isLoadingSales, refetch: refetchSales } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  const [medicineId, setMedicineId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);

  const selectedMedicine = useMemo(() => {
    if (!medicineId || !medicineId.trim() || medicines.length === 0) return null;
    return medicines.find((m) => String(m.id).trim() === String(medicineId).trim()) ?? null;
  }, [medicineId, medicines]);

  const total = useMemo(() => {
    if (!selectedMedicine) return 0;
    return selectedMedicine.price * quantity;
  }, [quantity, selectedMedicine]);

  function resetForm() {
    setMedicineId("");
    setCustomerId("");
    setQuantity(1);
    setEditingSaleId(null);
    setError("");
  }

  function handleEditSale(sale: typeof sales[number]) {
    setEditingSaleId(sale.id);
    setMedicineId(sale.medicine.id);
    setCustomerId(sale.customer.id);
    setQuantity(sale.quantity);
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!medicineId || medicineId.trim() === "") {
      setError("Please select a medicine.");
      return;
    }

    if (!customerId || customerId.trim() === "") {
      setError("Please select a customer.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (!selectedMedicine) {
      setError("Selected medicine is not available. Please reload the page and try again.");
      return;
    }

    if (selectedMedicine.quantity < quantity && !editingSaleId) {
      setError(
        `Insufficient stock for ${selectedMedicine.name}. Available: ${selectedMedicine.quantity}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSaleId) {
        await updateSale(editingSaleId, { medicineId, customerId, quantity });
      } else {
        await createSale({ medicineId, customerId, quantity });
      }

      resetForm();
      await refetchSales();
    } catch (err: any) {
      console.error("Sale error:", err);
      setError(err.response?.data?.message || "Unable to save the sale.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="headline">Sales</h1>
          <p className="subtitle">Record every pharmacy transaction and track recent activity.</p>
        </div>
        <span className="pill">{sales.length} recent sales</span>
      </header>

      <div className="split-grid">
        {canManage && (
          <section className="form-panel">
            <div className="card-title-row">
              <h2 className="card-title">{editingSaleId ? "Edit sale" : "Create sale"}</h2>
              {editingSaleId && (
                <button type="button" className="btn secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="medicine">Medicine {isLoadingMedicines && "(Loading...)"}</label>
                  <select id="medicine" value={medicineId} onChange={(e) => setMedicineId(e.target.value)} disabled={isLoadingMedicines}>
                    <option value="">{isLoadingMedicines ? "Loading medicines..." : "Select medicine"}</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} · ${medicine.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {medicines.length === 0 && !isLoadingMedicines && (
                    <small style={{ color: "#e11d48" }}>No medicines available. Add medicines first.</small>
                  )}
                </div>

                <div className="field full">
                  <label htmlFor="customer">Customer {isLoadingCustomers && "(Loading...)"}</label>
                  <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} disabled={isLoadingCustomers}>
                    <option value="">{isLoadingCustomers ? "Loading customers..." : "Select customer"}</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} · {customer.phone}
                      </option>
                    ))}
                  </select>
                  {customers.length === 0 && !isLoadingCustomers && (
                    <small style={{ color: "#e11d48" }}>No customers available. Add customers first.</small>
                  )}
                </div>

                <div className="field full">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={selectedMedicine?.quantity ?? 999}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  />
                  {selectedMedicine && (
                    <small style={{ color: "#666" }}>
                      Max available: {selectedMedicine.quantity}
                    </small>
                  )}
                </div>
              </div>

              {selectedMedicine && (
                <div className="demo-box" style={{ marginTop: "1rem" }}>
                  <strong>{selectedMedicine.name}</strong>
                  <div className="muted">Unit price: ${selectedMedicine.price.toFixed(2)} · Estimated total: ${total.toFixed(2)}</div>
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <div className="form-actions">
                <button type="submit" className="btn primary" disabled={isSubmitting}>
                  {isSubmitting ? (editingSaleId ? "Updating..." : "Processing...") : (editingSaleId ? "Update sale" : "Record sale")}
                </button>
              </div>
            </form>
          </section>
        )}

        <aside className="list-panel content-card">
          <div className="card-title-row">
            <h2 className="card-title">Recent sales</h2>
            <span className="badge">Live</span>
          </div>

          {isLoadingSales ? (
            <div className="empty-state">Loading sales...</div>
          ) : sales.length === 0 ? (
            <div className="empty-state">No sales recorded yet.</div>
          ) : (
            <div className="data-list">
              {sales.map((sale) => (
                <div key={sale.id} className="list-item" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <strong>{sale.medicine.name}</strong>
                    <small>{sale.customer.name}</small>
                  </div>
                  <div className="right">
                    <strong>${sale.total.toFixed(2)}</strong>
                    <small>{sale.quantity} qty</small>
                  </div>

                  {canManage && (
                    <button type="button" className="btn secondary" onClick={() => handleEditSale(sale)}>
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
