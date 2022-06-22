import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getAuthorization, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';
import { URL } from '../commons/Constants';

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
        <div>
            <PathLink path={location.pathname} title="Practise by solving exercices" />
            <div>



                <div id="main" class="grid sm:grid-col-1 md:grid-cols-2 xl:grid-cols-3 justify-evenly p-4 gap-1">
                    <div class="w-26 h-32">
                        <div className='w-full h-full rounded-lg bg-cyan-400'>
                            <p>dqwdqw</p>
                        </div>
                    </div>
                    <div class="bg-green-500 w-26 h-12">2</div>
                    <div class="bg-green-300 w-26 h-12">3</div>
                    <div class="bg-green-700 w-26 h-12">4</div>
                    <div class="bg-green-500 w-26 h-12">5</div>
                    <div class="bg-green-300 w-26 h-12">6</div>
                </div>



            </div>
        </div>
    )
}

export default ListCategories