import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await login(email, password)
        if (success) {
            navigate('/')
        }
    }
    
    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Welcome to NurseAid</h3>

            <label>Email address:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
            />

            <button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Log In'}</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Login