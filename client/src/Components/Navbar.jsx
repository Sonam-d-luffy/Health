import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../Context/CurrentUserContext";

const Navbar = ({ logo, title, onButtonClick, buttonName = "Login" }) => {
  const navigate = useNavigate();
  const {currentUser} = useCurrentUser()
   const handleNavClick = (item) => {
    if (item === "Profile") {
      if (currentUser?._id) {
        navigate(`/profile/${currentUser._id}`);
      }else{
        navigate('/playerLogin')
      }
    } else if (item === "Home") {
      navigate("/");
    } else if (item === "Record") {
      navigate("/record");
    } else if (item === "AI Trainer") {
      if(currentUser){
      navigate("/FitnessTrainer");
      }else{
        navigate("/playerLogin")
      }
    }
  };

  const navItems = ["Profile", "Home", "Record", "AI Trainer"];

  return (
    <nav
      className="
        absolute top-0 left-0
        w-full
        px-5 sm:px-8 md:px-12 lg:px-16
        py-5 sm:py-6
        z-50
      "
    >
      <div
        className="
          w-full
          flex
          flex-wrap
          items-center
          justify-between
          gap-y-5
        "
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {logo && (
            <img
              src={logo}
              alt="logo"
              className="
                h-9 w-9
                sm:h-10 sm:w-10
                md:h-12 md:w-12
                object-contain
              "
            />
          )}

          <span
            className="
              text-lg sm:text-xl md:text-2xl
              font-bold
              text-white
              tracking-wide
            "
          >
            {title}
          </span>
        </div>

        <div
          className="
            order-3
            w-full
            md:order-2
            md:w-auto
            flex
            items-center
            justify-center
            gap-6
            sm:gap-8
            md:gap-10
            lg:gap-14
          "
        >
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="
                bg-transparent
                text-white
                font-bold
                text-xs
                sm:text-sm
                md:text-base
                lg:text-lg
                tracking-widest
                whitespace-nowrap
                hover:underline
                hover:underline-offset-8
                transition-all
                duration-200
                cursor-pointer
              "
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={onButtonClick}
          className="
            order-2
            md:order-3
            px-5 py-2
            sm:px-6 sm:py-2.5
            md:px-7 md:py-3
            rounded-lg
            bg-white
            text-black
            font-semibold
            text-sm sm:text-base
            tracking-wide
            shadow-md
            hover:bg-black
            hover:text-white
            hover:shadow-lg
            hover:scale-105
            active:scale-95
            transition-all
            duration-200
            cursor-pointer
          "
        >
          {buttonName || "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
