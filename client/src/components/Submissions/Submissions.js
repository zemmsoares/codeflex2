import React, { useEffect, useState } from 'react';
import { Router, Link } from 'react-router-dom';
import { URL } from '../commons/Constants';
import { splitUrl, dateWithHoursAndDay, parseLocalJwt, getAuthorization } from '../commons/Utils'

import SubmissionsTable from './SubmissionsTable';

function Submissions({ path }) {

    const [results, setResults] = useState([]);

    useEffect(() => {
        let problemName = splitUrl(path)[2];
        fetch(URL + '/api/database/Submissions/viewByProblemNameByUsername/' + problemName + '/' + parseLocalJwt().username, {
            headers: { ...getAuthorization() }
        }).then(res => res.json()).then(data => {
            setResults(data);
            console.log('results');
            console.log(data);
        })
    }, [])

    return (
        <div>
            <div className="row">
                {results.length > 0 ?
                    (
                        <div>
                            <SubmissionsTable data={results} />
                        </div>
                    ) : (
                        <h3 className="no-data-h3">You have not submitted solutions to this problem.</h3>
                    )
                }
            </div>
        </div>
    )
}

export default Submissions