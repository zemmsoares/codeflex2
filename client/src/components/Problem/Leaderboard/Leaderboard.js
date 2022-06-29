import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

import { URL } from '../../commons/Constants';
import { splitUrl, msToTime, getAuthorization, parseLocalJwt } from '../../commons/Utils';

function Leaderboard({ pathname }) {

    const [problemName, setProblemName] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const problemName = splitUrl(pathname)[2];
        fetch(URL + '/api/database/Leaderboard/viewByProblemName/' + problemName, { headers: { ...getAuthorization() } }).then(res => res.json())
            .then(data => {
                setProblemName(problemName);
                setLeaderboard(data);
            })
    }, [])


    let toRender = '<div></div>';
    if (problemName != null) {

        let leaderboardFiltered = leaderboard.sort((a, b) => { return (b.score - a.score || a.durationMilliseconds - b.durationMilliseconds) });
        let currentUsername = parseLocalJwt().username;

        console.log(leaderboard.length)

    }

    return (
        <div>
            {leaderboard.length > 0 ?
                (<div>
                    {toRender}
                </div>)
                : (<h3 className="no-data-h3">There are no users on the leaderboard.</h3>)
            }
        </div>
    )
}

export default Leaderboard