import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { URL } from '../commons/Constants'
import { getAuthorization, parseLocalJwt } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';



function GlobalLeaderboard() {

    const [users, setUsers] = useState([]);
    const location = useLocation();

    const orderedUsers = users.sort((a, b) => { return b.rating - a.rating });

    useState(() => {
        fetch(URL + '/api/database/Users/viewAllWithLessInfo', {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                setUsers(data);
            })
    }, [])

    function renderTables() {
        const orderedUsers = users.sort((a, b) => { return b.rating - a.rating });
        return (<div>





        </div>)
    }


    return (
        <div className="container">
            <div className="row">
                <PathLink path={location.pathname} title="Overall Leaderboard" />

            </div>
        </div>
    )
}

export default GlobalLeaderboard