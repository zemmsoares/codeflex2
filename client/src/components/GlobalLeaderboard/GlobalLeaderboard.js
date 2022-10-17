import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import { getAuthorization, parseLocalJwt } from "../commons/Utils";
import PathLink from "../PathLink/PathLink";

import UserTable from "./UserTable";

function GlobalLeaderboard() {
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const currentDate = new Date();

  useState(() => {
    fetch(URL + "/api/database/Users/viewAllWithLessInfo", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const formattedUsers = useMemo(
    () =>
      users.map((user) => {
        console.log("unnecessary work");
        return {
          ...user,
          status: user.expires > currentDate ? "active" : "expired",
        };
      }),
    [users]
  );

  const filteredUsers = formattedUsers.filter((user) => {
    if (filter === "all") return true;
    return user.status === filter;
  });

  function renderTables() {
    return (
      <UserTable users={filteredUsers} filter={filter} setFilter={setFilter} />
    );
  }

  return (
    <div>
      <PathLink
        path={location.pathname}
        title="Global Leaderboard"
        user={parseLocalJwt().username}
      />
      <div>{renderTables()}</div>
    </div>
  );
}

export default GlobalLeaderboard;
