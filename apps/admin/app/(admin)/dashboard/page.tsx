export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Summary stats will load here in Phase 2 (
        <code className="rounded bg-slate-100 px-1">GET /api/admin/dashboard</code>
        ).
      </p>
    </div>
  );
}
