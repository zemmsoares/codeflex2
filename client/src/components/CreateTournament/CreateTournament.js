import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getAuthorization,
  isContentManager,
  parseLocalJwt,
  splitUrl,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";
import { URL } from "../commons/Constants";
import {
  isStringEmpty,
  validateLength,
  validateStringChars,
  validateStringCharsNoSpaces,
} from "../commons/Validation";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

import moment from "moment";
import PageNotFound from "../PageNotFound/PageNotFound";
import PathLink from "../PathLink/PathLink";
import "react-datepicker/dist/react-datepicker.css";

import "./CreateTournament.css";

function CreateTournament() {
  const [location2, setLocation2] = useState("");
  const [registered, setRegistered] = useState(true);
  const [userIsOwner, setUserIsOwner] = useState(true);
  const [id, setId] = useState(0);
  const [startDate, setStartDate] = useState(moment().toDate());
  const [endDate, setEndDate] = useState(moment().toDate());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privateCode, setPrivateCode] = useState("");

  const location = useLocation();

  const { tournamentName } = useParams();

  useEffect(() => {
    let url = splitUrl(location.pathname);
    if (!isContentManager() && url[1] !== "create-tournament") {
      isUserTournamentOwner();
      isUserRegistered();
    }
    setLocation2(splitUrl(location.pathname)[0]);
    if (url[3] === "edit") {
      fetchTournament();
    }
  }, []);

  function isUserRegistered() {
    fetch(
      URL +
        "/api/database/Rating/isUserRegisteredInTournamentTest/" +
        parseLocalJwt().username +
        "/" +
        tournamentName,
      {
        headers: { ...getAuthorization() },
      }
    ).then((res) => {
      if (res.status === 200) {
        setRegistered(true);
      } else {
        setRegistered(false);
      }
    });
  }

  function isUserTournamentOwner() {
    fetch(
      URL +
        "/api/database/tournament/isUserTournamentOwner/" +
        tournamentName +
        "/" +
        parseLocalJwt().username,
      {
        headers: new Headers({ ...getAuthorization() }),
      }
    ).then((res) => {
      if (res.status === 200) {
        setUserIsOwner(true);
      } else {
        setUserIsOwner(false);
      }
    });
  }

  function fetchTournament() {
    fetch(URL + "/api/database/tournament/viewByName/" + tournamentName, {
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setId(data.id);
        setStartDate(moment(data.startingDate));
        setEndDate(moment(data.endingDate));
        setName(data.name);
        setDescription(data.description);
        setPrivateCode(data.code);
      });
  }

  function handleChangeStart(date) {
    setStartDate(date);
  }

  function handleChangeEnd(date) {
    setEndDate(date);
  }

  function validateTournament(data) {
    if (isStringEmpty(data.name) || isStringEmpty(data.description)) {
      toast.error("Fill in all the fields", { autoClose: 2500 });
      return false;
    } else {
      if (!validateLength(data.name, 5, 50)) {
        toast.error("Tournament name must be between 5 and 50 characters");
        return false;
      } else {
        if (!validateStringChars(data.name)) {
          toast.error("Name can only contain letters, numbers and _");
          return false;
        }
      }
      if (!validateLength(data.description, 50, 1000)) {
        toast.error("Description must be between 50 and 1000 characters");
        return false;
      }
      if (
        location2 === "compete" &&
        !validateLength(data.code, 5, 50) &&
        !validateStringCharsNoSpaces(data.code)
      ) {
        toast.error(
          "Invalid code, it must be between 5 and 50 in length and no special characters."
        );
        return false;
      }
    }
    return true;
  }

  function updateTournament() {
    let data = {
      id: id,
      name: name,
      description: description,
      startingDate: startDate,
      endingDate: endDate,
      code: privateCode,
      owner: { username: parseLocalJwt().username },
    };

    let url = splitUrl(location.pathname);
    if (url[0] === "manage") {
      data = {
        ...data,
        showWebsite: true,
      };
    }

    fetch(URL + "/api/database/tournament/update", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    }).then(() => {
      if (onCompete()) {
        window.location.href = "/compete/manage-tournaments";
      } else {
        window.location.href = "/manage/tournaments";
      }
    });
  }

  function createTournament() {
    console.log("Creating tournament");
    let data = {
      name: name,
      description: description,
      startingDate: startDate,
      endingDate: endDate,
      code: privateCode,
      owner: { username: parseLocalJwt().username },
    };

    if (location2 === "manage") {
      data = {
        ...data,
        showWebsite: true,
      };
    }

    console.log(data);
    if (!validateTournament(data)) {
      return;
    }

    fetch(URL + "/api/database/tournament/add", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => {
        if (res.status === 409) {
          toast.error("Tournament name already in use", { autoClose: 2500 });
          throw new Error("Name in use");
        } else if (res.status === 226) {
          toast.error("Private code already in use", { autoClose: 2500 });
          throw new Error("Code in use");
        } else if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        if (onCompete()) {
          window.location.href =
            "/compete/manage-tournaments/" + textToLowerCaseNoSpaces(name);
        } else {
          window.location.href =
            "/manage/tournaments/" + textToLowerCaseNoSpaces(name);
        }
      })
      .catch((e) => {
        console.log("errro" + e);
      });
  }

  function onCompete() {
    let url = splitUrl(location.pathname);
    if (url[0] === "compete") {
      return true;
    }
    return false;
  }

  function pathLinkTitle() {
    let url = splitUrl(location.pathname);
    if (url[3] === "edit") {
      return "Edit";
    }
    return "Create Tournament";
  }

  function onSubmit() {
    let url = splitUrl(location.pathname);
    if (typeof url[3] != "undefined" && url[3] === "edit") {
      updateTournament();
    } else {
      createTournament();
    }
  }

  const dateFormat = "HH:mm dd/MM/yyyy";

  if (!registered || !userIsOwner) {
    return <PageNotFound />;
  }

  console.log(name);

  return (
    <div className="container">
      <div className="row">
        <PathLink
          path={location.pathname}
          title={pathLinkTitle()}
          user={parseLocalJwt().username}
        />
        <div className="tournament-creation-container pl-8">
          <div className="tournament-creation-top">
            <h3 className="page-subtitle">
              Host your own tournament at Codeflex and compete with your
              friends.
            </h3>
            <p className="page-subtitle">Start by filling the data below.</p>
            <br />
          </div>
          <form className="form-horizontal">
            <div className="form-group">
              <label for="tournamentName" className="col-sm-1 control-label">
                <span className="text-sm text-gray-400">Name</span>
              </label>
              <div className="col-sm-5">
                <input
                  type="tournamentName"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Tournament name"
                />
                <small className="fill-info">
                  Length between 5 and 50 characters. No special characters
                  except ':' and '_'
                </small>
              </div>
            </div>
            <div className="form-group">
              <label
                for="tournamentDescription"
                className="col-sm-1 control-label"
              >
                <span className="text-sm text-gray-400">Description</span>
              </label>
              <div className="col-sm-10">
                <textarea
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5 w-96"
                  id="description"
                  rows="6"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Short tournament description"
                ></textarea>
                <small className="fill-info">
                  Length between 50 and 1000 characters
                </small>
              </div>
            </div>
            <div className="form-group inline-block mr-2">
              <label for="startingDate" className="col-sm-1 control-label">
                <span className="text-sm text-gray-500">
                  Starting Date (GMT+1)
                </span>
              </label>
              <div className="col-sm-2 date-picker pl-5 py-4">
                <DatePicker
                  dateFormat={dateFormat}
                  selected={startDate}
                  selectsStart
                  showTimeSelect
                  timeIntervals={15}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleChangeStart}
                  minDate={moment()}
                  maxDate={moment().add(60, "days")}
                />
              </div>
            </div>
            <div className="form-group  inline-block">
              <label htmlFor="endingDate" className="col-sm-1 control-label">
                <span className="text-sm text-gray-500">
                  Ending Date (GMT+1)
                </span>
              </label>
              <div className="col-sm-5 date-picker pl-5 py-4">
                <DatePicker
                  dateFormat={dateFormat}
                  selected={endDate}
                  selectsEnd
                  showTimeSelect
                  timeIntervals={1}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleChangeEnd}
                  minDate={startDate}
                  maxDate={moment().add(365, "days")}
                />
              </div>
            </div>
            <div className="form-group">
              <label for="tournamentName" className="col-sm-1 control-label">
                <span className="text-sm text-gray-400">Code</span>
              </label>
              <div className="col-sm-5">
                <input
                  type="code"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5"
                  id="privateCode"
                  onChange={(e) => setPrivateCode(e.target.value)}
                  value={privateCode}
                  placeholder="Private code"
                />
                <small className="fill-info">
                  Add a private code that you can share with your friends to
                  register on the tournament
                </small>
              </div>
            </div>

            <div className="form-group">
              <div
                className="col-sm-offset-1 col-sm-11 col-xs-12 col-md-12"
                style={{ textAlign: "left" }}
              >
                <input
                  type="button"
                  id="btn btn-primary"
                  class="ml-auto m-2 py-1.5 px-8 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer mb-10"
                  onClick={onSubmit}
                  value="Save"
                />
              </div>
            </div>
          </form>

          <ToastContainer
            position="top-right"
            autoClose={5500}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "12pt",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateTournament;
