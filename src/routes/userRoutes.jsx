import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";

const userRoutes = [
  { path: "/user/login", element: <UserLogin /> },
  { path: "/user/register", element: <UserRegister /> },
  { path: "/user/cart", element: <Cart /> },
  { path: "/user/checkout", element: <Checkout /> },
];

export default userRoutes;
