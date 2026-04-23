import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Package, Upload, LayoutDashboard } from "lucide-react";

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
  createProduct,
  deleteProduct,
  getAllProducts,
} from "@/Store/features/product/admin.product.slice";

const AdminProducts = () => {
  const { products, loading } = useSelector((state) => state.products);
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

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

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

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-gray-900" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Products Management
              </h2>
              <p className="text-gray-500 text-sm">
                Review and update your product catalog.
              </p>
            </div>
          </div>

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
              {products?.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product._id}
                    className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4 flex justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={
                            product.images?.[0]?.url ||
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
                      <p>No products found in your catalog.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default AdminProducts;
