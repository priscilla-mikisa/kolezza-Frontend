'use client';
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import TherapistRegistration from '@/app/AddTherapist/page';
import AdminRegistration from '../AddAdmin';
import Layout from '@/app/Layout';

const UserRegistration = () => {
  const [isTherapist, setIsTherapist] = useState(true);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
 
  return (
    <Layout>
    <div className="flex min-h-screen bg-white">
      <main className="flex-1">
        <header className="bg-customGreen h-40">
          <div className="p-6">
            <IoIosArrowBack 
              className="text-4xl text-black cursor-pointer" 
              onClick={handleBack}
            />
          </div>
          <nav className="flex justify-between px-12">
            <button
              onClick={() => setIsTherapist(true)}
              className={`text-3xl ${isTherapist ? 'underline text-light-green' : ''}`}
            >
              New Therapist Details
            </button>
            <button
              onClick={() => setIsTherapist(false)}
              className={`text-3xl mr-40 ${!isTherapist ? 'underline text-light-green' : ''}`}
            >
              New Admin Details
            </button>
          </nav>
        </header>
        <section>
          {isTherapist ? <TherapistRegistration /> : <AdminRegistration />}
        </section>
      </main>
    </div>
    </Layout>
  );
};

export default UserRegistration;













