import React, { Component, useEffect, useState } from 'react'
import { URL } from '../../commons/Constants'
import { Link, useLocation, useParams } from 'react-router-dom';
import { dateWithHoursAndDay, getAuthorization, textToLowerCaseNoSpaces } from '../../commons/Utils';

import PathLink from '../../PathLink/PathLink'
import GithubCalendar from './GithubCalendar/GithubCalendar';

function ProfilePage() {

    const [verifiedUserExistance, setVerifiedUserExistance] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [userLoaded, setUserLoaded] = useState(false);
    const [categories, setCategories] = useState([]);

    const location = useLocation();

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

        return (getCategoryForProblem(submission.problem) != undefined ? (<Link to={'/practise/' + textToLowerCaseNoSpaces(getCategoryForProblem(submission.problem)) + '/' +
            textToLowerCaseNoSpaces(submission.problem.name)}>{submission.problem.name}</Link>) : (<div>Problem deleted </div>))



    }

    return (
        <div>
            {verifiedUserExistance ? (
                //verifiedUserExistance = true
                <div>
                    {userExists ? (
                        //userExists = true
                        <div>
                            <div className="" >
                                <div className="">
                                    <PathLink path={location.pathname} title="Profile" />
                                </div>

                                <div className='px-8'>

                                    <div className='bg-gray-100 mb-4'>
                                        <div class="flex-1 flex flex-row justify-start space-x-2">
                                            <div class="relative inline-block">
                                                <img className='w-24 h-24 bg-gray-100 rounded-full rounded"' src={require('../../images/user_placeholder.png')} alt="User flat image" />
                                                <div class="w-6 h-6 bg-green-500 rounded-full ring-4 ring-white absolute bottom-0 right-0" />
                                            </div>
                                            <div>
                                                <p className='text-lg font-bold capitalize'>{username}</p>
                                            </div>
                                        </div>

                                    </div>



                                    <div className='border rounded-lg p-4'>
                                        <GithubCalendar submissions={submissions} />
                                    </div>

                                    <div className=' p-4'>
                                        <h3 className='font-bold'>Recent Submissions</h3>
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