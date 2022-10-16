import React from "react";
import { Link } from "react-router-dom";
import { textToLowerCaseNoSpaces } from "../commons/Utils";
import userAvatar from "../images/user_placeholder.png";

export default function TournamentLeaderboardTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  console.log(props);

  return (
    <div className="flex justify-center">
      <div className="inline-block w-full border border-b-0 rounded-lg bg-white ">
        <div className="flex">
          <div className="justify-center">
            <label>
              <div className="ml-6 my-2">
                <span className="text-gray-700 font-bold text-lg pr-8">
                  {props.title}
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <table className="table-auto bg-blue-50 text-left w-full border border-l-0 border-r-0">
            <thead>
              <tr className="border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                <th className="p-2 pl-4">Score</th>
                <th className="p-2">Language</th>
                <th className="p-2">Submission Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Info</th>
              </tr>
            </thead>
            <tbody className="bg-white ">
              {props.data
                .filter((v) => v.result !== null)
                .map((data) => (
                  <tr key={data.result.id} className="border-b border-gray-200">
                    <td className="py-1 px-2">
                      <span className="block text-sm">{data.score}</span>
                    </td>
                    <td className="py-1 px-2">
                      <span className="text-gray-700 text-xs">
                        {data.language.name}
                      </span>
                    </td>
                    <td className="py-1 px-2">
                      <span className="text-gray-700 text-xs">{data.date}</span>
                    </td>
                    <td className="py-1 px-2">
                      <span className="text-gray-700 text-xs">
                        {data.result.name}
                      </span>
                    </td>
                    <td className="py-1 px-2">
                      <span className="text-gray-700 text-xs">
                        {data.result.message}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start py-4"></div>
      </div>
    </div>
  );
}
