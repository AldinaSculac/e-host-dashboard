import { Apartment } from '@/app/lib/definitions';
import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

type ApartmentProps = {
  apartment?: Apartment;
};

export default function ApartmentCard({ apartment }: ApartmentProps) {
  const createdAt = apartment?.created_at.toLocaleDateString();
  const updatedAt = apartment?.updated_at.toLocaleDateString();

  return (
    <div className="mb-8">
      <p className="text-xs text-gray-500">APARTMENT</p>
      <div className="mb-4 flex justify-between items-center md:justify-start">
        <h1 className="text-xl md:text-2xl md:mr-2">{apartment?.name}</h1>
        <PencilSquareIcon className="w-5 h-5" />
      </div>

      <p className="mb-2">{apartment?.description}</p>
      <div className="flex">
        <p className="text-xs text-gray-500 mr-2">Created at {createdAt}</p>
        <p className="text-xs text-gray-500">Edited at {updatedAt}</p>
      </div>
    </div>
  );
}
