import { WalletOptions } from '@/components/wallet-options'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useAccount } from 'wagmi'

export default function Navbar() {
  const { i18n } = useLingui()
  const { isConnected } = useAccount()

  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex px-2 lg:px-0">
            <div className="flex shrink-0 items-center">
              <svg
                aria-label={t(i18n)`Lil Nouns Auction`} // Using aria-label instead
                className="h-8 w-auto"
                fill="none"
                width="80"
                height="30"
                shape-rendering="crispEdges"
                viewBox="0 0 160 60"
              >
                <g fill="#d53c5e">
                  <path d="m90 0h-60v10h60z"></path>
                  <path d="m160 0h-60v10h60z"></path>
                  <path d="m40 10h-10v10h10z"></path>
                </g>
                <path d="m60 10h-20v10h20z" fill="#fff"></path>
                <path d="m80 10h-20v10h20z" fill="#000"></path>
                <path d="m90 10h-10v10h10z" fill="#d53c5e"></path>
                <path d="m110 10h-10v10h10z" fill="#d53c5e"></path>
                <path d="m130 10h-20v10h20z" fill="#fff"></path>
                <path d="m150 10h-20v10h20z" fill="#000"></path>
                <path d="m160 10h-10v10h10z" fill="#d53c5e"></path>
                <path d="m40 20h-40v10h40z" fill="#d53c5e"></path>
                <path d="m60 20h-20v10h20z" fill="#fff"></path>
                <path d="m80 20h-20v10h20z" fill="#000"></path>
                <path d="m110 20h-30v10h30z" fill="#d53c5e"></path>
                <path d="m130 20h-20v10h20z" fill="#fff"></path>
                <path d="m150 20h-20v10h20z" fill="#000"></path>
                <path d="m160 20h-10v10h10z" fill="#d53c5e"></path>
                <path d="m10 30h-10v10h10z" fill="#d53c5e"></path>
                <path d="m40 30h-10v10h10z" fill="#d53c5e"></path>
                <path d="m60 30h-20v10h20z" fill="#fff"></path>
                <path d="m80 30h-20v10h20z" fill="#000"></path>
                <path d="m90 30h-10v10h10z" fill="#d53c5e"></path>
                <path d="m110 30h-10v10h10z" fill="#d53c5e"></path>
                <path d="m130 30h-20v10h20z" fill="#fff"></path>
                <path d="m150 30h-20v10h20z" fill="#000"></path>
                <path d="m160 30h-10v10h10z" fill="#d53c5e"></path>
                <path d="m10 40h-10v10h10z" fill="#d53c5e"></path>
                <path d="m40 40h-10v10h10z" fill="#d53c5e"></path>
                <path d="m60 40h-20v10h20z" fill="#fff"></path>
                <path d="m80 40h-20v10h20z" fill="#000"></path>
                <path d="m90 40h-10v10h10z" fill="#d53c5e"></path>
                <path d="m110 40h-10v10h10z" fill="#d53c5e"></path>
                <path d="m130 40h-20v10h20z" fill="#fff"></path>
                <path d="m150 40h-20v10h20z" fill="#000"></path>
                <path d="m160 40h-10v10h10z" fill="#d53c5e"></path>
                <path d="m90 50h-60v10h60z" fill="#d53c5e"></path>
                <path d="m160 50h-60v10h60z" fill="#d53c5e"></path>
              </svg>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              {/*<a
                href="#"
                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Team
              </a>
              <a
                href="#"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Projects
              </a>
              <a
                href="#"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Calendar
              </a>*/}
            </div>
          </div>
          {/*<div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon aria-hidden="true" className="size-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search"
                  className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>*/}
          <div className="flex items-center lg:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
            {/*<button
              type="button"
              className="relative shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>*/}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-4 shrink-0">
              <div>
                <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {!isConnected && <WalletOptions />}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 pb-3 pt-2">
          {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
          <DisclosureButton
            as="a"
            href="#"
            className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
          >
            Dashboard
          </DisclosureButton>
          <DisclosureButton
            as="a"
            href="#"
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
          >
            Team
          </DisclosureButton>
          <DisclosureButton
            as="a"
            href="#"
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
          >
            Projects
          </DisclosureButton>
          <DisclosureButton
            as="a"
            href="#"
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
          >
            Calendar
          </DisclosureButton>
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4">
          <div className="flex items-center px-4">
            <div className="shrink-0">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-10 rounded-full"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                Tom Cook
              </div>
              <div className="text-sm font-medium text-gray-500">
                tom@example.com
              </div>
            </div>
            <button
              type="button"
              className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <DisclosureButton
              as="a"
              href="#"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Your Profile
            </DisclosureButton>
            <DisclosureButton
              as="a"
              href="#"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Settings
            </DisclosureButton>
            <DisclosureButton
              as="a"
              href="#"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              Sign out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
