import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import PathLink from "../PathLink/PathLink";
import {
  textToLowerCaseNoSpaces,
  splitUrl,
  getAuthorization,
  parseLocalJwt,
} from "../commons/Utils";
import { URL } from "../commons/Constants";
import { useLocation } from "react-router-dom";

import "./ViewResults.css";

function ViewResults(props) {
  const [results, setResults] = useState([]);

  const location = useLocation();

  console.log(results);

  useEffect(() => {
    if (typeof location.state.information !== "undefined") {
      setResults(location.state.information);
    } else {
      fetchScoringResults();
    }
  }, []);

  function fetchScoringResults() {
    let pathname = splitUrl(location.pathname)[2];
    fetch(
      URL +
        "/api/database/Scoring/viewBySubmissionId/" +
        location.state.submissionId,
      { headers: { ...getAuthorization() } }
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }

  const aceStyle = {
    minHeight: "600px",
    marginTop: "15px",
    paddingTop: "5px",
    border: "1px solid #ccc",
    width: "100%",
    boxShadow: "0px 3px 8px 0px #ccc",
    marginLeft: "0",
  };

  let renderTestCases = "";
  let renderCode = "";

  if (typeof results !== "undefined") {
    let totalScore = 0.0;
    results.map((s) => {
      if (s.isRight === 1 && !s.testcases.shown) {
        totalScore += s.value;
      }
    });

    renderTestCases = (
      <div className="testcase-container">
        <div>
          <h2>Total Score : {totalScore.toFixed(2)}</h2>
        </div>
        {results.map((s, index) => (
          <div className="col-sm-4 mx-5">
            <div className="col-sm-11 testcase">
              <div className="testcase-icons">
                {s.isRight === 1 ? (
                  <i className="material-icons green-icon" title="Correct!">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </i>
                ) : s.isRight === 0 ? (
                  <i className="material-icons red-icon" title="Incorrect!">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </i>
                ) : (
                  <i
                    className="material-icons red-icon"
                    title="RunTimeError/Time Exceeded!"
                  >
                    error
                  </i>
                )}
              </div>
              <p>solution {s.testcases.input}</p>
              <br></br>
              <p>{s.testcases.output}</p>
              {/* <p>Test Case {index + 1}</p>*/}
              {/*<p>Test Case {index + 1}</p>*/}
            </div>
          </div>
        ))}
      </div>
    );

    if (typeof results[0] !== "undefined") {
      renderCode = (
        <div className="px-8 mb-10">
          <h3>Code submitted</h3>
          <AceEditor
            style={aceStyle}
            mode={results[0].submissions.language.mode}
            name=""
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={atob(results[0].submissions.code)}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 3,
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className="container">
      <div className="row ">
        <PathLink
          path={location.pathname}
          title="View Results"
          user={parseLocalJwt().username}
        />
        {renderTestCases}
      </div>
      <div>{renderCode}</div>
    </div>
  );
}

export default ViewResults;
