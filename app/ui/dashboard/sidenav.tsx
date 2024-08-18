import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import EhostLogo from '@/app/ui/ehost-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { fetchApartments } from '@/app/lib/data';

export default async function SideNav() {
  // TODO: check correct user_id
  const apartments = await fetchApartments(
    '410544b2-4001-4271-9855-fec4b6a6442a'
  );

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-cyan-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <EhostLogo />
        </div>
      </Link>

      {/* TODO: only apartments list should be scrollable (remove: h-64 overflow-y-auto) */}
      {/* TODO: move Dashboard outside the NavLinks */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:h-64 overflow-y-auto">
        <NavLinks apartments={apartments} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-cyan-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
