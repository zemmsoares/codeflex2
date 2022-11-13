import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import {
  dateWithHoursAndDay,
  getAuthorization,
  parseLocalJwt,
  splitUrl,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";

export default function ManageTournamentSubmissionsTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  console.log(props);

  return (
    <div className=" flex justify-center mb-10 px-8 mt-8">
      <div className="inline-block w-full border border-b-0 rounded rounded-lg bg-white ">
        <div className="flex">
          <div className="justify-center">
            <label>
              <div className="ml-6 my-5">
                <span className="text-gray-700 font-bold text-lg pr-8">
                  {"Submissions of " + props.title}
                </span>
              </div>
            </label>
          </div>

          <div className="justify-end ml-auto">
            <label>
              <span className="text-gray-700">Status: </span>
              <span className="relative">
                <select
                  value={props.filter}
                  onChange={handleChange}
                  className="rounded mb-2 py-1 px-2 appearance-none bg-gray-200 border border-gray-200 text-gray-700 my-5 mr-6 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <table className="table-auto bg-blue-50 text-left w-full border border-l-0 border-r-0">
            <thead>
              <tr className="border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                <th className="p-2 pl-4">Problem</th>
                <th className="p-2">User</th>
                <th className="p-2">Language</th>
                <th className="p-2 pr-4">Date</th>
                <th className="p-2 pr-4">Code</th>
                <th className="p-2 pr-4">Result</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-200">
                  <td className="py-1 px-2">
                    <span className="block text-sm">
                      {submission.problem.name}
                    </span>
                  </td>

                  <td className="py-1 px-2">
                    <span className="block text-sm">
                      {submission.users.username}
                    </span>
                  </td>

                  <td className="py-1 px-2">
                    <span className="block text-sm">
                      {submission.language.name}
                    </span>
                  </td>

                  <td className="py-1 px-2">
                    <span className="block text-sm">
                      {dateWithHoursAndDay(submission.date)}
                    </span>
                  </td>

                  <td className="py-1 px-2 max-w-lg">
                    <span className="block text-sm">
                      {atob(submission.code)}
                    </span>
                  </td>
                  <td className="py-1 px-2">
                    <span className="block text-sm">
                      {submission.result
                        ? submission.result.name
                        : "Timeout Error"}
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
