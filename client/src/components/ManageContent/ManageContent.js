import React from "react";
import { Link, useLocation } from "react-router-dom";
import { parseLocalJwt } from "../commons/Utils";
import PathLink from "../PathLink/PathLink";

import "./ManageContent.css";

function ManageContent() {
  const location = useLocation();

  return (
    <div>
      <PathLink
        path={location.pathname}
        title="Manage Content"
        user={parseLocalJwt().username}
      />
      {parseLocalJwt().role == "CONTENT_MANAGER" ? (
        // ROLE IS CONTENT MANAGER
        <div class="w-full h-full flex justify-center items-center">
          <div
            id="main"
            class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 justify-evenly px-8 gap-4 "
          >
            <Link to="/manage/tournaments">
              <div className="w-full h-full rounded-lg bg-white border">
                <div className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-24 w-24 bg-blue-500 rounded rounded-full flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 fill-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>

                  <br></br>
                  <h3 className="font-semibold text-2xl">Tournaments</h3>
                  <br></br>
                  <p>
                    Manage public tournaments and all the aspects associated
                    with them.
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/manage/categories">
              <div className="w-full h-full rounded-lg bg-white border">
                <div className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-24 w-24 bg-blue-500 rounded rounded-full flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 fill-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <br></br>
                  <h3 className="font-semibold text-2xl">Manage</h3>
                  <br></br>
                  <p>
                    Manage the categories shown on practise. Feel free to add
                    your own!
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/manage/problems">
              <div className="w-full h-full rounded-lg bg-white border">
                <div className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-24 w-24 bg-blue-500 rounded rounded-full flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 fill-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                  </div>

                  <br></br>
                  <h3 className="font-semibold text-2xl">Manage Problems</h3>
                  <br></br>
                  <p>
                    Manage the list of problems and to which category they
                    belong. Test cases are also take care of here.
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/manage/v2">
              <div className="w-full h-full rounded-lg bg-white border">
                <div className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-24 w-24 bg-blue-500 rounded rounded-full flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 fill-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <br></br>
                  <h3 className="font-semibold text-2xl">New Stuff</h3>
                  <br></br>
                  <p>
                    Manage the list of problems and to which category they
                    belong. Test cases are also take care of here.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        // ROLE IS NOT CONTENT MANAGER
        <div></div>
      )}
    </div>
  );
}

export default ManageContent;
