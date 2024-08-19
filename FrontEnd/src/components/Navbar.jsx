import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <div>
      <div className="bg-white shadow-sm">
        <div className="mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center mr-5">
            <img
              src="https://i.vimeocdn.com/portrait/18662606_640x640"
              alt="ImageHub"
              className="h-6 md:mr-2"
            />
            <span className="text-blue-600 text-xl font-bold">ImageHub</span>
          </Link>

          <div className="flex items-center space-x-4 w-[200px]">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-gray-900">
              Create
            </Link>
            <Link
              to="/account"
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700"
            >
              {user.name.slice(0, 1)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
