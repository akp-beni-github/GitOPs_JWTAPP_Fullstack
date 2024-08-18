import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie'; // Import js-cookie

const Root = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [logoutSuccess, setLogoutSuccess] = useState(false);
    const [tokenRequestSuccess, setTokenRequestSuccess] = useState(false);
    const [testData, setTestData] = useState(null);
    //const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const api = axios.create({
        //baseURL: 'http://localhost:3001' // Base URL for all requests for the version control
        //baseURL: '/api' //for the version control
        baseURL: 'http://backend-service.jwt-app:3001' //set by cloudmap service discovery 
        
      });

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = api.post('/api/auth/signup', formData);
            console.log('Signup response:', response.data);
            if (response.data) {
                console.log('User signed up successfully');
                setSignupSuccess(true);
            } else {
                setError(response.data || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/login', formData, {
                withCredentials: true  // Include credentials with the request
            });
            console.log('Login response:', response.data);
            if (response.data) {
                console.log('logged in (check the cookie 🍪)');
                setLoginSuccess(true);

                // Store tokens in cookies
                // Cookies.set('accessToken', response.data.accessToken, { secure: true, sameSite: 'None' });
                // Cookies.set('refreshToken', response.data.refreshToken, { secure: true, sameSite: 'None' });

                
            } else {
                setError(response.data || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNewAccessToken = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/auth/token',  {
                withCredentials: true  // Include credentials with the request
            });
            
            if (response.status === 200) { // Check for a successful status code
                console.log('New access token received');
                console.log(process.env.BACKEND_URL);

                setTokenRequestSuccess(true);
            } else {
                setError('Failed to request new access token');
            }
        } catch (error) {
            console.error('Request new access token error:', error);
            setError('Error occurred during token refresh');
        } finally {
            setLoading(false);
        }
    };

    

    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            
            const response = await api.delete('/api/auth/logout', {
                withCredentials: true
            });
    
            if (response.status === 204) { // Check for status code 204 No Content
                console.log('Refresh token in the database is removed');
                console.log('User logged out successfully');
                setLogoutSuccess(true);

            } else {
                console.log('Refresh token in the database is not removed ');
            }
        } catch (error) {
            console.error('Logout error:', error.message);
            setError('Error occurred during logout: ' + error.message);
            
            
        } finally {
            setLoading(false);
            
        }
    };

    const handleTest = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/protected/test',  {
                withCredentials: true  // Include credentials with the request
            });
            if (response.status === 200) { // Check for status code 200 OK
                console.log('Test request successful:', response.data);
                setTestData(response.data); 
            } else {
                setError('Test request failed with status code: ' + response.status);
                
            }
        } catch (error) {
            console.error('Test request error:', error);
            console.log(process.env.BACKEND_URL)
            setError('Error occurred during test request');
        } finally {
            setLoading(false);
            
        }
    };

    return (
        <div>
            
            <h1>Authentication</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {signupSuccess && <p style={{ color: 'green' }}>Signup successful!</p>} {/* Render signup success message */}
            {loginSuccess && <p style={{ color: 'green' }}>Login successful!</p>}
            {logoutSuccess && <p style={{ color: 'green' }}>Logout successful!</p>}
            {tokenRequestSuccess && <p style={{ color: 'green' }}>Token request successful!</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2>Signup</h2>
                    <form onSubmit={handleSignup}>
                        <input
                            type="email"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Signup</button>
                    </form>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Login</button>
                    </form>

                    <button onClick={handleTest}>Test Protected API Endpoint</button>
                    <br></br>

                    <button onClick={handleRequestNewAccessToken}>Request New Access Token</button>
                    <br></br>
                    
                    <button onClick={handleLogout}>Logout</button>
                    
                {/* Render test data if available */}
                {testData && (
                    <div>
                        <h2>Test Data</h2>
                        <pre>{JSON.stringify(testData, null, 2)}</pre>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default Root;