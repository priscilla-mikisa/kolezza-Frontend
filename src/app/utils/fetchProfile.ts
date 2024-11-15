import { UserProfileData } from "./types";

export const defaultUserProfile: UserProfileData = {
  avatar: "",
  first_name: "Nicholus",
  last_name: "Samora",
  email: "nicholoussamora@gmail.com",
  role: "Speech Therapist",
  phone: "",
  hospital: ""
};
  
  export const getProfile = async (userId: string): Promise<UserProfileData> => {
    const response = await fetch(`/api/profile/${userId}`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("");
    }
  
    return response.json();
  };
  
  export const updateProfile = async (userId: string, profileData: UserProfileData) => {
  
    const response = await fetch(`/api/profile/${userId}`, { 
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
  
    if (!response.ok) {
      const errorResponse = await response.json(); 
      throw new Error(errorResponse.message || "Failed to update profile");
    }
  
    return response.json();
  };
  