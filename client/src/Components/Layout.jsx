import React from "react";
import Bg from "./Bg";
import Navbar from "./Navbar";
import Footer from "./Footer";
import assets from "../assets/assets";
import HomeNavbar from "./HomeNavbar";

const Layout = ({ children, currentUser }) => {
  return (
    <Bg>
      <HomeNavbar
        logo={assets.clogo}
        title="sports saarthi"
        buttonName={currentUser?.name}
      />

      <main>
        {children}
      </main>

      <Footer />
    </Bg>
  );
};

export default Layout;