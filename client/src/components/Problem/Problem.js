import React, { useEffect, useState, useRef } from "react";
import {
  useLocation,
  useParams,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  getAuthorization,
  parseLocalJwt,
  splitUrl,
  textToLowerCaseNoSpaces,
  dateWithDay,
} from "../commons/Utils";
import { URL } from "../commons/Constants";
import { ToastContainer, toast } from "react-toastify";
import Parser from "html-react-parser";
import draftToHtml from "draftjs-to-html";
import AceEditor from "react-ace";
import Submissions from "../Submissions/Submissions";

import $ from "jquery";

import "./Problem.css";
import Leaderboard from "./Leaderboard/Leaderboard";
import PathLink from "../PathLink/PathLink";
import CompilerError from "./CompilerError/CompilerError";

function Problem() {
  const [registered, setRegistered] = useState(false);
  const [problem, setProblem] = useState([]);
  const [problemLoaded, setProblemLoaded] = useState(false);
  const [displayLanguages, setDisplayLanguages] = useState([]);

  const [page, setPage] = useState({
    problem: true,
    submissions: false,
    leaderboard: false,
  });
  const [code, setCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [submission, setSubmission] = useState([]);
  const [scoringResults, setScoringResults] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const [subSize, setSubSize] = useState();

  const [scriptLoaded, setScriptLoaded] = useState(false);

  //const [language, setLanguage] = useState({ mode: "java", name: "Java" });
  const [language, setLanguage] = useState({
    language: { mode: "prolog", name: "Prolog" },
  });

  const [theme, setTheme] = useState("github");

  const location = useLocation();
  const { problemName } = useParams();

  const navigate = useNavigate();

  const mounted = useRef();

  useEffect(() => {
    fetch(
      URL +
        "/api/database/Submissions/viewByProblemNameByUsername/" +
        problemName +
        "/" +
        parseLocalJwt().username,
      {
        headers: { ...getAuthorization() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setSubSize(data.length);
      });
  }, [result]);

  useEffect(() => {
    let url = splitUrl(location.pathname);

    if (url[0] !== "practise") {
      //this.isUserRegisteredInTournament();
    }

    fetch(URL + "/api/database/problem/getProblemByName/" + problemName, {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setProblemLoaded(true);
        setOpenedProblem(data);
      });

    fetch(URL + "/api/database/Language/view", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisplayLanguages(data);
      });

    if (localStorage.getItem("problem-page") != null) {
      setPage(JSON.parse(localStorage.getItem("problem-page")));
    } else {
      localStorage.setItem("problem-page", JSON.stringify(page));
    }

    if (localStorage.getItem("code") != null) {
      setCode(localStorage.getItem("code"));
    }

    return () => {
      // Anything in here is fired on component unmount.
      localStorage.setItem("code", code);
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      let MathJax = $(window)[0].MathJax;

      try {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

        <div id="anchor-remove-mathjax"></div>;
        // removes the duplicates creadted by MathJax, not the best solution.
        if (page.problem) {
          while (typeof $("#problem-statement").prev()[0] !== "undefined") {
            $("#problem-statement").prev()[0].remove();
          }
        } else {
          $(".problem-description-container")
            .children(".MathJax_CHTML")
            .remove();
        }
      } catch (err) {}
    }
  });

  function setOpenedProblem(p) {
    const durationsData = {
      users: {
        username: parseLocalJwt().username,
      },
      problems: {
        id: p.id,
      },
    };

    fetch(URL + "/api/database/Durations/onProblemOpening", {
      method: "POST",
      body: JSON.stringify(durationsData),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {});
  }

  function onAceChange(newValue) {
    setCode(newValue);
  }

  function handleSelectBoxChange(e) {
    let selectedItem = [...e.target.options].filter((o) => o.selected)[0].value; //

    if (e.target.name === "language") {
      selectedItem = displayLanguages.filter(
        (l) => l.compilerName === selectedItem
      )[0];
      setLanguage({
        [e.target.name]: { mode: selectedItem.mode, name: selectedItem.name },
      });
    } else {
      setLanguage({ [e.target.name]: selectedItem });
    }
  }

  function submitSubmission() {
    ////////////

    setSubmitting(true);
    setResult([]);
    setError("");

    let data = {
      code: btoa(code),
      language: { name: language.language.name },
      users: { username: parseLocalJwt().username },
      problem: { name: textToLowerCaseNoSpaces(problem.name) },
    };

    fetch(URL + "/submission", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        ...getAuthorization(),
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(true);
        setWaitingForResults(true);
        setSubmission(data);

        window.secondsWaiting = new Date().getTime();
        window.resultsListener = setInterval(function () {
          fetchForResults(data);
        }, 1000);
      });
  }

  function fetchForResults(teste) {
    fetch(URL + "/api/database/Scoring/viewBySubmissionId/" + teste.id, {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          JSON.stringify(data) !== "[]" &&
          teste.problem.testCases.length === data.length
        ) {
          console.log(data);
          setSubmitting(false);
          setScoringResults(data);
          setWaitingForResults(false);
          //setLoaded(true);

          clearInterval(window.resultsListener);
        }

        if (new Date().getTime() - window.secondsWaiting >= 30000) {
          toast.error(
            "Your evaluation is taking too long, please try again later."
          );
          console.log(
            "Your evaluation is taking too long, please try again later."
          );
          clearInterval(window.resultsListener);
          {
            /* this.setState({ submitting: false, waitingForResults: false, problemLoaded: true, sentSubmission: { submitting: false } }); */
          }

          setSubmitting(false);
          setWaitingForResults(false);
          problemLoaded(true);

          return;
        }

        if (data.length > 0 && data[0].submissions.result != null) {
          /* TODO : corrigir este corner case
                        caso a solução seja válida e faça 
                        um update que dará uma length de 1 emitirá um erro
    
                        alterar o if para garantir que apenas soluções
                        com erro o ativem
                    */

          let submissionResult = data[0].submissions.result;
          let name = submissionResult.name;
          let errorMessage = submissionResult.message;

          if (name === "Compiler Error") {
            {
              /* 
                        this.setState({
                            sentSubmission: {
                                submitting: false, scoringResults: [], waitingForResults: false
                            },
                            results: {
                                result: { ...submissionResult },
                                error: 'Compiler Error'
                            }
                        })
                       */
            }

            setSubmitting(false);
            setScoringResults([]);
            setWaitingForResults(false);
            setResult({ ...submissionResult });
            setError("Compiler Error");

            clearInterval(window.resultsListener);
          } else if (name === "Runtime Error") {
            //console.log("Runtime Error");
          } else {
            setLoaded(true);
          }
          //console.log("error message " + this.state.results.result.message);
        }

        // HERE
      });
  }

  function onPageClick(e) {
    let newPage = page;
    for (let property in newPage) {
      if (property === e.target.innerHTML.toLowerCase()) {
        newPage[property] = true;
      } else {
        newPage[property] = false;
      }
    }
    setPage(newPage);

    localStorage.setItem("problem-page", JSON.stringify(newPage));

    // FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX
    window.location.reload();
  }

  function handleScriptLoad() {
    {
      /*this.setState({ scriptLoaded: true })*/
    }
    setScriptLoaded(true);
  }

  function getInformation(draft) {
    let finalString = "";
    try {
      draft = JSON.parse(draft);
      finalString = Parser(String(draftToHtml(draft)));
    } catch (err) {
      // if it isn't a JSON it's coming from the database as raw text instead of draftjs format
      finalString = draft;
    }

    return <div>{finalString}</div>;
  }

  function getProblemSection() {
    const aceStyle = {
      border: "1px solid #ccc",
      width: "100%",
      boxShadow: "0px 3px 8px 0px #ccc",
      marginLeft: "0",
    };

    const showLoading = getLoading();
    const problemInformation = getProblemInformation();

    return (
      <div className="flex flex-col ">
        <div className=" " id="problem-section">
          <div id="anchor-remove-mathjax"></div>

          <h3 id="problem-statement" className="problem-section-h3">
            Problem Statement
          </h3>
          {getInformation(problem.description)}

          <h3 className="problem-section-h3">Constraints</h3>
          {getInformation(problem.constraints)}

          <h3 className="problem-section-h3">Input Format</h3>
          {getInformation(problem.inputFormat)}

          <h3 className="problem-section-h3">Output Format</h3>
          {getInformation(problem.outputFormat)}

          {typeof problem.testCases !== "undefined"
            ? problem.testCases.map((tc, i) => {
                if (tc.shown) {
                  return (
                    <div>
                      <h3 className="problem-section-h3">Test Case {i + 1}</h3>
                      <div className="problem-testcase-wrapper">
                        {tc.description !== "" ? (
                          <div>
                            <h4>Explanation</h4>
                            <div className="testcase-wrapper">
                              <p>{tc.description}</p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          <h4>Input</h4>
                          <div className="testcase-wrapper">
                            <p>{tc.input}</p>
                          </div>
                        </div>
                        <div>
                          <h4>Output</h4>
                          <div className="testcase-wrapper">
                            <p>{tc.output}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            : ""}
        </div>
        {/* REMOVED PROBLEM INFORMATION */}
        {/*{problemInformation}*/}
        <div className="col-sm-12 ace-editor-container mt-5">
          <div className="ace-editor">
            <div className="ace-editor-navbar">
              <p
                style={{
                  float: "left",
                  padding: "3pt",
                  fontSize: "10pt",
                  color: "#aaa",
                }}
              >
                Classes must be named 'Solution' and include no packages.
              </p>
              <select
                name="language"
                id=""
                placeholder="Language"
                onChange={handleSelectBoxChange}
              >
                {displayLanguages.map((l) => (
                  <option key={l.id} value={l.compilerName}>
                    {l.name}
                  </option>
                ))}
              </select>

              <select name="theme" id="" onChange={handleSelectBoxChange}>
                <option value="github">github</option>
                <option value="tomorrow">tomorrow</option>
                <option value="monokai">monokai</option>
                <option value="terminal">terminal</option>
              </select>
            </div>
            <AceEditor
              style={aceStyle}
              mode={language.mode}
              //theme={theme}
              name=""
              onChange={onAceChange}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={code}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 3,
              }}
            />
          </div>

          {showLoading}
        </div>
      </div>
    );
  }

  function getLoading() {
    let showLoading = "";
    if (submitting) {
      showLoading = (
        <div className="loader-container py-5 mb-12">
          <h3>Evaluating your submission...</h3>
          <div className="loader"></div>
        </div>
      );
    } else {
      showLoading = (
        <div className="flex">
          <div className="py-4 w-full">
            {error === "Compiler Error" && page.problem ? (
              <CompilerError errorMessage={result.message} />
            ) : (
              ""
            )}
          </div>
          <div className="ml-auto justify-end py-4">
            {splitUrl(location.pathname)[0] == "practise" ? (
              <div></div>
            ) : (
              <p>Submissions count : {subSize}</p>
            )}
            {subSize < 5 || splitUrl(location.pathname)[0] == "practise" ? (
              <input
                type="submit"
                className="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                value="Submit your code!"
                onClick={submitSubmission}
              />
            ) : (
              <input
                type="submit"
                className="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                value="No submissions left"
                onClick={console.log("no more submissions")}
              />
            )}
          </div>
        </div>
      );
    }

    return showLoading;
  }

  function getProblemInformation() {
    return (
      <div className="col-sm-2 problem-info-container ">
        <table>
          <tbody>
            <tr>
              <th>
                <p className="align-left">Difficulty</p>
              </th>
              <th>
                <p className="align-right">
                  {problemLoaded ? problem.difficulty.name : ""}
                </p>
              </th>
            </tr>
            <tr>
              <th>
                <p className="align-left">Creator</p>
              </th>
              <th>
                <p className="align-right">
                  {problemLoaded ? (
                    <Link to={"/user/" + problem.owner.username}>
                      {problem.owner.username}
                    </Link>
                  ) : (
                    ""
                  )}
                </p>
              </th>
            </tr>
            <tr>
              <th>
                <p className="align-left">Date</p>
              </th>
              <th>
                <p className="align-right">
                  {problemLoaded ? dateWithDay(problem.creationDate) : ""}
                </p>
              </th>
            </tr>
            <tr>
              <th>
                <p className="align-left">Max Score</p>
              </th>
              <th>
                <p className="align-right">
                  {problemLoaded ? problem.maxScore : ""}
                </p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function getLeaderboardSection() {
    return (
      <div>
        <div className="problem-description-container">
          <div id="anchor-remove-mathjax"></div>
          <Leaderboard pathname={location.pathname} />
        </div>
      </div>
    );
  }

  function getSubmissionSection() {
    return (
      <div>
        <div className="problem-description-container ">
          <div id="anchor-remove-mathjax"></div>
          <Submissions path={location.pathname} />
        </div>
      </div>
    );
  }

  function testa() {
    if (page.submissions) {
      return getSubmissionSection();
    } else if (page.leaderboard) {
      return getLeaderboardSection();
    } else {
      if (problemLoaded) {
        return getProblemSection();
      }
    }
  }

  return (
    <div>
      {problemLoaded ? (
        <div>
          {problem.name != null ? (
            // PROBLEMA NAO NULO
            <div>
              <div className="">
                <div className="flex flex-col">
                  <PathLink
                    path={location.pathname}
                    title={problem.name}
                    user={parseLocalJwt().username}
                  />

                  <div className="px-8">
                    <div className="flex  mb-5">
                      <div className="">
                        <button
                          onClick={onPageClick}
                          type="button"
                          className={`py-1.5 px-5 mr-2 text-sm font-medium ${
                            page.problem ? "active" : ""
                          }`}
                        >
                          Problem
                        </button>
                      </div>
                      <div className="">
                        <button
                          onClick={onPageClick}
                          type="button"
                          className={`py-1.5 px-5 mr-2 text-sm font-medium ${
                            page.submissions ? "active" : ""
                          }`}
                        >
                          Submissions
                        </button>
                      </div>
                      <div className="" onClick={onPageClick}>
                        <button
                          onClick={onPageClick}
                          type="button"
                          className={`py-1.5 px-5 mr-2 text-sm font-medium ${
                            page.leaderboard ? "active" : ""
                          }`}
                        >
                          Leaderboard
                        </button>
                      </div>
                    </div>

                    {testa()}

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
                      }}
                    />

                    {loaded
                      ? navigate(location.pathname + "/view-results", {
                          state: { information: scoringResults },
                        })
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // PROBLEMA NULO
            <div></div>
          )}
        </div>
      ) : (
        // PROBLEM NOT LOADED
        <div></div>
      )}
    </div>
  );
}

export default Problem;
