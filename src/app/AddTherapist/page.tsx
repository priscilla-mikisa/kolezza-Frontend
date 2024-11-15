"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTherapistRegistration } from "../components/hooks/useTherapistRegistration";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TherapistRegistrationData, TherapistResponse } from "@/app/utils/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";

const therapistSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords don't match").required("Confirm password is required"),
  hospital_name: yup.string().required("Hospital name is required"),
  phone_number: yup.string().min(9, "Phone number is required").required("Phone number is required"),
  role: yup.string().required("Role is required"),
});

const TherapistRegistration = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof therapistSchema>>({
    resolver: yupResolver(therapistSchema),
  });

  const { registerTherapist, loading } = useTherapistRegistration();

  const onSubmit = async (data: yup.InferType<typeof therapistSchema>) => {
    const formattedData: TherapistRegistrationData = {
      hospital_name: data.hospital_name,
      phone_number: data.phone_number,
      user: {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
        role: data.role,
      },
    };

    try {
      const response: TherapistResponse = await registerTherapist(formattedData);
      if (!response?.data?.user) {
        throw new Error('Invalid response from server');
      }
  
      setCookie("username", response.data.user.username, { maxAge: 60 * 60 * 24 * 7, path: "/" });
      setCookie("role", response.data.user.role, { maxAge: 60 * 60 * 24 * 7, path: "/" });
  
      toast.success("Registration successful!", { position: "top-right", autoClose: 5000 });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast.error(errorMessage, { position: "bottom-center", autoClose: 5000 });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#052049] flex items-center justify-center">
        <Image src="/logo.png" alt="Sawatok Logo" width={300} height={200} />
      </div>

      <div className="w-2/3 flex flex-col items-center justify-center bg-gray-50 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl space-y-6">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          <div className="flex space-x-4 max-w-4xl">
            <div className="w-full relative">
              <label className="block text-lg mb-1">First Name</label>
              <FaUserAlt className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("first_name")}
                type="text"
                placeholder="Enter first name"
                className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
              />
              {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
            </div>
            <div className="w-full relative">
              <label className="block text-lg mb-1">Last Name</label>
              <FaUserAlt className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("last_name")}
                type="text"
                placeholder="Enter last name"
                className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
              />
              {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="block text-lg mb-1">Role</label>
            <input
              {...register("role")}
              type="text"
              placeholder="Speech Therapist / speech_therapist"
              className="w-full p-3 border text-center rounded-md shadow-sm"
            />
            {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-lg mb-1">Email</label>
            <AiOutlineMail className="absolute left-3 top-12 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="Enter email address"
              className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2 relative">
              <label className="block text-lg mb-1">Hospital Name</label>
              <MdBusiness className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("hospital_name")}
                type="text"
                placeholder="Enter hospital name"
                className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
              />
              {errors.hospital_name && <p className="text-red-500 text-xs">{errors.hospital_name.message}</p>}
            </div>
            <div className="w-1/2 relative">
              <label className="block text-lg mb-1">Phone Number</label>
              <AiOutlinePhone className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("phone_number")}
                type="tel"
                placeholder="Enter phone number"
                className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
              />
              {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="block text-lg mb-1">Username</label>
            <FaUserAlt className="absolute left-3 top-12 text-gray-400" />
            <input
              {...register("username")}
              type="text"
              placeholder="Enter username"
              className="w-full p-3 pl-10 border text-center rounded-md shadow-sm"
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2 relative">
              <label className="block text-lg mb-1">Password</label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full p-3 border text-center rounded-md shadow-sm"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 bottom-[14px] cursor-pointer`} style={{ fontSize: '24px' }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="w-1/2 relative">
              <label className="block text-lg mb-1">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full p-3 border text-center rounded-md shadow-sm"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 bottom-[14px] cursor-pointer`} style={{ fontSize: '24px' }}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-[#052049] text-white py-3 rounded-lg font-semibold hover:bg-[#041835] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Sign Up"}
          </button>

          <p className="text-center text-lg mt-4">
            Already have an account? 
            <Link href="/login" className="text-customDarkBlue font-bold hover:underline"> Log In</Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default TherapistRegistration;
