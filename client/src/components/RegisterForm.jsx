import React, { useState, useContext } from 'react'
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { checkAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                API_URL + '/users/signup',
                {name, email, password},
                {
                    withCredentials: true
                }
            )
            console.log('Registered user: ', response.data.user)
            const reps2 = await axios.get(
                API_URL + '/api/auth/status',
                {
                    withCredentials: true
                }
            )
            if (reps2.status == 200) {
                console.log('Logged in user:', reps2.data)
            }
            await checkAuth()
            navigate('/')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || 'Sign Up Failed')
        }
    }

  return (
    <div className='login-page'>
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1 className='poppins-bold'>Register</h1>

                <div className='input-box'>
                    <input type="text" name="name" placeholder='Name' required className='poppins-regular' value={name} onChange={e => setName(e.target.value)}/>
                    <FaUser className='icon'/>
                </div>
                <div className='input-box'>
                    <input type="text" name="email" placeholder='Email' required className='poppins-regular' value={email} onChange={e => setEmail(e.target.value)}/>
                    <FaUser className='icon'/>
                </div>
                <div className='input-box'>
                    <input type="text" name="password" placeholder='Password' required className='poppins-regular' value={password} onChange={e => setPassword(e.target.value)}/>
                    <FaLock className='icon'/>
                </div>

                <button type="submit">Register</button>

                {error && <div className="poppins-regular" style={{paddingTop: '1rem'}} >{error}</div>}

                <div className='register-link'>
                    <p className='poppins-regular'>Have an account? <a href="/login">Login</a></p>
                </div>
                <div className='register-link'>
                    <p className='poppins-regular'>Return to <a href="/">Home</a></p>
                </div>
            </form>
        </div>     
    </div>
  )
}

export default RegisterForm;