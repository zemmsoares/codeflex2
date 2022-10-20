import React from "react";
import { Link } from "react-router-dom";
import { splitUrl } from "../commons/Utils";

function PathLink(props) {
  function createPath(path, index) {
    path.map((p, i) => {
      if (i <= index) {
        return p + "/";
      }
    });
  }

  //console.log(props);

  function buildPath(pathname, index) {
    let finalPath = "/";
    for (let i = 0; i <= index; i++) {
      finalPath += pathname[i];

      {
        /* CHECK CHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKVV
            if (props.removePath.includes[i]) {
                return "";
            }
            */
      }

      if (i < index) {
        finalPath += "/";
      }
    }

    return finalPath;
  }

  let pathname = splitUrl(props.path);

  let titleCheck = props.title;
  if (typeof titleCheck !== "undefined") {
    titleCheck.replace("-", " ");
  }

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="px-8 py-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl upp font-bold capitalize">{pathname[0]}</h1>
          <p className="text-gray-600">{props.title}</p>
        </div>

        {/* IF user={} is sent on props to PathLink render */}
        {props.user ? (
          <div className="h-auto flex justify-center items-center">
            <div className="flex flex-row">
              <span className="rounded-full h-10 w-10  bg-gray-200 flex justify-center items-center font-bold text-xl text-white">
                {props.user.charAt(0).toUpperCase()}
              </span>
              <div className="ml-4 flex justify-center items-center">
                <span className="flex items-center  ">
                  <Link to={"/user/" + props.user}>
                    <p className="text-xl font-bold pb-1">{props.user}</p>
                  </Link>
                  <p className=" bg-gray-200 h-6 text-sm rounded-lg px-2 flex items-center justify-center ml-2">
                    <Link to="/" onClick={logoutUser}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4  cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                    </Link>
                  </p>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>

      <div className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700"></div>
      <span>
        <span className="text-gray-400 uppercase text-sm pr-2">></span>
        {pathname.map((p, index) => (
          <div key={index} className="inline-flex">
            <Link key={index} to={{ pathname: buildPath(pathname, index) }}>
              <p className="text-gray-400 uppercase text-sm">{p}</p>
            </Link>
            {index < pathname.length - 0 ? (
              <span className="text-gray-400 uppercase text-sm px-2">></span>
            ) : (
              ""
            )}
          </div>
        ))}
      </span>
    </div>
  );
}

export default PathLink;
