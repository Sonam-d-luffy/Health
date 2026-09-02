import React from "react";
import {
  Instagram,
  Twitter,
  Send,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide">
              sport-sarthi
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Stay connected with us. For any queries, support, or
              assistance, feel free to reach out to our team.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 transition hover:border-white hover:bg-white hover:text-black"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 transition hover:border-white hover:bg-white hover:text-black"
              >
                <Twitter size={18} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 transition hover:border-white hover:bg-white hover:text-black"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Helpline */}
          <div>
            <h3 className="text-lg font-semibold">Need Help?</h3>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Our support team is available to help you with any
              questions or issues.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Helpline</p>
                <p className="text-base font-semibold">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400">
                support@sport-sarthi.com
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-semibold">
              Have a Query?
            </h3>

            <p className="mt-4 text-sm text-gray-400">
              Leave your contact details and we'll get back to you.
            </p>

            <form className="mt-5">
              <div className="flex overflow-hidden rounded-lg border border-gray-700 bg-white">
                <input
                  type="text"
                  placeholder="Contact for further query"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500"
                />

                <button
                  type="submit"
                  className="flex items-center justify-center bg-white px-4 text-black transition hover:bg-gray-200"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} sport-sarthi. All rights reserved.
            </p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;