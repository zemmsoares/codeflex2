import React, { Component } from 'react'

import codeflexLogo from '../images/logo.svg'

export class PageNotFound extends Component {
    render() {
        return (
            <div className='bg-blue-900 h-screen'>
                <div className='flex  justify-center'>
                    <a href="/" class="flex items-center pl-2 mb-5">
                        <img src={codeflexLogo} class="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Codeflex</span>
                    </a>
                </div>
                <div className='flex justify-center text-blue-500'>
                    <h1 className='text-9xl font-bold'>404</h1>
                </div>


            </div>
        )
    }
}

export default PageNotFound