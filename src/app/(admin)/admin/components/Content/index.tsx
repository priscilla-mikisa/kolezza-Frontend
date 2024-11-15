"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdCheckboxOutline } from "react-icons/io";
import useGetUsersData from "@/app/components/hooks/useGetUsersDashboard";

type UserRole = "speech_therapist" | "superadmin";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: {
    view_patients: boolean;
    view_progress_reports: boolean;
    view_edit_profile: boolean;
    view_edit_users: boolean;
  };
}

const DashboardContent: React.FC = () => {
  const { users, loading, error } = useGetUsersData();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!Array.isArray(users)) {
    console.error('Users data is not an array:', users);
    return <div>Error: Unexpected data format</div>;
  }

  const isSuperAdmin = (user: User) => {
    return user.role === 'superadmin';
  };

  const Checkbox: React.FC<{ checked: boolean }> = ({ checked }) => (
    <div>
      {checked && (
        <IoMdCheckboxOutline
          className={`text-[2.5rem] nh:text-[1.35rem] nhm:text-[1.85rem] rounded flex items-center ml-[5rem] nhm:ml-[2.5rem] nh:ml-[2rem] ${
            checked ? "text-bold text-customGreen" : "text-white"
          }`}
        />
      )}
    </div>
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 nh:pb-0 pb-0 nhm:pb-0">
      <div className="flex justify-between items-center nh:mb-2 mb-6">
        <h1 className="text-2xl font-bold">Dashboard Access Permissions</h1>
        <Link
          href="/admin/add-user"
          className="border-customGreen border-2 px-4 py-2 rounded text-customGreen"
        >
          + Add Therapist
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-customGreen text-white nh:text-[16px] text-[24px] px-10">
            <th className="p-2 text-left">Users</th>
            <th className="p-2 text-center">View patients</th>
            <th className="p-2 text-center">View progress reports</th>
            <th className="p-2 text-center">View/edit profile</th>
            <th className="p-2 text-center">View/edit users</th>
            <th className="p-2 text-center">Logout</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => {
            const isAdmin = isSuperAdmin(user);
            return (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-200" : ""}
              >
                <td className="p-4 nh:pr-5 text-[20px] nh:text-[16px]">
                  {user.username}
                </td>
                <td className="p-4 nh:pr-5 text-center">
                  <Checkbox checked={isAdmin || !!user.permissions?.view_patients} />
                </td>
                <td className="p-4 nh:pr-5 text-center">
                  <Checkbox checked={isAdmin || !!user.permissions?.view_progress_reports} />
                </td>
                <td className="p-4 nh:pr-5 text-center">
                  <Checkbox checked={isAdmin || !!user.permissions?.view_edit_profile} />
                </td>
                <td className="p-4 nh:pr-5 text-center">
                  <Checkbox checked={isAdmin} />
                </td>
                <td className="p-4 text-center">
                  <Checkbox checked={true} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-10">
        <button onClick={prevPage} disabled={currentPage === 1} className="mr-4">
          <IoIosArrowBack
            className={`text-[36px] ${
              currentPage === 1 ? "text-gray-300" : "text-customGreen"
            }`}
          />
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="ml-4"
        >
          <IoIosArrowForward
            className={`text-[36px] ${
              currentPage === totalPages ? "text-gray-300" : "text-customGreen"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default DashboardContent;