"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


const schema = yup.object().shape({
    username: yup.string().min(4, "Username must be at least 4 characters").required("Username is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

interface LoginFormData {
    username: string;
    password: string;
}

const Login = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginStatus, setLoginStatus] = useState<string>('');

    const handleLogin = async (data: LoginFormData) => {
        setLoading(true);
        setLoginStatus('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

         
            setCookie('username', result.user.username, { maxAge: 60 * 60 * 24 * 7 });
            setCookie('role', result.user.role, { maxAge: 60 * 60 * 24 * 7 });

            setLoginStatus('Login successful!');

           
            switch (result.user.role) {
                case 'superadmin':
                    router.push('/dashboard');
                    break;
                case 'speech_therapist':
                    router.push('/therapist-dashboard');
                    break;
                default:
                    throw new Error('Invalid user role');
            }

            toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 3000,
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setLoginStatus(errorMessage);
            toast.error(errorMessage, {
                position: 'bottom-center',
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 bg-[#052049] flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={300} height={200} />
            </div>

            <div className="w-2/3 flex flex-col items-center justify-center bg-gray-50">
                <div className="w-full max-w-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                        <div>
                            <label className="block text-lg mb-1">Username</label>
                            <div className="flex items-center border rounded-lg border-black">
                                <span className="pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    {...register("username")}
                                    type="text"
                                    className={`w-full px-4 py-4 focus:outline-none text-lg ${errors.username ? "border-red-500" : "border-black"}`}
                                    placeholder="Enter Username"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-lg mb-1">Password</label>
                            <div className="flex items-center border rounded-lg border-black">
                                <span className="pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 4a2 2 0 00-2 2v1H7V6a3 3 0 016 0v1h-1V6a2 2 0 00-2-2z"
                                            clipRule="evenodd"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M4 9a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm2 1v6h8v-6H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full px-4 py-4 pr-[40px] focus:outline-none text-lg ${errors.password ? "border-red-500" : "border-black"}`}
                                    placeholder="Enter your password"
                                />
                                <span
                                    className="absolute right-[10px] cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={24} className="text-gray-500" /> : <AiFillEye size={24} className="text-gray-500" />}
                                </span>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        {loginStatus && (
                            <p className={`text-sm ${loginStatus === 'Login successful!' ? 'text-green-500' : 'text-red-500'}`}>
                                {loginStatus}
                            </p>
                        )}

                        <button
                            type="submit"
                            className={`w-full bg-[#052049] text-white py-3 rounded-lg font-semibold hover:bg-[#041835] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center text-xl mt-4">
                            <p className="text-gray-600">OR</p>
                            <Link href="/welcome-roles" className="text-customDarkBlue font-bold hover:underline">
                                Sign Up
                            </Link>
                            {' if you don\'t have an account'}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;


