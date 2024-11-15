import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UserProfileData } from "@/app/utils/types";
import { defaultUserProfile, getProfile, updateProfile } from "@/app/utils/fetchProfile";

export const useGetUserProfile = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null); // Add state for user profile data

  const schema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    role: z.string().min(1, "Role is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserProfileData>({
    resolver: zodResolver(schema),
    defaultValues: defaultUserProfile,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData: UserProfileData = await getProfile(userId);
        setUserProfileData(profileData); 
        reset(profileData); 
      } catch (err) {
        setError((err as Error).message);
        reset(defaultUserProfile); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, reset]);

  const onSubmit = async (data: UserProfileData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile(userId, data);
      setSuccessMessage("Profile updated successfully!");
      reset(data); 
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    register,
    handleSubmit,
    onSubmit,
    successMessage,
    errors,
    setValue,
    userProfileData, 
  };
};
