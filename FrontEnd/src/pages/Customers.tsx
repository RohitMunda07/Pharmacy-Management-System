import { FormEvent, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers, fetchPurchaseHistory, createCustomer } from "../services/customer.service";

export default function Customers() {
  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.address ?? ""].some((value) => value.toLowerCase().includes(term))
    );
  }, [customers, search]);

  const { data: purchaseHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["customer-history", selectedCustomerId],
    queryFn: () => (selectedCustomerId ? fetchPurchaseHistory(selectedCustomerId) : Promise.resolve([])),
    enabled: Boolean(selectedCustomerId),
  });

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  async function handleAddCustomer(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError("Name and phone number are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createCustomer({
        name: form.name,
        phone: form.phone,
        address: form.address || undefined,
      });
      setForm({ name: "", phone: "", address: "" });
      setSubmitError("");
      await refetch();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Unable to add customer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <div className="page-container"><div className="empty-state">Loading customers...</div></div>;
  if (error) return <div className="page-container"><div className="empty-state">Failed to load customer data.</div></div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="headline">Customers</h1>
          <p className="subtitle">View pharmacy customers and their purchase history.</p>
        </div>
        <span className="pill">{customers.length} profiles</span>
      </header>

      <div className="split-grid">
        <section className="content-card">
          <div className="toolbar">
            <div className="search-box">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, phone, or address"
              />
            </div>
          </div>

          <div className="data-list">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">No customer matches the current filter.</div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="list-item"
                  onClick={() => setSelectedCustomerId(customer.id)}
                  style={{ textAlign: "left", width: "100%", background: selectedCustomerId === customer.id ? "#eff6ff" : "#f8fafc" }}
                >
                  <div>
                    <strong>{customer.name}</strong>
                    <small>{customer.phone}</small>
                  </div>
                  <div className="right">
                    <strong>{customer.address || "No address"}</strong>
                    <small>{customer.address ? "Profile" : "Add address"}</small>
                  </div>
                </button>
              ))
            )}
          </div>
          
          <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>Add new customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="customer-name">Full name</label>
                  <input
                    id="customer-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="field full">
                  <label htmlFor="customer-phone">Phone</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="field full">
                  <label htmlFor="customer-address">Address (optional)</label>
                  <input
                    id="customer-address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              {submitError && <p className="form-error">{submitError}</p>}

              <div className="form-actions">
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add customer"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="content-card">
          <div className="card-title-row">
            <h2 className="card-title">Purchase history</h2>
            {selectedCustomer && <span className="badge">{selectedCustomer.name}</span>}
          </div>

          {!selectedCustomer ? (
            <div className="empty-state">Select a customer to view their recent purchases.</div>
          ) : loadingHistory ? (
            <div className="empty-state">Loading purchase history...</div>
          ) : purchaseHistory.length === 0 ? (
            <div className="empty-state">No purchases recorded for this customer yet.</div>
          ) : (
            <div className="data-list">
              {purchaseHistory.map((sale) => (
                <div key={sale.id} className="list-item">
                  <div>
                    <strong>{sale.medicine.name}</strong>
                    <small>{new Date(sale.soldAt).toLocaleDateString()}</small>
                  </div>
                  <div className="right">
                    <strong>${sale.total.toFixed(2)}</strong>
                    <small>{sale.quantity} units</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
