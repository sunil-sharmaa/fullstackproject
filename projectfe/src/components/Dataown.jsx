import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'

const Dataown = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signuppage' element={<Signup />} />
                <Route path='/homepage' element={<Home />} />
            </Routes>
        </>
    )
}

export default Dataown

//1.tag k andr bydefault value nhi aa rhi 
