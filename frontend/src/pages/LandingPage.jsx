import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

import HERO_IMG from "../assets/hero-img.png";
import { APP_FEATURES } from "../utils/data";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full min-h-full bg-[#FFFCEF] overflow-x-hidden">
        {/* Background Blur */}
        <div className="w-72 h-72 md:w-[500px] md:h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

        <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10 max-w-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-16 flex-wrap">
            <div className="text-xl text-black font-bold">Interview Prep AI</div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors mt-3 md:mt-0"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-8 md:mb-0">
              <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2 inline-flex">
                <LuSparkles /> AI Powered
              </div>

              <h1 className="text-4xl md:text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[16px] md:text-[17px] font-bold text-gray-900 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery — your ultimate interview toolkit is
                here.
              </p>

              <button
                className="bg-black text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <section className="flex items-center justify-center -mt-36 px-4 md:px-0">
        <img
          src={HERO_IMG}
          alt="Hero Image"
          className="w-full max-w-[90vw] md:max-w-[80vw] rounded-lg"
        />
      </section>

      {/* Features Section */}
      <div className="w-full min-h-full bg-[#FFFCEF] mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20 max-w-full">
          <h2 className="text-2xl font-bold text-center mb-12">
            Features That Make You Shine
          </h2>

          <div className="flex flex-col items-center gap-8">
            {/* First 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {APP_FEATURES.slice(0, 3).map((feature) => (
                <div
                  key={feature.id}
                  className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                >
                  <h3 className="text-base font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-bold">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Remaining 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {APP_FEATURES.slice(3).map((feature) => (
                <div
                  key={feature.id}
                  className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                >
                  <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-bold">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
        Made with ❤️... Happy Coding
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
