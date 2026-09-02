import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import Navbar from "../Components/Navbar";
import { useCurrentUser } from "../Context/CurrentUserContext";
import Bg from "../Components/Bg";
import Footer from "../Components/Footer";

const InstituteLogin = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");

  const [sportsInput, setSportsInput] = useState("");

  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [local, setLocal] = useState("");

  const [forGirls, setForGirls] = useState("");

  const [registrationFile, setRegistrationFile] = useState(null);
  const [affiliationFile, setAffiliationFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [image, setImage] = useState(null);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/institute`;

  const handlePincodeBlur = async () => {
    if (pincode.length !== 6) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pincode/${pincode}`
      );

      const data = res.data[0];

      if (data.Status === "Success" && data.PostOffice?.length > 0) {
        setState(data.PostOffice[0].State);
        setDistrict(data.PostOffice[0].District);
        setMessage("Location fetched successfully");
      } else {
        setState("");
        setDistrict("");
        setMessage("Invalid pincode");
      }

    } catch (error) {
      console.error(error);

      setState("");
      setDistrict("");

      setMessage(
        error.response?.data?.message ||
        "Error fetching location data"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${API_URL}/signup`,
        {
          email
        }
      );

      setOtpSent(true);

      setMessage(
        res.data.message ||
        "OTP sent successfully"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {

    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
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

        setMessage(
          "Email verified successfully"
        );
      }

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password
        }
      );

      if (
        res.data.redirect === "otp" &&
        res.data.userId
      ) {

        navigate("/otp", {
          state: {
            InstituteId: res.data.userId
          }
        });

        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "instituteId",
        res.data.userId || res.data.instituteId
      );

      setCurrentUser(res.data.user);

      setMessage(
        res.data.message ||
        "Login successful"
      );

    setTimeout(() => {
  navigate(`/instituteDashboard/${res.data.userId || res.data.instituteId}`);
}, 500);
    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {

    e.preventDefault();


    if (!emailVerified) {
      setMessage(
        "Please verify your email first"
      );
      return;
    }


    if (
      !name ||
      !phone ||
      !registrationNo ||
      !password ||
      !sportsInput ||
      !pincode ||
      !state ||
      !district ||
      !local ||
      !forGirls
    ) {
      setMessage(
        "Please fill all required fields"
      );
      return;
    }


    if (
      !registrationFile ||
      !affiliationFile ||
      !panFile ||
      !image
    ) {
      setMessage(
        "Please upload all required documents"
      );
      return;
    }

    try {

      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append(
        "name",
        name
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "phone",
        phone
      );

      formData.append(
        "registrationNo",
        registrationNo
      );

      formData.append(
        "password",
        password
      );

      formData.append(
        "sports",
        sportsInput
      );

      formData.append(
        "pincode",
        pincode
      );

      formData.append(
        "state",
        state
      );

      formData.append(
        "district",
        district
      );

      formData.append(
        "local",
        local
      );

      formData.append(
        "forGirls",
        forGirls
      );

      // Documents

      formData.append(
        "registration",
        registrationFile
      );

      formData.append(
        "affiliation",
        affiliationFile
      );

      formData.append(
        "pan",
        panFile
      );

      formData.append(
        "image",
        image
      );

      const res = await axios.post(
        `${API_URL}/create-institute`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setMessage(
        res.data.message ||
        "Institute created successfully"
      );

      if (res.data.institute) {
        setCurrentUser(
          res.data.institute
        );
      }

      setTimeout(() => {
      navigate(`/instituteDashboard/${res.data.userId || res.data.instituteId}`);
      }, 1000);

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Institute creation failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {

    setIsLogin(!isLogin);

    setMessage("");

    setOtpSent(false);

    setEmailVerified(false);

    setOtp("");

  };

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
                  message
                    .toLowerCase()
                    .includes("success")
                  ||
                  message
                    .toLowerCase()
                    .includes("verified")
                    ||
                  message
                    .toLowerCase()
                    .includes("fetched")
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
                    ? "Access your institute portal"
                    : "Create your institute profile"}

                </p>

                <div className="mt-4 w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-200 mx-auto rounded-full" />

              </div>

              {/* Toggle */}

              <div className="flex justify-center mb-8">

                <button
                  type="button"
                  onClick={handleToggle}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                >

                  {isLogin
                    ? "Switch to Signup"
                    : "Switch to Login"}

                </button>

              </div>

              {/* =========================
                  LOGIN
              ========================= */}

              {isLogin ? (

                <form
                  onSubmit={handleLogin}
                  className="space-y-6"
                >

                  {/* Email */}

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

                  {/* Password */}

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

                  {/* Login */}

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

                /* =========================
                   SIGNUP
                ========================= */

                <form
                  onSubmit={handleSignup}
                  className="space-y-6"
                >

                  {/* =========================
                      EMAIL VERIFICATION
                  ========================= */}

                  <div className="p-5 bg-gray-900/70 border border-gray-700 rounded-2xl">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="text-lg font-semibold text-white">
                        Verify Institute Email
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
                        placeholder="Enter institute email"
                        value={email}
                        disabled={emailVerified}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className={`${inputClass} flex-1 ${
                          emailVerified
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      />

                      {!emailVerified && (

                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={
                            loading ||
                            !email
                          }
                          className="px-5 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white font-semibold whitespace-nowrap transition-all disabled:opacity-50"
                        >

                          {loading
                            ? "Sending..."
                            : otpSent
                            ? "Resend OTP"
                            : "Verify Email"}

                        </button>

                      )}

                    </div>

                    {/* OTP */}

                    {otpSent &&
                      !emailVerified && (

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
                              onClick={
                                handleVerifyOTP
                              }
                              disabled={
                                loading ||
                                otp.length !== 6
                              }
                              className="px-5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold transition-all disabled:opacity-50"
                            >

                              {loading
                                ? "Checking..."
                                : "Verify"}

                            </button>

                          </div>

                        </div>

                      )}

                  </div>

                  {/* =========================
                      REST OF SIGNUP FORM
                  ========================= */}

                  <div
                    className={
                      !emailVerified
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100 transition-all"
                    }
                  >

                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-5">

                      {/* Name + Registration */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                          <label className={labelClass}>
                            Institute Name *
                          </label>

                          <input
                            type="text"
                            placeholder="Enter institute name"
                            value={name}
                            onChange={(e) =>
                              setName(e.target.value)
                            }
                            className={inputClass}
                          />

                        </div>

                        <div>

                          <label className={labelClass}>
                            Registration Number *
                          </label>

                          <input
                            type="text"
                            placeholder="Enter registration number"
                            value={registrationNo}
                            onChange={(e) =>
                              setRegistrationNo(
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />

                        </div>

                      </div>

                      {/* Phone */}

                      <div>

                        <label className={labelClass}>
                          Phone Number *
                        </label>

                        <input
                          type="text"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          className={inputClass}
                        />

                      </div>

                      {/* Sports */}

                      <div>

                        <label className={labelClass}>
                          Sports Offered *
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Cricket, Football, Tennis"
                          value={sportsInput}
                          onChange={(e) =>
                            setSportsInput(
                              e.target.value
                            )
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
                          onBlur={
                            handlePincodeBlur
                          }
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
                            Local Area *
                          </label>

                          <input
                            type="text"
                            placeholder="Enter locality"
                            value={local}
                            onChange={(e) =>
                              setLocal(
                                e.target.value
                              )
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
                              setPassword(
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />

                        </div>

                      </div>

                      {/* =========================
                          DOCUMENTS
                      ========================= */}

                      <div className="p-5 bg-gray-900/60 border border-gray-700 rounded-2xl">

                        <h3 className="text-lg font-semibold text-white mb-4">
                          Institute Documents
                        </h3>

                        <div className="space-y-5">

                          {/* Registration */}

                          <div>

                            <label className={labelClass}>
                              Registration Document *
                            </label>

                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                setRegistrationFile(
                                  e.target.files[0]
                                )
                              }
                              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                            />

                          </div>

                          {/* Affiliation */}

                          <div>

                            <label className={labelClass}>
                              Affiliation Certificate *
                            </label>

                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                setAffiliationFile(
                                  e.target.files[0]
                                )
                              }
                              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                            />

                          </div>

                          {/* PAN */}

                          <div>

                            <label className={labelClass}>
                              PAN Document *
                            </label>

                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                setPanFile(
                                  e.target.files[0]
                                )
                              }
                              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                            />

                          </div>

                          {/* Institute Image */}

                          <div>

                            <label className={labelClass}>
                              Institute Image *
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

                      {/* =========================
                          FOR GIRLS
                      ========================= */}

                      <div>

                        <label className={labelClass}>
                          For Girls Only? *
                        </label>

                        <select
                          value={forGirls}
                          onChange={(e) =>
                            setForGirls(
                              e.target.value
                            )
                          }
                          className={inputClass}
                        >

                          <option value="">
                            --- Select ---
                          </option>

                          <option value="Yes">
                            Yes
                          </option>

                          <option value="No">
                            No
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      CREATE ACCOUNT
                  ========================= */}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !emailVerified
                    }
                    className="w-full py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-500 hover:from-gray-700 hover:to-gray-400 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed"
                  >

                    {loading
                      ? "Creating Institute..."
                      : "Create Institute Account"}

                  </button>

                  {!emailVerified && (

                    <p className="text-center text-gray-500 text-sm">
                      Verify your email to unlock the institute signup form.
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

export default InstituteLogin;
