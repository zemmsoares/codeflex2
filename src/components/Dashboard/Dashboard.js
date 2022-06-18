import React from 'react'
import { parseLocalJwt } from '../commons/Utils'

function Dashboard() {

    return (
        <div>
            <div className='px-7 py-3'>
                <h1 className='font-bold text-xl'>Hello, {parseLocalJwt().username}</h1>
                <h2 className='font-medium text-sm text-gray-500'>Today is {new Date().toLocaleString() + ""}</h2>
            </div>

        </div>
    )
}

export default Dashboard