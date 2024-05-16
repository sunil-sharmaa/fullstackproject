import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [tagdata, setTagdata] = useState(undefined)
    const [updateid, setUpdateid] = useState('')
    const [databasedata, setDatabasedata] = useState([])
    const [dataerror, setDataerror] = useState({})
    const [dataobj, setDataobj] = useState({
        title: '',
        description: '',
        tag: ''
    })

    function handlechange(e) {
        if (e.target.name === 'tag' && e.target.value.length === 0) {
            setDataobj({ ...dataobj, [e.target.name]: undefined });
        } else {
            setDataobj({ ...dataobj, [e.target.name]: e.target.value });
        }
    }
    

    const navigate = useNavigate()
    function handlelogout() {
        navigate('/')
    }

    async function handleclick() {
        if (verify()) {
            if(updateid)
            {
                let updatedata = await axios.put(`http://localhost:5600/api/notesdata/update/${updateid}`,dataobj,{
                    headers: {
                        "authentication": localStorage.getItem("token")
                    }
                })
            }
            else{
                let sendata = await axios.post('http://localhost:5600/api/notesdata/post', dataobj, {
                headers: {
                    "Content-Type": "application/json",
                    "authentication": localStorage.getItem("token")
                }
            })
            }
            setDataobj({
                title: '',
                description: '',
                tag:''
            })
            
            setUpdateid('')
        }
    }

    function verify() {
        let check = true;
        let dataerr = {};
        if (dataobj.title.length < 5) {
            check = false;
            dataerr.title = "Title must have 5 charecters"
        }
        if (dataobj.description.length < 10) {
            check = false;
            dataerr.description = "Description minimum have 10 charecters"
        }
        setDataerror(dataerr);
        return check;
    }

    async function storedata() {
        let data = await axios.get('http://localhost:5600/api/notesdata/get', {
            headers: {
                "authentication": localStorage.getItem("token")
            }
        })
        setDatabasedata(data.data)
    }
    useEffect(() => {
        storedata();
    }, [handleclick])

    async function handleDelete(e) {
        const deletedata = await axios.delete(`http://localhost:5600/api/notesdata/delete/${e}`, {
            headers: {
                "authentication": localStorage.getItem("token")
            }
        })
    }
    const titleInputRef = useRef(null);
    function handleUpdate(e) {
        titleInputRef.current.focus();
        setDataobj({
            title:e.title,
            description:e.description,
            tag:e.tag
        })
        setUpdateid(e._id)
    }

    return (
        <>
            <header className=' alert alert-danger sticky-top d-xl-flex justify-content-between text-center align-items-center  '>
                <h1 className='text-dark shadow-lg rounded border '>NOTES</h1>
                <h2 className='text-center text-light'>HEY ! MOST WELCOME HERE, MAKE YOUR DAILY NOTES</h2>
                <button className='btn btn-secondary' onClick={handlelogout}>Logout</button>
            </header>

            <section className='container border-bottom my-3 pt-5 rounded ' data-aos="fade-up" >
                <h1 className='bg-secondary text-white text-center p-2 rounded'>Create New Notes</h1>
                <div>
                    <div className=" mb-3">
                        <label htmlFor="title" className="form-label"> Enter Title</label>
                        <input type="email"  className="form-control" id="title" name='title' value={dataobj.title} aria-describedby="emailHelp" onChange={handlechange} maxLength={10} ref={titleInputRef}/>
                        {<p className='text-danger'>{dataerror.title}</p>}
                    </div>
                    <div className=" mb-3">
                        <label htmlFor="description" className="form-label"> Enter Description</label>
                        <input type="email" className="form-control" id="description" name='description' value={dataobj.description} aria-describedby="emailHelp" onChange={handlechange} maxLength={100} />
                        {<p className='text-danger'>{dataerror.description}</p>}
                    </div>
                    <div className=" mb-3">
                        <label htmlFor="tag" className="form-label"> Enter Tag</label>
                        <input type="email" className="form-control" id="tag" name='tag' value={dataobj.tag} aria-describedby="emailHelp" onChange={handlechange} maxLength={10} />
                    </div>
                </div>

                <button className='w-25 btn btn-primary shadow py-3 my-5 border d-block mx-auto' onClick={handleclick}>{updateid.length===0 ? "SUBMIT" : "UPDATE"}</button>

            </section>

            <div className='container'>
                <h1 className='text-success text-center my-5 d-flex align-items-center justify-content-center'>
                    <span className='text-dark mx-2'>My</span> Notes
                </h1>
                <div className='row d-flex justify-content-around my-2 gap-3'>
                    {databasedata.map((e, i) => {
                        return (
                            <div key={i} data-aos="flip-down" className='col-12 col-md-3 border-bottom border-info rounded text-center px-0 text-capitalize'>
                                <h1 className='bg-info w-100 rounded p-2 '>{e.title}</h1>
                                <p>{e.description}</p>
                                <p>{e.tag}</p>
                                <div className='d-flex justify-content-around my-2'>
                                    <button className='btn btn-warning' onClick={() => handleUpdate(e)}>Update</button>
                                    <button className='btn btn-danger' onClick={() => handleDelete(e._id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    )
}

export default Home
