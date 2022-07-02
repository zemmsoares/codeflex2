import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace';
import PathLink from '../PathLink/PathLink';
import { textToLowerCaseNoSpaces, splitUrl, getAuthorization } from '../commons/Utils';
import { URL } from '../commons/Constants';
import { useLocation } from 'react-router-dom';

import './ViewResults.css'

function ViewResults(props) {

    const [results, setResults] = useState([]);

    console.log('state' + JSON.stringify(props))

    const location = useLocation();


    useEffect(() => {
        if (typeof location.state.information !== "undefined") {
            setResults(location.state.information)
            console.log('HI');
        } else {
            console.log('CALLING FETCH RESULTS')
            fetchScoringResults();
        }
    }, [])

    function fetchScoringResults() {
        let pathname = splitUrl(location.pathname)[2];

        console.log('Fetching view-results');
        console.log(pathname);
        fetch(URL + '/api/database/Scoring/viewBySubmissionId/' + location.state.submissionId, { headers: { ...getAuthorization() } }).then(res => res.json())
            .then(data => {
                console.log('VIEW RESULTS')
                console.log(data);
                console.log(data.length);
                setResults(data);
            });
    }

    const aceStyle = {
        minHeight: '600px',
        marginTop: '15px',
        paddingTop: '5px',
        border: '1px solid #ccc',
        width: '100%',
        boxShadow: '0px 3px 8px 0px #ccc',
        marginLeft: '0'
    }

    let renderTestCases = '';
    let renderCode = '';

    if (typeof results !== "undefined") {
        console.log("RESULTS");
        console.log(results);
        let totalScore = 0.0;
        results.map(s => {
            if (s.isRight === 1 && !s.testcases.shown) {
                totalScore += s.value;
            }
        })


        renderTestCases =
            <div className="testcase-container">
                <div>
                    <h2>Total Score : {totalScore.toFixed(2)}</h2>
                </div>
                {results.map((s, index) => (
                    <div className="col-sm-4">
                        <div className="col-sm-11 testcase">
                            <div className="testcase-icons">
                                {s.isRight === 1 ? <i className="material-icons green-icon" title="Correct!">check_circle_outline</i> :
                                    s.isRight === 0 ? <i className="material-icons red-icon" title="Incorrect!">highlight_off</i> :
                                        <i className="material-icons red-icon" title="RunTimeError/Time Exceeded!">error</i>}
                            </div>
                            <p>solution {s.testcases.input}</p><br></br>
                            <p>{s.testcases.output}</p>
                            {/* <p>Test Case {index + 1}</p>*/}
                            {/*<p>Test Case {index + 1}</p>*/}
                        </div>
                    </div>
                ))}
            </div>

        if (typeof results[0] !== "undefined") {
            renderCode = <div>
                <h3>Code submitted</h3>
                <AceEditor style={aceStyle} mode={results[0].submissions.language.mode} name=""
                    fontSize={14} showPrintMargin={true} showGutter={true} highlightActiveLine={true} value={atob(results[0].submissions.code)}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 3,
                    }} />
            </div>
        }
    }

    console.log(renderCode);
    console.log('doqwdwqd' + JSON.stringify(location))

    return (
        <div className="container">
            <div className="row ">
                <PathLink path={location.pathname} title="View Results" />
                {renderTestCases}
            </div>
            <div>
                {renderCode}
            </div>
        </div>
    )
}

export default ViewResults