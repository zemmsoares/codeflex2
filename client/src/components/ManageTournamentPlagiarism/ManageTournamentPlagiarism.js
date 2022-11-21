import React from "react";
import { useLocation } from "react-router-dom";
import { parseLocalJwt } from "../commons/Utils";
import PathLink from "../PathLink/PathLink";

function ManageTournamentPlagiarism() {
  const location = useLocation();

  return (
    <div className="w-full">
      <PathLink
        path={location.pathname}
        title="Tournament Plagiarism Check"
        user={parseLocalJwt().username}
      />
    </div>
  );
}

export default ManageTournamentPlagiarism;
