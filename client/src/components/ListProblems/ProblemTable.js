import React, { useState } from "react";
import { Link } from "react-router-dom";
import { textToLowerCaseNoSpaces } from "../commons/Utils";
import userAvatar from "../images/user_placeholder.png";

export default function ProblemTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  console.log(props);

  return (
    <div className="px-8 flex justify-center mb-10">
      <div className="inline-block w-full border rounded rounded-lg bg-white ">
        <div className="flex">
          <div className="justify-center">
            <label>
              <div className="ml-6 my-5">
                <span className="text-gray-700 font-bold text-lg pr-8">
                  Haskell Problems:{" "}
                </span>
              </div>
            </label>
          </div>

          <div className="justify-end ml-auto">
            <label>
              <span className="text-gray-700">Status: </span>
              <span className="relative">
                <select
                  value={props.problem.filter}
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
                <th className="p-2 pl-4" />
                <th className="p-2">Problem Name</th>
                <th className="p-2">Difficulty</th>
                {/* <th className="p-2 pr-4">Owner</th>*/}
                <th className="p-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.problem.map(
                (problem) => (
                  console.log(problem.solved),
                  (
                    <tr key={problem.id} className="border-b border-gray-200">
                      <td className="py-1 pl-6 ">
                        <img
                          src={userAvatar}
                          alt={"dqwdqwdqw"}
                          className="block w-8 h-8 rounded-full"
                        />
                      </td>
                      <td className="py-1 px-2">
                        <span className="block text-sm">{problem.name}</span>
                      </td>
                      <td className="py-1 px-2">
                        <span className="text-gray-700 text-xs">
                          {problem.difficulty.name}
                        </span>
                      </td>
                      {/* 
                      <td className="py-1 px-2">{
                        problem.owner.username
                      }</td>
                      */}
                      <td className="py-1 px-2 pr-4">
                        {problem.solved === true ? (
                          <span className="bg-green-200 py-1 px-2 text-xs rounded-full text-green-900">
                            Solved
                          </span>
                        ) : (
                          <span className="bg-red-200 py-1 px-2 text-xs rounded-full text-red-900">
                            Unsolved
                          </span>
                        )}
                      </td>

                      <td className="py-1 pr-6 w-64">
                        <div className=" flex justify-end">
                          <Link
                            to={{
                              pathname:
                                props.path +
                                "/" +
                                textToLowerCaseNoSpaces(problem.name),
                              state: {
                                problemId: problem.id,
                                problemName: problem.name,
                              },
                            }}
                          >
                            <button
                              type="button"
                              class=" py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              Solve Problem
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

        <div className="flex justify-start">
          <label>
            <div className="ml-6 my-1 ">
              <span className="text-gray-700 text-sm pr-8 text-gray-400"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
