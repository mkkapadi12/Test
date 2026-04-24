import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminProfile } from "@/Store/features/admin/admin.auth.slice";
import { getAllProducts } from "@/Store/features/product/admin.product.slice";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import { ADMIN_ICONS } from "@/lib/icons/admin.icons";

const AdminDashboard = () => {
  const { admin, loading: adminLoading } = useSelector((state) => state.admin);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products,
  );
  const { allEnrollments } = useSelector((state) => state.enrollment) || {
    allEnrollments: [],
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAdminProfile());
  }, [dispatch]);

  const totalProducts = products?.length || 0;
  const lowStockItems = products?.filter((p) => p.stock < 10).length || 0;
  const totalValue =
    products?.reduce((acc, p) => acc + p.price * p.stock, 0) || 0;
  const totalEnrollments = allEnrollments?.length || 0;

  if (adminLoading || productsLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {admin?.name || "Administrator"}
          </h1>
          <span className="text-2xl sm:text-3xl" role="img" aria-label="wave">
            👋
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Here's what's happening with your platform today. Monitor key metrics
          and take action on important items.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Live inventory count"
          icon={ADMIN_ICONS.PACKAGE}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          trend={totalProducts > 0 ? "Active" : null}
        />
        <StatCard
          title="Low Stock"
          value={lowStockItems}
          subtitle="Items below 10 units"
          icon={ADMIN_ICONS.ALERT}
          iconBg={
            lowStockItems > 0
              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              : "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          }
        />
        <StatCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Aggregated valuation"
          icon={ADMIN_ICONS.DOLLARSIGN}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Enrollments"
          value={totalEnrollments}
          subtitle="Total student enrollments"
          icon={ADMIN_ICONS.USERS}
          iconBg="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <ADMIN_ICONS.ACTIVITY className="h-5 w-5 text-muted-foreground" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              title: "Manage Courses",
              desc: "Create and organize your educational content",
              icon: ADMIN_ICONS.BOOKOPEN,
              href: "/admin/all-courses",
            },
            {
              title: "Review Requests",
              desc: "Approve or reject pending enrollment requests",
              icon: ADMIN_ICONS.USERCHECK,
              href: "/admin/pending-requests",
            },
          ].map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <ADMIN_ICONS.ARROWUPRIGHT className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
