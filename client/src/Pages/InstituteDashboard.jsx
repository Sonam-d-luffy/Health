import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import assets from "../assets/assets";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Bg from "../Components/Bg";

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Institute ID not found");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/institute/profile/${id}`
        );

        if (res.data.success) {
          setInstitute(res.data.institute);
        } else {
          setError(res.data.message || "Institute not found");
        }
      } catch (err) {
        console.error("Institute fetch error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load institute information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInstitute();
  }, [id, API_URL]);

  const submit = () => {
    if (id) {
      navigate(`/${id}/submission`);
    }
  };

  const instituteImage =
    institute?.docs?.image ||
    institute?.profileImage ||
    institute?.image ||
    assets.clogo;

  if (loading) {
    return (
      <Bg>
        <div className="flex min-h-screen items-center justify-center text-white">
          <p className="text-sm text-white/50">
            Loading institute...
          </p>
        </div>
      </Bg>
    );
  }

  if (error || !institute) {
    return (
      <Bg>
        <div className="flex min-h-screen items-center justify-center px-5 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-black">
              Institute Not Found
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {error || "Unable to load institute information"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
            >
              Go Home
            </button>
          </div>
        </div>
      </Bg>
    );
  }

  return (
    <Bg>
      <div className="min-h-screen text-white">
       
        <main className="px-4 pb-16 pt-28 sm:px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
             <div className="relative h-44 overflow-hidden sm:h-56 md:h-64">
  <img
    src={assets.s4}
    alt="Institute cover"
    className="h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
</div>

              <div className="relative px-5 pb-8 sm:px-8 md:px-10">
                <div className="-mt-16 flex flex-col items-center sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-black bg-white/10 shadow-2xl sm:h-40 sm:w-40">
                    <img
                      src={instituteImage}
                      alt={institute.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 min-w-0 flex-1 text-center sm:mb-3 sm:mt-0 sm:text-left">
                    <h1 className="break-words text-2xl font-black sm:text-3xl md:text-4xl">
                      {institute.name}
                    </h1>

                    <p className="mt-1 break-words text-sm text-white/45">
                      {institute.email}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {institute.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/editInstituteProfile/${id}`)}
                    className="mt-4 rounded-full border border-white/20 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold transition-all hover:bg-white hover:text-black sm:mb-3 sm:mt-0"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                Institute
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Institute Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Registration Number
                  </p>
                  <p className="mt-3 break-words text-sm font-bold">
                    {institute.registrationNo || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Email
                  </p>
                  <p className="mt-3 break-words text-sm font-bold">
                    {institute.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Phone
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {institute.phone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    State
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {institute.address?.state || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    District
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {institute.address?.district || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Pincode
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {institute.address?.pincode || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:col-span-2 lg:col-span-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Address
                  </p>

                  <p className="mt-3 text-sm font-bold leading-6">
                    {institute.address?.local || "Not provided"}
                    {institute.address?.district &&
                      `, ${institute.address.district}`}
                    {institute.address?.state &&
                      `, ${institute.address.state}`}
                    {institute.address?.pincode &&
                      ` - ${institute.address.pincode}`}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:col-span-2 lg:col-span-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Sports Offered
                  </p>

                  {Array.isArray(institute.sports) &&
                  institute.sports.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {institute.sports.map((sport, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 text-sm font-semibold"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/40">
                      No sports information available.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:col-span-2 lg:col-span-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Training For Girls
                  </p>

                  <p className="mt-3 text-sm font-bold">
                    {institute.forGirls || "Not specified"}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                    Applications
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Player Applications
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                    View and manage players who have applied to your institute.
                  </p>
                </div>

                <button
                  onClick={submit}
                  className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-white/85 active:scale-95"
                >
                  View Applications →
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </Bg>
  );
};

export default InstituteDashboard;