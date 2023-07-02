import React from "react";
import userAvatar from "../images/user_placeholder.png";

export default function UserTable(props) {

  return (
    <div className="px-8 flex justify-center">
      <div className="inline-block w-full">
        <div className="flex justify-center">
          <table className="table-auto bg-gray-200 shadow-lg rounded text-left w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 uppercase text-xs text-gray-700 tracking-wider">
                <th className="p-2 pl-4">Rank</th>
                <th className="p-2"></th>
                <th className="p-2">User</th>
                <th className="p-2">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {props.users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200">
                  <td className="py-1 px-4 w-32">{user.id}</td>
                  <td className="py-1 px-4 w-32"></td>
                  <td className="py-1 px-2 flex items-center">
                    <img
                      src={userAvatar}
                      alt={user.name}
                      className="block w-8 h-8 rounded-full mr-4"
                    />
                    <span className="block">{user.username}</span>
                    <span className="text-gray-700 text-xs">{user.email}</span>
                  </td>
                  <td className="py-1 px-2">{user.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
