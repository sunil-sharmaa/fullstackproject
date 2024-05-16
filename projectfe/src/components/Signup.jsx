import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [userdata, setUserdata] = useState([])
    const [dataerror, setDataerror] = useState({})
    const [dataobj, setDataobj] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    function handlechange(e) {
        setDataobj({ ...dataobj, [e.target.name]: e.target.value })
    }

    async function handlesubmit() {
        if (verify()) {

            try {
                if (comparedata()) {
                    console.log('aage bdha h')
                    let senddata = await axios.post('http://localhost:5600/api/user/signup', dataobj, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                    localStorage.setItem('token', senddata.data)

                    setDataobj({
                        name: '',
                        email: '',
                        password: ''
                    })
                    navigate('/homepage')
                }

            }
            catch (error) {
                console.log('error:', error)
            }
        }
    }

    function comparedata() {
        let accounterr = {};
        for (let e of userdata) {
            if (e.email === dataobj.email) {
                accounterr.error = 'You have already created account on this mail'
                setDataerror(accounterr)
                return false
            }
        }
        return true;
    }

    let emailRejex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let passwordRejex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    function verify() {
        let check = true;
        let objerror = {}

        if (dataobj.name.length === 0) {
            check = false;
            objerror.name = "*Please enter your name"
        }

        else if (dataobj.name.length < 3) {
            check = false;
            objerror.name = "Name must have 3 chrecters"
        }

        if (dataobj.email.length === 0) {
            check = false;
            objerror.email = "*Please enter your email"
        }
        else if (!emailRejex.test(dataobj.email)) {
            check = false;
            objerror.email = "*Enter valid email"
        }
        if (dataobj.password.length < 5) {
            check = false;
            objerror.password = "*Please Enter min. 5 charecter password"
        }
        else if (!passwordRejex.test(dataobj.password)) {
            check = false;
            objerror.password = "*Enter strong password"
        }
        setDataerror(objerror);
        return check;
    }

    function handlelogin() {
        navigate('/')
    }

    async function getdata() {
        let datarcv = await axios.get('http://localhost:5600/api/userdata/data');
        setUserdata(datarcv.data)
    }
    useEffect(() => {
        getdata();
    }, [])

    return (
        <>
            <div className='container border border-warning rounded my-5 p-4 shadow-lg ' >
                <h1 className='text-center alert alert-warning'>Signup</h1>

                <div className=" mb-3">
                    <label htmlFor="exampleInputname" className="form-label"> Name </label>
                    <input type="text" className="form-control" id="exampleInputname" name='name' value={dataobj.name} onChange={handlechange} placeholder='enter your name '/>
                    {<p className='text-danger'>{dataerror.name}</p>}
                </div>

                <div className=" mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label"> Email address  </label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={dataobj.email} aria-describedby="emailHelp" onChange={handlechange} placeholder='enter your email '/>
                    {<p className='text-danger'>{dataerror.email}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label"> Password  </label>
                    <input type="text" className="form-control" id="exampleInputPassword1" name='password' value={dataobj.password} onChange={handlechange} placeholder='enter your password '/>
                    {<p className='text-danger'>{dataerror.password}</p>}
                </div>
                {<p className='text-danger' >{dataerror.error}</p>}
                <div className='w-100 text-center d-flex flex-column  gap-3 justify-content-center align-items-center '>
                    <button type="submit" className="btn btn-warning w-25" onClick={handlesubmit}>Submit</button>
                    <button className="btn btn-primary w-50" onClick={handlelogin}>Login</button>
                </div>
            </div>
        </>

    )
}

export default Signup

// {
//     let senddata = await axios.post('http://localhost:5600/api/user/signup', dataobj, {
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })

//     localStorage.setItem('token', senddata.data)

//     setDataobj({
//         name: '',
//         email: '',
//         password: ''
//     })
//     navigate('/homepage')
// }