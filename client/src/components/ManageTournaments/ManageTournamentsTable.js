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
import userAvatar from "../images/user_placeholder.png";

export default function ManageTournamentsTable(props) {
  const [filteredTournaments, setFilteredTournaments] = useState(props);

  function handleChange(e) {
    console.log(e.target.value);

    if (e.target.value == "closed") {
      const result = props.tournaments.filter(
        (t) => t.tournament.open == false
      );
      setFilteredTournaments(result);
      console.log("clooooooo");
    } else if (e.target.value == "open") {
      const result = props.tournaments.filter((t) => t.tournament.open == true);
      setFilteredTournaments(result);
      console.log("opeeeeeee");
    } else {
      const result = props.tournaments.filter(
        (t) => t.tournament.open == true || t.tournament.open == false
      );
      setFilteredTournaments(result);
      console.log("opeeeeeee");
    }
  }

  console.log(filteredTournaments);

  return (
    <div className=" flex justify-center mb-10">
      <div className="inline-block w-full border border-b-0 rounded rounded-lg bg-white ">
        <div className="flex">
          <div className="justify-center">
            <label>
              <div className="ml-6 my-5">
                <span className="text-gray-700 font-bold text-lg pr-8">
                  {props.title}
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
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <table className="table-auto bg-blue-50 text-left w-full border border-l-0 border-r-0">
            <thead>
              <tr className="border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                <th className="p-2 pl-4" />
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2 pr-4">startingDate</th>
                <th className="p-2 pr-4">endingDate</th>
                <th className="p-2 pr-4">Users</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredTournaments.tournaments != undefined ? (
                filteredTournaments.tournaments.map((tournament) => (
                  <tr key={tournament.id} className="border-b border-gray-200">
                    <td className="py-1 px-2">
                      <span className="block text-sm">
                        {tournament.tournament.id}
                      </span>
                    </td>

                    <td className="py-1 px-2">
                      <span className="block text-sm">
                        {tournament.tournament.name}
                      </span>
                    </td>

                    <td className="py-1 px-2 pr-4">
                      {tournament.tournament.open === true ? (
                        <span className="bg-green-200 py-1 px-2 text-xs rounded-full text-green-900">
                          Open
                        </span>
                      ) : (
                        <span className="bg-red-200 py-1 px-2 text-xs rounded-full text-red-900">
                          Closed
                        </span>
                      )}
                    </td>

                    <td className="py-1 px-2">
                      <span className="block text-sm">
                        {dateWithHoursAndDay(
                          tournament.tournament.startingDate
                        )}
                      </span>
                    </td>

                    <td className="py-1 px-2">
                      <span className="block text-sm">
                        {dateWithHoursAndDay(tournament.tournament.endingDate)}
                      </span>
                    </td>

                    <td className="py-1 px-2">
                      <span className="block text-sm">
                        {tournament.users.length}
                      </span>
                    </td>

                    <td className="py-1 items-center justify-end mr-3 ">
                      <div className=" items-center justify-center max-w-fit">
                        <Link
                          to={{
                            pathname:
                              "/manage/tournaments/plagiarism/" +
                              textToLowerCaseNoSpaces(
                                tournament.tournament.name
                              ),
                            state: {
                              something: "example",
                            },
                          }}
                        >
                          <button
                            type="button"
                            class="flex justify-center items-center py-1.5 px-5 text-sm font-medium 
                            text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                             hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
                             dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
                             dark:hover:text-white dark:hover:bg-gray-700"
                          >
                            Plagiarism Check
                          </button>
                        </Link>
                      </div>
                    </td>

                    <td className="py-1 flex items-center justify-end mr-3 ">
                      <div className=" flex items-center justify-center max-w-fit">
                        <Link
                          to={{
                            pathname:
                              "/manage/tournaments/submissions/" +
                              textToLowerCaseNoSpaces(
                                tournament.tournament.name
                              ),
                            state: {
                              something: "example",
                            },
                          }}
                        >
                          <button
                            type="button"
                            class="flex justify-center items-center py-1.5 px-5 text-sm font-medium 
                            text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                             hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
                             dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
                             dark:hover:text-white dark:hover:bg-gray-700"
                          >
                            View Submissions
                          </button>
                        </Link>
                      </div>
                    </td>

                    <td className="py-1 pr-6 w-40">
                      <div className="flex justify-end w-fit">
                        <Link
                          to={{
                            pathname:
                              "/manage/tournaments/" +
                              textToLowerCaseNoSpaces(
                                tournament.tournament.name
                              ),
                          }}
                        >
                          <button
                            type="button"
                            class=" py-1.5 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          >
                            View Problems
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <div>Naonaoanoanosdndoandoadoandoa</div>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start py-4"></div>
      </div>
    </div>
  );
}
