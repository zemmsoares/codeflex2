import React, { useEffect, useState } from "react";
import {
  dateWithHoursAndDay,
  getAuthorization,
  parseLocalJwt,
  splitUrl,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";
import { URL } from "../commons/Constants";
import PathLink from "../PathLink/PathLink";
import { Link, useLocation } from "react-router-dom";
import ManageTournamentsTable from "./ManageTournamentsTable";

function ManageTournaments() {
  const [location2, setLocation2] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [redirectDestination, setRedirectDestination] = useState("");

  const location = useLocation();

  useEffect(() => {
    fetchTournaments();
    setLocation2(splitUrl(location.pathname)[0]);
  }, []);

  function fetchTournaments() {
    let location2 = splitUrl(location.pathname)[0];
    if (location2 === "compete") {
      fetch(
        URL +
          "/api/database/Tournament/viewAllWithRegisteredUsersByOwnerUsername/" +
          parseLocalJwt().username,
        {
          headers: { ...getAuthorization() },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setTournaments(data);
          console.log(data);
        });
    } else if (location2 === "manage") {
      console.log("fetching public tournaments");
      fetch(URL + "/api/database/Tournament/viewAllPublicTournaments", {
        headers: { ...getAuthorization() },
      })
        .then((res) => res.json())
        .then((data) => {
          setTournaments(data);
        });

      // ALSO FETCH NON REGISTERED TOURNAMENTS TO MANAGE
      fetch(
        URL +
          "/api/database/Tournament/viewAllWithRegisteredUsersByOwnerUsername/" +
          parseLocalJwt().username,
        {
          headers: { ...getAuthorization() },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          //tournaments.push(...data);

          setTournaments((tournaments) => [...tournaments, ...data]);
          console.log(tournaments);
        });
    }
  }

  function onIconDelete(tournamentName) {
    console.log("Deleting");
    tournamentName = textToLowerCaseNoSpaces(tournamentName);
    const data = {
      tournament: { name: tournamentName },
    };
    fetch(URL + "/api/database/Tournament/deleteByName/" + tournamentName, {
      method: "POST",
      headers: {
        ...getAuthorization(),
      },
    }).then(() => {
      fetchTournaments();
    });
  }

  function onIconClick(e, name) {
    let destination = textToLowerCaseNoSpaces(name);

    switch (e.target.id) {
      case "visibility":
        setRedirectDestination("visibility");

        if (location2 === "compete") {
          window.location.href = "/compete/manage-tournaments/" + destination;
        } else {
          window.location.href = "/manage/tournaments/" + destination;
        }

        break;
      case "delete":
        setRedirectDestination("delete");
        break;
      case "edit":
        setRedirectDestination("edit");

        if (location2 === "compete") {
          window.location.href =
            "/compete/manage-tournaments/" +
            textToLowerCaseNoSpaces(name) +
            "/edit";
        } else {
          window.location.href =
            "/manage/tournaments/" + textToLowerCaseNoSpaces(name) + "/edit";
        }
        break;
      default:
        break;
    }
  }

  const rows = tournaments.length;

  return (
    <div className="container">
      <PathLink path={location.pathname} title="Manage tournaments" />
      <div className="px-8">
        {tournaments.length > 0 ? (
          <ManageTournamentsTable tournaments={tournaments} />
        ) : (
          <h3 className="no-data-h3 ">There are no tournaments created.</h3>
        )}

        <Link
          to={
            location2 === "compete"
              ? "/compete/create-tournament"
              : "/manage/tournaments/add"
          }
        >
          <button
            type="button"
            class="flex ml-auto m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Create new tournament!
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ManageTournaments;
