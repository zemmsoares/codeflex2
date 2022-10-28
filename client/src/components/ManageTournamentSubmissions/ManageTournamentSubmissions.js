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

  console.log(filteredData);
  console.log(filteredUsers);

  function filterUser() {
    for (let i = 0; i < filterSubmissions.length; i++) {}
  }

  return (
    <div>
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
