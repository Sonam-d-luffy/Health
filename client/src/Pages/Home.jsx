import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import TerritoryMap from "../Components/TerritoryMap";
import Layout from "../Components/Layout";
import Bot from "../Components/Bot";

const Home = () => {
  const navigate = useNavigate();

  const [isBotOpen, setIsBotOpen] = useState(false);

  const aca = () => {
    navigate("/instituteLogin");
  };

  const player = () => {
    navigate("/playerLogin");
  };

  const post = () => {
    navigate("/post");
  };
const communities = () => {
  navigate("/community")
}
  return (
    <Layout>
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-screen w-full overflow-hidden pt-28 sm:pt-32 lg:pt-24">
        <div
          className="
            mx-auto
            grid
            min-h-[calc(100vh-120px)]
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-5
            sm:px-8
            md:px-10
            lg:grid-cols-2
            lg:gap-10
            lg:px-12
          "
        >
          <div className="relative z-10 text-center lg:text-left">
            <p
              className="
                mb-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-white/55
                sm:text-xs
                md:text-sm
              "
            >
              Your Sports. Your Journey.
            </p>

            <h1
              className="
                text-4xl
                font-black
                leading-[1.05]
                tracking-tight
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              Find Your
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-white
                  via-white/80
                  to-white/40
                  bg-clip-text
                  text-transparent
                "
              >
                Sporting Edge
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-white/60
                sm:text-base
                lg:mx-0
                lg:text-lg
              "
            >
              Discover sports opportunities, connect with academies,
              meet fellow players, track your performance, and take
              the next step toward your sporting goals.
            </p>

            <div
              className="
                mt-7
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
                lg:justify-start
              "
            >
              <button
                onClick={player}
                className="
                  w-full
                  rounded-full
                  bg-white
                  px-8
                  py-3.5
                  font-bold
                  text-black
                  shadow-xl
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-white/85
                  sm:w-auto
                "
              >
                Get Started
              </button>

              <button
                onClick={post}
                className="
                  w-full
                  rounded-full
                  border
                  border-white/20
                  bg-transparent
                  px-8
                  py-3.5
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-white/10
                  sm:w-auto
                "
              >
                Explore Community
              </button>
            </div>
          </div>

          {/* TERRITORY MAP */}
          <div
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              pt-6
              lg:pt-0
            "
          >
            <div
              className="
                relative
                w-full
                max-w-[500px]
                sm:max-w-[540px]
                lg:max-w-[500px]
              "
            >
              <TerritoryMap />
            </div>

            <div className="mt-3 max-w-md px-4 text-center">
              <h3
                className="
                  text-lg
                  font-black
                  tracking-tight
                  text-white
                  sm:text-xl
                "
              >
                Make Your Own Territory.
              </h3>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-white/45
                  sm:text-xs
                "
              >
                Surpass the distance. Own the ground.
              </p>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div
          className="
            absolute
            bottom-5
            left-1/2
            hidden
            -translate-x-1/2
            flex-col
            items-center
            gap-2
            text-white/35
            md:flex
          "
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Scroll to explore
          </span>

          <div className="h-8 w-5 rounded-full border border-white/20 p-1">
            <div className="mx-auto h-1.5 w-1 rounded-full bg-white animate-bounce" />
          </div>
        </div>
      </section>

      {/* =====================================================
          PLAYERS SECTION
      ====================================================== */}
      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-5
            sm:px-8
            md:px-10
            lg:grid-cols-2
            lg:gap-12
            lg:px-12
          "
        >
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              For Players
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Train Hard.
              <span className="block bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                Play Smart.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
              Find the right opportunities to improve your game.
              Connect with fellow athletes, discover sports facilities,
              participate in events, and build your path toward a
              successful sporting career.
            </p>

            <button
              onClick={player}
              className="
                mt-6
                rounded-full
                bg-white
                px-7
                py-3
                font-bold
                text-black
                shadow-lg
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/85
              "
            >
              Start Your Journey
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="group relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
              <img
                src={assets.s1}
                alt="Sports players"
                className="
                  h-[250px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[320px]
                  md:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-lg font-bold text-white sm:text-xl">
                  Push Your Limits
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/55 sm:text-xs">
                  Become Better
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACADEMY SECTION
      ====================================================== */}
      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-5
            sm:px-8
            md:px-10
            lg:grid-cols-2
            lg:gap-12
            lg:px-12
          "
        >
          <div className="order-2 flex items-center justify-center lg:order-1">
            <div className="group relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
              <img
                src={assets.s4}
                alt="Sports academy"
                className="
                  h-[250px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[320px]
                  md:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-lg font-bold text-white sm:text-xl">
                  Build Champions
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/55 sm:text-xs">
                  Grow Together
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 max-w-xl text-center lg:order-2 lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              For Academies
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Grow Your
              <span className="block bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                Sports Academy.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
              Bring your academy into a connected sporting ecosystem.
              Reach aspiring athletes, showcase your facilities,
              manage your community, and create opportunities for
              the next generation of players.
            </p>

            <button
              onClick={aca}
              className="
                mt-6
                rounded-full
                bg-white
                px-7
                py-3
                font-bold
                text-black
                shadow-lg
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/85
              "
            >
              Start Your Academy
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          COMMUNITY SECTION
      ====================================================== */}
      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-5
            sm:px-8
            md:px-10
            lg:grid-cols-2
            lg:gap-12
            lg:px-12
          "
        >
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Our Community
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              One Community.
              <span className="block bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                Endless Possibilities.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
              Sports become more powerful when people come together.
              Share experiences, discover opportunities, connect with
              athletes and academies, and be part of a growing sporting
              community.
            </p>

            <button
              onClick={communities}
              className="
                mt-6
                rounded-full
                bg-white
                px-7
                py-3
                font-bold
                text-black
                shadow-lg
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/85
              "
            >
              Join the Community
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="group relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
              <img
                src={assets.s3}
                alt="Sports community"
                className="
                  h-[250px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[320px]
                  md:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-lg font-bold text-white sm:text-xl">
                  Together We Grow
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/55 sm:text-xs">
                  Connect • Share • Grow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative overflow-hidden px-5 py-16 text-center text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35 sm:text-xs">
            Your Journey Starts Here
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Ready to make your move?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Whether you're a player, academy, or sports enthusiast,
            there's a place for you here.
          </p>

          <button
            onClick={player}
            className="
              mt-6
              rounded-full
              bg-white
              px-8
              py-3.5
              font-bold
              text-black
              shadow-xl
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white/85
            "
          >
            Get Started
          </button>
        </div>
      </section>

      {/* =====================================================
          FLOATING CHATBOT BUTTON
      ====================================================== */}
      {/* =====================================================
    FLOATING CHATBOT BUTTON
====================================================== */}
<button
  onClick={() => setIsBotOpen(true)}
  aria-label="Open AI Fitness Trainer"
  className="
    fixed
    bottom-5
    right-5
    z-[9999]
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-full
    bg-transparent
    shadow-[0_10px_40px_rgba(0,0,0,0.5)]
    transition-all
    duration-300
    hover:scale-110
    active:scale-95
    sm:bottom-6
    sm:right-6
    sm:h-16
    sm:w-16
  "
>
  {/* RAG Image */}
  <img
    src={assets.rag}
    alt="AI Fitness Trainer"
    className="
      h-full
      w-full
      rounded-full
      object-cover
    "
  />

  {/* Small AI Badge */}
  <span
    className="
      absolute
      right-0
      top-0
      flex
      h-4
      min-w-4
      items-center
      justify-center
      rounded-full
      bg-black
      px-1
      text-[7px]
      font-bold
      leading-none
      text-white
      shadow-md
    "
  >
    AI
  </span>
</button>
      {/* =====================================================
          CHATBOT SIDE PANEL
      ====================================================== */}

      {/* BACKDROP */}
      {isBotOpen && (
        <div
          onClick={() => setIsBotOpen(false)}
          className="
            fixed
            inset-0
            z-[10000]
            bg-black/50
            backdrop-blur-[2px]
          "
        />
      )}

      {/* CHAT PANEL */}
      <div
        className={`
          fixed
          right-0
          top-0
          z-[10001]
          h-full
          w-full
          transform
          bg-[#111111]
          shadow-2xl
          transition-transform
          duration-500
          ease-in-out
          sm:w-[430px]
          md:w-[480px]
          lg:w-[500px]
          ${isBotOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-white/10
            bg-[#151515]
            px-4
            sm:px-5
          "
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl">
  <img
    src={assets.rag}
    alt="AI Fitness Trainer"
    className="h-full w-full object-cover"
  />
</div>

            <div>
              <h2 className="text-sm font-bold text-white sm:text-base">
                AI Fitness Trainer
              </h2>

              <p className="text-[10px] text-white/40 sm:text-xs">
                Ask anything about fitness
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={() => setIsBotOpen(false)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-white/60
              transition
              hover:bg-white/10
              hover:text-white
            "
            aria-label="Close chatbot"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* CHATBOT */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <Bot />
        </div>
      </div>
    </Layout>
  );
};

export default Home;