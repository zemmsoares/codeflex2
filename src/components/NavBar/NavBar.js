import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { parseLocalJwt, splitUrl } from '../commons/Utils'
import '../../App.css'

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
            <div className="overflow-y-auto py-4 px-3  rounded dark:bg-gray-800">

                {logged ?
                    <div>
                        <a href="#" class="flex items-center pl-2.5 mb-5">
                            <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Codeflex</span>
                        </a>
                        {/* USER IS LOGGED IN */}
                        <div className="" id="myNavbar">
                            <ul className="">

                            </ul>
                            <ul class="space-y-2">
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/"><p>Dashboard</p></Link></span>

                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/practise"><p>Practise</p></Link></span>
                                        <span class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/compete"><p>Compete</p></Link></span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                        <span class="flex-1 ml-3 whitespace-nowrap"><Link to="/leaderboard"><p>Leaderboard</p></Link></span>
                                    </a>
                                </li>




                                <li className="">
                                    <ul class="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                                        <li>
                                            <a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                <span className={'ml-3'}><Link to="/" className="" data-toggle="dropdown"><p>{parseLocalJwt().username}&nbsp;<span class="caret"></span></p></Link></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                <span className={'ml-3'}><Link to={"/user/" + parseLocalJwt().username}><p>Profile</p></Link></span>
                                            </a>
                                        </li>
                                        {parseLocalJwt().role === "CONTENT_MANAGER" ?
                                            <li>
                                                <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                    <span className={'ml-3'}><Link to="/manage"><p>Manage Content</p></Link></span>
                                                </a>
                                            </li> : ''
                                        }

                                        <li>
                                            <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                <span className={'ml-3'}><Link to="/" onClick={logoutUser}><p>Logout</p></Link></span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>


                            </ul>
                        </div>
                    </div>

                    :
                    <div>
                        {/* USER IS LOGGED OUT */}
                        <span className="flex" id="myNavbar">
                            <a href="https://flowbite.com" class="flex items-center pl-2.5 mb-5">
                                <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                                <span class="self-center text-xl font-semibold whitespace-nowrap">Codeflex</span>
                            </a>
                        </span>
                    </div >
                }
            </div>
        </nav>
    );


}

export default NavBar