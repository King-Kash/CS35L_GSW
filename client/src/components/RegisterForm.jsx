import React, { useState } from 'react'
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:3000/users/signup',
                {name, email, password},
                {
                    withCredentials: true
                }
            )
            console.log('Registered user: ', response.data.user)
            navigate('/login')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || 'Sign Up Failed')
        }
    }

  return (
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
                <input type="password" name="password" placeholder='Password' required className='poppins-regular' value={password} onChange={e => setPassword(e.target.value)}/>
                <FaLock className='icon'/>
            </div>

            <button type="submit">Register</button>

            {error && <div className="poppins-regular" style={{paddingTop: '1rem'}} >{error}</div>}

            <div className='register-link'>
                <p className='poppins-regular'>Have an account? <a href="/login">Login</a></p>
            </div>
        </form>
    </div>
  )
}

export default RegisterForm;