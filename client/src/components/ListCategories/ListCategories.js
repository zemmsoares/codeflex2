import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getAuthorization, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';
import { URL } from '../commons/Constants';

import avatarImg from '../images/user_placeholder.png';

function ListCategories() {
    const [categories, setCategories] = useState([]);

    const location = useLocation();
    useEffect(() => {
        fetch(URL + '/api/database/PractiseCategory/listwithstats/' + parseLocalJwt().username, {
            headers: {
                ...getAuthorization()
            }
        }).then(res => res.json()).then(data => {
            setCategories(data)
            console.log(categories);
        })
    }, [])

    return (
        <div className='h-screen'>
            <PathLink path={location.pathname} title="Practise by solving exercices" />
            <div class="">
                <div id="main" class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 justify-evenly px-8 gap-4">
                    {categories.length > 0 && categories.map((category, index) => (
                        <div class="w-26">
                            <div className='relative w-full h-full rounded-lg bg-white border shadow'>
                                <div className='p-4'>
                                    <div className='flex flex-row pb-4 '>
                                        <span className='rounded-full h-24 w-24 flex-shrink-0 bg-gray-200 flex justify-center items-center font-bold text-4xl text-white'>{category.name.charAt(0)}</span>
                                        {/* <img className='rounded-full h-24 w-24 flex-shrink-0 ' src={avatarImg}></img> */}

                                        <div className='ml-4'>
                                            <span className='flex items-center  '>
                                                <p className='text-xl font-bold pb-1'>{category.name}</p>
                                                <p className=' bg-gray-200 h-6 text-sm rounded-lg px-2 flex items-center justify-center ml-2'>
                                                    {category.finishedProblems} / {category.totalProblems} solved
                                                </p>
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
                                        <Link to={{ pathname: "/practise/" + textToLowerCaseNoSpaces(category.name), state: { categoryId: category.id } }}>
                                            <button type="button" class=" m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                                View Category
                                            </button>

                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ListCategories