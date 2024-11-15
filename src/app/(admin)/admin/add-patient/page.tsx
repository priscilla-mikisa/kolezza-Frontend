"use client";
import React, { useState } from 'react';
import { ChevronLeft, User, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from "@/app/Layout";
import Link from 'next/link';

type PatientData = {
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientDateOfBirth: Date;
  gender: 'male' | 'female';
  levelOfStutteringId: string;
  childmodule_id: string;
};

const schema = yup.object({
  patientFirstName: yup.string().required('First name is required'),
  patientMiddleName: yup.string().required('Patient middle name is required'),
  patientLastName: yup.string().required('Last name is required'),
  patientDateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
  levelOfStutteringId: yup.string().required('Level of stuttering is required'),
  childmodule_id: yup.string().required('Child module ID is required'),
}).required();

const AddPatients = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PatientData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const [feedback, setFeedback] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const onSubmit = (data: PatientData) => {
    const transformedData = {
      first_name: data.patientFirstName,
      middle_name: data.patientMiddleName,
      last_name: data.patientLastName,
      date_of_birth: startDate ? startDate.toISOString().split('T')[0] : '',
      gender: data.gender,
      level_of_stuttering_id: data.levelOfStutteringId,
      childmodule_id: data.childmodule_id,
    };

    setFeedback('Patient details have been submitted: ' + JSON.stringify(transformedData));
  };

  const inputStyle = "w-full h-[80px] nh:w-[200px] nh:h-[50px] nhm:w-[280px] border-customGreen border-4 rounded-lg p-2 pl-10 placeholder-gray-400";
  const iconStyle = "absolute left-3 top-1/2 transform -translate-y-1/2 text-black";

  return (
    <Layout>
      <div className="bg-white">
        <div className="px-10 nh:px-4">
          <Link href="/patients/">
            <ChevronLeft className="w-20 h-10 mr-10 cursor-pointer nh:w-12 nh:h-8" />
          </Link>
          <h2 className="text-4xl nh:text-2xl nh:ml-6 font-semibold">Add a new Patient</h2>
        </div>

        {feedback && <p className="text-green-500">{feedback}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 nh:mt-4">
          <div className="flex flex-col md:flex-row mb-4 space-x-4 nh:gap-4 nh:w-1/3">
            <div className="flex-1">
              <label className="block font-medium mb-2 text-[20px] nh:text-[14px]">
                Patient First Name
              </label>
              <div className="relative mb-4 text-[20px] nh:text-[15px]">
                <User className={iconStyle} />
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className={inputStyle}
                  {...register('patientFirstName')}
                />
                {errors.patientFirstName && (
                  <p className="text-red-500">{errors.patientFirstName.message}</p>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block font-medium mb-2 text-[20px] nh:text-[14px]">
                Patient Middle Name
              </label>
              <div className="relative mb-4 text-[20px] nh:text-[15px]">
                <User className={iconStyle} />
                <input
                  type="text"
                  placeholder="Enter Middle Name"
                  className={inputStyle}
                  {...register('patientMiddleName')}
                />
                {errors.patientMiddleName && (
                  <p className="text-red-500">{errors.patientMiddleName.message}</p>
                )}
              </div>
            </div>
          

          <div className="flex-1">
            <label className="block font-medium mb-2 text-[20px] nh:text-[14px]">
              Patient Last Name
            </label>
            <div className="relative mb-4 text-[20px] nh:text-[15px]">
              <User className={iconStyle} />
              <input
                type="text"
                placeholder="Enter Last Name"
                className={inputStyle}
                {...register('patientLastName')}
              />
              {errors.patientLastName && (
                <p className="text-red-500">{errors.patientLastName.message}</p>
              )}
            </div>
          </div>
          </div>

          <label className="block font-medium mb-2 text-[20px] nh:text-[14px] ">Date of Birth</label>
          <div className="relative text-[20px] mb-4 nh:text-[15px] ">
            <input
              type="text"
              placeholder="Select your date of birth"
              value={startDate ? startDate.toLocaleDateString() : ''}
              readOnly
              className={`${inputStyle} pl-10 nh:w-[684px]`}
            />
            <Calendar
              className={`${iconStyle} cursor-pointer`}
              onClick={() => setCalendarOpen(true)}
            />
            {calendarOpen && (
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setValue('patientDateOfBirth', date ? date : new Date());
                  setCalendarOpen(false);
                }}
                placeholderText="Select your date of birth"
                className="absolute z-10"
                inline
              />
            )}
            {errors.patientDateOfBirth && <p className="text-red-500">{errors.patientDateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-2 text-[20px] nh:text-[14px]">Gender</label>
            <div className="flex gap-4 nh:gap-96 border-4 p-4 rounded-lg border-lightGreen nh:w-[689px] nh:h-[50px]">
              {['female', 'male'].map((gender) => (
                <label key={gender} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={gender}
                    className="hidden"
                    {...register('gender')}
                  />
                  <span className="w-10 h-10 nh:w-8 nh:h-8 border border-gray-400 rounded-full relative flex items-center justify-center">
                    <span className={`w-6 h-6 rounded-full bg-black ${watch('gender') === gender ? '' : 'hidden'}`} />
                  </span>
                  <span className="ml-2 text-xl nh:text-[15px]">{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
          </div>

          <div className="flex flex-col md:flex-row mt-10 nh:mt-5 mb-4 space-x-4 nh:space-x-0">
            {/* Level of Stuttering */}
            <div className="flex-1">
              <label className="block text-xl font-medium mb-2 nh:text-lg">Level of Stuttering</label>
              <select
                className={`w-full max-w-[800px] nh:w-[325px] nhm:w-[320px] nh:h-[50px] h-[80px] border-[4px] border-lightGreen rounded-lg p-3 text-lg ${errors.levelOfStutteringId ? 'border-red-500' : ''}`}
                {...register('levelOfStutteringId')}
              >
                <option value="">Select Level of Stuttering</option>
                {[1, 2, 3].map(level => <option key={level} value={level}>{level}</option>)}
              </select>
              {errors.levelOfStutteringId && <p className="text-red-500 text-sm">{errors.levelOfStutteringId.message}</p>}
            </div>

            {/* Child Module ID */}
            <div className="flex-1">
              <label className="block text-xl font-medium mb-2 nh:text-lg">Child Module ID</label>
              <select
                className={`w-full max-w-[800px] nh:w-[325px] nhm:w-[320px] nh:h-[50px] h-[80px] border-[4px] border-lightGreen rounded-lg p-3 text-lg ${errors.childmodule_id ? 'border-red-500' : ''}`}
                {...register('childmodule_id')}
              >
                <option value="">Select Child Module ID</option>
                {[1, 2, 3].map(id => <option key={id} value={id}>{id}</option>)}
              </select>
              {errors.childmodule_id && <p className="text-red-500 text-sm">{errors.childmodule_id.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-customDarkBlue mr-[600px] nh:mr-[270px] nhm:mr-[200px] text-4xl nh:text-2xl text-white py-4 nh:py-2 px-10 nh:px-16 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddPatients;

