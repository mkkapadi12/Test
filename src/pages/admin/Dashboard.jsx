import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ShieldCheck,
  LogOut,
  Package,
  LayoutDashboard,
  DollarSign,
  BarChart3,
  AlertCircle,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  getAdminProfile,
  logout,
} from "@/Store/features/admin/admin.auth.slice";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from "@/Store/features/product/admin.product.slice";

const Dashboard = () => {
  const { admin, loading } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState([]);

  const fileInputRef = useRef(null);

  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      exp_date: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAdminProfile());
  }, [dispatch]);

  console.log("Admin:", admin);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setImages((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Adding product...");
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const result = await dispatch(createProduct(formData)).unwrap();
      toast.success(result.msg || "Product added successfully!", {
        id: toastId,
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Operation failed",
        { id: toastId },
      );
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting product...");
    try {
      const result = await dispatch(deleteProduct(id)).unwrap();
      toast.success(result.msg || "Product deleted!", { id: toastId });
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Delete failed",
        { id: toastId },
      );
    }
  };

  const adminLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate some simple stats
  const totalProducts = products?.length || 0;
  const lowStockItems = products?.filter((p) => p.stock < 10).length || 0;
  const totalValue =
    products?.reduce((acc, p) => acc + p.price * p.stock, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <ShieldCheck className="w-6 h-6" />
            <span>AdminPortal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold leading-none">
                {admin?.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">Administrator</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-gray-500 hover:text-red-600 transition-colors"
              onClick={adminLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Statistics Section */}
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

        {/* Inventory Section */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-gray-900" />
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Inventory Management
                </h2>
                <p className="text-gray-500 text-sm">
                  Review and update your product catalog.
                </p>
              </div>
            </div>

            {/* Add Product Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold h-10 px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Add New Product
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new item to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Premium Cotton Tee"
                        {...form.register("name", {
                          required: "Name is required",
                        })}
                        className="border-gray-300 focus-visible:ring-gray-900"
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        {...form.register("price", {
                          required: "Price is required",
                        })}
                        className="border-gray-300 focus-visible:ring-gray-900"
                      />
                      {form.formState.errors.price && (
                        <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                          {form.formState.errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="stock"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Stock Quantity
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="100"
                        {...form.register("stock", {
                          required: "Stock is required",
                        })}
                        className="border-gray-300 focus-visible:ring-gray-900"
                      />
                      {form.formState.errors.stock && (
                        <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                          {form.formState.errors.stock.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="exp_date"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Expiration Date
                      </Label>
                      <Input
                        id="exp_date"
                        type="date"
                        {...form.register("exp_date", {
                          required: "Date is required",
                        })}
                        className="border-gray-300 focus-visible:ring-gray-900"
                      />
                      {form.formState.errors.exp_date && (
                        <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                          {form.formState.errors.exp_date.message}
                        </p>
                      )}
                    </div>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div
                        className="cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium">
                          Click or drag images here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload up to 4 images (PNG, JPG)
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      className="w-full bg-gray-900 text-white hover:bg-gray-800 font-bold h-11"
                    >
                      Save Product
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="w-[80px] text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pl-6 text-center">
                    Image
                  </TableHead>
                  <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                    Product Details
                  </TableHead>
                  <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                    Price
                  </TableHead>
                  <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                    Stock
                  </TableHead>
                  <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                    Discount
                  </TableHead>
                  <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow
                      key={product._id}
                      className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <TableCell className="pl-6 py-4 flex justify-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={
                              product.images[0]?.url ||
                              "https://placehold.co/100x100?text=No+Img"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5">
                            ID: {product._id?.substring(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-900">
                        ${product.price?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold leading-none ${product.stock < 10 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-gray-400 text-xs">None</span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-48 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 opacity-20" />
                        <p>No products found in your inventory.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AdminPortal. System V1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
