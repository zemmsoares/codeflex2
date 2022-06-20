import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { getAuthorization, parseLocalJwt, splitUrl, textToLowerCaseNoSpaces, dateWithDay } from '../commons/Utils';
import { URL } from '../commons/Constants';
import { ToastContainer, toast } from 'react-toastify';
import Parser from 'html-react-parser';
import draftToHtml from 'draftjs-to-html';
import AceEditor from 'react-ace';
import Submissions from '../Submissions/Submissions';

import $ from 'jquery';

import './Problem.css'
import Leaderboard from './Leaderboard/Leaderboard';
import PathLink from '../PathLink/PathLink';

function Problem() {
    const [registered, setRegistered] = useState(false);
    const [problem, setProblem] = useState([]);
    const [problemLoaded, setProblemLoaded] = useState(false);
    const [displayLanguages, setDisplayLanguages] = useState([]);

    const [page, setPage] = useState({ problem: true, submissions: false, leaderboard: false });
    const [code, setCode] = useState('')


    const [sentSubmission, setSentSubmission] = useState({
        submitting: false,
        waitingForResults: false,
        submission: [],
        scoringResults: []
    });

    const [results, setResults] = useState({
        loaded: false,
        result: [],
        error: ''
    })

    const [scriptLoaded, setScriptLoaded] = useState(false);


    const [language, setLanguage] = useState({ mode: 'java', name: 'Java' });

    const [theme, setTheme] = useState('github');


    const location = useLocation();
    const { problemName } = useParams()


    console.log("location : " + location);

    const mounted = useRef();

    useEffect(() => {
        let url = splitUrl(location.pathname);


        if (url[0] !== 'practise') {
            //this.isUserRegisteredInTournament();
        }

        fetch(URL + '/api/database/problem/getProblemByName/' + problemName,
            { headers: { ...getAuthorization() } })
            .then(res => res.json()).then(data => {
                setProblem(data);
                setProblemLoaded(true);
                setOpenedProblem(data);
                console.log(data)
            })

        fetch(URL + '/api/database/Language/view', { headers: { ...getAuthorization() } }).then(res => res.json()).then(data => {
            setDisplayLanguages(data);
        });

        if (localStorage.getItem('problem-page') != null) {
            setPage(JSON.parse(localStorage.getItem('problem-page')))
        } else {
            localStorage.setItem('problem-page', JSON.stringify(page));
        }

        if (localStorage.getItem("code") != null) {

            setCode(localStorage.getItem("code"));
        }

        return () => {
            // Anything in here is fired on component unmount.
            localStorage.setItem("code", code);
        }

    }, [])



    useEffect(() => {
        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;
        } else {
            // do componentDidUpdate logic
            let MathJax = $(window)[0].MathJax;

            try {
                console.log("dnhoqwdhoqwidjoqwidjqiwodjqowidjqowidjqoiw")
                console.log(MathJax);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

                <div id="anchor-remove-mathjax"></div>
                // removes the duplicates creadted by MathJax, not the best solution.
                if (page.problem) {
                    while (typeof $('#problem-statement').prev()[0] !== 'undefined') {
                        $('#problem-statement').prev()[0].remove();
                    }
                } else {
                    $('.problem-description-container').children('.MathJax_CHTML').remove();
                }

            } catch (err) {

            }
        }
    });

    function setOpenedProblem(p) {
        const durationsData = {
            users: {
                username: parseLocalJwt().username
            },
            problems: {
                id: p.id
            }
        }

        fetch(URL + '/api/database/Durations/onProblemOpening', {
            method: 'POST',
            body: JSON.stringify(durationsData),
            headers: new Headers({
                ...getAuthorization(),
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
        });
    }

    function onAceChange(newValue) {
        setCode(newValue)
    }

    function handleSelectBoxChange(e) {
        let selectedItem = [...e.target.options].filter(o => o.selected)[0].value; //

        if (e.target.name === 'language') {
            selectedItem = displayLanguages.filter(l => l.compilerName === selectedItem)[0];
            setLanguage({ [e.target.name]: { mode: selectedItem.mode, name: selectedItem.name } })

        } else {
            setLanguage({ [e.target.name]: selectedItem });
        }
    }

    function submitSubmission() {
        setSentSubmission({ submitting: true })
        setResults({ result: [], error: '' });

        let data = {
            code: btoa(code),
            language: { name: language.name },
            users: { username: parseLocalJwt().username },
            problem: { name: textToLowerCaseNoSpaces(problem.name) }
        }


        fetch(URL + '/submission', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                ...getAuthorization(),
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then(data => {
            {/*this.setState({ sentSubmission: { submitting: true, waitingForResults: true, submission: data } })*/ }

            setSentSubmission({ submitting: true, waitingForResults: true, submission: data })
            window.secondsWaiting = new Date().getTime();
            window.resultsListener = setInterval(fetchForResults, 1000);
        });

    }

    function fetchForResults() {
        fetch(URL + '/api/database/Scoring/viewBySubmissionId/' + sentSubmission.submission.id, { headers: { ...getAuthorization() } }).then(res => res.json())
            .then(data => {
                if (JSON.stringify(data) !== '[]' && sentSubmission.submission.problem.testCases.length === data.length) {
                    {/*
                    this.setState({
                        sentSubmission: { submitting: false, scoringResults: data, waitingForResults: false },
                        results: { loaded: true }
                    })
                    */}

                    setSentSubmission({ submitting: false, scoringResults: data, waitingForResults: false });
                    setResults({ loaded: true });

                    clearInterval(window.resultsListener);

                }

                if (new Date().getTime() - window.secondsWaiting >= 30000) {
                    toast.error("Your evaluation is taking too long, please try again later.")
                    clearInterval(window.resultsListener);
                    {/* this.setState({ submitting: false, waitingForResults: false, problemLoaded: true, sentSubmission: { submitting: false } }); */ }

                    // ATENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN

                    setSentSubmission({ submitting: false, waitingForResults: false, problemLoaded: true })


                    return;
                }

                if (data.length === 1 && data[0].submissions.result != null) {

                    /* TODO : corrigir este corner case
                        caso a solução seja válida e faça 
                        um update que dará uma length de 1 emitirá um erro
    
                        alterar o if para garantir que apenas soluções
                        com erro o ativem
                    */

                    let submissionResult = data[0].submissions.result;
                    let name = submissionResult.name;
                    let errorMessage = submissionResult.message


                    if (name === 'Compiler Error') {
                        console.log(submissionResult);
                        {/* 
                        this.setState({
                            sentSubmission: {
                                submitting: false, scoringResults: [], waitingForResults: false
                            },
                            results: {
                                result: { ...submissionResult },
                                error: 'Compiler Error'
                            }
                        })
                       */}

                        setSentSubmission({ submitting: false, scoringResults: [], waitingForResults: false })
                        setResults({ result: { ...submissionResult }, error: 'Compiler Error' })
                        clearInterval(window.resultsListener);
                    } else if (name === 'Runtime Error') {

                    }
                    //console.log("error message " + this.state.results.result.message);
                }

                // HERE
            })
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
        setPage(newPage)

        localStorage.setItem('problem-page', JSON.stringify(newPage));

        // FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX 
        window.location.reload();
    }

    function handleScriptLoad() {
        {/*this.setState({ scriptLoaded: true })*/ }
        setScriptLoaded(true);
    }

    function getInformation(draft) {
        let finalString = '';
        try {
            draft = JSON.parse(draft);
            finalString = Parser(String(draftToHtml(draft)));
        } catch (err) {
            // if it isn't a JSON it's coming from the database as raw text instead of draftjs format
            finalString = draft;
        }

        return (
            <div>
                {finalString}
            </div>
        );
    }

    function getProblemSection() {
        const aceStyle = {
            border: '1px solid #ccc',
            width: '100%',
            boxShadow: '0px 3px 8px 0px #ccc',
            marginLeft: '0'
        }


        const showLoading = getLoading();
        const problemInformation = getProblemInformation();


        return (
            <div className='flex flex-col'>
                <div className=" bg-orange-400" id="problem-section">

                    <div id="anchor-remove-mathjax"></div>

                    <h3 id="problem-statement" className="problem-section-h3">Problem Statement</h3>
                    {getInformation(problem.description)}

                    <h3 className="problem-section-h3">Constraints</h3>
                    {getInformation(problem.constraints)}

                    <h3 className="problem-section-h3">Input Format</h3>
                    {getInformation(problem.inputFormat)}

                    <h3 className="problem-section-h3">Output Format</h3>
                    {getInformation(problem.outputFormat)}

                    {typeof problem.testCases !== "undefined" ? problem.testCases.map((tc, i) => {
                        if (tc.shown) {
                            return <div>
                                <h3 className="problem-section-h3">Test Case {i + 1}</h3>
                                <div className="problem-testcase-wrapper">
                                    {tc.description !== "" ? <div>
                                        <h4>Explanation</h4>
                                        <div className="testcase-wrapper">
                                            <p>{tc.description}</p>
                                        </div>
                                    </div> : ''}
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
                        }
                    }) : ''}

                </div>
                {/* REMOVED PROBLEM INFORMATION */}
                {/*{problemInformation}*/}
                <div className="col-sm-12 ace-editor-container">
                    <div className="ace-editor">
                        <div className="ace-editor-navbar">
                            <p style={{ float: 'left', padding: '3pt', fontSize: '10pt', color: '#aaa' }}>Classes must be named 'Solution' and include no packages.</p>
                            <select name="language" id="" placeholder="Language" onChange={handleSelectBoxChange}>
                                {displayLanguages.map(l => (
                                    <option key={l.id} value={l.compilerName}>{l.name}</option>
                                ))}
                            </select>

                            <select name="theme" id="" onChange={handleSelectBoxChange}>
                                <option value="github">github</option>
                                <option value="tomorrow">tomorrow</option>
                                <option value="monokai">monokai</option>
                                <option value="terminal">terminal</option>
                            </select>
                        </div>
                        <AceEditor style={aceStyle} mode={language.mode} theme={theme} name="" onChange={onAceChange}
                            fontSize={14} showPrintMargin={true} showGutter={true} highlightActiveLine={true} value={code}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 3,
                            }} />
                    </div>

                    {showLoading}

                </div>
            </div>
        )

    }

    function getLoading() {
        let showLoading = "";
        if (sentSubmission.submitting) {
            showLoading =
                <div className="loader-container">
                    <h3>Evaluating your submission...</h3>
                    <div className="loader"></div>
                </div>
        } else {
            showLoading = <div className=" bg-blue-400">
                <input type="submit" className="btn btn-codeflex" value="Submit your code!" onClick={submitSubmission} />
            </div>
        }

        return showLoading;
    }

    function getProblemInformation() {
        return (<div className="col-sm-2 problem-info-container ">
            <table>
                <tbody>
                    <tr>
                        <th><p className="align-left">Difficulty</p></th>
                        <th>
                            <p className="align-right">{problemLoaded ? problem.difficulty.name : ''}</p>
                        </th>
                    </tr>
                    <tr>
                        <th><p className="align-left">Creator</p></th>
                        <th>
                            <p className="align-right">{problemLoaded ?
                                <Link to={'/user/' + problem.owner.username}>
                                    {problem.owner.username}
                                </Link> : ''}</p>
                        </th>
                    </tr>
                    <tr>
                        <th><p className="align-left">Date</p></th>
                        <th>
                            <p className="align-right">{problemLoaded ? dateWithDay(problem.creationDate) : ''}</p>
                        </th>
                    </tr>
                    <tr>
                        <th><p className="align-left">Max Score</p></th>
                        <th>
                            <p className="align-right">{problemLoaded ? problem.maxScore : ''}</p>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>)
    }

    function getLeaderboardSection() {
        return (<div>
            <div className="problem-description-container">
                <div id="anchor-remove-mathjax"></div>
                <Leaderboard pathname={location.pathname} />
            </div>
        </div>);
    }

    function getSubmissionSection() {
        return (<div>
            <div className="problem-description-container ">
                <div id="anchor-remove-mathjax"></div>
                {/*<Submissions pathname={location.pathname} />*/}
            </div>
        </div>);
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

                            <div className="" >
                                <div className="flex flex-col">
                                    <PathLink path={location.pathname} title={problem.name} />
                                    <div className=" bg-green-500">
                                        <ul onClick={onPageClick} className="m-0">
                                            <li className={page.problem ? 'active' : ''}>Problem</li>
                                            <li className={page.submissions ? 'active' : ''}>Submissions</li>
                                            <li className={page.leaderboard ? 'active' : ''}>Leaderboard</li>
                                        </ul>
                                    </div>

                                    {console.log("PAGE.SUBMISSIONS" + page.submissions)}

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
                                        style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12pt', letterSpacing: '1px' }}
                                    />

                                    {results.loaded ?
                                        <Navigate to={{
                                            pathname: location.pathname + "/view-results", state: {
                                                information: sentSubmission.scoringResults
                                            }
                                        }} /> : ''
                                    }

                                </div>
                                {/*
                                <div className="row">
                                    {results.error === 'Compiler Error' && page.problem ? <CompilerError errorMessage={results.result.message} /> : ''}
                                </div>
                                */}
                            </div >

                        </div>
                    ) : (
                        // PROBLEMA NULO
                        <div>

                        </div>
                    )}
                </div >
            ) : (
                // PROBLEM NOT LOADED
                <div>

                </div>
            )}
        </div >











    )
}

export default Problem


