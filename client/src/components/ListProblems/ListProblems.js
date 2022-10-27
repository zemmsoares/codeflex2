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
  const [registered, setRegistered] = useState(false);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  const [tournament, setTournament] = useState({});

  const [problemName2, setProblemName2] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);

  const location = useLocation();

  const { tournamentName } = useParams();

  //console.log("AQUI AQUI AQUI" + JSON.stringify(location.state.title));

  useEffect(() => {
    const url = splitUrl(location.pathname);

    if (url[0] === "practise") {
      console.log("practise");
      fetchProblemsByCategory();
    } else if (url[0] === "compete") {
      console.log("compete");
      isUserRegisteredInTournament();
    }
    fetch(URL + "/api/database/difficulty/view", {
      headers: {
        ...getAuthorization(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDifficulties(data);
      });
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
        console.log("is registered");
        setRegistered(true);
        fetchTournament();
        fetchProblemsByTournament();
      } else {
        setRegistered(false);
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
        console.log("error " + e);
      });
  }

  console.log(leaderboard);

  function fetchTournament() {
    fetch(URL + "/api/database/Tournament/viewByName/" + tournamentName, {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setTournament(data);
        console.log(data);
      });
  }
  function fetchProblemsByTournament() {
    const currentTournament = splitUrl(location.pathname)[1];
    console.log(currentTournament);
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
        setProblems(data);
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
          setProblems(newData[0].problem);
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
          {leaderboard.length > 0 ? (
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
            <div></div>
          )}
        </div>
        <ProblemTable problem={filteredProblems} path={location.pathname} />
      </div>
    </div>
  );
}

export default ListProblems;
