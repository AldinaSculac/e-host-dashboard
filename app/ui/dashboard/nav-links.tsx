'use client';

import { ChevronRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Apartment } from '@/app/lib/definitions';

// TODO: display apts on mobile

type NavLinksProps = {
  apartments: Apartment[];
};

export default function NavLinks({ apartments }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      <Link
        key="dashboard"
        href="/dashboard"
        className={clsx(
          'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-cyan-600 md:flex-none md:justify-start md:p-2 md:px-3',
          {
            'bg-sky-100 text-cyan-600': pathname === '/dashboard',
          }
        )}
      >
        <Squares2X2Icon className="w-6" />
        <p className="hidden md:block truncate">Dashboard</p>
      </Link>

      {apartments.map((apartment: Apartment) => {
        return (
          <Link
            key={apartment.name}
            href={`/dashboard/${apartment.id}`}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-cyan-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-cyan-600':
                  pathname === `/dashboard/${apartment.id}`,
              }
            )}
          >
            <ChevronRightIcon className="w-6" />
            <p className="hidden md:block truncate">{apartment.name}</p>
          </Link>
        );
      })}
    </>
  );
}
