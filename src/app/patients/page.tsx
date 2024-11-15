"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { FetchedPatient } from "../utils/types";
import Link from "next/link";
import Layout from "@/app/Layout";
import useFetchPatients from "../components/hooks/useFetchPatients";


const toTitleCase = (str: string) => {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const PatientDashboard = () => {
  const { patients, loading, error } = useFetchPatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const patientList: FetchedPatient[] = Array.isArray(patients) ? patients : [];
  const patientsPerPage = 5;

  const handleSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPatients: FetchedPatient[] = patientList.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase() 
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="flex w-full nh:w-20 h-screen mt-10 mx-4">
        <div className="flex-1 p-0 md:p-0 lg:p-0 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative w-full mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search patient here..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 nh:text-[20px]  nh:w-[305px] nhm:w-46 nh:h-9 pr-4 py-2 border-lightGreen border-2 rounded-xl w-full md:w-[631px] h-12 focus:border-customGreen text-base md:text-lg"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black nh:size-3"
                size={24}
              />
            </div>
            <Link href={`/admin/add-patient`}>
              <button className="text-gray-400 px-4 nh:text-[20px] py-2 nh:w-[204px] nh:h-9 border-lightGreen border-2 rounded-xl flex items-center justify-center w-full md:w-[207px] lg:w-[180px] xl:w-[200px] h-12 hover:border-customGreen focus:outline-none text-base md:text-lg">
                <Plus size={24} className="mr-2 nh:size-4" />
                Add Patient
              </button>
            </Link>
          </div>

          <h2 className="text-2xl nh:mb-2 md:text-3xl nh:text-xl font-bold mb-6">
            All Patients
          </h2>

          <div className="overflow-x-auto">
            <table
              className="w-full " 
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
              }}
            >
              <thead>
                <tr className="bg-lightGreen text-white md:text-lg">
                  <th className="py-3 nh:py-[1rem] nh:px-[2.3rem]  md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 text-left rounded-l-lg border-2 nh:text-[20px]">
                    First Name
                  </th>
                  <th className="py-3 nh:py-[1rem] nh:px-[2.3rem] md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 text-left border-2 nh:text-[20px]">
                    Middle Name
                  </th>
                  <th className="py-3 nh:py-[1rem] nh:px-[2.3rem] md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 text-left border-2 nh:text-[20px]">
                    Last Name
                  </th>
                  <th className="py-3 nh:py-[1rem] nh:px-[2.3rem] md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 rounded-r-lg border-2 nh:text-[20px]">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient: FetchedPatient, index) => (
                    <tr
                      key={patient.id}
                      className={`text-base nh:text-sm nh:h-4 md:text-lg ${
                        index % 2 === 0 ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      <Link
                        href={`/admin/patient/${patient.id}`}
                        className="contents"
                      >
                        <td className="py-3 md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 nh:text-[20px]">
                          {toTitleCase(patient.first_name || "N/A")}
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 nh:text-[20px]">
                          {toTitleCase(patient.middle_name || "N/A")}
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 nh:text-[20px]">
                          {toTitleCase(patient.last_name || "N/A")}
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 lg:px-4 xl:px-6 rounded-r-lg nh:text-[20px]">
                          {patient.gender || "N/A"}
                        </td>
                      </Link>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-base md:text-lg"
                    >
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full ${
                  currentPage === index + 1
                    ? "bg-lightGreen text-white"
                    : "bg-gray-200 text-black"
                } flex items-center justify-center focus:outline-none nh:text-sm text-base nh:h- md:text-lg`}
              >
                {index + 1}
              </button>
            ))}
            <p className="text-base md:text-lg nh:text-sm mt-4 md:mt-0 md:ml-4">
              Total patients: {filteredPatients.length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
