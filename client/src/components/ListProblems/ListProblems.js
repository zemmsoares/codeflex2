import React, { useEffect, useState } from "react";
import { URL } from "../commons/Constants";
import { useLocation, useParams } from "react-router-dom";
import {
  splitUrl,
  getAuthorization,
  textToLowerCaseNoSpaces,
  parseLocalJwt,
} from "../commons/Utils";
import PathLink from "../PathLink/PathLink";

import ProblemTable from "./ProblemTable";

function ListProblems(props) {
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const location = useLocation();
  const { tournamentName } = useParams();

  useEffect(() => {
    const url = splitUrl(location.pathname);

    if (url[0] === "practise") {
      fetchProblemsByCategory();
    } else if (url[0] === "compete") {
      isUserRegisteredInTournament();
    }
  }, []);

  function isUserRegisteredInTournament() {
    fetch(
      URL +
        "/api/database/Rating/isUserRegisteredInTournamentTest/" +
        parseLocalJwt().username +
        "/" +
        tournamentName,
      {
        headers: { ...getAuthorization() },
      }
    ).then((res) => {
      if (res.status === 200) {
        fetchProblemsByTournament();
      } else {
        //setRegistered(false);
      }
    });

    fetch(
      URL +
        "/api/database/Tournament/viewTournamentLeaderboard/" +
        tournamentName,
      {
        headers: { ...getAuthorization() },
      }
    )
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((e) => {
        //console.log("error " + e);
      });
  }

  function fetchProblemsByTournament() {
    const currentTournament = splitUrl(location.pathname)[1];
    fetch(
      URL +
        "/api/database/tournament/getAllProblemsByName/" +
        currentTournament +
        "/" +
        parseLocalJwt().username,
      {
        headers: {
          ...getAuthorization(),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFilteredProblems(data);
      });
  }

  function fetchProblemsByCategory() {
    const currentCategory = splitUrl(location.pathname)[1];
    fetch(
      URL +
        "/api/database/PractiseCategory/getAllWithoutTestCases/" +
        parseLocalJwt().username,
      {
        headers: {
          ...getAuthorization(),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let newData = data.filter(
          (d) => textToLowerCaseNoSpaces(d.name) === currentCategory
        );
        if (JSON.stringify(newData) === "[]") {
          window.location.href = "/";
        } else {
          setFilteredProblems(newData[0].problem);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <PathLink
        path={location.pathname}
        title="Practise by solving exercices"
        user={parseLocalJwt().username}
      />
      <div>
        <div>
          {splitUrl(location.pathname)[0] === "compete" ? (
            <div className="px-8 flex my-4 ">
              <div className="bg-blue-100 rounded px-3 py-1 flex">
                <p className="font-bold">Tournament Score:</p>

                {leaderboard
                  .filter((users) => users.username == parseLocalJwt().username)
                  .map((filteredUsers) => {
                    return <span className="pl-1">{filteredUsers.score}</span>;
                  })}
              </div>
            </div>
          ) : (
            // Dont render outside tournaments
            <div></div>
          )}
        </div>
        <ProblemTable problem={filteredProblems} path={location.pathname} />
        {console.log(filteredProblems)}
      </div>
    </div>
  );
}

export default ListProblems;
