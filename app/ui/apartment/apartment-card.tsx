import { fetchApartment } from '@/app/lib/data';
import { DeleteApartment, EditApartment } from './buttons';

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

        <EditApartment id={apartmentId} />
      </div>

      <p>{apartment?.description}</p>
      <div className="flex my-4">
        <p className="text-xs text-gray-500 mr-2">Created at {createdAt}</p>
        <p className="text-xs text-gray-500">Edited at {updatedAt}</p>
      </div>
      <DeleteApartment id={apartmentId} />
    </div>
  );
}
