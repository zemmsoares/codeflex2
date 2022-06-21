import React from "react";

export default function UserTable(props) {
    function handleChange(e) {
        props.setFilter(e.target.value);
    }

    return (
        <div className="bg-gray-300 p-4 flex justify-center">
            <div className="inline-block">
                <div className="flex justify-end">
                    <label>
                        <span className="text-gray-700">Status: </span>
                        <span className="relative">
                            <select
                                value={props.filter}
                                onChange={handleChange}
                                className="rounded mb-2 py-1 px-2 appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </span>
                    </label>
                </div>
                <div className="flex justify-center">
                    <table className="table-auto bg-gray-100 shadow-lg rounded text-left w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                                <th className="p-2 pl-4" />
                                <th className="p-2">User</th>
                                <th className="p-2">Score</th>
                                <th className="p-2 pr-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {props.users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200">
                                    <td className="py-1 px-4">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="block w-8 h-8 rounded-full"
                                        />
                                    </td>
                                    <td className="py-1 px-2">
                                        <span className="block">{user.username}</span>
                                        <span className="text-gray-700 text-xs">{user.email}</span>
                                    </td>
                                    <td className="py-1 px-2">{user.rating}</td>
                                    <td className="py-1 px-2 pr-4">
                                        {user.status === "active" ? (
                                            <span className="bg-green-200 py-1 px-2 text-xs rounded-full text-green-900">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-red-200 py-1 px-2 text-xs rounded-full text-red-900">
                                                Expired
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
