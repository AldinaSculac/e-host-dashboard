import { HomeModernIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  apartments: HomeModernIcon,
  notes: DocumentTextIcon,
};

export default async function CardWrapper() {
  const { numberOfApartments, numberOfNotes } = await fetchCardData(
    '410544b2-4001-4271-9855-fec4b6a6442a'
  );

  return (
    <>
      <Card
        title="Number of Apartments"
        value={numberOfApartments}
        type="apartments"
      />
      <Card title="Number of Notes" value={numberOfNotes} type="notes" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'apartments' | 'notes';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
