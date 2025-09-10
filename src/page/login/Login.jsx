import React, { useState, useContext } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../API/Api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/image/logo.png";
import girl2 from "../../assets/image/girl2.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Forgot password states
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = reset
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleClick = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 🔔 Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      Toast.fire({ icon: "success", title: "Login successful!" });
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.role === "admin") navigate("/admin/home");
      if (storedUser?.role === "vendor") navigate("/vendor/home");
      if (storedUser?.role === "company") navigate("/company/home");
    } else {
      Toast.fire({ icon: "error", title: "Invalid email or password" });
    }
  };

  // Step 1: Request OTP
  const sendOtp = async () => {
    try {
      await API.post("/auth/send-otp", { email: resetEmail });
      Toast.fire({ icon: "success", title: "OTP sent to email!" });
      setStep(2);
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    try {
      await API.post("/auth/verify-otp", { email: resetEmail, otp });
      Toast.fire({ icon: "success", title: "OTP verified!" });
      setStep(3);
    } catch (err) {
      Toast.fire({ icon: "error", title: "Invalid OTP" });
    }
  };

  // Step 3: Reset Password
  const resetPassword = async () => {
    try {
      await API.post("/auth/reset-password", {
        email: resetEmail,
        newPassword,
      });
      Toast.fire({ icon: "success", title: "Password reset successfully!" });
      setStep(1);
    } catch (err) {
      Toast.fire({ icon: "error", title: "Failed to reset password" });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r min-h-screen from-gray-300 via-white to-gray-300">
      <div className="mb-4 mt-4 flex max-w-6xl flex-col sm:mx-2 xl:flex-row">
        {/* Left Side */}
        <div className="w-full bg-[#d7e0dd shadow-2xl xl:w-2/3 xl:rounded-bl-2xl xl:rounded-tl-2xl">
          <div className="m-10 max-w-5xl">
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-md p-6 rounded-lg shadow-md w-full"
            >
              <img
                src={logo}
                loading="lazy"
                alt="logo"
                className="w-[150px] mb-6"
              />
              <div className="text-3xl font-bold mb-4">Welcome</div>
              {/* Email */}
              <label>
                <span className="text-xl">
                  Email<span className="text-red-500">*</span>
                </span>
              </label>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full appearance-none rounded border px-3 py-2 pr-10 shadow focus:bg-slate-50 focus:shadow focus:outline-none focus:border-red-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password */}
              <div className="relative flex flex-col justify-center gap-1 text-left">
                <span className="text-xl">
                  Password <span className="text-red-500">*</span>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full appearance-none rounded border mb-6 px-3 py-2 pr-10 shadow focus:bg-slate-50 focus:shadow focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-11 text-gray-400"
                  onClick={handleClick}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:cursor-pointer text-xl font-semibold">
                Login
              </button>
              <p
                onClick={() =>
                  Swal.fire({
                    title: "Forgot Password?",
                    html:
                      step === 1
                        ? `<input type="email" id="email" class="swal2-input" placeholder="Enter your email"/>`
                        : step === 2
                          ? `<input type="text" id="otp" class="swal2-input" placeholder="Enter OTP"/>`
                          : `<input type="password" id="newPassword" class="swal2-input" placeholder="Enter new password"/>`,
                    confirmButtonText:
                      step === 1
                        ? "Send OTP"
                        : step === 2
                          ? "Verify OTP"
                          : "Reset Password",
                    showCancelButton: true,
                    preConfirm: () => {
                      if (step === 1) {
                        setResetEmail(document.getElementById("email").value);
                        sendOtp();
                      } else if (step === 2) {
                        setOtp(document.getElementById("otp").value);
                        verifyOtp();
                      } else {
                        setNewPassword(
                          document.getElementById("newPassword").value
                        );
                        resetPassword();
                      }
                    },
                  })
                }
                className="text-red-500 cursor-pointer text-center mt-2 block"
              >
                Forgot Password?
              </p>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full bg-white shadow-2xl xl:w-auto xl:rounded-br-2xl xl:rounded-tr-2xl">
          <img
            src={girl2}
            loading="lazy"
            decoding="async"
            alt="frame"
            className="hidden w-full object-cover xl:block xl:w-[500px] xl:rounded-br-2xl xl:rounded-tr-2xl h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
