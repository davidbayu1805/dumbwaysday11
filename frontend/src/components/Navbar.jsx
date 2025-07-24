import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScroll(true);
        setShow(false);
      } else {
        setScroll(false);
      }
    };

    checkAuthStatus();

    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuActive = show ? "left-0" : "-left-full";
  const scrollActive = scroll ? "py-6 bg-white shadow" : "py-4";

  return (
    <div className={`navbar fixed w-full transition-all z-50 ${scrollActive}`}>
      <div className="container mx-auto px-4">
        <div className="navbar-box flex items-center justify-between">
          <div className="flex items-center">
            <div className="logo">
              <Link to="/">
                <img
                  src="/brandred.png"
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>
            <ul
              className={`fixed ${menuActive} top-1/2 -translate-y-1/2 flex flex-col gap-8 px-8 py-6 rounded shadow-g shadow-slate-300 bg-gray-400 font-bold text-white transition-all md:static md:flex-row md:flex md:items-center md:gap-12 md:p-0 md:m-0 md:w-auto md:h-full md:bg-transparent md:shadow-none md:text-black md:translate-y-0 md:transition-none md:ml-8`}
            >
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-3 font-medium opacity-75 hover:opacity-100 transition-opacity"
                >
                  <i className="ri-home-2-line text-3xl md:hidden block"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="myproject"
                  className="flex items-center gap-3 font-medium opacity-75 hover:opacity-100 transition-opacity"
                >
                  <i className="ri-folder-open-fill text-3xl md:hidden block"></i>
                  MyProject
                </Link>
              </li>
              <li className="md:hidden">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 font-medium opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <i className="ri-logout-box-line text-3xl md:hidden block"></i>
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 font-medium opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <i className="ri-login-box-line text-3xl md:hidden block"></i>
                      Login
                    </Link>
                    <Link
                      to="/login?mode=register"
                      className="flex items-center gap-3 font-medium opacity-75 hover:opacity-100 transition-opacity mt-4"
                    >
                      <i className="ri-user-add-line text-3xl md:hidden block"></i>
                      Register
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:block text-sm font-medium">
                  Hi, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 px-5 py-2 rounded-full text-white font-bold hover:bg-gray-700 transition-all text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block bg-gray-900 px-5 py-2 rounded-full text-white font-bold hover:bg-gray-700 transition-all text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/login?mode=register"
                  className="hidden md:block bg-blue-500 px-5 py-2 rounded-full text-white font-bold hover:bg-blue-600 transition-all text-sm"
                >
                  Register
                </Link>
              </>
            )}
            <i
              className="ri-menu-3-line text-3xl md:hidden block cursor-pointer"
              onClick={() => setShow(!show)}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;