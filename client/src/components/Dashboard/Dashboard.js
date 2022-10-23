import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import {
  getAuthorization,
  parseLocalJwt,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";
import PathLink from "../PathLink/PathLink";

function Dashboard() {
  const [example, setExample] = useState([]);

  const location = useLocation();
  useEffect(() => {
    fetch(
      URL +
        "/api/database/PractiseCategory/listwithstats/" +
        parseLocalJwt().username,
      {
        headers: {
          ...getAuthorization(),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setExample(data);
      });
  }, []);

  console.log(example);

  return (
    <div className="h-screen">
      <PathLink
        path={location.pathname}
        title="Practise by solving exercices"
        user={parseLocalJwt().username}
      />

      <div
        id="main"
        class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 justify-evenly px-8 gap-4"
      >
        <div class="w-26">
          <Link to="/practise">
            <div className="relative w-full h-full rounded-lg bg-white border shadow">
              <div className="p-4">
                <div className="flex flex-row pb-4 ">
                  <div className="ml-4">
                    <span className="flex items-center  ">
                      <p className="text-xl font-bold pb-1">Practise</p>
                    </span>
                    <p>
                      Haskell is a general-purpose, statically-typed, purely
                      functional programming language with type inference and
                      lazy evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div class="w-26">
          <Link to="/compete">
            <div className="relative w-full h-full rounded-lg bg-white border shadow">
              <div className="p-4">
                <div className="flex flex-row pb-4 ">
                  <div className="ml-4">
                    <span className="flex items-center  ">
                      <p className="text-xl font-bold pb-1">Tournaments</p>
                      <p className=" bg-blue-400 h-6 text-sm rounded-lg px-2 flex items-center justify-center ml-2">
                        New
                      </p>
                    </span>
                    <p>
                      Haskell is a general-purpose, statically-typed, purely
                      functional programming language with type inference and
                      lazy evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div class="w-26">
          <Link to="/leaderboard">
            <div className="relative w-full h-full rounded-lg bg-white border shadow">
              <div className="p-4">
                <div className="flex flex-row pb-4 ">
                  <div className="ml-4">
                    <span className="flex items-center  ">
                      <p className="text-xl font-bold pb-1">Leaderboard</p>
                    </span>
                    <p>
                      Haskell is a general-purpose, statically-typed, purely
                      functional programming language with type inference and
                      lazy evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
