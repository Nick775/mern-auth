import React, {useState, useEffect} from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const Activate = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true
    });

    useEffect(() => {
       let token = match.params.token;
       let {name} = jwt.decode(token)

       if(token) {
         setValues({...values, name, token})
       }
    }, [])


    const { name, token, show } = values;

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
        .then(res => {
            console.log('ACCOUNT ACTIVATION', res)
            setValues({...values, show: false})
            toast.success(res.data.message)
        })
        .catch(err => {
            console.log('ACCOUNT ACTIVATION ERROR', err.res.data.error)
            toast.error(err.res.data.err)
        })
    }

    const activationLink = () => (
        <div>
          <h1 className='p-5 text-center'>Ready to activate account</h1>
          <button className='btn btn-outline-primary' onClick={clickSubmit}>Activate account</button>            
        </div>
    )

    return <Layout>
        <div className='col-d-6 offset-md-3'>
          <ToastContainer />    
          {activationLink()}        
        </div>
    </Layout>
}

export default Activate


