import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet
  } from "react-router-dom";
import App from './App'
import Signup from './auth/Signup'
import Signin from './auth/Signin'
import Activate from './auth/Activate'
import Private from './core/Private'
import Admin from './core/Admin'
import PrivateRoute from './auth/PrivateROute'
import AdminRoute from './auth/AdminRoute';

const Router = () => {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/signup" exact element={<Signup/>} />
        <Route path="/signin" exact element={<Signin/>} />
        <Route path="auth/activate/:token" exact element={<Activate/>} />
        <PrivateRoute path="/private" exact element={<Private/>}/>
        <AdminRoute path="/admin" exact element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
    )
}

export default Router;













