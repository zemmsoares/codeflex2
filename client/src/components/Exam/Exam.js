import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, useLocation } from "react-router-dom";
import PathLink from "../PathLink/PathLink";
import {
  dateWithHoursAndDay,
  getAuthorization,
  getTimeHoursMinsText,
  parseLocalJwt,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";
import TournamentTable from "./ExamTable";

function ListExams() {
  const [tournaments, setTournaments] = useState([]);
  const [redirect, setRedirect] = useState({ now: false, path: "/" });
  const [displayInputCode, setDisplayInputCode] = useState(false);
  const [privateCode, setPrivateCode] = useState("");

  const location = useLocation();

  useEffect(() => {
    fetchTournamentList();
    window.updateEveryMinute = setInterval(() => {
      fetchTournamentList();
    }, 10000);
  }, []);

  useEffect(() => {
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      clearInterval(window.updateEveryMinute);
    };
  }, []);

  function fetchTournamentList() {
    fetch(
      URL +
        "/api/database/Tournament/viewTournamentsToList/" +
        parseLocalJwt().username,
      {
        headers: { ...getAuthorization() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);
      });
  }

  function onClickTournament(clickType, tournamentId, tournamentName) {
    if (clickType === "Sign Up") {
      onClickRegister(tournamentId);
      console.log("sign");
    } else if (clickType === "Starting soon") {
    } else if (clickType === "Enter") {
      setRedirect({
        now: true,
        path: "/compete/" + textToLowerCaseNoSpaces(tournamentName),
      });
    }
  }

  function onClickRegister(tournamentId) {
    const data = {
      user: { username: parseLocalJwt().username },
      tournament: { id: tournamentId },
    };
    registerUser(data);
  }

  function registerUser(data) {
    fetch(URL + "/api/database/Tournament/registerUser", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);
      });
  }

  function onClickPrivateTournament() {
    setDisplayInputCode(!displayInputCode);
  }

  function onClickEnterPrivateTournament() {
    const data = {
      user: { username: parseLocalJwt().username },
      tournament: { code: privateCode },
    };
    registerUser(data);
    setDisplayInputCode(false);
  }

  let availableTournaments = "";
  let archivedTournaments = "";

  function availa() {
    if (typeof tournaments.availableTournaments !== "undefined") {
      // TODO @Review Is this sorting working
      return (
        <TournamentTable
          tournaments={tournaments.availableTournaments}
          title={"Available"}
        />
      );
    }
  }

  function archived() {
    if (typeof tournaments.archivedTournaments !== "undefined") {
      return (
        <TournamentTable
          tournaments={tournaments.archivedTournaments}
          title={"Archived"}
        />
      );
    }
  }

  const PopupInformation = () => (
    <div>
      <h2 style={{ color: "white", margin: "auto" }}>teste</h2>
      <p style={{ color: "white", margin: "auto", textAlign: "center" }}>
        fasfasfafs
      </p>
    </div>
  );

  return (
    <div>
      <PathLink
        path={location.pathname}
        title="Practise by solving exercices"
      />
      <div>
        <div>
          <div className="flex px-6 pb-4">
            {displayInputCode ? (
              <div className="private-code">
                <input
                  type="text"
                  className="textbox-no-radius"
                  style={{ height: "25px", marginBottom: "7px" }}
                  placeholder="Tournament Private Code"
                  name="privateCode"
                  onChange={(e) => setPrivateCode(e.target.value)}
                  value={privateCode}
                />
                <input
                  style={{ maxHeight: "25px" }}
                  type="button"
                  className="m-2 py-1.5  text-sm font-medium text-gray-900 focus:outline-none 
                    bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                  value="Register"
                  onClick={onClickEnterPrivateTournament}
                />
              </div>
            ) : (
              <button
                type="button"
                class="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border 
                        border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
                onClick={onClickPrivateTournament}
              >
                Register in private tournament
              </button>
            )}
            <Link to="/compete/create-tournament">
              <button
                type="button"
                class="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border 
                        border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
              >
                Create tournament
              </button>
            </Link>
            <Link to="/compete/manage-tournaments">
              <button
                type="button"
                class="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border 
                        border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
              >
                Manage tournaments
              </button>
            </Link>
          </div>

          <div className="tournaments-container">{availa()}</div>

          <div className="tournaments-container">{archived()}</div>
        </div>

        {redirect.now ? (
          <Route path="*" element={<Navigate replace to={redirect.path} />} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ListExams;
