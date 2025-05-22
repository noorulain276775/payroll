import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CAlert,
} from '@coreui/react';
import axios from 'axios';
import { BASE_URL } from '../../../config';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [alert, setAlert] = useState({ visible: false, message: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const token = localStorage.getItem('authToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setPasswordMismatchError(true);
      return;
    }

    // If passwords match, make the API call
    try {
      const response = await axios.post(
        `${BASE_URL}/users/change-password/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlert({ visible: true, message: 'Password changed successfully!', color: 'success' });
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setPasswordMismatchError(false); 

      setTimeout(() => {
        setAlert({ ...alert, visible: false });
      }, 10000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An error occurred while changing the password, please try again.';
      setAlert({ visible: true, message: errorMessage, color: 'danger' });
      setTimeout(() => {
        setAlert({ ...alert, visible: false });
      }, 10000);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <CContainer>
        <CCard className="shadow-sm">
          <CCardHeader className="bg-light text-black">
            <h4>Change Password</h4>
          </CCardHeader>
          <CCardBody>
            {alert.visible && (
              <CAlert
                color={alert.color}
                dismissible
                onClose={() => setAlert({ visible: false })}
              >
                {alert.message}
              </CAlert>
            )}
            {passwordMismatchError && (
              <CAlert color="danger" dismissible>
                New password and confirm password do not match.
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Current Password <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="Enter Your Current Password"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>New Password <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="Enter New Password"
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Confirm New Password <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                    />{' '}
                    Show Password
                  </label>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="text-center">
                  <CButton
                    type="submit"
                    color="primary"
                    className="px-5"
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default ChangePassword;
