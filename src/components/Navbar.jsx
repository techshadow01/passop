import React from 'react'
import './Navbar.css'
import logo from './github.svg'

const Navbar = () => {
    return (
        <nav>
            <div className='tfont'>
                <span className='text-green-500'>&#60;</span>
                <span className='text-white'>Pass</span>
                <span className='text-green-500'>OP/&gt;</span>
            </div>

            <button id='gitbtn' className='flex items-center justify-center gap-1'><img src={logo} alt="" />Github</button>
        </nav>
    )
}

export default Navbar
