import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import Swal from 'sweetalert2';

const LoginSignupForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ 
    username: '', 
    password: '' 
  });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    setIsActive(mode === 'register');
  }, [location]);

  const handleRegisterClick = () => {
    setIsActive(true);
    navigate('/login?mode=register', { replace: true });
  };

  const handleLoginClick = () => {
    setIsActive(false);
    navigate('/login', { replace: true });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { username, password } = loginData;
      const response = await AuthService.login(username, password);
    
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      await Swal.fire({
        icon: 'success',
        title: 'Login Success',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
      });
 
      const from = location.state?.from?.pathname || '/myproject';
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid username or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { username, email, password, confirmPassword } = registerData;
    
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const response = await AuthService.register(username, email, password);
  
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      await Swal.fire({
        icon: 'success',
        title: 'Registration Success',
        text: 'Your account has been created!',
        timer: 1500,
        showConfirmButton: false,
      });
    
      navigate('/myproject', { replace: true });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'Failed to create account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200 font-sans">
      <div className={`relative w-[850px] max-w-[90vw] h-[550px] max-h-[calc(100vh-40px)] bg-white m-5 rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-1000 ${isActive ? 'md:h-[550px]' : ''}`}>
   
        <form onSubmit={handleLoginSubmit}>
          <div className={`absolute ${isActive ? 'right-1/2' : 'right-0'} w-full md:w-1/2 h-full bg-white flex items-center text-gray-700 text-center p-10 z-10 transition-all duration-700 ease-in-out ${isActive ? 'delay-1200' : 'delay-0'} ${isActive ? 'md:right-1/2' : 'md:right-0'} max-md:${isActive ? 'bottom-[30%]' : 'bottom-0'} max-md:h-[70%] max-md:w-full`}>
            <div className="w-full">
              <h1 className="text-4xl max-md:text-3xl font-semibold mb-4">Login</h1>
              
              <div className="relative my-8">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">👤</i>
              </div>
              
              <div className="relative my-8">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">🔒</i>
              </div>
              
              <div className="mb-4 -mt-4 text-right">
                <a href="#" className="text-sm text-gray-700 hover:underline">Forgot Password?</a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-400 rounded-lg shadow-lg border-none cursor-pointer text-base text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">↻</span>
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>
              
              <p className="text-sm my-4">or login with social platforms</p>
              
              <div className="flex justify-center gap-4">
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">🔍</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">📘</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">⚫</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">💼</button>
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={handleRegisterSubmit}>
          <div className={`absolute right-0 w-full md:w-1/2 h-full bg-white flex items-center text-gray-700 text-center p-10 z-10 transition-all duration-700 ease-in-out ${isActive ? 'visible delay-0' : 'invisible delay-1000'} ${isActive ? 'md:right-1/2' : 'md:right-0'} max-md:${isActive ? 'bottom-[30%]' : 'bottom-0'} max-md:h-[70%] max-md:w-full`}>
            <div className="w-full">
              <h1 className="text-4xl max-md:text-3xl font-semibold mb-4">Registration</h1>
              
              <div className="relative my-8">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">👤</i>
              </div>
              
              <div className="relative my-8">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">✉️</i>
              </div>
              
              <div className="relative my-8">
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters)"
                  required
                  minLength="6"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">🔒</i>
              </div>

              <div className="relative my-8">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  minLength="6"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-700 font-medium placeholder-gray-500"
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl">🔒</i>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-400 rounded-lg shadow-lg border-none cursor-pointer text-base text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">↻</span>
                    Registering...
                  </span>
                ) : 'Register'}
              </button>
              
              <p className="text-sm my-4">or register with social platforms</p>
              
              <div className="flex justify-center gap-4">
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">🔍</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">📘</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">⚫</button>
                <button type="button" className="inline-flex p-2 border-2 border-gray-300 rounded-lg text-2xl text-gray-700 hover:border-blue-400 transition-colors">💼</button>
              </div>
            </div>
          </div>
        </form>

        <div className="absolute w-full h-full">
          <div className={`absolute ${isActive ? 'left-1/2' : '-left-[250%]'} w-[300%] h-full bg-blue-400 rounded-[150px] z-20 transition-all duration-[1.8s] ease-in-out max-md:${isActive ? 'top-[70%]' : '-top-[270%]'} max-md:left-0 max-md:w-full max-md:h-[300%] max-md:rounded-[20vw]`}></div>
        </div>

        <div className={`absolute ${isActive ? '-left-1/2' : 'left-0'} w-full md:w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'delay-700' : 'delay-1200'} max-md:w-full max-md:h-[30%] max-md:top-0 max-md:${isActive ? '-top-[30%]' : 'top-0'} max-md:left-0`}>
          <h1 className="text-4xl max-md:text-3xl font-semibold mb-4">Hello, Welcome!</h1>
          <p className="text-sm mb-5">Don't have an account?</p>
          <button
            onClick={handleRegisterClick}
            className="w-40 h-12 bg-transparent border-2 border-white rounded-lg text-base text-white font-semibold cursor-pointer hover:bg-white hover:text-blue-400 transition-all"
          >
            Register
          </button>
        </div>

        <div className={`absolute ${isActive ? 'right-0' : '-right-1/2'} w-full md:w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'delay-1200' : 'delay-700'} max-md:w-full max-md:h-[30%] max-md:right-0 max-md:${isActive ? 'bottom-0' : '-bottom-[30%]'}`}>
          <h1 className="text-4xl max-md:text-3xl font-semibold mb-4">Welcome Back!</h1>
          <p className="text-sm mb-5">Already have an account?</p>
          <button
            onClick={handleLoginClick}
            className="w-40 h-12 bg-transparent border-2 border-white rounded-lg text-base text-white font-semibold cursor-pointer hover:bg-white hover:text-blue-400 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;