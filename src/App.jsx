import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, LayoutDashboard, ReceiptText,
  Target, Plus, Trash2, ArrowUpRight, ArrowDownLeft, ShoppingBag,
  Utensils, Bus, House, Clapperboard, HeartPulse, ShoppingCart, CircleHelp,
  Pencil, CheckCircle2, AlertTriangle, PiggyBank
} from "lucide-react";

const STORAGE_KEY = "spendsmart-transactions-v1";
const BUDGET_KEY = "spendsmart-budget-v1";
const categories = [
  "Food & groceries", "Transport", "Housing & bills",
  "Entertainment", "Shopping", "Health", "Other"
];
const categoryIcons = {
  "Food & groceries": Utensils,
  Transport: Bus,
  "Housing & bills": House,
  Entertainment: Clapperboard,
  Shopping: ShoppingCart,
  Health: HeartPulse,
  Other: CircleHelp,
};

const initialTransactions = [
  { id: "demo-1", description: "Groceries", category: "Food & groceries", type: "expense", amount: 620, date: "2026-10-20" },
  { id: "demo-2", description: "Monthly salary", category: "Income", type: "income", amount: 18000, date: "2026-10-01" },
  { id: "demo-3", description: "Public transport", category: "Transport", type: "expense", amount: 450, date: "2026-10-18" },
  { id: "demo-4", description: "Coffee", category: "Food & groceries", type: "expense", amount: 65, date: "2026-10-17" },
  { id: "demo-5", description: "Streaming subscription", category: "Entertainment", type: "expense", amount: 149, date: "2026-10-15" },
  { id: "demo-6", description: "New notebook", category: "Shopping", type: "expense", amount: 120, date: "2026-10-12" },
];

function readStoredTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTransactions;
  } catch {
    return initialTransactions;
  }
}

function money(value) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

function currentDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function monthLabel() {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date());
}

export default function App() {
  const [transactions, setTransactions] = useState(readStoredTransactions);
  const [budget, setBudget] = useState(() => {
    const saved = Number(localStorage.getItem(BUDGET_KEY));
    return Number.isFinite(saved) && saved >= 0 ? saved : 8000;
  });
  const [page, setPage] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(currentDate());
  const [budgetDraft, setBudgetDraft] = useState(String(budget));
  const [editingBudget, setEditingBudget] = useState(false);
  const [message, setMessage] = useState("");
  const [showDemo, setShowDemo] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, String(budget));
  }, [budget]);

  const expenses = useMemo(() => transactions.filter((t) => t.type === "expense"), [transactions]);
  const income = useMemo(() => transactions.filter((t) => t.type === "income"), [transactions]);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const budgetPercentage =
  budget > 0
    ? (totalExpense / budget) * 100
    : totalExpense > 0
      ? 100
      : 0;

  const displayedPercentage = Math.round(budgetPercentage);
  const progressWidth = Math.min(100, budgetPercentage);
  const visibleTransactions = transactions
    .filter((t) => filter === "All" || t.type === filter.toLowerCase())
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  function addTransaction(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim()) {
      setMessage("Please enter a description.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage("Please enter an amount greater than zero.");
      return;
    }
    setTransactions((current) => [{
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      description: description.trim(),
      category: type === "income" ? "Income" : category,
      type,
      amount: parsedAmount,
      date: date || currentDate(),
    }, ...current]);
    setDescription("");
    setAmount("");
    setDate(currentDate());
    setMessage("Transaction added.");
    setFilter("All");
  }

  function deleteTransaction(id) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
    setMessage("Transaction deleted.");
  }

  function saveBudget(event) {
    event.preventDefault();
    const value = Number(budgetDraft);
    if (!Number.isFinite(value) || value < 0 || budgetDraft.trim() === "") {
      setMessage("Enter a valid budget amount.");
      return;
    }
    setBudget(value);
    setEditingBudget(false);
    setMessage("Budget updated.");
  }

  function resetDemo() {
    setTransactions(initialTransactions);
    setBudget(8000);
    setMessage("Demo data has been restored.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setPage("Overview")}>
          <span className="brand-mark"><Wallet size={23} /></span>
          <span><strong>SpendSmart</strong><small>Personal finance</small></span>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <nav className="nav-list" aria-label="Main navigation">
          {[
            ["Overview", LayoutDashboard],
            ["Transactions", ReceiptText],
            ["Budget", Target],
          ].map(([label, Icon]) => (
            <button key={label} className={`nav-button ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setMessage(""); }}>
              <Icon size={19} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><PiggyBank size={21} /><strong>Small steps add up.</strong><p>Track your spending to understand where your money goes.</p></div>
          <p className="sidebar-foot">SpendSmart · Student project</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">PERSONAL FINANCE</span><h1>{page}</h1></div>
          <div className="topbar-right"><span className="date-chip">{monthLabel()}</span><span className="avatar">S</span></div>
        </header>

        {showDemo && (
          <div className="demo-notice">
            <span><strong>Demo data:</strong> These are example transactions, not your real bank information.</span>
            <button aria-label="Dismiss demo notice" onClick={() => setShowDemo(false)}>×</button>
          </div>
        )}

        {page === "Overview" && (
          <>
            <section className="hero-balance">
              <div className="hero-copy">
                <span className="hero-label"><Wallet size={16} /> TOTAL BALANCE</span>
                <strong className="balance-number">{money(balance)}</strong>
                <span className="hero-caption">Your income minus your recorded expenses</span>
              </div>
              <div className="hero-decoration"><div className="circle circle-one" /><div className="circle circle-two" /><Wallet size={58} strokeWidth={1.2} /></div>
            </section>

            <section className="stat-grid">
              <article className="stat-card">
                <div className="stat-top"><span className="stat-icon income-icon"><TrendingUp size={19} /></span><span className="stat-label">Total income</span></div>
                <strong>{money(totalIncome)}</strong><span className="stat-sub">Across all transactions</span>
              </article>
              <article className="stat-card">
                <div className="stat-top"><span className="stat-icon expense-icon"><TrendingDown size={19} /></span><span className="stat-label">Total expenses</span></div>
                <strong>{money(totalExpense)}</strong><span className="stat-sub">Across all transactions</span>
              </article>
              <article className="stat-card">
                <div className="stat-top"><span className="stat-icon budget-icon"><Target size={19} /></span><span className="stat-label">Budget remaining</span></div>
                <strong className={budget - totalExpense < 0 ? "negative" : ""}>{money(budget - totalExpense)}</strong><span className="stat-sub">From your monthly limit</span>
              </article>
            </section>

            <section className="content-grid">
              <article className="panel spending-panel">
                <div className="panel-heading"><div><h2>Spending by category</h2><p>Where your money is going</p></div><span className="heading-icon"><ReceiptText size={18} /></span></div>
                {categories.filter((item) => expenses.some((t) => t.category === item)).length ? (
                  <div className="category-list">
                    {categories.filter((item) => expenses.some((t) => t.category === item)).map((item, index) => {
                      const total = expenses.filter((t) => t.category === item).reduce((sum, t) => sum + t.amount, 0);
                      const Icon = categoryIcons[item] || CircleHelp;
                      const colors = ["#4b9674", "#7199d4", "#d4a35f", "#a38bd1", "#d27e72", "#67aeb0", "#9a9f9b"];
                      return <div className="category-row" key={item}>
                        <div className="category-top"><span className="category-name"><span className="category-icon" style={{ color: colors[index % colors.length] }}><Icon size={17} /></span>{item}</span><strong>{money(total)}</strong></div>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${totalExpense ? total / totalExpense * 100 : 0}%`, background: colors[index % colors.length] }} /></div>
                        <span className="category-percent">{totalExpense ? Math.round(total / totalExpense * 100) : 0}% of expenses</span>
                      </div>;
                    })}
                  </div>
                ) : <div className="empty-state"><ReceiptText size={28} /><p>No expenses yet. Add a transaction to see your breakdown.</p></div>}
              </article>

              <article className="panel budget-panel">
                <div className="panel-heading"><div><h2>Monthly budget</h2><p>Your spending limit</p></div><span className="heading-icon"><Target size={18} /></span></div>
                <div className="budget-total"><strong>{money(budget)}</strong><button className="text-button" onClick={() => { setBudgetDraft(String(budget)); setEditingBudget(true); setPage("Budget"); }}>Edit budget</button></div>
                <div className="budget-progress-label">
  <span>Spent {money(totalExpense)}</span>
  <span>{displayedPercentage}%</span>
</div>

<div className="progress-track budget-track">
  <div
    className={`progress-fill ${
      totalExpense > budget ? "over-budget" : ""
    }`}
    style={{ width: `${progressWidth}%` }}
  />
  </div>
                <div className="progress-track budget-track"><div className={`progress-fill ${totalExpense > budget ? "over-budget" : ""}`} style={{ width: `${budget > 0 ? Math.min(100, totalExpense / budget * 100) : totalExpense > 0 ? 100 : 0}%` }} /></div>
                <div className={`budget-message ${totalExpense > budget ? "warning" : ""}`}>{totalExpense > budget ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}<span>{totalExpense > budget ? `${money(totalExpense - budget)} over budget` : `${money(budget - totalExpense)} left to spend`}</span></div>
                <button className="secondary-button full-button" onClick={() => setPage("Budget")}>Manage budget <ArrowUpRight size={16} /></button>
              </article>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest recorded activity</p></div><button className="text-button" onClick={() => setPage("Transactions")}>View all <ArrowUpRight size={15} /></button></div>
              <TransactionList transactions={visibleTransactions.slice(0, 4)} onDelete={deleteTransaction} compact />
            </section>
          </>
        )}

        {page === "Transactions" && (
          <section className="transactions-page">
            <div className="page-intro"><div><h2>All transactions</h2><p>Add, filter, and manage your income and expenses.</p></div><span className="count-pill">{transactions.length} entries</span></div>
            <div className="transaction-layout">
              <article className="panel form-panel">
                <div className="panel-heading"><div><h2>Add transaction</h2><p>Enter the details below</p></div><span className="heading-icon"><Plus size={18} /></span></div>
                <form onSubmit={addTransaction} className="transaction-form">
                  <div className="segmented-control"><button type="button" className={type === "expense" ? "selected expense-selected" : ""} onClick={() => { setType("expense"); setCategory(categories[0]); }}>Expense</button><button type="button" className={type === "income" ? "selected income-selected" : ""} onClick={() => { setType("income"); setCategory("Income"); }}>Income</button></div>
                  <label>Description<input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Lunch or salary" maxLength={80} required /></label>
                  <label>Amount (NOK)<div className="amount-input"><span>kr</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div></label>
                  <label>Category<select value={type === "income" ? "Income" : category} disabled={type === "income"} onChange={(e) => setCategory(e.target.value)}>{(type === "income" ? ["Income"] : categories).map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
                  <button className="primary-button full-button" type="submit"><Plus size={17} /> Add transaction</button>
                  {message && <p className="form-message" role="status">{message}</p>}
                </form>
              </article>
              <article className="panel all-transactions-panel">
                <div className="panel-heading"><div><h2>Transaction history</h2><p>Newest first</p></div></div>
                <div className="filter-row">{["All", "Expense", "Income"].map((item) => <button key={item} className={`filter-button ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item === "Expense" ? "Expenses" : item === "Income" ? "Income" : "All"}</button>)}</div>
                <TransactionList transactions={visibleTransactions} onDelete={deleteTransaction} />
              </article>
            </div>
            {message && <p className="page-message" role="status">{message}</p>}
          </section>
        )}

        {page === "Budget" && (
          <section className="budget-page">
            <div className="page-intro"><div><h2>Budget planner</h2><p>Set a monthly limit and keep an eye on your spending.</p></div></div>
            <div className="budget-layout">
              <article className="panel budget-main-panel">
                <div className="panel-heading"><div><h2>Your monthly budget</h2><p>{monthLabel()}</p></div><span className="heading-icon"><Target size={18} /></span></div>
                {editingBudget ? (
                  <form onSubmit={saveBudget} className="budget-edit-form">
                    <label>Monthly limit (NOK)<div className="amount-input"><span>kr</span><input type="number" min="0" step="1" value={budgetDraft} onChange={(e) => setBudgetDraft(e.target.value)} required /></div></label>
                    <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setEditingBudget(false)}>Cancel</button><button type="submit" className="primary-button"><CheckCircle2 size={16} /> Save budget</button></div>
                  </form>
                ) : (
                  <div className="budget-big-number"><strong>{money(budget)}</strong><button className="secondary-button" onClick={() => { setBudgetDraft(String(budget)); setEditingBudget(true); }}><Pencil size={15} /> Edit limit</button></div>
                )}
                <div className="large-progress"><div className={`progress-fill ${totalExpense > budget ? "over-budget" : ""}`} style={{ width: `${budget > 0 ? Math.min(100, totalExpense / budget * 100) : totalExpense > 0 ? 100 : 0}%` }} /></div>
                <div className="budget-details"><div><span>Spent so far</span><strong>{money(totalExpense)}</strong></div><div><span>Remaining</span><strong className={budget - totalExpense < 0 ? "negative" : "positive"}>{money(budget - totalExpense)}</strong></div><div><span>Budget used</span><strong>{budget ? Math.round(totalExpense / budget * 100) : totalExpense ? 100 : 0}%</strong></div></div>
                <div className={`budget-message ${totalExpense > budget ? "warning" : ""}`}>{totalExpense > budget ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}<span>{totalExpense > budget ? "You've exceeded your budget. Review your spending categories." : "You're within your budget. Keep it up!"}</span></div>
                {message && <p className="form-message" role="status">{message}</p>}
              </article>
              <article className="panel budget-tips-panel"><div className="panel-heading"><div><h2>Spending summary</h2><p>By category</p></div></div>{categories.filter((item) => expenses.some((t) => t.category === item)).map((item) => <div className="mini-category" key={item}><span>{item}</span><strong>{money(expenses.filter((t) => t.category === item).reduce((sum, t) => sum + t.amount, 0))}</strong></div>)}{expenses.length === 0 && <p className="muted">No spending recorded yet.</p>}</article>
            </div>
          </section>
        )}
        <footer className="footer"><span>SpendSmart</span><span>Personal finance, made simple</span><button onClick={resetDemo}>Restore demo data</button></footer>
      </main>
    </div>
  );
}

function TransactionList({ transactions, onDelete, compact = false }) {
  if (!transactions.length) return <div className="empty-state"><ReceiptText size={28} /><p>No transactions found. Add one to get started.</p></div>;
  return <div className="transaction-list">{transactions.map((transaction) => {
    const Icon = transaction.type === "income" ? Wallet : (categoryIcons[transaction.category] || ShoppingBag);
    return <div className="transaction-row" key={transaction.id}>
      <span className={`transaction-icon ${transaction.type === "income" ? "transaction-income" : ""}`}><Icon size={18} /></span>
      <div className="transaction-info"><strong>{transaction.description}</strong><span>{transaction.category} · {new Date(`${transaction.date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></div>
      <strong className={`transaction-amount ${transaction.type === "income" ? "positive" : ""}`}>{transaction.type === "income" ? "+" : "−"}{money(transaction.amount)}</strong>
      {!compact && <button className="delete-button" aria-label={`Delete ${transaction.description}`} title="Delete transaction" onClick={() => onDelete(transaction.id)}><Trash2 size={16} /></button>}
    </div>;
  })}</div>;
}
