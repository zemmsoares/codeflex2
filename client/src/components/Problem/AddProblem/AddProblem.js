import React, { useEffect, useState } from "react";
import {
  getAuthorization,
  isContentManager,
  parseLocalJwt,
  splitUrl,
} from "../../commons/Utils";
import PathLink from "../../PathLink/PathLink";
import { URL } from "../../commons/Constants";
import { useLocation, useParams } from "react-router-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { toast, ToastContainer } from "react-toastify";

import { validateSaveProblem } from "./DataValidation";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import "../../commons/draft-editor.css";
import "./AddProblem.css";

function AddProblem() {
  const [displayCategories, setDisplayCategories] = useState([]);
  const [displayDifficulties, setDisplayDifficulties] = useState([]);
  const [userIsOwner, setUserIsOwner] = useState(true);

  const [problemDescription, setProblemDescription] = useState(
    EditorState.createEmpty()
  );
  const [problemConstraints, setProblemConstraints] = useState(
    EditorState.createEmpty()
  );
  const [problemInputFormat, setProblemInputFormat] = useState(
    EditorState.createEmpty()
  );
  const [problemOutputFormat, setProblemOutputFormat] = useState(
    EditorState.createEmpty()
  );

  const [problemMaxScore, setProblemMaxScore] = useState(100);
  const [difficulty, setDifficulty] = useState({ id: "", name: "" });

  const [difficultyId, setDifficultyId] = useState(0);
  const [difficultyName, setDifficultyName] = useState("");

  const [category, setCategory] = useState({ id: "", name: "" });
  const [problemId, setProblemId] = useState("");
  const [problemNameA, setProblemNameA] = useState("");

  const [catId, setCatId] = useState(0);
  const [catName, setCatName] = useState("");

  // test
  const [saveData, setSaveData] = useState({});

  const location = useLocation();
  const { tournamentName } = useParams();
  const { problemName } = useParams();

  useEffect(() => {
    if (!isContentManager()) {
      isUserTournamentOwner();
    }
    fetch(URL + "/api/database/difficulty/view", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDisplayDifficulties(data);
      });
    fetch(URL + "/api/database/PractiseCategory/view", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisplayCategories(data);
      });
    const path = splitUrl(location.pathname);
    if (isEditing()) {
      fetchCurrentProblem();
    }
  }, []);

  useEffect(() => {
    console.log(catName);
    console.log(difficultyName);
    console.log(problemNameA);
  });

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

  function fetchCurrentProblem() {
    fetch(URL + "/api/database/Problem/viewAllDetails/" + problemName, {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        let saveData = "";

        try {
          console.log(data.problem.id);
          console.log(data.problem.name);
          //console.log(convertFromRaw(JSON.parse(data.problem.description)));
          saveData = {
            problemId: data.problem.id,
            problemName: data.problem.name,

            problemMaxScore: data.problem.maxScore,
          };
        } catch (err) {
          console.log(err);
        }
        if (data.category) {
          saveData = {
            ...saveData,
            category: {
              id: data.category.id,
              name: data.category.id,
            },
          };
        }
        if (data.problem.difficulty) {
          saveData = {
            ...saveData,
            difficulty: {
              id: data.problem.difficulty.id,
              name: data.problem.difficulty.name,
            },
          };
        }
        // TODO : check category might be null
        setSaveData({
          ...saveData,
        });
        console.log(saveData);
      });
  }

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID 85af3a3fbda6df3");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  }

  // couldn't figure out how to get the target for the editors. This will have to do. ( maybe refs)
  function onDescriptionChange(change) {
    setProblemDescription(change);
  }
  function onConstraintChange(change) {
    setProblemConstraints(change);
  }
  function onInputFormatChange(change) {
    setProblemInputFormat(change);
  }
  function onOutputFormatChange(change) {
    setProblemOutputFormat(change);
  }

  function handleSelectBoxChange(e) {
    let selectedItem = [...e.target.options].filter((o) => o.selected)[0];
    setCatId(selectedItem.value);
    setCatName(selectedItem.id);
  }

  function handleSelectBoxChangeDifficulty(e) {
    let selectedItem = [...e.target.options].filter((o) => o.selected)[0];
    setDifficultyId(selectedItem.value);
    setDifficultyName(selectedItem.id);
  }

  function updateProblem() {
    console.log("-------------------------updating");
    const data = {
      problem: {
        id: problemId,
        name: problemNameA,
        maxScore: parseInt(problemMaxScore),
        description: JSON.stringify(
          convertToRaw(problemDescription.getCurrentContent())
        ),
        constraints: JSON.stringify(
          convertToRaw(problemConstraints.getCurrentContent())
        ),
        inputFormat: JSON.stringify(
          convertToRaw(problemInputFormat.getCurrentContent())
        ),
        outputFormat: JSON.stringify(
          convertToRaw(problemOutputFormat.getCurrentContent())
        ),
        difficulty: {
          id: difficultyId,
          name: difficultyName,
        },
      },
      category: {
        id: catId,
        name: catName,
      },
      owner: {
        username: parseLocalJwt().username,
      },
      tournament: {
        name: tournamentName,
      },
    };

    fetch(URL + "/api/database/Problem/update", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("PROBLEM UPDATED");
        //window.location.href = this.getRedirectDestinationOnSave();
      });
  }

  function isEditing() {
    const path = splitUrl(location.pathname);
    if (
      path[3] === "edit" ||
      path[2] === "edit" ||
      (typeof path[4] != "undefined" && path[4] === "edit")
    ) {
      return true;
    }
    return false;
  }

  function saveProblem() {
    let url = splitUrl(location.pathname);

    const dataVal = {
      invalidData: true,
      userIsOwner: userIsOwner,
      problemId: problemId,
      problemName: problemNameA,
      problemMaxScore: problemMaxScore,
      problemDescription: EditorState.createEmpty(),
      problemConstraints: EditorState.createEmpty(),
      problemInputFormat: EditorState.createEmpty(),
      problemOutputFormat: EditorState.createEmpty(),
      difficulty: {
        id: difficultyId,
        name: difficultyName,
      },
      category: {
        id: catId,
        name: catName,
      },
      displayDifficulties: displayDifficulties,
      displayCategories: displayCategories,
    };

    if (!validateSaveProblem(dataVal)) {
      return;
    }

    if (isEditing()) {
      updateProblem();
      return;
    }

    const data = {
      problem: {
        name: problemNameA,
        maxScore: Number(problemMaxScore),
        description: JSON.stringify(
          convertToRaw(problemDescription.getCurrentContent())
        ),
        constraints: JSON.stringify(
          convertToRaw(problemConstraints.getCurrentContent())
        ),
        inputFormat: JSON.stringify(
          convertToRaw(problemInputFormat.getCurrentContent())
        ),
        outputFormat: JSON.stringify(
          convertToRaw(problemOutputFormat.getCurrentContent())
        ),
        creationDate: new Date().getTime(),
      },
      difficulty: {
        id: difficultyId,
        name: difficultyName,
      },
      category: {
        id: catId,
        name: catName,
      },
      owner: {
        username: parseLocalJwt().username,
      },
      tournament: {
        name: tournamentName,
      },
    };

    console.log(data);
    fetch(URL + "/api/database/Problem/add", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => {
        if (res.status === 500) {
          toast.error("There is already a problem named " + data.problem.name, {
            autoClose: 2500,
          });
        } else {
          return res.json();
        }
      })
      .then((data) => {
        window.location.href = getRedirectDestinationOnSave();
      });
  }

  function getRedirectDestinationOnSave() {
    let url = splitUrl(location.pathname);

    if (url[0] === "compete") {
      return "/compete/manage-tournaments/" + tournamentName;
    } else if (url[0] === "manage") {
      if (url[1] === "problems") {
        return "/manage/problems";
      } else if (url[1] === "tournaments") {
        return "/manage/tournaments/" + tournamentName;
      }
    }
  }

  return (
    <div className="container add-problem">
      <div className="row">
        <PathLink
          path={location.pathname}
          title="Add problem"
          user={parseLocalJwt().username}
        />
        <div className="col-sm-2 add-problem-desc pl-8">
          <h3>Name</h3>
          <p>Add a name to your problem.</p>
        </div>
        <div className="col-sm-10 add-problem-textarea pl-8">
          <input
            name="problemName"
            className="textbox-problem"
            onChange={(e) => {
              setProblemNameA(e.target.value);
            }}
            value={problemNameA}
            type="text"
            id="input-problem-name"
            placeholder="Problem name"
          />
          <small className="fill-info">
            {" "}
            &nbsp; Length between 5 and 50 characters
          </small>
        </div>
      </div>

      {splitUrl(location.pathname)[0] === "manage" &&
      splitUrl(location.pathname)[1] !== "tournaments" ? (
        <div>
          {
            <div className="row info-section pl-8">
              <div className="col-sm-2 add-problem-desc">
                <h3>Category</h3>
                <p>Select the category that best represents the problem.</p>
              </div>
              <div className="col-sm-10 add-problem-textarea">
                <select
                  name="category"
                  className="textbox-problem"
                  placeholder="Category"
                  onChange={handleSelectBoxChange}
                >
                  <option value="" disabled selected>
                    Select category
                  </option>
                  {displayCategories.map((d, index) => (
                    <option
                      key={d.id}
                      value={d.id}
                      selected={d.id === category.id ? "selected" : ""}
                      id={d.name}
                    >
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
        </div>
      ) : (
        ""
      )}

      <div className="row info-section pl-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Difficulty</h3>
          <p>Select the difficulty of the problem.</p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <select
            name="difficulty"
            className="textbox-problem"
            placeholder="Difficulty"
            onChange={handleSelectBoxChangeDifficulty}
          >
            <option value="" disabled selected>
              Select difficulty
            </option>
            {displayDifficulties.map((d, index) => (
              <option
                key={d.id}
                value={d.id}
                selected={d.id === difficulty.id ? "selected" : ""}
                id={d.name}
              >
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row info-section px-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Problem Statement</h3>
          <p>Explain your problem here. Keep it simple and clear.</p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <div className="text-editor-wrapper">
            <Editor
              wrapperClassName="demo-wrapper "
              editorClassName="demo-editor"
              editorState={problemDescription}
              //    editorState={this.state.description}
              onEditorStateChange={onDescriptionChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: {
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: true },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="row info-section px-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Constraints</h3>
          <p>
            Include all your constraints here, such as input and output size
            limitations.
          </p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <div className="text-editor-wrapper">
            <Editor
              id="description"
              wrapperClassName="demo-wrapper "
              editorClassName="demo-editor"
              editorState={problemConstraints}
              //    editorState={this.state.description}
              onEditorStateChange={onConstraintChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: {
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: true },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="row info-section px-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Input Format</h3>
          <p>Add your information regarding the expected input format.</p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <div className="text-editor-wrapper">
            <Editor
              id="description"
              wrapperClassName="demo-wrapper "
              editorClassName="demo-editor"
              editorState={problemInputFormat}
              //    editorState={this.state.description}
              onEditorStateChange={onInputFormatChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: {
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: true },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="row info-section px-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Output Format</h3>
          <p>Add your information regarding the expected output format.</p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <div className="text-editor-wrapper">
            <Editor
              id="description"
              wrapperClassName="demo-wrapper "
              editorClassName="demo-editor"
              editorState={problemOutputFormat}
              //    editorState={this.state.description}
              onEditorStateChange={onOutputFormatChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: {
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, mandatory: true },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="row info-section pl-8">
        <div className="col-sm-2 add-problem-desc">
          <h3>Max score</h3>
          <p>
            Max score of the problem. It will be divided equally by all the test
            cases that aren't shown to the user.
          </p>
        </div>
        <div className="col-sm-10 add-problem-textarea">
          <input
            name="problemMaxScore"
            className="textbox-problem"
            onChange={(e) => {
              setProblemMaxScore(e.target.value);
            }}
            value={problemMaxScore}
            type="text"
            placeholder="Max score (e.g. 100)"
          />
          <small className="fill-info"> &nbsp; Value between 10 and 250</small>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-offset-2 col-sm-10 col-xs-12 pl-8">
          <input
            type="button"
            class="ml-auto m-2 py-1.5 px-8 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer mb-10"
            onClick={saveProblem}
            name=""
            id="save-problem"
            value="Save problem"
          />
        </div>
      </div>

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
  );
}

export default AddProblem;
