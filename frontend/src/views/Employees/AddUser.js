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
  CFormSelect,
  CAlert,
} from '@coreui/react';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '../../config';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    user_type: 'Employee',
  });
  const [alert, setAlert] = useState({ visible: false, message: '', color: '' });

  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.REGISTER}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlert({ visible: true, message: 'User added successfully!', color: 'success' });
      setFormData({
        username: '',
        password: '',
        confirm_password: '',
        user_type: 'Employee',
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An error occurred while adding the user.';
      setAlert({ visible: true, message: errorMessage, color: 'danger' });
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <CContainer className='mt-2 mb-2'>
        <CCard className="shadow-sm">
          <CCardHeader className="bg-light text-black">
            <h4>Register User</h4>
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
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Username <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>User Role <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormSelect
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                    <option value="Both">Both</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Password <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Confirm Password <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol className="text-center">
                  <CButton type="submit" color="primary" className="px-5">
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

export default AddUser;
