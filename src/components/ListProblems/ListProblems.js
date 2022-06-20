import React, { useEffect, useState } from 'react'
import { URL } from '../commons/Constants';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { splitUrl, getAuthorization, textToLowerCaseNoSpaces, parseLocalJwt } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';


function ListProblems() {

    const [registered, setRegistered] = useState(false);
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [difficulties, setDifficulties] = useState([]);

    const [problemName2, setProblemName2] = useState('');

    const location = useLocation();


    useEffect(() => {
        const url = splitUrl(location.pathname);


        if (url[0] === 'practise') {
            console.log('practise')
            fetchProblemsByCategory();
        } else if (url[0] === 'compete') {
            console.log('compete')
            //isUserRegisteredInTournament();
        }
        fetch(URL + '/api/database/difficulty/view', {
            headers: {
                ...getAuthorization()
            }
        })
            .then(res => res.json()).then(data => { setDifficulties(data) })
    }, []);


    function fetchProblemsByCategory() {
        const currentCategory = splitUrl(location.pathname)[1];
        fetch(URL + '/api/database/PractiseCategory/getAllWithoutTestCases/' + parseLocalJwt().username, {
            headers: {
                ...getAuthorization()
            }
        })
            .then(res => res.json()).then(data => {
                let newData = data.filter(d => textToLowerCaseNoSpaces(d.name) === currentCategory)
                if (JSON.stringify(newData) === '[]') {
                    window.location.href = '/'
                } else {
                    setProblems(newData[0].problem);
                    setFilteredProblems(newData[0].problem);
                }
            }).catch(err => console.log(err));
    }





    return (
        <div className=''>
            <PathLink path={location.pathname} title={''} />
            {filteredProblems.sort((a, b) => a.id - b.id).map((problem, index) => (
                <div className='flex border rounded-lg border-blue-100'>
                    <h1 className='m-4 w-1/3'>{problem.name}</h1>
                    <div className='w-full flex justify-between'>
                        <h1 className='m-4 font-bold text-blue-500e'>{problem.difficulty.name}</h1>
                        <div id="button-container" className='m-4'>
                            <Link to={{
                                pathname: location.pathname + '/' + textToLowerCaseNoSpaces(problem.name), state: {
                                    problemId: problem.id,
                                    problemName: problem.name
                                }
                            }}><input type="submit" className="" /></Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>








    )
}

export default ListProblems