"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineLogout, AiOutlineEdit } from "react-icons/ai"; 
import Sidebar from "@/app/Sidebar";
import { deleteCookie } from "cookies-next"; 
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import { useGetUserProfile } from "@/app/components/hooks/useGetProfile";

type Params = {
  userId: string;
};

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string;
}

const avatars = [
  "/images/avatar.avif",
  "/images/avatar1.avif",
  "/images/avatar2.avif",
  "/images/avatar3.avif",
  "/images/avatar4.avif",
  "/images/avatar5.avif",
  "/images/avatar6.avif",
  "/images/avatar7.avif",
  "/images/avatar8.avif",
  "/images/avatar9.avif",
  "/images/avatar10.avif",
  "/images/avatar11.avif",
  "/images/avatar12.avif",
];

const UserProfile = function ({ params: { userId } }: { params: Params }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  const router = useRouter();

  const {
    loading,
    error,
    register,
    handleSubmit,
    onSubmit,
    setValue, 
    errors,
    userProfileData 
  } = useGetUserProfile(userId);
  
  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    } else if (userProfileData) {
      setSelectedAvatar(userProfileData.avatar || avatars[0]);
    } else {
      setSelectedAvatar(avatars[0]);
    }

    if (userProfileData) {
      setValue("first_name", userProfileData.first_name);
      setValue("last_name", userProfileData.last_name);
      setValue("email", userProfileData.email);
      setValue("role", userProfileData.role);
    }
  }, [userProfileData, setValue]);

  const handleFormSubmit = async (data: ProfileData) => {
    try {
      await onSubmit({
        ...data, avatar: selectedAvatar || avatars[0],
        phone: "",
        hospital: ""
      });
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false); 
    } catch (err) {
      setSuccessMessage(null);
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("userRole");
    deleteCookie("userId");
    router.push("/login");
  };

  const handleCancel = () => {
    setIsEditing(false); 
    setSuccessMessage(null); 
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 bg-white p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <FaArrowLeft size={30} className="cursor-pointer" onClick={() => router.push("/dashboard")} />
          <AiOutlineLogout size={30} className="cursor-pointer" onClick={handleLogout} />
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>

        <div className="flex items-center mb-8 justify-center relative">
          <div className="bg-[#90BD31] rounded-full w-[280px] h-[280px] flex items-center justify-center mr-2 relative">
            {selectedAvatar ? (
              <Image
                src={selectedAvatar}
                alt="User Avatar"
                className="rounded-full object-cover"
                fill
                sizes="280px"
                priority
              />
            ) : (
              <Image
                src="/images/avatar2.avif"
                alt="Default Avatar"
                className="rounded-full object-cover"
                fill
                sizes="280px"
                priority
              />
            )}
            {isEditing && (
              <AiOutlineEdit
                size={30}
                className="absolute bottom-0 right-0 cursor-pointer bg-white rounded-full border border-gray-300 p-1"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              />
            )}
          </div>

          {showAvatarPicker && (
            <div className="absolute top-[220px] left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
              <h2 className="text-lg font-medium mb-2">Choose an Avatar</h2>
              <div className="grid grid-cols-3 gap-2">
                {avatars.map((avatar, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className={`rounded-full cursor-pointer ${selectedAvatar === avatar ? "border border-green-500" : ""}`}
                      fill
                      sizes="64px"
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        localStorage.setItem("selectedAvatar", avatar); 
                        setShowAvatarPicker(false);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isEditing ? (
          loading ? (
            <div className="text-center">Loading profile...</div>
          ) : error ? (
            <div className="text-red-500 ">Error loading profile</div>
          ) : (
            <div className="space-y-8 ">
              <div className=" text-left text-lg space-y-8 w-1/2 ml-auto mr-24">
              <p><strong>First Name:</strong> {userProfileData?.first_name || "Nicholus"}</p>
              <p><strong>Last Name:</strong> {userProfileData?.last_name || "Samora"}</p>
              <p><strong>Email:</strong> {userProfileData?.email || "nicholussamora@gmail.com"}</p>
              <p><strong>Role:</strong> {userProfileData?.role || "speech_therapist"}</p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  className="w-[200px] text-lg bg-customDarkBlue text-white py-4 px-6 rounded-lg transition duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-6">
                <label htmlFor="first_name" className="text-lg font-medium">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  {...register("first_name")}
                  className={`border border-green-400 h-16 px-4 py-2 rounded-lg text-lg w-full ${errors.first_name ? "border-red-500" : ""}`}
                  placeholder="Enter First Name"
                />
                {errors.first_name && (
                  <p className="text-red-500">{errors.first_name?.message}</p>
                )}
              </div>

              <div className="space-y-6">
                <label htmlFor="last_name" className="text-lg font-medium">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  {...register("last_name")}
                  className={`border border-green-400 h-16 px-4 py-2 rounded-lg text-lg w-full ${errors.last_name ? "border-red-500" : ""}`}
                  placeholder="Enter Last Name"
                />
                {errors.last_name && (
                  <p className="text-red-500">{errors.last_name?.message}</p>
                )}
              </div>

              <div className="space-y-6">
                <label htmlFor="email" className="text-lg font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`border border-green-400 h-16 px-4 py-2 rounded-lg text-lg w-full ${errors.email ? "border-red-500" : ""}`}
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email?.message}</p>
                )}
              </div>

              <div className="space-y-6">
                <label htmlFor="role" className="text-lg font-medium">Role</label>
                <input
                  id="role"
                  type="text"
                  {...register("role")}
                  className={`border border-green-400 h-16 px-4 py-2 rounded-lg text-lg w-full ${errors.role ? "border-red-500" : ""}`}
                  placeholder="Enter Role"
                />
                {errors.role && (
                  <p className="text-red-500">{errors.role?.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="w-[200px] text-lg bg-customDarkBlue text-white py-4 px-6 rounded-lg transition duration-200"
                type="submit"
              >
                Save Changes
              </button>
              <button
                className="w-[200px] text-lg border border-red-500 text-red-500 py-4 px-6 rounded-lg transition duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

            {successMessage && (
              <div className="text-green-500 text-center mt-4">{successMessage}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
