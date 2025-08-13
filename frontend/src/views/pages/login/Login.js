import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginUser, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUserType } from '../../../store/slices/authSlice'
import logo from 'src/assets/brand/logo.png'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const userType = useSelector(selectUserType)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = userType === 'Employee' ? '/employee-dashboard' : '/dashboard'
      navigate(redirectPath)
    }
  }, [isAuthenticated, userType, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      return
    }
    
    dispatch(loginUser({ username, password }))
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
          <CCol md={6}>
            <CCardGroup>
                              <CCard
                  className="p-4 shadow-lg login-form"
                  style={{ borderRadius: '12px', backgroundColor: 'white' }}
                >
                <CCardBody>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center', 
                      height: '50px',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
                    />
                  </div>

                  <CForm onSubmit={handleLogin}>
                    <h1 className="mb-4" style={{ fontWeight: '700', color: '#333', textAlign: 'center' }}>
                      Login
                    </h1>

                    {error && (
                      <CAlert color="danger" className="mb-3">
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-4">
                      <CInputGroupText style={{ minWidth: '45px', justifyContent: 'center' }}>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        required
                        style={{ flex: 1 }}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText style={{ minWidth: '45px', justifyContent: 'center' }}>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        style={{ flex: 1, width: '100%' }}
                      />
                      <CButton
                        type="button"
                        variant="outline"
                        color="secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        style={{ 
                          minWidth: '60px',
                          borderLeft: '1px solid #dee2e6',
                          borderRadius: '0 0.375rem 0.375rem 0',
                          flexShrink: 0
                        }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </CButton>
                    </CInputGroup>

                    <CButton
                      type="submit"
                      color="primary"
                      className="px-4 w-100 py-2"
                      disabled={isLoading || !username.trim() || !password.trim()}
                      style={{ 
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </CButton>
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
