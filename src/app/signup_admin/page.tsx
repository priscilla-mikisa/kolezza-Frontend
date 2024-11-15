"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminRegistrationData } from "../utils/types";
import { fetchAdmin } from "../utils/adminPost";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import { toast } from 'react-toastify'; 

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    role: Yup.string().required("Role is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegistrationData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: AdminRegistrationData) => {
    setLoading(true);
  
    try {
      const result = await fetchAdmin(data);
  
      if (result?.message === "Successful SignUp" && result.user) {
        setCookie('userSession', JSON.stringify(result.user), { maxAge: 86400, path: "/" }); 
  
        toast.success("Sign up successful! Redirecting to login...", {
          position: "top-right",
          autoClose: 5000,
        });
  
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.error || "There was an error during sign-up. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error during sign-up. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/3 bg-customDarkBlue flex items-center justify-center h-full">
        <Image src="/images/sawatok.png" alt="SawaTok Logo" width={300} height={200} />
      </div>

      <div className="w-2/3 p-12 flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-3/4 max-w-full">
          <div className="flex space-x-4">
            <div className="w-full relative">
              <label className="block text-xl text-gray-700 font-medium">First Name</label>
              <FaUser className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className="w-full mt-1 p-3 border border-gray-300 rounded-md text-center shadow-sm pl-10"
              />
              {errors.firstName && <p className="text-red-500 mt-1 text-sm">{errors.firstName.message}</p>}
            </div>
            <div className="w-full relative">
              <label className="block text-xl text-gray-700 font-medium">Last Name</label>
              <FaUser className="absolute left-3 top-12 text-gray-400" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
                className="w-full mt-1 block text-lg p-3 border rounded-md shadow-sm text-center pl-10"
              />
              {errors.lastName && <p className="text-red-500 mt-1 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="block text-xl font-medium text-gray-700">Role</label>
            <input
              {...register("role")}
              className="mt-1 block w-full text-center text-lg rounded-md border border-gray-300 p-3 pl-10"
              placeholder="Enter your role"
            />
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-xl font-medium text-gray-700">Username</label>
            <FaUser className="absolute left-3 top-12 text-gray-400" />
            <input
              {...register("username")}
              className="mt-1 block w-full text-center text-lg rounded-md border border-gray-300 p-3 pl-10"
              placeholder="Enter your username"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>

         
          <div className="relative">
            <label className="block text-xl font-medium text-gray-700">Email</label>
            <FaEnvelope className="absolute left-3 top-12 text-gray-400" />
            <input
              {...register("email")}
              className="mt-1 block w-full text-center text-lg rounded-md border border-gray-300 p-3 pl-10"
              placeholder="Enter email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

        
          <div className="flex space-x-4">
            <div className="w-1/2 relative">
              <label className="block text-xl font-medium text-gray-700">Password</label>
              <FaLock className="absolute left-3 top-12 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1 block w-full text-center text-lg rounded-md border border-gray-300 p-3 pl-10"
                placeholder="Enter password"
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 bottom-[14px] cursor-pointer" style={{ fontSize: '24px' }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

        
            <div className="w-1/2 relative">
              <label className="block text-xl font-medium text-gray-700">Confirm Password</label>
              <FaLock className="absolute left-3 top-12 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="mt-1 block w-full text-center text-lg rounded-md border border-gray-300 p-3 pl-10"
                placeholder="Confirm password"
              />
              <span 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 bottom-[14px] cursor-pointer" style={{ fontSize: '24px' }}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

         
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`w-full h-[50px] rounded-lg bg-customDarkBlue text-white text-xl font-medium ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-lg text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-customDarkBlue font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
