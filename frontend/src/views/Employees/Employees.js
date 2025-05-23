import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../../config';
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput // Replacing CInput with CFormInput
} from '@coreui/react'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedemployeeid, setSelectedemployeeid] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editPreviewFiles, setEditPreviewFiles] = useState({
    photo: null,
    highest_degree_certificate: null,
    emirates_id_image: null,
    passport_image: null,
    visa_image: null,
    insurance_card: null,
  });
  const [editEmployee, setEditEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    nationality: '',
    date_of_birth: '',
    photo: '',
    place_of_birth: '',
    gender: '',
    marital_status: '',
    spouse_name: '',
    father_name: '',
    mother_name: '',
    home_town_number: '',
    address: '',
    company_phone_number: '',
    designation: '',
    department: '',
    previous_company_name: '',
    previous_company_designation: '',
    joining_date: '',
    personal_email: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    emergency_contact_relation: '',
    emirates_id: '',
    emirates_id_expiry: '',
    passport_no: '',
    qualification: '',
    visa_no: '',
    visa_expiry_date: '',
    insurance_expiry_date: '',
  })
  const navigate = useNavigate()
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    axios
      .get(`${BASE_URL}/view_all_employees/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployees(response.data)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken')
          window.location.reload();
          navigate('/')
        }
      })
  }, [navigate, token])

  const handleView = (employee) => {
    setSelectedEmployee(employee)
    setModalVisible(true)
  }

  const handleEdit = (employee) => {
    setEditEmployee({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone_number: employee.phone_number,
      nationality: employee.nationality,
      date_of_birth: employee.date_of_birth,
      place_of_birth: employee.place_of_birth,
      gender: employee.gender,
      marital_status: employee.marital_status,
      spouse_name: employee.spouse_name,
      father_name: employee.father_name,
      mother_name: employee.mother_name,
      home_town_number: employee.home_town_number,
      address: employee.address,
      company_phone_number: employee.company_phone_number,
      designation: employee.designation,
      department: employee.department,
      previous_company_name: employee.previous_company_name,
      previous_company_designation: employee.previous_company_designation,
      joining_date: employee.joining_date,
      personal_email: employee.personal_email,
      emergency_contact_name: employee.emergency_contact_name,
      emergency_contact_number: employee.emergency_contact_number,
      emergency_contact_relation: employee.emergency_contact_relation,
      emirates_id: employee.emirates_id,
      passport_no: employee.passport_no,
      qualification: employee.qualification,
      visa_no: employee.visa_no,
      visa_expiry_date: employee.visa_expiry_date,
      insurance_expiry_date: employee.insurance_expiry_date,
      emirates_id_expiry: employee.emirates_id_expiry,
    });
    setEditPreviewFiles({
      photo: employee.photo ? `${BASE_URL}${employee.photo}` : null,
      highest_degree_certificate: employee.highest_degree_certificate ? `${BASE_URL}${employee.highest_degree_certificate}` : null,
      emirates_id_image: employee.emirates_id_image ? `${BASE_URL}${employee.emirates_id_image}` : null,
      insurance_card: employee.insurance_card ? `${BASE_URL}${employee.insurance_card}` : null,
      visa_image: employee.visa_image ? `${BASE_URL}${employee.visa_image}` : null,
      passport_image: employee.passport_image ? `${BASE_URL}${employee.passport_image}` : null,
    });
    setSelectedEmployee(employee);
    setSelectedemployeeid(employee.id);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    if (!token) {
      navigate('/');
      return;
    }

    const formData = new FormData();
    for (const key in editEmployee) {
      if (editEmployee[key]) {
        formData.append(key, editEmployee[key]);
      }
    }

    axios
      .put(`${BASE_URL}/employee/${selectedemployeeid}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Update the employee list to reflect changes
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === selectedemployeeid ? { ...emp, ...response.data } : emp
          )
        );
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.error('Error updating employee:', error.response?.data || error.message);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      });
  };


  const getValue = (value) => value ? value : 'N/A'

  return (
    <CCard>
      <CCardHeader>
        <div className='mt-2 mb-2'>
          <h4>Employee Personal Information</h4>
        </div>
      </CCardHeader>
      <div>
        <CCardBody>

          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Photo</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>First Name</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Last Name</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Phone Number</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nationality</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {employees.length === 0 ? ( // Check if the employees array is empty
                <CTableRow>
                  <CTableDataCell colSpan="8" style={{ textAlign: 'center' }}>
                    No data available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                employees.map((employee) => (
                  <CTableRow key={employee.id}>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.id}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      {employee.photo ? (
                        <img
                          src={`${BASE_URL}${employee.photo}`}
                          alt="Employee Photo"
                          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                      ) : (
                        'N/A'
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.first_name}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.last_name}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.email}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.phone_number}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{employee.nationality}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <CDropdown>
                        <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleView(employee)}>View</CDropdownItem>
                          <CDropdownItem onClick={() => handleEdit(employee)}>Edit</CDropdownItem>
                          {/* <CDropdownItem onClick={() => handleDelete(employee.id)}>Delete</CDropdownItem> */}
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>

          </CTable>
        </CCardBody>

        {/* Edit Modal */}
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" centered>
          <CModalHeader>
            <CModalTitle>Edit Employee</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="gy-4">
              <CCol xs={12}>
                <h5>Basic Information</h5>
              </CCol>
              <CCol md={6}>
                <label>First Name</label>
                <CFormInput
                  value={editEmployee.first_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, first_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Last Name</label>
                <CFormInput
                  value={editEmployee.last_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, last_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Personal Email</label>
                <CFormInput
                  value={editEmployee.personal_email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, personal_email: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Phone Number</label>
                <CFormInput
                  value={editEmployee.phone_number}
                  onChange={(e) => setEditEmployee({ ...editEmployee, phone_number: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Nationality</label>
                <CFormInput
                  value={editEmployee.nationality}
                  onChange={(e) => setEditEmployee({ ...editEmployee, nationality: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Date of Birth</label>
                <CFormInput
                  type="date"
                  value={editEmployee.date_of_birth}
                  onChange={(e) => setEditEmployee({ ...editEmployee, date_of_birth: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Gender</label>
                <select
                  className="form-select"
                  value={editEmployee.gender}
                  onChange={(e) => setEditEmployee({ ...editEmployee, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </CCol>
              <CCol md={6}>
                <label>Marital Status</label>
                <select
                  className="form-select"
                  value={editEmployee.marital_status}
                  onChange={(e) => setEditEmployee({ ...editEmployee, marital_status: e.target.value })}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </select>
              </CCol>
              <CCol md={6}>
                <label>Place of birth</label>
                <CFormInput
                  value={editEmployee.place_of_birth}
                  onChange={(e) => setEditEmployee({ ...editEmployee, place_of_birth: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Spouse Name</label>
                <CFormInput
                  value={editEmployee.spouse_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, spouse_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Father Name</label>
                <CFormInput
                  value={editEmployee.father_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, father_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Mother Name</label>
                <CFormInput
                  value={editEmployee.mother_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, mother_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Home town number</label>
                <CFormInput
                  value={editEmployee.home_town_number}
                  onChange={(e) => setEditEmployee({ ...editEmployee, home_town_number: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Current Address</label>
                <CFormInput
                  value={editEmployee.address}
                  onChange={(e) => setEditEmployee({ ...editEmployee, address: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Highest Qualification</label>
                <CFormInput
                  value={editEmployee.qualification}
                  onChange={(e) => setEditEmployee({ ...editEmployee, qualification: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Passport No</label>
                <CFormInput
                  value={editEmployee.passport_no}
                  onChange={(e) => setEditEmployee({ ...editEmployee, passport_no: e.target.value })}
                />
              </CCol>
              <CCol xs={12}>
                <h5>Work Information</h5>
              </CCol>
              <CCol md={6}>
                <label>Department</label>
                <select
                  className="form-select"
                  value={editEmployee.department}
                  onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Operations">Operations</option>
                  <option value="IT">IT</option>
                </select>
              </CCol>
              <CCol md={6}>
                <label>Company Email</label>
                <CFormInput
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Company Phone Number</label>
                <CFormInput
                  value={editEmployee.company_phone_number}
                  onChange={(e) => setEditEmployee({ ...editEmployee, company_phone_number: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Designation</label>
                <CFormInput
                  value={editEmployee.designation}
                  onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Previous Company Name</label>
                <CFormInput
                  value={editEmployee.previous_company_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, previous_company_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Previous Company Designation</label>
                <CFormInput
                  value={editEmployee.previous_company_designation}
                  onChange={(e) => setEditEmployee({ ...editEmployee, previous_company_designation: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Date of Joining</label>
                <CFormInput
                  type="date"
                  value={editEmployee.joining_date}
                  onChange={(e) => setEditEmployee({ ...editEmployee, joining_date: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Emirates ID no:</label>
                <CFormInput
                  value={editEmployee.emirates_id}
                  onChange={(e) => setEditEmployee({ ...editEmployee, emirates_id: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Emirates Id Expiry Date</label>
                <CFormInput
                  type="date"
                  value={editEmployee.emirates_id_expiry}
                  onChange={(e) => setEditEmployee({ ...editEmployee, emirates_id_expiry: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Visa no:</label>
                <CFormInput
                  value={editEmployee.visa_no}
                  onChange={(e) => setEditEmployee({ ...editEmployee, visa_no: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Visa Expiry Date</label>
                <CFormInput
                  type="date"
                  value={editEmployee.visa_expiry_date}
                  onChange={(e) => setEditEmployee({ ...editEmployee, visa_expiry_date: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Health Insurance Expiry</label>
                <CFormInput
                  type="date"
                  value={editEmployee.insurance_expiry_date}
                  onChange={(e) => setEditEmployee({ ...editEmployee, insurance_expiry_date: e.target.value })}
                />
              </CCol>
              <CCol xs={12} className="mt-4">
                <h5>Emergency Contact</h5>
              </CCol>
              <CCol md={6}>
                <label>Emergency Contact Name</label>
                <CFormInput
                  value={editEmployee.emergency_contact_name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, emergency_contact_name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Emergency Contact Number</label>
                <CFormInput
                  value={editEmployee.emergency_contact_number}
                  onChange={(e) => setEditEmployee({ ...editEmployee, emergency_contact_number: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <label>Emergency Contact Relationship</label>
                <CFormInput
                  value={editEmployee.emergency_contact_relation}
                  onChange={(e) => setEditEmployee({ ...editEmployee, emergency_contact_relation: e.target.value })}
                />
              </CCol>
              {/* Uploads Section */}
              <CCol xs={12} className="mt-4">
                <h5>Attachments</h5>
              </CCol>
              <div className="d-flex width-50">
                <CCol md={6}>
                  <label>Photo</label>
                  {editPreviewFiles.photo && (
                    <div className="mb-2">
                      <img
                        src={editPreviewFiles.photo}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  <CFormInput
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setEditEmployee({ ...editEmployee, photo: file });
                      setEditPreviewFiles({ ...editPreviewFiles, photo: file ? URL.createObjectURL(file) : null });
                    }}
                  />
                </CCol>
              </div>

              <CCol md={6}>
                <label>Passport Attachment</label>
                {editPreviewFiles.passport_image && (
                  <div className="mb-2">
                    <a href={editPreviewFiles.passport_image} target="_blank" rel="noopener noreferrer">
                      View Current File
                    </a>
                  </div>
                )}
                <CFormInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditEmployee({ ...editEmployee, passport_image: file });
                    setEditPreviewFiles({ ...editPreviewFiles, passport_image: null });
                  }}
                />
              </CCol>
              <CCol md={6}>
                <label>Highest Degree Certificate</label>
                {editPreviewFiles.highest_degree_certificate && (
                  <div className="mb-2">
                    <a href={editPreviewFiles.highest_degree_certificate} target="_blank" rel="noopener noreferrer">
                      View Current File
                    </a>
                  </div>
                )}
                <CFormInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditEmployee({ ...editEmployee, highest_degree_certificate: file });
                    setEditPreviewFiles({ ...editPreviewFiles, highest_degree_certificate: null });
                  }}
                />
              </CCol>
              <CCol md={6}>
                <label>Emirates ID Attachment</label>
                {editPreviewFiles.emirates_id_image && (
                  <div className="mb-2">
                    <a href={editPreviewFiles.emirates_id_image} target="_blank" rel="noopener noreferrer">
                      View Current File
                    </a>
                  </div>
                )}
                <CFormInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditEmployee({ ...editEmployee, emirates_id_image: file });
                    setEditPreviewFiles({ ...editPreviewFiles, emirates_id_image: null });
                  }}
                />
              </CCol>
              <CCol md={6}>
                <label>Visa Attachment</label>
                {editPreviewFiles.visa_image && (
                  <div className="mb-2">
                    <a href={editPreviewFiles.visa_image} target="_blank" rel="noopener noreferrer">
                      View Current File
                    </a>
                  </div>
                )}
                <CFormInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditEmployee({ ...editEmployee, visa_image: file });
                    setEditPreviewFiles({ ...editPreviewFiles, visa_image: null });
                  }}
                />
              </CCol>
              <CCol md={6}>
                <label>Insurance Card Attachment</label>
                {editPreviewFiles.insurance_card && (
                  <div className="mb-2">
                    <a href={editPreviewFiles.insurance_card} target="_blank" rel="noopener noreferrer">
                      View Current File
                    </a>
                  </div>
                )}
                <CFormInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditEmployee({ ...editEmployee, insurance_card: file });
                    setEditPreviewFiles({ ...editPreviewFiles, insurance_card: null });
                  }}
                />
              </CCol>
            </CRow>
            <CButton color="primary" onClick={handleEditSubmit} className="mt-4">
              Save Changes
            </CButton>
          </CModalBody>
        </CModal>


        {/* Modal for Viewing Employee Details */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" centered>
          <CModalHeader>
            <CModalTitle>Employee Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedEmployee && (
              <CCard>
                <CCardHeader>
                  <strong>Personal Information</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={12}>
                      <p><strong>First Name:</strong> {getValue(selectedEmployee.first_name)}</p>
                      <p><strong>Last Name:</strong> {getValue(selectedEmployee.last_name)}</p>
                      <p><strong>Personal Email:</strong> {getValue(selectedEmployee.personal_email)}</p>
                      <p><strong>Phone Number:</strong> {getValue(selectedEmployee.phone_number)}</p>
                      <p><strong>Nationality:</strong> {getValue(selectedEmployee.nationality)}</p>
                      <p><strong>Gender:</strong> {getValue(selectedEmployee.gender)}</p>
                      <p><strong>Date of Birth:</strong> {getValue(selectedEmployee.date_of_birth)}</p>
                      <p><strong>Marital Status:</strong> {getValue(selectedEmployee.marital_status)}</p>
                      <p><strong>Spouse Name:</strong> {getValue(selectedEmployee.spouse_name)}</p>
                      <p><strong>Father Name:</strong> {getValue(selectedEmployee.father_name)}</p>
                      <p><strong>Mother Name:</strong> {getValue(selectedEmployee.mother_name)}</p>
                      <p><strong>Home Town Number:</strong> {getValue(selectedEmployee.home_town_number)}</p>
                      <p><strong>Address:</strong> {getValue(selectedEmployee.address)}</p>
                      <p><strong>Place of Birth:</strong> {getValue(selectedEmployee.place_of_birth)}</p>
                      <p><strong>Passport:</strong> {getValue(selectedEmployee.passport_no)}</p>
                      <p><strong>Qualification:</strong> {getValue(selectedEmployee.qualification)}</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}

            {/* Company Information Section */}
            {selectedEmployee && (
              <CCard className="mt-3">
                <CCardHeader>
                  <strong>Company Information</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={12}>
                      <p><strong>Company Email:</strong> {getValue(selectedEmployee.email)}</p>
                      <p><strong>Company Phone Number:</strong> {getValue(selectedEmployee.company_phone_number)}</p>
                      <p><strong>Current Designation:</strong> {getValue(selectedEmployee.designation)}</p>
                      <p><strong>Current Department:</strong> {getValue(selectedEmployee.department)}</p>
                      <p><strong>Previous Company Name:</strong> {getValue(selectedEmployee.previous_company_name)}</p>
                      <p><strong>Previous Company Designation:</strong> {getValue(selectedEmployee.previous_company_designation)}</p>
                      <p><strong>Joining Date:</strong> {getValue(selectedEmployee.joining_date)}</p>
                      <p><strong>Emirates ID number:</strong> {getValue(selectedEmployee.emirates_id)}</p>
                      <p><strong>Visa no:</strong> {getValue(selectedEmployee.visa_no)}</p>
                      <p><strong>Visa Expiry Date:</strong> {getValue(selectedEmployee.visa_expiry_date)}</p>
                      <p><strong>Insurance Expiry Date:</strong> {getValue(selectedEmployee.insurance_expiry_date)}</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}
            {/* Attachments Section */}
            {selectedEmployee && (
              <CCard className="mt-3">
                <CCardHeader>
                  <strong>Emergency Contact</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={12}>
                      <p><strong>Emergency Contact Name:</strong> {getValue(selectedEmployee.emergency_contact_name)}</p>
                      <p><strong>Emergency Contact Number:</strong> {getValue(selectedEmployee.emergency_contact_number)}</p>
                      <p><strong>Emergency Contact Relationship:</strong> {getValue(selectedEmployee.emergency_contact_relation)}</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}

            {/* Attachments Section */}
            {selectedEmployee && (
              <CCard className="mt-3">
                <CCardHeader>
                  <strong>Attachments</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={12}>
                      <p><strong>Emirates ID:</strong> {selectedEmployee.emirates_id_image ?
                        <a href={`${BASE_URL}${selectedEmployee.emirates_id_image}`} target="_blank" rel="noopener noreferrer">View Emirates ID</a> : 'N/A'}</p>
                      <p><strong>Passport:</strong> {selectedEmployee.passport_image ?
                        <a href={`${BASE_URL}${selectedEmployee.passport_image}`} target="_blank" rel="noopener noreferrer">View Passport</a> : 'N/A'}</p>
                      <p><strong>Visa:</strong> {selectedEmployee.visa_image ?
                        <a href={`${BASE_URL}${selectedEmployee.visa_image}`} target="_blank" rel="noopener noreferrer">View Visa</a> : 'N/A'}</p>
                      <p><strong>Highest Degree Certificate:</strong> {selectedEmployee.highest_degree_certificate ?
                        <a href={`${BASE_URL}${selectedEmployee.highest_degree_certificate}`} target="_blank" rel="noopener noreferrer">View Degree</a> : 'N/A'}</p>
                      <p><strong>Insurance Card:</strong> {selectedEmployee.insurance_card ?
                        <a href={`${BASE_URL}${selectedEmployee.insurance_card}`} target="_blank" rel="noopener noreferrer">View Insurance Card</a> : 'N/A'}</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}

          </CModalBody>
        </CModal>
      </div>
    </CCard>
  )
}

export default Employees
