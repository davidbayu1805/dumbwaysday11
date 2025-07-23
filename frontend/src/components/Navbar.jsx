import { useEffect, useState } from "react";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  let menuActive = show ? "left-0" : "-left-full";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScroll(true);
        setShow(false);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let scrollActive = scroll ? "py-6 bg-white shadow" : "py-4";

  return (
    <div className={`navbar fixed w-full transition-all z-50 ${scrollActive}`}>
      <div className="container mx-auto px-4">
        <div className="navbar-box flex items-center justify-between">
          <div className="flex items-center">
            <div className="logo">
              <img
                src="/brandred.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <ul
              className={`fixed ${menuActive} top-1/2 -translate-y-1/2 flex flex-col gap-8 px-8 py-6 rounded shadow-g shadow-slate-300 bg-gray-400 font-bold text-white transition-all md:static md:flex-row md:flex md:items-center md:gap-12 md:p-0 md:m-0 md:w-auto md:h-full md:bg-transparent md:shadow-none md:text-black md:translate-y-0 md:transition-none md:ml-8`}
            >
              <li>
                <a
                  href="/"
                  className="flex items-center gap-3 font-medium opacity-75"
                >
                  <i className="ri-home-2-line text-3xl md:hidden block"></i>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="myproject"
                  className="flex items-center gap-3 font-medium opacity-75"
                >
                  <i className="ri-folder-open-fill text-3xl md:hidden block"></i>
                  MyProject
                </a>
              </li>
            </ul>
          </div>
          <div className="contact flex items-center gap-2">
            <a
              href="/contact"
              className="bg-gray-900 px-5 py-2 rounded-full text-white font-bold hover:bg-gray-700 transition-all"
            >
              Contact Me
            </a>
            <i
              className="ri-menu-3-line text-3xl md:hidden block cursor-pointer"
              onClick={handleClick}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
