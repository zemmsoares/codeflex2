import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { URL } from '../commons/Constants';
import { getAuthorization, parseLocalJwt, splitUrl, textToLowerCaseNoSpaces } from '../commons/Utils';
import PageNotFound from '../PageNotFound/PageNotFound';
import PathLink from '../PathLink/PathLink';

function ManageProblems() {

    const [userIsOwner, setUserIsOwner] = useState(true);
    const [origin, setOrigin] = useState('');
    const [problems, setProblems] = useState([]);

    const location = useLocation();
    const { tournamentNameParam } = useParams();
    const { urlParam } = useParams();

    useEffect(() => {
        if (parseLocalJwt().role != 'CONTENT_MANAGER') {
            isUserTournamentOwner();
        }
        fetchProblems();
    })

    function isUserTournamentOwner() {
        fetch(URL + '/api/database/tournament/isUserTournamentOwner/' + tournamentNameParam + "/" + parseLocalJwt().username, {
            headers: new Headers({ ...getAuthorization() })
        }).then(res => {
            if (res.status === 200) {
                setUserIsOwner(true);
            }
            else {
                setUserIsOwner(false);
            }
        })
    }

    function fetchProblems() {
        const url = splitUrl(location.pathname);
        let origin = '';
        if (url[0] === 'manage') {
            if (url[1] === 'tournaments') {
                setOrigin('manage-tournaments')
                origin = 'manage-tournaments';
            } else {
                setOrigin('manage')
                origin = 'manage';
            }
        } else {
            setOrigin('tournament')
            origin = 'tournament'
        }

        if (origin === 'tournament') {
            fetchAllProblemsByTournamentName(url[2]);
        } else if (origin === 'manage') {
            if (url[1] === 'problems') {

                fetch(URL + '/api/database/Problem/viewAllWithCategory/', {
                    headers: { ...getAuthorization() }
                })
                    .then(res => res.json())
                    .then(data => {
                        setProblems(data);
                    })
            } else if (url[1] === 'tournaments') {
                fetchAllProblemsByTournamentName(url[2]);
            }
        } else if (origin === 'manage-tournaments') {
            fetch(URL + '/api/database/Tournament/getAllProblemsByName/' + tournamentNameParam, {
                headers: { ...getAuthorization() }
            }).then(res => res.json())
                .then(data => {
                    setProblems(data);
                })
        }
    }


    function fetchAllProblemsByTournamentName(tournamentName) {
        fetch(URL + '/api/database/Tournament/getAllProblemsByName/' + tournamentName, {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                setProblems(data);
            })
    }

    function deleteProblem(p) {
        fetch(URL + '/api/database/Problem/deleteByName/' + textToLowerCaseNoSpaces(p.name), {
            method: 'POST',
            headers: { ...getAuthorization() }
        })
            .then(() => {
                fetchProblems();

                let currentProblems = problems;
                let index = currentProblems.indexOf(p);
                currentProblems.splice(index, 1);

                setProblems(currentProblems);

            }).catch((error) => console.log(error));
    }

    if (!userIsOwner) {
        return (
            <PageNotFound />
        )
    }

    let content =
        <div className="add-problem-container">
            <h3 style={{ marginBottom: '15px' }}>{origin === 'tournament' ?
                'There are no problems on this tournament yet.' : "You haven't added any problems yet."
            }</h3>


            <Link to={
                origin === 'tournament' ? "/compete/manage-tournaments/" + splitUrl(location.pathname)[2] + "/add"
                    : origin !== 'manage-tournaments' ? "/manage/problems/add" : "/manage/tournaments/" + tournamentNameParam + "/add"}>
                <input className="btn btn-codeflex" type="button" value="Add problem" />
            </Link>
        </div>

    return (
        <div className="container">
            <div className="row">
                {origin === 'tournament' ?
                    <PathLink path={location.pathname} title={splitUrl(urlParam)[2]} />
                    :
                    <PathLink path={location.pathname} title="Manage Problems" />}
                <div>
                    <div>
                        {problems.length > 0 ? (
                            <div>
                                {/* 
                                <ReactTable
                                    data={problems}
                                    columns={[
                                        {
                                            Header: "Name",
                                            id: "problemName",
                                            accessor: p => (
                                                <p>{p.name} </p>
                                            )
                                        },
                                        {
                                            Header: "Difficulty",
                                            id: "startingDate",
                                            accessor: p => p.difficulty.name,
                                            sortMethod: (a, b) => {
                                                console.log(a);
                                                return a >= b ? 1 : -1;
                                            }
                                        },
                                        {
                                            Header: "Max score",
                                            id: "maxScore",
                                            accessor: t => t.maxScore
                                        },
                                        {
                                            Header: "#TestCases",
                                            id: "testCases",
                                            accessor: p => (
                                                <div>
                                                    {p.testCases.length}
                                                    <Link to={location.pathname + "/" + textToLowerCaseNoSpaces(p.name) + "/test-cases"}> <i className="material-icons manage-tournament-icon" onClick={this.onIconClick}>edit</i> </Link>
                                                </div>
                                            )
                                        },
                                        {
                                            Header: "",
                                            id: "icons",
                                            accessor: p => (
                                                <div>
                                                    <Link to={location.pathname + '/' + textToLowerCaseNoSpaces(p.name) + '/edit'}>
                                                        <i name="edit" className="material-icons manage-tournament-icon" id="edit">edit</i>
                                                    </Link>
                                                    <i name="delete" className="material-icons manage-tournament-icon " id="delete" onClick={() => deleteProblem(p)}>delete</i>
                                                </div >
                                            )
                                        }
                                    ]}
                                    defaultPageSize={15}
                                    pageSize={Math.min(problems.length, 15)}
                                    style={{
                                    }
                                    }
                                    showPagination={Math.min(problems.length, 15) >= 15 ? true : false}
                                    className="-highlight"
                                />
                                */}

                                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                    <Link to={location.pathname + '/add'}>
                                        <input type="button" className="btn btn-codeflex" value="Add new problem" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ManageProblems