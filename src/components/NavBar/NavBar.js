import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { parseLocalJwt, splitUrl } from '../commons/Utils'
import '../../App.css'

import avatarImage from '../images/user_placeholder.png';

function NavBar({ isSidebar }) {
    const [page, setPage] = useState("");
    const [count, setCount] = useState(0);
    const [url, setUrl] = useState(splitUrl(window.location.pathname)[0]);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        console.log('componentWillUpdate- runs on every update');
        setUrl(splitUrl(window.location.pathname)[0]);


        if (localStorage.getItem('token') != null) {
            setLogged(true);
        } else {
            setLogged(false);
        }

        console.log("URL " + url);
        console.log("isLogged" + logged)

    }, [url])

    function logoutUser() {
        localStorage.clear();
    }

    return (
        <nav className="">


            {logged ?
                <div className="bg-white pt-8 pb-4 px-3 rounded border-r h-screen">
                    <div>
                        <Link to={{ pathname: "/" }}>
                            <a href="/" class="flex items-center pl-2 mb-5">
                                <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                                <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Codeflex</span>
                            </a>
                        </Link>
                        {/* USER IS LOGGED IN */}
                        <div className="" id="myNavbar">
                            <ul className="">
                            </ul>
                            <ul class="space-y-2">
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                        </svg>

                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/Dashboard"><p>Dashboard</p></Link></span>

                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">

                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/practise"><p>Practise</p></Link></span>
                                        <span class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/compete"><p>Tournaments</p></Link></span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">

                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>

                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/leaderboard"><p>Leaderboard</p></Link></span>
                                    </a>
                                </li>

                                <li>
                                    <button type="button" class="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                                        <span class="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>E-commerce</span>
                                        <svg sidebar-toggle-item class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    </button>
                                    <ul id="dropdown-example" class="hidden py-2 space-y-2">
                                        <li>
                                            <a href="#" class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Products</a>
                                        </li>
                                        <li>
                                            <a href="#" class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Billing</a>
                                        </li>
                                        <li>
                                            <a href="#" class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Invoice</a>
                                        </li>
                                    </ul>
                                </li>




                                <li className="">
                                    <ul class="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                                        {parseLocalJwt().role === "CONTENT_MANAGER" ?
                                            <li>
                                                <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">

                                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>

                                                    <span className={'ml-3'}><Link to="/manage"><p>Manage Content</p></Link></span>
                                                </a>
                                            </li> : ''
                                        }

                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <ul class="pt-4 mt-4 space-y-2 border-t border-gray-200 ">
                            <li className='flex'>
                                <a class="flex items-center max-w-fit flex-grow p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <img className='rounded-full w-7' src={avatarImage}></img>

                                    <span className={'ml-3'}><Link to={"/user/" + parseLocalJwt().username} className="" data-toggle="dropdown"><p>{parseLocalJwt().username}&nbsp;<span class="caret"></span></p></Link></span>
                                </a>
                                <a className='flex ml-auto items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                                    <span className={'ml-3'}><Link to="/" onClick={logoutUser}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </Link></span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

                :
                <div>
                    {/* USER IS LOGGED OUT  
                    <div className="overflow-y-auto py-4 px-3  rounded dark:bg-gray-800">
                        <span className="flex" id="myNavbar">
                            <a href="https://flowbite.com" class="flex items-center pl-2.5 mb-5">
                                <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                                <span class="self-center text-xl font-semibold whitespace-nowrap">Codeflex</span>
                            </a>
                        </span>
                    </div >
                    */}


                </div >
            }

        </nav>
    );


}

export default NavBar