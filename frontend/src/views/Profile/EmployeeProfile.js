import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormTextarea
} from '@coreui/react';

const BASE_URL = 'http://127.0.0.1:8000'; // Base URL for your Django API

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    axios
      .get(`${BASE_URL}/employee/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployee(response.data);
        setFormData(response.data); // Set initial form data
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      });
  }, [navigate, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(employee); // Reset to initial data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${BASE_URL}/employee/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setEmployee(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>Employee Personal Information</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="first_name">First Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="last_name">Last Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="email">Company Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormTextarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="department">Department</CFormLabel>
                <CFormInput
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="designation">Designation</CFormLabel>
                <CFormInput
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
            </CRow>
            <div className="mt-4">
              {isEditing ? (
                <CButton color="primary" onClick={handleSubmit}>
                  Save Changes
                </CButton>
              ) : (
                <CButton color="dark" onClick={handleEdit}>
                  Edit Profile
                </CButton>
              )}
              {isEditing && (
                <CButton color="secondary" onClick={handleCancel} className="ms-2">
                  Cancel
                </CButton>
              )}
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EmployeeProfile;
