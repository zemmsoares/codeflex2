import { SelectionState } from "draft-js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import { getAuthorization, parseLocalJwt, splitUrl } from "../commons/Utils";
import ManageTournamentSubmissionsTable from "./ManageTournamentSubmissionsTable";
import _ from "lodash";

function ManageTournamentSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tournamentId, setTournamentId] = useState();

  const [teste, setTeste] = useState({});

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [plagResults, setPlagResults] = useState([]);

  const location = useLocation();
  const url = splitUrl(location.pathname);

  useEffect(() => {
    fetchSubmissions();
    getTournamentId();
  }, [tournamentId]);

  function fetchSubmissions() {
    fetch(URL + "/api/database/Submissions/view", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        filterSubmissions(data);
      });
  }

  function getTournamentId() {
    fetch(URL + "/api/database/Tournament/viewByName/" + url[3], {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setTournamentId(data.id);
      });
  }

  function filterSubmissions(data) {
    const filtered = data.filter((submission) => {
      //return submission.users.id === 1;
      if (submission.problem.tournament) {
        return submission.problem.tournament.id === tournamentId;
      } else {
        return;
      }
    });
    setFilteredData([...filtered]);
    filterUsers(filtered);
  }

  function filterUsers(filtered) {
    setFilteredUsers(_.groupBy(filtered, "users.username"));
  }

  //console.log(filteredData);
  //console.log(filteredUsers);

  function filterUser() {
    for (let i = 0; i < filterSubmissions.length; i++) {}
  }

  function plagCheck() {
    fetch("http://10.5.0.5:8082/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredUsers),
    });
  }

  function checkResults() {
    fetch("http://10.5.0.5:8082/test", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlagResults(data);
        console.log("plagREsults" + plagResults);
      });
  }

  return (
    <div>
      <input
        type="submit"
        className="mt-8 ml-8 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        value="Download Submissions File!"
        onClick={plagCheck}
      />
      <input
        type="submit"
        className="mt-8 ml-8 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        value="Check Results"
        onClick={checkResults}
      />
      {filteredData ? (
        <div>
          {Object.keys(filteredUsers).map((key, index) => {
            return (
              <ManageTournamentSubmissionsTable
                submissions={filteredUsers[key]}
                title={key}
              />
            );
            //console.log(filteredUsers[key]);
          })}
          {/* 
          <ManageTournamentSubmissionsTable
            submissions={filteredData}
            title={url[3]}
/>
          */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ManageTournamentSubmissions;
