import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import { isAuth, signout } from '../auth/helpers'

const Layout = ({children, match}) => {

    const isActive = path => {
      if(match.path === path) {
        return {color: '#000'}
      } else {
        return { color: '#fff'}
      }
    }

    return (
        <>
           <ul className="nav nav-tabs bg-primary">
              <li className='nav-item'>
                <Link to="/" className='text-light nav-link' style={isActive('/')}>
                    Home 
                </Link>
              </li>

              {!isAuth() && (
                <>
                <li className='nav-item'>
                  <Link to="/signup" className='text-light nav-link' style={isActive('/signup')}>
                    Signup
                  </Link>
                </li>  
                <li className='nav-item'>
                  <Link to="/signin" className='text-light nav-link' style={isActive('/signin')}>
                    Signin
                  </Link>
                 </li> 
                </>
              )}

              {isAuth() && isAuth().role === 'admin' && (
                <li>
                    <Link className='nav-link' style={isActive('/admin')} to="/admin">{isAuth().name}</Link>
                </li>
              )}

              {isAuth() && isAuth().role === 'subscriber' && (
                <li>
                    <Link className='nav-link' style={isActive('/private')} to="/private">{isAuth().name}</Link>
                </li>
              )}

              {isAuth() && (
                <li className='nav-item'>
                  <span
                    className="nav-link"
                    style={{cursor: 'pointer', color: '#fff'}}
                    onClick={() => {
                      history.push('/')
                    }}
                  >
                    Signout
                  </span>
                </li>
              )}
            </ul>
          <div className='container'>
            {children}
          </div>
        </>
    )
}

export default withRouter(Layout);














