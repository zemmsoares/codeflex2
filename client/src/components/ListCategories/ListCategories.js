import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getAuthorization, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';
import { URL } from '../commons/Constants';

import avatarImg from '../images/user_placeholder.png';
import haskellLogo from '../images/haskell.png';

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
            <div>
                <div id="main" class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 justify-evenly px-8 gap-4">
                    {categories.length > 0 && categories.map((category, index) => (
                        <div class="w-26 h-56">
                            <div className='relative w-full h-full rounded-lg bg-white border'>

                                <div className='p-4 flex'>
                                    <div>
                                        <img className='rounded-md w-14' src={avatarImg}></img>
                                    </div>
                                    <div className='ml-4'>
                                        <p className='text-2xl font-bold'>{category.name}</p>
                                        <span className='flex items-center'>
                                            <p className='text-base'>haskell.co</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>

                                        </span>
                                    </div>
                                </div>
                                <div className='mx-4'>
                                    <div className=" mb-4 h-1.5 bg-blue-400 rounded-lg" style={{ width: (100) + '%' }}></div>
                                </div>
                                <div className='text-sm px-4 pb-4'>
                                    <p>Haskell is a general-purpose, statically-typed, purely functional programming language with type inference and lazy evaluation.

                                    </p>
                                </div>
                                <div className='bottom-0 flex w-full h-fit rounded-b-lg border border-b-0 border-r-0 border-l-0'>
                                    <Link to={{ pathname: "/practise/" + textToLowerCaseNoSpaces(category.name), state: { categoryId: category.id } }}>
                                        <button type="button" class="m-2 py-1.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            View Category
                                        </button>
                                    </Link>


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