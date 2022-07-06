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
                {example.length > 0 && example.map((example, index) => (
                    <div id="main" class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 justify-evenly px-8 gap-4">
                        <div class="w-26">
                            <div className='relative w-full h-full rounded-lg bg-white border shadow'>
                                <div className='p-4'>
                                    <div className='flex flex-row pb-4 '>
                                        <div className='text-5xl font-bold'>67</div>
                                        <div className='ml-4'>
                                            <span className='flex items-center  '>
                                                <p className='text-xl font-bold pb-1'>Problems Solved</p>

                                            </span>
                                            <p>Haskell is a general-purpose, statically-typed, purely functional programming language with type inference and lazy evaluation.</p>
                                        </div>
                                    </div>

                                    <div className='border-t pb-2'></div>

                                    <div className='flex justify-between'>
                                        <div className=' flex items-center justify-center  px-4 text-gray-300'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p>Achievement Completed</p>
                                        </div>
                                        <Link to={{ pathname: "/practise/" }}>
                                            <button type="button" class=" m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                                View Category
                                            </button>

                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard