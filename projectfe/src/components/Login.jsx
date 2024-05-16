import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [userdata, setUserdata] = useState([])
    const [dataerror, setDataerror] = useState({})
    const [dataobj, setDataobj] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    function handlechange(e) {
        setDataobj({ ...dataobj, [e.target.name]: e.target.value })
    }

    async function handlesubmit() {
        if (verify()) {
            if(checkemail()){
                try{
                let senddata = await axios.post('http://localhost:5600/api/user/login', dataobj, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                localStorage.setItem('token', senddata.data)
    
                setDataobj({
                    email: '',
                    password: ''
                })
                navigate('/homepage')
            }catch{
                let passworderr = {}
                passworderr.password = "*Enter correct password";
                setDataerror(passworderr);
            }
            }
        }
    }
    function checkemail(){
        let dataerr = {}
        for(let e of userdata){
            if(e.email === dataobj.email){
                return true;
                // if(e.password === dataobj.password){
                //     return true;
                // }
                // else{
                //     dataerr.password = "*Enter correct password";
                //     setDataerror(dataerr);
                //     return false;
                // }
            }
        }
        dataerr.email = "*Please create your account";
        setDataerror(dataerr);
        return false;
    }

    let emailRejex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let passwordRejex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    function verify() {
        let check = true;
        let objerror = {}
        if (dataobj.email.length === 0) {
            check = false;
            objerror.email = "*please enter your email"
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

    function handlesignup() {
        navigate('/signuppage')
    }

    async function getdata() {
        const datarcv = await axios.get('http://localhost:5600/api/userdata/data');
        setUserdata(datarcv.data)
    }
    useEffect(() => {
        getdata();
    }, [])

    return (
        <>
            <div className='container border shadow-lg  border-primary rounded my-5 p-4 '>
                <h1 className='text-center alert alert-primary'>Login</h1>

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

                <div className='w-100 text-center d-flex flex-column align-items-center gap-3'>
                    <button type="submit" className="btn btn-primary w-25 px-2" onClick={handlesubmit}>Submit</button>
                    <button type="submit" className="btn btn-warning w-50" onClick={handlesignup}>Create account ?</button>
                </div>

            </div>
        </>
    )
}

export default Login
