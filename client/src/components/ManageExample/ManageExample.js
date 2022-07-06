import React from 'react'
import { useLocation } from 'react-router-dom';
import { URL } from '../commons/Constants';
import { getAuthorization } from '../commons/Utils';
import PathLink from '../PathLink/PathLink'

function ManageExample() {

    const location = useLocation();



    function fetchTournaments() {
        fetch(URL + '/api/database/Tournament/viewAllPublicTournaments', {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }

    fetchTournaments();

    return (
        <div>

            <div>
                <PathLink path={location.pathname} title="Practise by solving exercdqwdqwices" />
                <div className='px-8'>
                    qwdqwdqwd
                </div>
            </div>
        </div>
    )
}

export default ManageExample