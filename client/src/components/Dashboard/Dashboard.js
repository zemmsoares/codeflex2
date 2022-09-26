import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { URL } from '../commons/Constants';
import { getAuthorization, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils'
import PathLink from '../PathLink/PathLink'

function Dashboard() {

    const [example, setExample] = useState([]);

    const location = useLocation();
    useEffect(() => {
        fetch(URL + '/api/database/PractiseCategory/listwithstats/' + parseLocalJwt().username, {
            headers: {
                ...getAuthorization()
            }
        }).then(res => res.json()).then(data => {
            setExample(data)
        })
    }, [])

    console.log(example);


    return (
        <div className='h-screen'>
            <PathLink path={location.pathname} title="Practise by solving exercices" />
            <div class="">
                
            </div>
        </div>
    )
}

export default Dashboard