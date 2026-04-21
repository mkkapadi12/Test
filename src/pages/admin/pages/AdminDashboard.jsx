import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Package, DollarSign, BarChart3, AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAdminProfile } from "@/Store/features/admin/admin.auth.slice";
import { getAllProducts } from "@/Store/features/product/admin.product.slice";

const AdminDashboard = () => {
  const { admin, loading: adminLoading } = useSelector((state) => state.admin);
  const { products, loading: productsLoading } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAdminProfile());
  }, [dispatch]);

  const totalProducts = products?.length || 0;
  const lowStockItems = products?.filter((p) => p.stock < 10).length || 0;
  const totalValue =
    products?.reduce((acc, p) => acc + p.price * p.stock, 0) || 0;

  if (adminLoading || productsLoading) {
    return <div className="p-8">Loading dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {admin?.name || "Administrator"}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Here is the current overview of your platform metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Package className="w-16 h-16" />
          </div>
          <CardHeader className="p-6 pb-2">
            <CardDescription className="text-gray-500 font-medium uppercase tracking-wider text-xs">
              Total Products
            </CardDescription>
            <CardTitle className="text-3xl font-bold mt-1">
              {totalProducts}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Live inventory count
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <AlertCircle className="w-16 h-16" />
          </div>
          <CardHeader className="p-6 pb-2">
            <CardDescription className="text-gray-500 font-medium uppercase tracking-wider text-xs">
              Low Stock Alerts
            </CardDescription>
            <CardTitle
              className={`text-3xl font-bold mt-1 ${lowStockItems > 0 ? "text-red-600" : "text-gray-900"}`}
            >
              {lowStockItems}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Items with stock below 10
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <DollarSign className="w-16 h-16" />
          </div>
          <CardHeader className="p-6 pb-2">
            <CardDescription className="text-gray-500 font-medium uppercase tracking-wider text-xs">
              Inventory Value
            </CardDescription>
            <CardTitle className="text-3xl font-bold mt-1">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Aggregated stock valuation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
