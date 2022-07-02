import React from "react";
import { Link } from "react-router-dom";
import { textToLowerCaseNoSpaces } from "../../commons/Utils";

export default function ProblemLeaderboardTable(props) {
    function handleChange(e) {
        props.setFilter(e.target.value);
    }

    console.log(props)

    return (
        <div className="px-8 flex justify-center mb-10">
            <div className="inline-block w-full border border-b-0 rounded rounded-lg bg-white ">

                <div className="flex">
                    <div className="justify-center">

                        <label>

                            <div className="ml-6 my-5">

                                <span className="text-gray-700 font-bold text-lg pr-8">{props.title}</span>
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
                                <th className="p-2 pl-4" ></th>
                                <th className="p-2">Username</th>
                                <th className="p-2">Score</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {props.leaderboard.map(data => (
                                <tr key={data.id} className="border-b border-gray-200">
                                    <td className="py-1 px-2">
                                        <span className="block text-sm"></span>
                                    </td>
                                    <td className="py-1 px-2">
                                        <span className="block text-sm">{data.username}</span>
                                    </td>
                                    <td className="py-1 px-2">
                                        <span className="text-gray-700 text-xs">{data.score}</span>
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
