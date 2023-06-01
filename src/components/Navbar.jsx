import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { UserAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (e) {}
  };

  return (
    <div className="rounded-div flex items-center justify-between h-20 font-bold">
      <Link to="/">
        <h1 className="text-2xl">Cryptocurrency Club</h1>
      </Link>
      <div className="hidden md:block hover:text-accent">
        <ThemeToggle />
      </div>

      {user?.email ? (
        <div className="hidden md:flex md:items-center">
          <Link
            to="/account"
            className="p-4 hover:text-accent border px-5 py-2 rounded-2xl shadow-lg hover:shadow-2xl"
          >
            Account
          </Link>
          <button
            onClick={handleSignOut}
            className="bg-button text-btnText px-5 py-2 ml-2 rounded-2xl shadow-lg hover:shadow-2xl"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="hidden md:block">
          <Link
            to="/signin"
            className="p-4 hover:text-accent border px-5 py-2 rounded-2xl shadow-lg hover:shadow-2xl"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-button text-btnText px-5 py-2 ml-2 rounded-2xl shadow-lg hover:shadow-2xl"
          >
            Sign Up
          </Link>
        </div>
      )}

      <div onClick={handleNav} className="block md:hidden cursor-pointer z-10">
        {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navbar */}
      <div
        className={
          nav
            ? "md:hidden fixed left-0 top-20 flex flex-col items-center justify-between w-full h-[90%] bg-primary ease-in-out duration-500 z-10"
            : "fixed left-[-100%] top-20 h-[90%] flex flex-col items-center justify-between ease-in-out duration-500"
        }
      >
        <ul className="w-full p-4">
          <li onClick={handleNav} className="border-b py-6 hover:text-accent">
            <Link to="/">Home</Link>
          </li>
          <li onClick={handleNav} className="border-b py-6 hover:text-accent">
            <Link to="/account">Account</Link>
          </li>
          <li className="border-b py-6 hover:text-accent">
            <ThemeToggle />
          </li>
        </ul>

        {user?.email ? (
          <div className="flex flex-col w-full p-4">
            <button
              onClick={handleSignOut}
              className="w-full my-2 p-3 border px-5 py-2 rounded-2xl shadow-xl hover:shadow-2xl bg-button text-btnText"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col w-full p-4">
            <Link to="/signin">
              <button
                onClick={handleNav}
                className="w-full my-2 p-3 bg-primary text-primary border border-secondary rounded-2xl shadow-xl"
              >
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button
                onClick={handleNav}
                className="w-full my-2 p-3 bg-button text-btnText rounded-2xl shadow-xl"
              >
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
