import React from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import TerritoryMap from "../Components/TerritoryMap";
import Layout from "../Components/Layout";

const Home = () => {
  const navigate = useNavigate();

  const aca = () => {
    navigate("/instituteLogin");
  };

  const player = () => {
    navigate("/playerLogin");
  };

  const post = () => {
    navigate("/post");
  };

  return (
    <Layout >
      <section className="relative min-h-screen w-full overflow-hidden pt-28 sm:pt-32 lg:pt-24">
        <div
          className="
            mx-auto
            grid
            min-h-[calc(100vh-120px)]
            max-w-7xl
            grid-cols-1
            items-center
            gap-5
            px-6
            sm:px-10
            lg:grid-cols-2
            lg:gap-6
            lg:px-12
          "
        >
          <div className="relative z-10 text-center lg:text-left">
            <p
              className="
                mb-4
                text-xs
                font-semibold
                uppercase
                tracking-[0.35em]
                text-white/55
                sm:text-sm
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

              <button
                onClick={post}
                className="
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
                "
              >
                Explore Community
              </button>
            </div>
          </div>

          <div
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
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

            <div className="mt-3 max-w-md text-center">
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
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-white/45
                  sm:text-xs
                "
              >
                Surpass the distance. Own the ground.
              </p>
            </div>
          </div>
        </div>

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

      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-6
            sm:px-10
            lg:grid-cols-2
            lg:px-12
          "
        >
          <div className="max-w-xl">
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-white/45
              "
            >
              For Players
            </span>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Train Hard.
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
            <div
              className="
                group
                relative
                w-full
                max-w-xl
                overflow-hidden
                rounded-3xl
                border
                border-white/15
                bg-white/5
                shadow-2xl
              "
            >
              <img
                src={assets.s1}
                alt="Sports players"
                className="
                  relative
                  h-[280px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-xl font-bold text-white">
                  Push Your Limits
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/55">
                  Become Better
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-6
            sm:px-10
            lg:grid-cols-2
            lg:px-12
          "
        >
          <div className="order-2 flex items-center justify-center lg:order-1">
            <div
              className="
                group
                relative
                w-full
                max-w-xl
                overflow-hidden
                rounded-3xl
                border
                border-white/15
                bg-white/5
                shadow-2xl
              "
            >
              <img
                src={assets.s4}
                alt="Sports academy"
                className="
                  relative
                  h-[280px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-xl font-bold text-white">
                  Build Champions
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/55">
                  Grow Together
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 max-w-xl lg:order-2">
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-white/45
              "
            >
              For Academies
            </span>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Grow Your
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

      <section className="relative overflow-hidden py-12 text-white sm:py-16">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            items-center
            gap-8
            px-6
            sm:px-10
            lg:grid-cols-2
            lg:px-12
          "
        >
          <div className="max-w-xl">
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-white/45
              "
            >
              Our Community
            </span>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              One Community.
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
              onClick={post}
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
            <div
              className="
                group
                relative
                w-full
                max-w-xl
                overflow-hidden
                rounded-3xl
                border
                border-white/15
                bg-white/5
                shadow-2xl
              "
            >
              <img
                src={assets.s3}
                alt="Sports community"
                className="
                  relative
                  h-[280px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                  sm:h-[360px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <p className="text-xl font-bold text-white">
                  Together We Grow
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/55">
                  Connect • Share • Grow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            Your Journey Starts Here
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            "
          >
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
    </Layout>
  );
};

export default Home;
