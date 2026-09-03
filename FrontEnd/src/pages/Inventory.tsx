import { FormEvent, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createMedicine, fetchMedicines } from "../services/medicine.service";

export default function Inventory() {
  const { data: medicines = [], isLoading, error, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
  });

  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    reorderLevel: 0,
    price: 0,
    expiryDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const filteredMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return medicines;
    return medicines.filter((medicine) =>
      [medicine.name, medicine.category].some((field) => field.toLowerCase().includes(term))
    );
  }, [medicines, search]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    if (!form.name || !form.category || !form.expiryDate) {
      setSubmitError("Medicine name, category, and expiry date are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createMedicine({
        ...form,
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        price: Number(form.price),
      });
      setForm({
        name: "",
        category: "",
        quantity: 0,
        reorderLevel: 0,
        price: 0,
        expiryDate: "",
      });
      await refetch();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Unable to add medicine.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <div className="page-container"><div className="empty-state">Loading inventory...</div></div>;
  if (error) return <div className="page-container"><div className="empty-state">Failed to load medicines.</div></div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="headline">Inventory</h1>
          <p className="subtitle">Manage medicines, stock levels, and reorder triggers in one place.</p>
        </div>
        <span className="pill">{medicines.length} medicines</span>
      </header>

      <div className="split-grid">
        <section className="content-card">
          <div className="toolbar">
            <div className="search-box">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search medicines or category"
              />
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Reorder</th>
                  <th>Price</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state" style={{ margin: "0.75rem 0" }}>No medicines match your search.</div>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>
                        <div>
                          <strong>{medicine.name}</strong>
                        </div>
                      </td>
                      <td>{medicine.category}</td>
                      <td className={medicine.quantity <= medicine.reorderLevel ? "low-stock" : ""}>{medicine.quantity}</td>
                      <td>{medicine.reorderLevel}</td>
                      <td>${medicine.price.toFixed(2)}</td>
                      <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="form-panel">
          <div className="card-title-row">
            <h2 className="card-title">Add medicine</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="medicine-name">Medicine name</label>
                <input id="medicine-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="field full">
                <label htmlFor="category">Category</label>
                <input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>

              <div className="field">
                <label htmlFor="quantity">Quantity</label>
                <input id="quantity" type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>

              <div className="field">
                <label htmlFor="reorder-level">Reorder level</label>
                <input id="reorder-level" type="number" min={0} value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} />
              </div>

              <div className="field">
                <label htmlFor="price">Price</label>
                <input id="price" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>

              <div className="field">
                <label htmlFor="expiry-date">Expiry date</label>
                <input id="expiry-date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
            </div>

            {submitError && <p className="form-error" style={{ marginTop: "1rem" }}>{submitError}</p>}

            <div className="form-actions">
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? "Saving..." : "Add medicine"}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
