import React, { Component, useEffect, useState } from 'react'
import { URL } from '../../commons/Constants'
import { Link, useLocation, useParams } from 'react-router-dom';
import { dateWithHoursAndDay, getAuthorization, textToLowerCaseNoSpaces } from '../../commons/Utils';

import PathLink from '../../PathLink/PathLink'

function ProfilePage() {

    const [verifiedUserExistance, setVerifiedUserExistance] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [userLoaded, setUserLoaded] = useState(false);
    const [categories, setCategories] = useState([]);


    const { location } = useLocation();
    const { username } = useParams()

    useEffect(() => {
        fetchUserExistance();
        fetchSubmissionsByUsername();
        fetchPractiseCategories();
    }, [])

    function fetchUserExistance() {

        fetch(URL + '/api/account/Users/isRegistered/' + username, {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                setVerifiedUserExistance(true);
                setUserExists(data);
            })
    }

    function fetchSubmissionsByUsername() {
        fetch(URL + '/api/database/Submissions/viewByUsername/' + username, {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                setSubmissions(data);
                setUserLoaded(true);
            })
    }

    function fetchPractiseCategories() {
        fetch(URL + '/api/database/PractiseCategory/view', {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                setCategories(data);
            });
    }

    function getCategoryForProblem(problem) {
        let categ = categories;
        let category = '';
        categ.map(c => {
            c.problem.filter(p => {
                if (p.name === problem.name) {
                    category = c;
                    return true;
                }
            })
        })

        return category.name;
    }

    function linkToProblem(submission) {
        if (submission.problem.tournament != null) {
            return <Link to={'/compete/' + textToLowerCaseNoSpaces(submission.problem.tournament.name) + '/' +
                textToLowerCaseNoSpaces(submission.problem.name)}>{submission.problem.name}</Link>
        }

        getCategoryForProblem(submission.problem);

        return <Link to={'/practise/' + textToLowerCaseNoSpaces(getCategoryForProblem(submission.problem)) + '/' +
            textToLowerCaseNoSpaces(submission.problem.name)}>{submission.problem.name}</Link>

    }

    return (
        <div>
            {verifiedUserExistance ? (
                //verifiedUserExistance = true
                <div>
                    {userExists ? (
                        //userExists = true
                        <div>
                            <div className="container" >
                                <div className="row">
                                    {/* <PathLink path={location.pathname} title="Profile" />*/}

                                </div>
                                <div className="row">
                                    <div className="col-sm-3 profile-user-info no-padding no-margin">
                                        <div className="profile-page-border">
                                            <img id="img-profile-placeholder" src={require('../../images/user_placeholder.png')} alt="User flat image" />
                                            <h3 style={{ textAlign: 'center' }}>{username}</h3>
                                        </div>
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-sm-1"></div>
                                    <div className="col-sm-8 no-padding profile-user-stats">
                                        <div className="profile-page-border">
                                            <h3>Activity</h3>
                                            {/*<GithubCalendar submissions={submissions} />*/}

                                        </div>
                                        <br />
                                        <br />
                                        <div className="profile-page-border">
                                            <h3>Recent Submissions</h3>
                                            {submissions.length > 0 && categories.length > 0 ?
                                                submissions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, Math.min(10, submissions.length)).map(s => (
                                                    <div className="profile-page-subtramission">

                                                        <p>Solution to {linkToProblem(s)} submitted on {dateWithHoursAndDay(s.date)} with a total score of {s.score.toFixed(2)}
                                                            &nbsp;({s.score != 0 ? (s.score / s.problem.maxScore * 100).toFixed(2) : '0'}%).</p>
                                                    </div>
                                                )) : <p className="page-subtitle">No recent submissions</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        //userExists = false
                        <div></div>
                    )}
                </div>
            ) : (
                //verifiedUserExistance = false
                <div></div>
            )
            }
        </div >


    )
}

export default ProfilePage