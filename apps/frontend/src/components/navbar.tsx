import { t } from '@lingui/macro'

const Navbar = () => {
  /*const [selectedLanguage, setSelectedLanguage] = useState("English (US)");

  const languages = [
    { code: "en", label: "English (US)", flag: "🇺🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "zh", label: "中文 (繁體)", flag: "🇨🇳" },
  ];*/

  return (
    <nav className="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="#" className="flex items-center">
          <svg
            aria-label={t`Lil Nouns Auction`} // Using aria-label instead
            className="mr-3 h-5"
            fill="none"
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
          <span className="hidden text-2xl font-semibold dark:text-white">
            {t`Lil Nouns Auction`}
          </span>
        </a>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/*<button
              onClick={() =>
                document
                  .querySelector("#language-dropdown-menu")
                  ?.classList.toggle("hidden")
              }
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 dark:text-white dark:hover:bg-gray-700"
            >
              {selectedLanguage}
            </button>
            <div
              id="language-dropdown-menu"
              className="absolute right-0 z-50 mt-2 hidden w-48 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => setSelectedLanguage(lang.label)}
                      className="flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>*/}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
