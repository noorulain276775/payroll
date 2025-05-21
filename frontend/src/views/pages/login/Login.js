import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { BASE_URL } from '../../../../config'
import logo from 'src/assets/brand/logo.png' // Adjust this path as needed

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${BASE_URL}/users/login/`, {
        username,
        password,
      })
      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        localStorage.setItem('user_type', response.data.user_type)
        localStorage.setItem('logged_in_status', JSON.stringify(true))
        if (response.data.user_type === 'Admin') {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/employee-dashboard'
        }
      }
    } catch (error) {
      setError('Invalid credentials or server error')
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem',
      }}
    >

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard
                className="p-4 shadow-lg"
                style={{ borderRadius: '12px', backgroundColor: 'white' }}
              >
                <CCardBody>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',  // vertically center the image
                      height: '30px',        // fixed height to reduce extra space
                      marginBottom: '0.5rem' // less bottom margin
                    }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
                    />
                  </div>

                  <CForm onSubmit={handleLogin}>
                    <h1 className="mb-3" style={{ fontWeight: '700', color: '#333' }}>
                      Login
                    </h1>
                    <p className="text-muted mb-4">Sign In to your account</p>

                    <CInputGroup className="mb-3 shadow-sm">
                      <CInputGroupText style={{ backgroundColor: '#f0f0f0' }}>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ boxShadow: 'none' }}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-2 shadow-sm">
                      <CInputGroupText style={{ backgroundColor: '#f0f0f0' }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ boxShadow: 'none' }}
                      />
                    </CInputGroup>

                    <CRow className="mb-3">
                      <CCol>
                        <label
                          style={{ userSelect: 'none', fontSize: '0.9rem', color: '#555' }}
                        >
                          <input
                            type="checkbox"
                            onChange={() => setShowPassword(!showPassword)}
                            style={{ marginRight: '8px' }}
                          />
                          Show Password
                        </label>
                      </CCol>
                    </CRow>

                    {error && (
                      <p className="text-danger mb-3" style={{ fontWeight: '600' }}>
                        {error}
                      </p>
                    )}

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          style={{
                            fontWeight: '600',
                            borderRadius: '8px',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Login
                        </CButton>
                      </CCol>
                      {/* Uncomment if forgot password is needed */}
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
