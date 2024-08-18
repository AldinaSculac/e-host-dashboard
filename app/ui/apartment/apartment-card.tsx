import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { fetchApartment } from '@/app/lib/data';

type ApartmentProps = {
  apartmentId: string;
};

export default async function ApartmentCard({ apartmentId }: ApartmentProps) {
  const apartment = await fetchApartment(apartmentId);
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
