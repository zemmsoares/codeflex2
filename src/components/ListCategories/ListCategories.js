import React, { useEffect, useState, Component } from 'react'
import { getAuthorization, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils';
import { Link } from 'react-router-dom';
import { URL } from '../commons/Constants';
import PathLink from '../PathLink/PathLink';

class ListCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        }

    }


    componentDidMount() {
        fetch(URL + '/api/database/PractiseCategory/listwithstats/' + parseLocalJwt().username, {
            headers: {
                ...getAuthorization()
            }
        }).then(res => res.json()).then(data => {
            this.setState({ categories: data })
            console.log(this.state.categories);
        })
    }

    onChange(newValue) {
        console.log(newValue);
    }

    render() {
        return (
            <div className="">
                <div className="flex flex-col sm:flex-row">

                    {this.state.categories.length > 0 && this.state.categories.map((category, index) => (
                        <div key={category.id} className="bg-gray-100 p-10 border border-solid border-blue-600 w-full sm:1/2">
                            <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '24pt' }}>{category.name}</h2>
                            <div className="progress-bar">
                                <div className="h-2 bg-red-800" style={{ width: (category.finishedProblems / category.totalProblems * 100) + '%' }}></div>
                                <p className="p-small-text">You have completed {category.finishedProblems} ({(category.finishedProblems / category.totalProblems * 100).toFixed(2)}%) out of the {category.totalProblems} available problems.</p>
                            </div>
                            <div className="pt-2">
                                <Link to={{ pathname: "/practise/" + textToLowerCaseNoSpaces(category.name), state: { categoryId: category.id } }}><input type="submit" className="px-2 py-1  border border-amber-400" value="Explore problems" /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ListCategories;
