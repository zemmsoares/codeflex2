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
        <div className="">
            <PathLink path={location.pathname} title="Categories" />
            <div className="flex flex-col sm:flex-row">

                {categories.length > 0 && categories.map((category, index) => (
                    <div key={category.id} className="bg-gray-50 p-10 rounded-lg w-full border">
                        <span class="flex items-center text-base font-normal text-gray-900 rounded-lg">
                            <span class="flex-1 whitespace-nowrap font-bold text-xl">{category.name}</span>
                        </span>
                        <div className="">
                            {/*<div className="h-2 bg-red-800" style={{ width: (category.finishedProblems / category.totalProblems * 100) + '%' }}></div>*/}
                            <div className="h-2 bg-blue-500 my-2" style={{ width: (75) + '%' }}></div>
                            <p className="p-small-text">You have completed {category.finishedProblems} ({(category.finishedProblems / category.totalProblems * 100).toFixed(2)}%) out of the {category.totalProblems} available problems.</p>
                        </div>
                        <div className="pt-2">
                            <Link to={{
                                pathname: "/practise/" + textToLowerCaseNoSpaces(category.name),
                                state: { categoryId: category.id }
                            }}><input type="submit" className="px-2 py-1 border rounded-sm  border-solid border-blue-600"
                                value="Explore problems" /></Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListCategories