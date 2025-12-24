import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const RegisterPage = ({ setShowOTP, setFormData, formData }) => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [emailExistsError, setEmailExistsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "email") setEmailExistsError("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const checkUserExistance = async () => {
    try {
      const response = await fetch(
        `${API}/api/v1/checkUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setEmailExistsError("Email already exists. Please use another.");
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const sendOTP = async () => {
    try {
      const response = await fetch(
        `${API}/api/v1/sendOTP`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!data.success) return false;

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const existingUsers = await checkUserExistance();
    if (!existingUsers) {
      setIsLoading(false);
      return;
    }

    const otpsent = await sendOTP();
    if (!otpsent) {
      setIsLoading(false);
      return;
    }

    setShowOTP(true);
    setIsLoading(false);
    console.log("Registration successful:", formData);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const [focusedFields, setFocusedFields] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusedFields({ ...focusedFields, [field]: false });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-4">
        <img
          src="/CampusConnect (1) (2).png"
          className="w-14 h-14 mr-2"
          alt="CampusConnect Logo"
        />
        <h2 className="text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition duration-300">
          CampusConnect
        </h2>
      </div>

      <div className="max-w-md w-full border border-gray-300 rounded-lg bg-white px-8 pb-8 pt-5 transition-all duration-300">
        <p className="text-black text-3xl font-semibold mb-8">Sign Up</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative mt-4">
            <div className="relative">
              <input
                type="text"
                name="username"
                className={`w-full pt-3 pb-3 px-4 z-0 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 peer ${
                  formData.username ? "border-blue-500" : ""
                }`}
                value={formData.username}
                onChange={handleChange}
                onFocus={() => handleFocus("username")}
                onBlur={() => handleBlur("username")}
                required
              />
              <label
                className={`absolute left-4 z-10 transition-all duration-200 pointer-events-none ${
                  focusedFields.username || formData.username
                    ? "-top-2 text-xs text-blue-600 bg-white px-2"
                    : "top-1/2 -translate-y-1/2 text-gray-400"
                }`}
              >
                Username
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="relative mt-4">
            <div className="relative">
              <input
                type="text"
                name="email"
                className={`w-full pt-3 pb-3 px-4 z-0 border rounded-lg focus:ring-2 outline-none transition-all duration-200 peer ${
                  errors.email || emailExistsError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 focus:ring-blue-500"
                } ${formData.email && !errors.email ? "border-blue-500" : ""}`}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                required
              />
              <label
                className={`absolute left-4 z-10 transition-all duration-200 pointer-events-none ${
                  focusedFields.email || formData.email
                    ? "-top-2 text-xs text-blue-600 bg-white px-2"
                    : "top-1/2 -translate-y-1/2 text-gray-400"
                } ${errors.email || emailExistsError ? "text-red-500" : ""}`}
              >
                Email Address
              </label>
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
            {emailExistsError && (
              <p className="text-red-600 text-sm">{emailExistsError}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <div className="relative">
              <input
                type="password"
                name="password"
                className={`w-full pt-3 pb-3 px-4 z-10 border rounded-lg focus:ring-2 outline-none transition-all duration-200 peer ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 focus:ring-blue-500"
                } ${formData.password ? "border-blue-500" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                required
              />
              <label
                className={`absolute z-10 left-4 transition-all duration-200 pointer-events-none ${
                  focusedFields.password || formData.password
                    ? "-top-2 text-xs text-blue-600 bg-white px-2"
                    : "top-1/2 -translate-y-1/2 text-gray-400"
                } ${errors.password ? "text-red-500" : ""}`}
              >
                Password
              </label>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex justify-center w-full text-white py-3.5 rounded-lg font-semibold transition-all duration-300 transform shadow-lg
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-blue-200"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-lg font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
          >
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => navigate("/login")}
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
