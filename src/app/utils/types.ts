export interface Child {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  date_of_birth: string;
  is_deleted: boolean;
  updated_at: string | null;
  level_of_stuttering_id: number;
  childmodule_id: number;
}

export interface Patient {
  id: number ;
  first_name: string;
  last_name: string;
  middle_name?: string; 
  gender: string;
  date_of_birth: Date; 
}

export interface ChildrenResponse {
  child: Child[];
}

export interface RegistrationErrorResponse {
  error: string; 
  details?: {
      field?: string;
      message?: string;
  };
}

export interface FetchedPatient {
  id: number;                  
  first_name: string;         
  middle_name?: string;       
  last_name: string;          
  gender: string;             
}

export interface FetchChildrenResponse {
  child: Child[];
}

export interface TherapistResponse {
  user: User; 
  hospital_name: string;
  phone_number: string;
}

export interface FetchPatientsSuccessResponse {
  patients: FetchedPatient[]; 
}

export interface PatientRegistrationData {
  first_name: string; 
  last_name: string;
  middle_name?: string; 
  gender: string;
  date_of_birth: Date;
  level_of_stuttering_id: number;
  childmodule_id?: number;
}

export interface UsePatientRegistrationReturn {
  registerPatient: (data: PatientRegistrationData) => Promise<void>;
  errorMessage: string;
  successMessage: string;
}

export interface User {
  id: number | string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
}

export interface Result {
  user: User;
}

export interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface FetchUsersResponse {
  users: User[];
}

export interface UsersFetchSuccessResponse {
  users: User[];
  total: number;
}
export interface UsersFetchErrorResponse {
  error: string;
}

export interface TherapistResponse {
  data: {
    user: {
      username: string;
      role: string;
    }
  }
}

export type TherapistRegistrationData = {
hospital_name: string;
phone_number: string;
user: {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  role: string;
};
};

export interface ApiPatient {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
}


export interface RegistrationSuccessResponse {
  data: {
    user: User;
    hospital_name: string;
    phone_number: string;
  };
  message: string;
}

export interface RegistrationSuccessResponse {
  message: string;
  therapist: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    hospital_name: string;
    phoneNumber: string;
  };
}

export interface RegistrationErrorResponse {
  error: string;
}

export interface RegistrationSuccessResponse {
  message: string;
  patients: Patient[];        
}


export interface TherapistRegistrationState {
  loading: boolean;
  prev?: string;
  errorMessage: string;
  successMessage: string;
}

export interface UseTherapistRegistrationReturn {
  registerTherapist: (data: TherapistRegistrationData) => Promise<RegistrationSuccessResponse | undefined>;
  loading: boolean;
  errorMessage: string;
  successMessage: string;
}

export type FetchTherapistFunction = (data: TherapistRegistrationData) => Promise<RegistrationSuccessResponse>;


export interface AdminRegistrationData {
firstName: string,
lastName: string,
role: string;
email:string;
username: string;
password: string;
confirmPassword: string;
}

export interface RegistrationSuccessResponse {
message: string;
admin: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};
}

export interface RegistrationErrorResponse {
error: string;
}

export interface AdminRegistrationState {
loading: boolean;
errorMessage: string;
successMessage: string;
}

export interface UseAdminRegistrationReturn {
registerAdmin: (data: AdminRegistrationData) => Promise<void>;
loading: boolean;
errorMessage: string;
successMessage: string;
}

export type FetchAdminFunction = (data: AdminRegistrationData) => Promise<RegistrationSuccessResponse>;

export interface UserProfileData {
  avatar: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  hospital: string;
  role: string;
}

export type FetchPatientsFunction = () => Promise<FetchPatientsSuccessResponse | RegistrationErrorResponse>;

export  interface LoginCredentials {
  username: string;
  password: string;
}

export type GetUser = {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
};





