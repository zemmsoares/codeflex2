import { SelectionState } from "draft-js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import { getAuthorization, parseLocalJwt, splitUrl } from "../commons/Utils";
import ManageTournamentSubmissionsTable from "./ManageTournamentSubmissionsTable";

function ManageTournamentSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tournamentId, setTournamentId] = useState();

  const [teste, setTeste] = useState({});

  const location = useLocation();
  const url = splitUrl(location.pathname);
  console.log(url[3]);

  console.log(location);

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
  }

  console.log(submissions);
  console.log(teste);

  return (
    <div>
      {filteredData ? (
        <ManageTournamentSubmissionsTable
          submissions={filteredData}
          title={url[3]}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ManageTournamentSubmissions;
