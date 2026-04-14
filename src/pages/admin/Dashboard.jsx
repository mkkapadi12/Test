import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getAdminProfile,
  logout,
} from "@/Store/features/admin/admin.auth.slice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { admin } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      discount: "",
      exp_date: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAdminProfile());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Adding product...");

    try {
      const result = await dispatch(createProduct(data)).unwrap();

      toast.success(result.msg || "Product added successfully!", {
        id: toastId,
      });

      form.reset();
    } catch (error) {
      console.log(error);
      toast.error(
        typeof error === "string" ? error : error?.message || "Login failed",
        { id: toastId },
      );
    }
  };

  const adminLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <div>
      <section className="container mx-auto max-w-7xl px-3">
        <div className="max-w-xl mx-auto">
          {/* admin profile */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
              <p>
                <strong>Name:</strong> {admin?.name}
              </p>
              <p>
                <strong>Email:</strong> {admin?.email}
              </p>
            </div>
            <div className="p-6 border-t">
              <Button onClick={() => adminLogout()}>Logout</Button>
            </div>
          </Card>
        </div>

        {/* heading */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl uppercase font-bold">All Products List</h1>
        </div>

        {/* product table */}
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead className="w-25">Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>

                <TableCell className="text-right">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">
                  {product.discount}%
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    onClick={() => dispatch(deleteProduct(product._id))}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
      <section className="max-w-xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name", {
                required: "Name is required",
              })}
            />
            {form.formState.errors.name && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              {...form.register("price", {
                required: "Price is required",
              })}
            />
            {form.formState.errors.price && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.price.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              {...form.register("quantity", {
                required: "Quantity is required",
              })}
            />
            {form.formState.errors.quantity && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.quantity.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              {...form.register("discount", {
                required: "Discount is required",
              })}
            />
            {form.formState.errors.discount && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.discount.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="exp_date">Expiration Date</Label>
            <Input
              id="exp_date"
              type="date"
              {...form.register("exp_date", {
                required: "Expiration date is required",
              })}
            />
            {form.formState.errors.exp_date && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.exp_date.message}
              </span>
            )}
          </div>
          <Button type="submit" className="mt-4">
            Add Product
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
