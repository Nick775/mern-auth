import React, {useState} from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import {authenticate, isAuth} from './helpres'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const Signin = ({history}) => {
    const [values, setValues] = useState({
        email: 'hhwork58@gmail.com',
        password: '12345',
        buttonText: 'Submit'
    })

    const {email, password, buttonText} = values;

    const handleChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    } 

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: {email, password}
        })
        .then(res => {
            console.log('SIGNIN SUCCESS', res)
            authenticate(response, () => {
                setValues({...values, name: '', email: '', password: '', buttonText: 'Submited'})
                toast.success(`Hey ${res.data.user.name}, Welcome back!`)
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
            })

        })
        .catch(err => {
            console.log('SIGNIN ERROR', err.res.data)
            setValues({...values, buttonText: 'Submit'})
            toast.error(err.res.data.err)
        })
    }

    const signinForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className='form-control'/>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className='form-control'/>
            </div>
            <div>
                <button className='btn btn-primary' onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )

    return <Layout>
        <div className='col-d-6 offset-md-3'>
          <ToastContainer />
          {isAuth() ? <Redirect to="/"/> : null}
          <h1 className='p-5 text-center'>Signin</h1>
          {signinForm()}        
        </div>
    </Layout>
}

export default Signin;









