import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dateWithHoursAndDay,
  textToLowerCaseNoSpaces,
  timeUntilDate,
} from "../commons/Utils";
import userAvatar from "../images/user_placeholder.png";
import moment from "moment";

import CountDownTimer from "./CountDown/CountDownTimer";

export default function TournamentTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  function isFuture(startDate) {
    let s = new Date(startDate).getTime();
    //console.log(s);
    let t = new Date().getTime();
    if (s > t) {
      return true;
    }
  }

  console.log(props);

  return (
    <div className="px-8 flex justify-center mb-10">
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
                <th className="p-2 pl-4">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.tournaments.map(
                (data) => (
                  console.log(data),
                  (
                    <tr
                      key={data.tournament.id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-1 px-2">
                        <span className="block text-sm">
                          {data.tournament.name}
                        </span>
                      </td>
                      <td className="py-1 px-2 w-auto">
                        <span className="text-gray-700 text-xs">
                          {data.tournament.description}
                        </span>
                      </td>
                      <td className="py-1 px-2 w-28">
                        <span className="text-gray-700 text-xs">
                          {dateWithHoursAndDay(data.tournament.startingDate)}
                        </span>
                      </td>
                      <td className="py-1 px-2 w-28">
                        <span className="text-gray-700 text-xs">
                          {dateWithHoursAndDay(data.tournament.endingDate)}
                        </span>
                      </td>
                      <td className="py-1 px-2 justify-center w-48">
                        {isFuture(data.tournament.startingDate) ? (
                          <span className=" py-1 px-2 text-xs text-green-900 ">
                            <CountDownTimer
                              targetDate={data.tournament.startingDate}
                              isFuture={true}
                            />
                          </span>
                        ) : (
                          console.log("isNotFuture")
                        )}
                        {data.tournament.open === true ? (
                          <span className=" py-1 px-2 text-xs text-green-900">
                            <CountDownTimer
                              targetDate={data.tournament.endingDate}
                            />
                          </span>
                        ) : (
                          <div>
                            {data.tournament.open === false &&
                            isFuture(data.tournament.startingDate) == true ? (
                              console.log()
                            ) : (
                              <span className="bg-red-200 py-1 px-2 text-xs rounded-full text-red-900">
                                Archived
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-1 w-32">
                        <div className="flex justify-end">
                          <Link
                            to={
                              "/compete/" +
                              textToLowerCaseNoSpaces(data.tournament.name) +
                              "/leaderboard"
                            }
                          >
                            <button
                              type="button"
                              class="py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none
                                                 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
                                                 focus:z-10 focus:ring-4 focus:ring-gray-200"
                            >
                              Leaderboard
                            </button>
                          </Link>
                        </div>
                      </td>
                      <td className="py-1 w-32 pr-2">
                        <div className="flex justify-center">
                          <Link
                            to={
                              "/compete/" +
                              textToLowerCaseNoSpaces(data.tournament.name)
                            }
                          >
                            <button
                              type="button"
                              class=" py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none
                                                 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
                                                 focus:z-10 focus:ring-4 focus:ring-gray-200"
                            >
                              Problems
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start py-4"></div>
      </div>
    </div>
  );
}
