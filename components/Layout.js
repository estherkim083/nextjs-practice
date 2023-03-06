import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropDownLink from "./DropDownLink";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");
  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <nav className="flex h-12 items-center px-4 justify-between">
          <Link href="/">
            <span className="text-lg font-bold">Amazona</span>
          </Link>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search products"
            />
          </form>
          <div>
            <Link href="/cart">
              <span className="p-2">Cart</span>
              {cartItemsCount > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {status === "loading" ? (
              <span>"Loading"</span>
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="text-blue-600">
                  {session.user.name}
                </Menu.Button>
                <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
                  <Menu.Item>
                    <DropDownLink className="dropdown-link" href="/profile">
                      Profile
                    </DropDownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropDownLink
                      className="dropdown-link"
                      href="/order-history"
                    >
                      Order History
                    </DropDownLink>
                  </Menu.Item>
                  {session.user.isAdmin && (
                    <Menu.Item>
                      <DropDownLink
                        className="dropdown-link"
                        href="/admin/dashboard"
                      >
                        Admin Dashboard
                      </DropDownLink>
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    <DropDownLink
                      className="dropdown-link"
                      href="#"
                      onClick={logoutClickHandler}
                    >
                      Logout
                    </DropDownLink>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Link href="/login">
                <span className="p-2">Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="container m-auto mt-4 px-4">{children}</main>
      <footer className="flex justify-center items-center shadow-inner">
        <p>Copyright &copy; 2023 Amazona </p>
      </footer>
    </div>
  );
}
