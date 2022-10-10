import React, { useEffect, useState } from "react";
import ReactTable from "react-table";

import { Redirect, useLocation, useParams } from "react-router-dom";
import { URL } from "../commons/Constants";
import { msToTime, parseLocalJwt, getAuthorization } from "../commons/Utils";

import PathLink from "../PathLink/PathLink";
import PageNotFound from "../PageNotFound/PageNotFound";
import TournamentLeaderboardTable from "./TournamentLeaderboardTable";

function TournamentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [registered, setRegistered] = useState(true);

  const location = useLocation();
  const { tournamentName } = useParams();

  useEffect(() => {
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
        this.setState({ registered: true });
      } else {
        this.setState({ registered: false });
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
  }, []);

  let leaderboardData = leaderboard;
  console.log("ASDASDAD");
  console.log(leaderboardData);
  if (JSON.stringify(leaderboardData) != "[]") {
    leaderboardData = leaderboardData.sort((a, b) => {
      return b.score - a.score || a.totalMilliseconds - b.totalMilliseconds;
    });
  }

  if (!registered) {
    return <PageNotFound />;
  }

  return (
    <div className="">
      <div className="">
        <PathLink path={location.pathname} title="Leaderboard" />

        {leaderboardData.length == 0 ? (
          <h3 className="no-data-h3 pl-8">
            There is no one on the leaderboard.
          </h3>
        ) : (
          <TournamentLeaderboardTable data={leaderboardData} />
        )}
      </div>
    </div>
  );
}

export default TournamentLeaderboard;
