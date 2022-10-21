import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { parseLocalJwt, splitUrl } from "../commons/Utils";
import "../../App.css";
import "./NavBar.css";
import codeflexLogoPng from "../images/logo_png.png";

import leftArrowIcon from "../images/icons/left_arrow.svg";

function NavBar() {
  const [url, setUrl] = useState(splitUrl(window.location.pathname)[0]);
  const [logged, setLogged] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setUrl(splitUrl(window.location.pathname)[0]);
    if (localStorage.getItem("token") != null) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [url]);

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <nav
      className={`h-full bg-white border border-t-0 border-b-0 border-l-0 dark:bg-black"
      }`}
    >
      {logged ? (
        <div className="flex flex-col h-screen dark:bg-gray-800">
          <div className={` ${open ? "w-64" : "w-20"}   p-5 pt-8  relative`}>
            <img
              src={leftArrowIcon}
              onClick={() => setOpen(!open)}
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute cursor-pointer -right-3 top-9 w-7 bg-white
                            border-2 rounded-full  ${!open && "rotate-180"}`}
            />

            <Link
              to={"/"}
              onClick={() => setSelected("")}
              className="flex gap-x-4 items-center p-1"
            >
              <img
                src={codeflexLogoPng}
                className={`h-7 cursor-pointer duration-500 ${
                  open && "rotate-[360deg]"
                }`}
              />
              <h1
                className={`text-gray-700 origin-left font-medium text-xl duration-200 ${
                  !open && "scale-0"
                }`}
              >
                Codeflex
              </h1>
            </Link>

            <ul className="pt-10 pb-2">
              <li>
                <Link
                  to="/Dashboard"
                  onClick={() => setSelected("dashboard")}
                  className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "dashboard"
                                        ? "text-black"
                                        : ""
                                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    Dashboard
                  </span>
                </Link>
              </li>
            </ul>
            <ul className="py-2">
              <li>
                <Link
                  to="/practise"
                  onClick={() => setSelected("practise")}
                  className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "practise" ? "text-black" : ""
                                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    Practise
                  </span>
                </Link>
              </li>
            </ul>
            <ul className="py-2">
              <li>
                <Link
                  to="/compete"
                  onClick={() => setSelected("tournaments")}
                  className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "tournaments"
                                        ? "text-black"
                                        : ""
                                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>

                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    Tournaments
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="py-2">
              <li>
                <Link
                  to="/leaderboard"
                  onClick={() => setSelected("leaderboard")}
                  className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "leaderboard"
                                        ? "text-black"
                                        : ""
                                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>

                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    Leaderboard
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="py-2">
              {parseLocalJwt().role === "CONTENT_MANAGER" ? (
                <li className="border-t">
                  <div className="pt-4">
                    <Link
                      to="/manage"
                      onClick={() => setSelected("manage")}
                      className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "manage" ? "text-black" : ""
                                    }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        Manage Content
                      </span>
                    </Link>
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>

            <ul className="py-2">
              <li>
                <Link
                  to={"/user/" + parseLocalJwt().username}
                  onClick={() => setSelected("profile")}
                  className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "profile" ? "text-black" : ""
                                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    Profile
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="py-2">
              <li className="border-t">
                <div className="pt-4">
                  <Link
                    to="/"
                    onClick={logoutUser}
                    className={`flex rounded-md p-2 cursor-pointer text-base font-semibold items-center gap-x-4 text-gray-400 hover:text-black hover:bg-gray-50
                                    ${
                                      selected == "logout" ? "text-black" : ""
                                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      Log out
                    </span>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className=" flex-1 flex-grow">
            <h1 className="text-2xl font-semibold "></h1>
          </div>
        </div>
      ) : (
        <div>
          {/* USER IS LOGGED OUT  
                    <div className="overflow-y-auto py-4 px-3  rounded dark:bg-gray-800">
                        <span className="flex" id="myNavbar">
                            <a href="https://flowbite.com" class="flex items-center pl-2.5 mb-5">
                                <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                                <span class="self-center text-xl font-semibold whitespace-nowrap">Codeflex</span>
                            </a>
                        </span>
                    </div >
                    */}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
