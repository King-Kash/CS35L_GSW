import React, { useContext, useState } from 'react'
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { checkAuth } = useContext(AuthContext);

    const handleSumbit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:3000/users/login',
                {email, password},
                {
                    withCredentials: true
                }
            );
            const reps2 = await axios.get(
                'http://localhost:3000/api/auth/status',
                {
                    withCredentials: true
                }
            )
            if (reps2.status == 200) {
                console.log('Logged in user:', reps2.data)
            }
            else {
                console.warn('Login succeedd but /api/auth/status said unauthenticated.')
            }
            await checkAuth()
            navigate('/')
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Login failed');
        }
    }

  return (
    <div className='wrapper'>
        <form onSubmit={handleSumbit}>
            <h1 className='poppins-bold'>Login</h1>
            <div className='input-box'>
                <input type="text" name="email" placeholder='Email' required className='poppins-regular' value={email} onChange={e => setEmail(e.target.value)}/>
                <FaUser className='icon'/>
            </div>
            <div className='input-box'>
                <input type="password" name="password" placeholder='Password' required className='poppins-regular' value={password} onChange={e => setPassword(e.target.value)}/>
                <FaLock className='icon'/>
            </div>

            <button type="submit">Login</button>

            {error && <div className="poppins-regular" style={{paddingTop: '1rem'}}>{error}</div>}


            <div className='register-link'>
                <p className='poppins-regular'>Don't have an account? <a href="/register">Register</a></p>
            </div>
        </form>
    </div>
  )
}

export default LoginForm;