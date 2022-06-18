import React, { useEffect, useState } from 'react'
import { URL } from '../commons/Constants';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { splitUrl, getAuthorization, textToLowerCaseNoSpaces, parseLocalJwt } from '../commons/Utils';


function ListProblems() {

    const [registered, setRegistered] = useState(false);
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [difficulties, setDifficulties] = useState([]);



    const location = useLocation();


    useEffect(() => {
        const url = splitUrl(location.pathname);

        console.log(url)

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
        <div className="m-10">
            <div className="">
                {/*<PathLink path={this.props.location.pathname} title={splitUrl(this.props.match.url)[1]} />*/}
                <div className="">

                    {filteredProblems.sort((a, b) => a.id - b.id).map((problem, index) => (

                        <div className="flex h-20 bg-gray-700">
                            <div>
                                <p id="problem-name">
                                    {problem.name}
                                </p>
                                <p id="problem-difficulty">
                                    {problem.difficulty.name}
                                </p>
                            </div>
                            <div id="button-container">
                                <Link to={{
                                    pathname: location.pathname + '/' + textToLowerCaseNoSpaces(problem.name), state: {
                                        problemId: problem.id,
                                        problemName: problem.name
                                    }
                                }}><input type="submit" className="" /></Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default ListProblems