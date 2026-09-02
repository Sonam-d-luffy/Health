import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import Navbar from "../Components/Navbar";
import { useCurrentUser } from "../Context/CurrentUserContext";
import Bg from "../Components/Bg";
import Footer from "../Components/Footer";

const PlayerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [local, setLocal] = useState("");
  const [sportsInput, setSportsInput] = useState("");
  const [image, setImage] = useState(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const profile = (id) => {
    navigate(`/profile/${id}`)
  }
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/player`;

  // =========================
  // PINCODE
  // =========================

  const handlePincodeBlur = async () => {
    if (pincode.length !== 6) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pincode/${pincode}`
      );

      const data = res.data[0];

      if (data.Status === "Success") {
        setState(data.PostOffice[0].State);
        setDistrict(data.PostOffice[0].District);
        setMessage("");
      } else {
        setState("");
        setDistrict("");
        setMessage("Invalid pincode");
      }
    } catch (error) {
      setMessage("Error fetching location data");
    }
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOTP = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API_URL}/signup`, {
        email,
        name: "pending",
        password: "pending",
        sports: "pending",
        pincode: "000000",
        gender: "pending"
      });

      setOtpSent(true);

      setMessage(
        res.data.message || "OTP sent to your email"
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${API_URL}/verify-email`,
        {
          email,
          otp
        }
      );

      if (res.data.success) {
        setEmailVerified(true);
        setMessage("Email verified successfully");
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password
        }
      );

      if (
        res.data.redirect === "otp" &&
        res.data.playerId
      ) {
        navigate("/otp-player", {
          state: {
            playerId: res.data.playerId
          }
        });

        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "playerId",
        res.data.playerId
      );

      setCurrentUser(res.data.player);

      profile()

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FINAL SIGNUP
  // =========================

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      setMessage("Please verify your email first");
      return;
    }

    if (
      !name ||
      !phone ||
      !password ||
      !sportsInput ||
      !pincode ||
      !gender
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("sports", sportsInput);
      formData.append("pincode", pincode);
      formData.append("local", local);
      formData.append("gender", gender);
      formData.append("otp", otp);

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        `${API_URL}/create-player`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage(
        res.data.message ||
        "Player created successfully"
      );

      profile()
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT CLASS
  // =========================

  const inputClass =
    "w-full px-5 py-3.5 bg-black/40 backdrop-blur-xl border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-black/60 focus:ring-1 focus:ring-gray-500 transition-all duration-300 text-sm";

  const labelClass =
    "block text-gray-300 text-sm font-medium mb-2";

  return (
  <Bg>
  <div className="min-h-screen relative overflow-hidden bg-black/20 mt-10">
    <div className="fixed top-10 left-10 w-40 h-40 bg-gray-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="fixed bottom-20 right-10 w-48 h-48 bg-gray-400/10 rounded-full blur-3xl animate-pulse" />
    <div className="fixed top-1/3 left-1/2 w-28 h-28 bg-white/5 rounded-full blur-3xl animate-ping" />
    <div className="fixed bottom-1/3 left-10 w-24 h-24 bg-gray-400/10 rounded-full blur-2xl" />

    <div className="absolute top-5 left-8 right-8 md:left-12 md:right-12 lg:left-16 lg:right-16 z-50 flex items-center justify-between">
      <img
        src={assets.clogo}
        alt="Logo"
        className="w-12 h-12 rounded-full object-cover"
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-white font-semibold text-sm hover:underline transition-all duration-300"
      >
        ← Back
      </button>
    </div>

        <div className="relative z-10 px-4 pt-24 pb-12">

          <div className="max-w-2xl mx-auto">

            {/* Message */}

            {message && (
              <div
                className={`mb-6 p-4 backdrop-blur-xl border rounded-2xl text-center ${
                  message.toLowerCase().includes("success") ||
                  message.toLowerCase().includes("verified")
                    ? "bg-gray-500/20 border-gray-400/30 text-gray-200"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {/* Card */}

            <div className="backdrop-blur-2xl bg-black/50 p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-700/60">

              {/* Header */}

              <div className="text-center mb-8">

            
                <p className="text-gray-400 text-lg">
                  {isLogin
                    ? "Access your player portal"
                    : "Create your athlete profile"}
                </p>

                <div className="mt-4 w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-200 mx-auto rounded-full" />

              </div>

              {/* Toggle */}

              <div className="flex justify-center mb-8">

                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                    setOtpSent(false);
                    setEmailVerified(false);
                  }}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isLogin
                    ? "Switch to Signup"
                    : "Switch to Login"}
                </button>

              </div>

              {/* ================= LOGIN ================= */}

              {isLogin ? (

                <form
                  onSubmit={handleLogin}
                  className="space-y-6"
                >

                  <div>
                    <label className={labelClass}>
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 hover:from-gray-700 hover:to-gray-500 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading
                      ? "Please wait..."
                      : "Sign Into Portal"}
                  </button>

                </form>

              ) : (

                /* ================= SIGNUP ================= */

                <form
                  onSubmit={handleSignup}
                  className="space-y-6"
                >

                  {/* EMAIL VERIFICATION */}

                  <div className="p-5 bg-gray-900/70 border border-gray-700 rounded-2xl">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="text-lg font-semibold text-white">
                        Verify Email
                      </h3>

                      {emailVerified && (
                        <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                          ✓ Verified
                        </span>
                      )}

                    </div>

                    <div className="flex gap-3">

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={emailVerified}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className={`${inputClass} flex-1`}
                      />

                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="px-5 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white font-semibold whitespace-nowrap transition-all"
                        >
                          {loading
                            ? "Sending..."
                            : otpSent
                            ? "Resend OTP"
                            : "Verify Email"}
                        </button>
                      )}

                    </div>

                    {/* OTP FIELD */}

                    {otpSent && !emailVerified && (
                      <div className="mt-4">

                        <label className={labelClass}>
                          Enter OTP
                        </label>

                        <div className="flex gap-3">

                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                )
                              )
                            }
                            className={`${inputClass} flex-1 tracking-[0.4em]`}
                          />

                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="px-5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold transition-all"
                          >
                            Verify
                          </button>

                        </div>

                      </div>
                    )}

                  </div>

                  {/* REST OF FORM */}

                  <div
                    className={
                      !emailVerified
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100 transition-all"
                    }
                  >

                    <div className="max-h-[550px] overflow-y-auto pr-2 space-y-5">

                      {/* Name + Phone */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                          <label className={labelClass}>
                            Full Name *
                          </label>

                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) =>
                              setName(e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            Phone Number *
                          </label>

                          <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) =>
                              setPhone(e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>

                      </div>

                      {/* Gender */}

                      <div>

                        <label className={labelClass}>
                          Gender *
                        </label>

                        <select
                          value={gender}
                          onChange={(e) =>
                            setGender(e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">
                            --- Select Gender ---
                          </option>

                          <option value="Female">
                            Female
                          </option>

                          <option value="Male">
                            Male
                          </option>

                          <option value="Other">
                            Other
                          </option>
                        </select>

                      </div>

                      {/* Sports */}

                      <div>

                        <label className={labelClass}>
                          Sports *
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Cricket, Football"
                          value={sportsInput}
                          onChange={(e) =>
                            setSportsInput(e.target.value)
                          }
                          className={inputClass}
                        />

                      </div>

                      {/* Pincode */}

                      <div>

                        <label className={labelClass}>
                          Pincode *
                        </label>

                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit pincode"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(
                              e.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          onBlur={handlePincodeBlur}
                          className={inputClass}
                        />

                      </div>

                      {/* State + District */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                          <label className={labelClass}>
                            State
                          </label>

                          <input
                            type="text"
                            value={state}
                            readOnly
                            placeholder="Auto-filled"
                            className={`${inputClass} bg-gray-900/50`}
                          />

                        </div>

                        <div>

                          <label className={labelClass}>
                            District
                          </label>

                          <input
                            type="text"
                            value={district}
                            readOnly
                            placeholder="Auto-filled"
                            className={`${inputClass} bg-gray-900/50`}
                          />

                        </div>

                      </div>

                      {/* Local + Password */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                          <label className={labelClass}>
                            Local Area
                          </label>

                          <input
                            type="text"
                            placeholder="Enter locality"
                            value={local}
                            onChange={(e) =>
                              setLocal(e.target.value)
                            }
                            className={inputClass}
                          />

                        </div>

                        <div>

                          <label className={labelClass}>
                            Password *
                          </label>

                          <input
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            className={inputClass}
                          />

                        </div>

                      </div>

                      {/* Image */}

                      <div className="p-5 bg-gray-900/60 border border-gray-700 rounded-2xl">

                        <label className="block text-gray-300 text-sm font-medium mb-3">
                          Profile Image
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImage(
                              e.target.files[0]
                            )
                          }
                          className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                        />

                      </div>

                    </div>

                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !emailVerified
                    }
                    className="w-full py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-500 hover:from-gray-700 hover:to-gray-400 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Player Account"}
                  </button>

                  {!emailVerified && (
                    <p className="text-center text-gray-500 text-sm">
                      Verify your email to unlock the signup form.
                    </p>
                  )}

                </form>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </Bg>
  );
};

export default PlayerLogin;
