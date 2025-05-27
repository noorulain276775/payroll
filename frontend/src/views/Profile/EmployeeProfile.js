import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CAlert,
  CButton,
  CFormSelect
} from '@coreui/react';

// Constants for file validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_PDF_TYPES = ['application/pdf'];


const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [emiratesIdPreview, setEmiratesIdPreview] = useState(null);
  const [passportIdPreview, setPassportIdPreview] = useState(null);
  const [visaPreview, setVisaPreview] = useState(null);
  const [highestDegreeCertificatePreview, sethighestDegreeCertificatePreview] = useState(null);
  const [insuranceCardPreview, setInsuranceCardPreview] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
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
        const {
          first_name, last_name, date_of_birth, place_of_birth, nationality,
          gender, marital_status, spouse_name, father_name, mother_name,
          phone_number, company_phone_number, home_town_number,
          email, personal_email, joining_date, address,
          emergency_contact_name, emergency_contact_number, emergency_contact_relation,
          emirates_id, passport_no, qualification, visa_no,
          designation, department, previous_company_name, previous_company_designation
        } = response.data;

        setFormData({
          first_name, last_name, date_of_birth, place_of_birth, nationality,
          gender, marital_status, spouse_name, father_name, mother_name,
          phone_number, company_phone_number, home_town_number,
          email, personal_email, joining_date, address,
          emergency_contact_name, emergency_contact_number, emergency_contact_relation,
          emirates_id, passport_no, qualification, visa_no,
          designation, department, previous_company_name, previous_company_designation
        });
        if (response.data.photo) {
          setPhotoPreview(`${BASE_URL}${response.data.photo}`);
        }
        if (response.data.emirates_id_image) {
          setEmiratesIdPreview(`${BASE_URL}${response.data.emirates_id_image}`);
        }
        if (response.data.passport_image) {
          setPassportIdPreview(`${BASE_URL}${response.data.passport_image}`);
        }
        if (response.data.visa_image) {
          setVisaPreview(`${BASE_URL}${response.data.visa_image}`);
        }
        if (response.data.highest_degree_certificate) {
          sethighestDegreeCertificatePreview(`${BASE_URL}${response.data.highest_degree_certificate}`);
        }
        if (response.data.insurance_card) {
          setInsuranceCardPreview(`${BASE_URL}${response.data.insurance_card}`);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_type');
          window.location.href = '/'
        }
      });
  }, [navigate, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(employee);
    setPhotoPreview(`${BASE_URL}${employee.photo}`);
    setEmiratesIdPreview(`${BASE_URL}${employee.emirates_id_image}`);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setAlertVisible(true);
        setAlertMessage(`${name.replace(/_/g, ' ')} is too large. Max allowed size is ${maxSizeInMB}MB.`);
        setAlertColor('danger');
        setTimeout(() => {
          setAlertVisible(false);
        }, 5000);
        e.target.value = null;
        return;
      }

      // Validate file types
      if (name === "photo" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed for profile photo.");
        return;
      } else if (
        ["emirates_id_image", "passport_image", "visa_image", "highest_degree_certificate", "insurance_card"].includes(name) &&
        !ALLOWED_PDF_TYPES.includes(file.type)
      ) {
        alert(`Only PDF files are allowed for ${name.replaceAll("_", " ")}.`);
        return;
      }

      // Set actual File object in formData
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Update preview
      const previewUrl = URL.createObjectURL(file);
      switch (name) {
        case "photo":
          setPhotoPreview(previewUrl);
          break;
        case "emirates_id_image":
          setEmiratesIdPreview(previewUrl);
          break;
        case "passport_image":
          setPassportIdPreview(previewUrl);
          break;
        case "visa_image":
          setVisaPreview(previewUrl);
          break;
        case "highest_degree_certificate":
          sethighestDegreeCertificatePreview(previewUrl);
          break;
        case "insurance_card":
          setInsuranceCardPreview(previewUrl);
          break;
        default:
          break;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File || typeof value === "string") {
        data.append(key, value);
      }
    });

    try {
      const response = await axios.put(`${BASE_URL}/employee/update/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployee(response.data);
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setAlertVisible(true);
      setAlertMessage("Profile updated successfully!");
      setAlertColor('success');
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating employee:", error.response?.data || error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setAlertVisible(true);
      setAlertMessage("Error updating profile. Please try again.");
      setAlertColor('danger');
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user_type');
        window.location.href = '/'
      }
    }
  };



  if (!employee || employee.length === 0) {
    return (
      <CRow className="justify-content-center mt-5">
        <CCol xs={12} md={8} lg={6}>
          <CAlert color="warning" className="text-center p-4">
            <h5 className="fw-bold">Employee Profile Not Found</h5>
            <p>Your employee profile has not been created by the Admin yet.</p>
            <p>Please contact the Admin for assistance.</p>
          </CAlert>
        </CCol>
      </CRow>
    );
  }
  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>Employee Information</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="mt-3">
              {alertVisible && (
                <CAlert color={alertColor} onClose={() => setAlertVisible(false)} dismissible>
                  {alertMessage}
                </CAlert>
              )}
            </div>
            {/* Personal Information Section */}
            <div className="section-header">
              <h5>Personal Information</h5>
            </div>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="first_name">First Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="last_name">Last Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="personal_email">Personal Email</CFormLabel>
                <CFormInput
                  type="text"
                  id="personal_email"
                  name="personal_email"
                  value={formData.personal_email || ''}
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
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="date_of_birth">Date of birth</CFormLabel>
                <CFormInput
                  type="text"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="place_of_birth">Place of Birth</CFormLabel>
                <CFormInput
                  type="text"
                  id="place_of_birth"
                  name="place_of_birth"
                  value={formData.place_of_birth || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="nationality">Nationality</CFormLabel>
                <CFormInput
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="address">Current Address</CFormLabel>
                <CFormInput
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="marital_status">Marital Status</CFormLabel>
                <CFormSelect
                  id="marital_status"
                  name="marital_status"
                  value={formData.marital_status || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="spouse_name">Spouse Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="spouse_name"
                  name="spouse_name"
                  value={formData.spouse_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="gender">Gender</CFormLabel>
                <CFormSelect
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="children">Children</CFormLabel>
                <CFormInput
                  type="number"
                  id="children"
                  name="children"
                  value={formData.children || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="father_name">Father name</CFormLabel>
                <CFormInput
                  type="text"
                  id="father_name"
                  name="father_name"
                  value={formData.father_name || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="mother_name">Mother Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="mother_name"
                  name="mother_name"
                  value={formData.mother_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="pasport_no">Passport no:</CFormLabel>
                <CFormInput
                  type="text"
                  id="pasport_no"
                  name="pasport_no"
                  value={formData.pasport_no || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="qualification">Highest Qualification</CFormLabel>
                <CFormInput
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            {/* Photo and passport Upload Section */}
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="photo">Profile Photo</CFormLabel>
                <CFormInput
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img src={photoPreview} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={6}>

                <CFormLabel htmlFor="passport_image">Passport Document (PDF)</CFormLabel>
                <CFormInput
                  type="file"
                  id="passport_image"
                  name="passport_image"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {passportIdPreview && (
                  <div className="mt-2">
                    <a href={passportIdPreview} target="_blank" rel="noopener noreferrer">View Passport ID PDF</a>
                  </div>
                )}

              </CCol>
            </CRow>

            {/* Company Information Section */}
            <div className="section-header mt-4">
              <h5>Company Information</h5>
            </div>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="email">Company Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="company_phone_number">Company Phone Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="company_phone_number"
                  name="company_phone_number"
                  value={formData.company_phone_number || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  value={formData.designation || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="department">Department</CFormLabel>
                <CFormInput
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="joining_date">Date of Joining</CFormLabel>
                <CFormInput
                  type="text"
                  id="joining_date"
                  name="joining_date"
                  value={formData.joining_date || ''}
                  onChange={handleChange}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="insurance_expiry_date">Insurance Expiry Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="insurance_expiry_date"
                  name="insurance_expiry_date"
                  value={formData.insurance_expiry_date || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emirates_id">Emirates Id number</CFormLabel>
                <CFormInput
                  type="text"
                  id="emirates_id"
                  name="emirates_id"
                  value={formData.emirates_id || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emirates_id_expiry">Emirates ID Expiry Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="emirates_id_expiry"
                  name="emirates_id_expiry"
                  value={formData.emirates_id_expiry || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="visa_no">Visa number</CFormLabel>
                <CFormInput
                  type="text"
                  visa_
                  name="visa_no"
                  value={formData.visa_no || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="visa_expiry">Visa Expiry Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="visa_expiry"
                  name="visa_expiry"
                  value={formData.visa_expiry || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="previous_company_name">Previous Company Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="previous_company_name"
                  name="previous_company_name"
                  value={formData.previous_company_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="previous_company_designation">Previous Company Designation</CFormLabel>
                <CFormInput
                  type="text"
                  id="previous_company_designation"
                  name="previous_company_designation"
                  value={formData.previous_company_designation || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <div className="section-header mt-4">
              <h5>Documents Upload</h5>
            </div>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emirates_id_image">Emirates ID Image (PDF)</CFormLabel>
                <CFormInput
                  type="file"
                  id="emirates_id_image"
                  name="emirates_id_image"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {emiratesIdPreview && (
                  <div className="mt-2">
                    <a href={emiratesIdPreview} target="_blank" rel="noopener noreferrer">View Emirates ID</a>
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="visa_image">Visa Document (PDF)</CFormLabel>
                <CFormInput
                  type="file"
                  id="visa_image"
                  name="visa_image"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {visaPreview && (
                  <div className="mt-2">
                    <a href={visaPreview} target="_blank" rel="noopener noreferrer">View Visa Document</a>
                  </div>
                )}
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emirates_id_image">Highest Degree Certificate (PDF)</CFormLabel>
                <CFormInput
                  type="file"
                  id="highest_degree_certificate"
                  name="highest_degree_certificate"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {highestDegreeCertificatePreview && (
                  <div className="mt-2">
                    <a href={highestDegreeCertificatePreview} target="_blank" rel="noopener noreferrer">View Highest Degree</a>
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="visa_image">Insurance Card (PDF)</CFormLabel>
                <CFormInput
                  type="file"
                  id="insurance_card"
                  name="insurance_card"
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {insuranceCardPreview && (
                  <div className="mt-2">
                    <a href={insuranceCardPreview} target="_blank" rel="noopener noreferrer">View Insurance Card</a>
                  </div>
                )}
              </CCol>
            </CRow>


            {/* Emergency Contact Section */}
            <div className="section-header mt-4">
              <h5>Emergency Contact Information</h5>
            </div>
            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emergency_contact_name">Emergency Contact Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emergency_contact_number">Emergency Contact Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="emergency_contact_number"
                  name="emergency_contact_number"
                  value={formData.emergency_contact_number || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emergency_contact_relation">Emergency Contact Relation</CFormLabel>
                <CFormInput
                  type="text"
                  id="emergency_contact_relation"
                  name="emergency_contact_relation"
                  value={formData.emergency_contact_relation || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol>
              {/* <CCol xs={12} md={6}>
                <CFormLabel htmlFor="emergency_contact_number">Blood Group</CFormLabel>
                <CFormInput
                  type="text"
                  id="emergency_contact_number"
                  name="emergency_contact_number"
                  value={formData.emergency_contact_number || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CCol> */}
            </CRow>



            {/* Save/Cancel Button */}
            <div className="mt-4">
              {isEditing ? (
                <CButton color="primary" onClick={handleSubmit}>
                  Save Changes
                </CButton>
              ) : (
                <CButton color="primary" variant="outline" onClick={handleEdit}>
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
