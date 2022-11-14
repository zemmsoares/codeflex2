import React from "react";
import { Link, useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import { getAuthorization, textToLowerCaseNoSpaces } from "../commons/Utils";
import userAvatar from "../images/user_placeholder.png";

export default function ManageProblemsTable(props) {
  function handleChange(e) {
    props.setFilter(e.target.value);
  }

  const location = useLocation();

  function deleteProblem(problem) {
    fetch(
      URL +
        "/api/database/Problem/deleteByName/" +
        textToLowerCaseNoSpaces(problem.name),
      {
        method: "POST",
        headers: { ...getAuthorization() },
      }
    )
      .then(() => {
        //console.log("Problem deleted");
      })
      .catch((error) => console.log(error));
  }

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
                  <option value="Easy">Active</option>
                  <option value="Medium">Expired</option>
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
                <th className="p-2">Id</th>
                <th className="p-2">Difficulty</th>
                <th className="p-2 pr-4">Test Cases</th>
                <th className="p-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.problem.map((problem) => (
                <tr
                  key={problem.creationDate}
                  className="border-b border-gray-200"
                >
                  <td className="py-1 px-2">
                    <span className="bg-green-200 py-1 px-2 text-xs rounded-full text-green-900">
                      {problem.id}
                    </span>
                  </td>
                  <td className="py-1 px-2">
                    <span className="block text-sm">{problem.name}</span>
                  </td>
                  <td className="py-1 px-2">
                    <span className="text-gray-700 text-xs">
                      {problem.difficulty.name}
                    </span>
                  </td>
                  {/*<td className="py-1 px-2">{problem.owner.username}</td>*/}
                  <td className="py-1 px-2 pr-4">
                    <span className="bg-red-200 py-1 px-2 text-xs rounded-full text-red-900">
                      {problem.testCases.length}

                      <Link
                        to={
                          location.pathname +
                          "/" +
                          textToLowerCaseNoSpaces(problem.name) +
                          "/test-cases"
                        }
                      >
                        <i className="material-icons manage-tournament-icon">
                          edit
                        </i>
                      </Link>
                    </span>
                  </td>

                  <td className="py-1 pr-6 w-64">
                    <div className=" flex justify-end">
                      <Link
                        to={{
                          pathname: "",
                          state: {
                            problemId: problem.id,
                            problemName: problem.name,
                          },
                        }}
                      >
                        <button
                          type="button"
                          className=" py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          View
                        </button>
                      </Link>

                      <Link
                        to={
                          location.pathname +
                          "/" +
                          textToLowerCaseNoSpaces(problem.name) +
                          "/edit"
                        }
                      >
                        <button
                          type="button"
                          className="mx-2 py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => deleteProblem(problem)}
                        type="button"
                        className=" py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
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
