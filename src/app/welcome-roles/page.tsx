import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RoleSelection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customPurple p-8">
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center mb-6 justify-center">
        <Image 
            src="/images/sawatokcolored.png" 
            width={100} 
            height={30} 
            alt="SawaTok Logo" 
            className="mr-2" 
          />

        </div>
        
        <p className="text-3xl text-center mb-6 text-gray-700">Choose your role</p>
        <div className="space-y-4">
          <Link href={"/AddTherapist"}>
          <button className="w-80 py-2 px-4 text-xl bg-indigo-900 text-white rounded hover:bg-indigo-800 transition mb-4  ml-7 duration-300">
            🧑‍⚕️ Therapist
          </button>
          </Link>
          <Link href={"/signup_admin"}>
           <button className="w-80 py-2 px-4 text-xl bg-gray-300 text-indigo-900 rounded hover:bg-gray-400 transition ml-7 duration-300">
           👤 Admin
         </button>
         </Link>

         
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

