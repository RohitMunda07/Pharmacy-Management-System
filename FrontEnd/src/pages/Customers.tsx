import { FormEvent, useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchCustomers, fetchPurchaseHistory, createCustomer, deleteCustomer, updateCustomer } from "../services/customer.service";

export default function Customers() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "PHARMACIST";

  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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

  async function handleSubmitCustomer(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setSubmitError("Name and phone number are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateCustomer(editingId, {
          name: form.name,
          phone: form.phone,
          address: form.address || undefined,
        });
        setEditingId(null);
      } else {
        await createCustomer({
          name: form.name,
          phone: form.phone,
          address: form.address || undefined,
        });
      }

      setForm({ name: "", phone: "", address: "" });
      setShowAdd(false);
      setSubmitError("");
      await refetch();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || (editingId ? "Unable to update customer." : "Unable to add customer."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCustomer(customerId: string) {
    setDeletingId(customerId);
    try {
      // check for purchase history first to avoid backend 400
      const history = await fetchPurchaseHistory(customerId);
      if ((history || []).length > 0) {
        setSubmitError("Cannot delete a customer with recorded sales history.");
        return;
      }

      await deleteCustomer(customerId);
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
      }
      await refetch();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Unable to delete customer.");
    } finally {
      setDeletingId(null);
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

      <div className="split-grid" style={{ gridTemplateColumns: "1fr" }}>
        <section className="content-card">
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <div className="search-box">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, phone, or address"
              />
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {canManage && (
                <button type="button" className="btn primary" onClick={() => { setShowAdd((s) => !s); setForm({ name: "", phone: "", address: "" }); }}>
                  {showAdd ? "Close" : "Add customer"}
                </button>
              )}
            </div>
          </div>

          {canManage && showAdd && (
            <Modal
              title={editingId ? "Edit customer" : "Add new customer"}
              onClose={() => { setShowAdd(false); setEditingId(null); setForm({ name: "", phone: "", address: "" }); setSubmitError(""); }}
            >
              <form onSubmit={handleSubmitCustomer}>
                <div className="form-grid">

                  <div className="field full">
                    <label htmlFor="customer-name">Full name</label>
                    <input id="customer-name" className="rounded-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Kumar" />
                  </div>

                  <div className="field full">
                    <label htmlFor="customer-phone">Phone</label>
                    <input id="customer-phone" className="rounded-input" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>

                  <div className="field full">
                    <label htmlFor="customer-address">Address (optional)</label>
                    <input id="customer-address" className="rounded-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" />
                  </div>
                </div>

                {submitError && <p className="form-error">{submitError}</p>}

                <div className="form-actions">
                  <button type="submit" className="btn primary" disabled={submitting}>
                    {submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update customer" : "Add customer")}
                  </button>
                </div>
              </form>
            </Modal>
          )}

          <div className="data-list">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">No customer matches the current filter.</div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="list-item" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerId(customer.id)}
                    style={{ textAlign: "left", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
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

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {canManage && (
                            <>
                              <button
                                type="button"
                                className="btn secondary"
                                onClick={() => {
                                  // open modal in edit mode
                                  setEditingId(customer.id);
                                  setForm({ name: customer.name || "", phone: customer.phone || "", address: customer.address || "" });
                                  setShowAdd(true);
                                }}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn danger"
                                onClick={() => handleDeleteCustomer(customer.id)}
                                disabled={deletingId === customer.id}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {deletingId === customer.id ? "Deleting..." : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="content-card">
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
                    <strong>{sale.medicine?.name ?? "(unknown medicine)"}</strong>
                    <small>{new Date(sale.soldAt).toLocaleDateString()}</small>
                  </div>
                  <div className="right">
                    <strong>₹{(sale.total ?? 0).toFixed(2)}</strong>
                    <small>{sale.quantity ?? 0} units</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
