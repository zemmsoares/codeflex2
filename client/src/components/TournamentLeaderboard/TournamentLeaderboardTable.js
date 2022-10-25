import React from "react";
import { Link } from "react-router-dom";
import { textToLowerCaseNoSpaces } from "../commons/Utils";
import userAvatar from "../images/user_placeholder.png";

export default function TournamentLeaderboardTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  return (
    <div className="px-8 flex justify-cente ">
      <div className="inline-block w-full">
        <div className="flex justify-center">
          <table className="table-auto bg-gray-200 shadow-lg rounded text-left w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                <th className="p-2"></th>
                <th className="p-2">User</th>
                <th className="p-2">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.data.map((data) => (
                <tr key={data.id} className="border-b border-gray-200">
                  <td className="py-1 px-4 w-32">{data.id}</td>
                  <td className="py-1 px-2 flex items-center">
                    <img
                      src={userAvatar}
                      alt={data.name}
                      className="block w-8 h-8 rounded-full mr-4"
                    />
                    <span className="block">{data.username}</span>
                  </td>
                  <td className="py-1 px-2">{data.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
