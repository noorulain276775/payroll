import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
  CFormInput,
  CFormSelect,
  CAlert
} from '@coreui/react'

const Salary = () => {
  const [salary, setSalary] = useState([])
  const [selectedEmployeeSalary, setSelectedEmployeeSalary] = useState(null)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [basicSalary, setBasicSalary] = useState('')
  const [housingAllowance, setHousingAllowance] = useState('')
  const [transportAllowance, setTransportAllowance] = useState('')
  const [otherAllowance, setOtherAllowance] = useState(0)
  const [bankName, setBankName] = useState('')
  const [accountNo, setAccountNo] = useState('')
  const [iban, setIban] = useState('')
  const [swiftCode, setSwiftCode] = useState('')
  const [calculatedGrossSalary, setCalculatedGrossSalary] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const navigate = useNavigate()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [editErrorMessage, setEditErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editSuccessMessage, setEditSuccessMessage] = useState(null)
  const [alertVisible, setAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [editAlertVisible, setEditAlertVisible] = useState(false);
  const [editSuccessAlertVisible, setEditSuccessAlertVisible] = useState(false);
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
  
    // Timer for alerts
    let timer;
    if (editAlertVisible || editSuccessAlertVisible || alertVisible || successAlertVisible) {
      timer = setTimeout(() => {
        setEditAlertVisible(false);
        setEditSuccessAlertVisible(false);
        setAlertVisible(false);
        setSuccessAlertVisible(false);
      }, 10000); // 10 seconds
    }
  
    // Fetch Employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_all_employees/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      }
    };
  
    // Fetch Salaries
    const fetchSalaries = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/salaries/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalary(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      }
    };
  
    fetchEmployees();
    fetchSalaries();
  
    // Cleanup function
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    navigate,
    token,
    editAlertVisible,
    editSuccessAlertVisible,
    alertVisible,
    successAlertVisible,
  ]);
  

  const handleView = (s) => {
    setSelectedEmployeeSalary(s)
    setModalVisible(true)
  }

  const handleCreateRecord = () => {
    const data = {
      employee: selectedEmployee,
      basic_salary: basicSalary,
      housing_allowance: housingAllowance,
      transport_allowance: transportAllowance,
      other_allowance: otherAllowance,
      bank_name: bankName,
      account_no: accountNo,
      iban: iban,
      swift_code: swiftCode,
    }
    const resetForm = () => {
      setSelectedEmployee(null);
      setBasicSalary('');
      setHousingAllowance('');
      setTransportAllowance('');
      setOtherAllowance('');
      setBankName('');
      setAccountNo('');
      setIban('');
      setSwiftCode('');
      setCalculatedGrossSalary(null);
    };

    axios
      .post('http://127.0.0.1:8000/create-salary-details/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSalary([...salary, response.data])
        setErrorMessage(null);
        setSuccessMessage('Salary details created successfully.');
        setSuccessAlertVisible(true);
        resetForm();

      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data?.employee?.[0];
          if (errorMessage === 'salary details with this employee already exists.') {
            setErrorMessage('Salary details for this employee already exist. Please edit the existing record.');
            setAlertVisible(true);
          } else {
            setErrorMessage('Seem like you have left one of the mandatory field empty.');
            setAlertVisible(true);
          }
        } else {
          console.error('Unexpected error:', error);
          setErrorMessage('An unexpected error occurred. Please try again.');
          setAlertVisible(true);
        }
        resetForm();
      })
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setEditModalVisible(true)
  }

  const handleUpdateRecord = () => {
    const { id, employee, ...updatedFields } = selectedRecord;

    const payload = { ...updatedFields, employee };

    axios
      .put(`http://127.0.0.1:8000/update-salary-details/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSalary(
          salary.map((s) => (s.id === response.data.id ? response.data : s))
        );
        setEditSuccessAlertVisible(true);
        setEditSuccessMessage('Record updated successfully.');
        setEditErrorMessage(null);
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
        setEditErrorMessage('Failed to update the record. Please try again.');
        setEditAlertVisible(true);
      });
  };
  const handleInputEditChange = (e, field) => {
    setSelectedRecord({ ...selectedRecord, [field]: e.target.value })
  }


  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value)
  }

  const handleInputChange = (e, setter) => {
    setter(e.target.value)
  }

  const calculateGrossSalary = () => {
    const basic = parseFloat(basicSalary) || 0;
    const housing = parseFloat(housingAllowance) || 0;
    const transport = parseFloat(transportAllowance) || 0;
    const other = parseFloat(otherAllowance) || 0;

    const gross = basic + housing + transport + other;
    setCalculatedGrossSalary(gross);
  };

  const getValue = (value) => value ? value : 'N/A'


  return (
    <div>
      <div className='d-flex justify-content-between align-items-end mb-4'>
        <h4>Salary Record</h4>
        <CButton color="primary" onClick={() => setCreateModalVisible(true)} className="mt-4">
          <i className="cui-plus"></i> Add New
        </CButton>
      </div>

      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee Name</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Basic Salary</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Housing Allowance</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Transport Allowance</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Other Allowance</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Gross Salary</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {salary.map((s) => (
            <CTableRow key={s.id}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.employee_full_name}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.basic_salary}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.housing_allowance}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.transport_allowance}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.other_allowance}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.gross_salary}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CDropdown>
                  <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handleView(s)}>View</CDropdownItem>
                    <CDropdownItem onClick={() => handleEdit(s)}>Edit</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Viewing Employee Details */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" centered>
        <CModalHeader>
          <CModalTitle>Employee Salary Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployeeSalary && (
            <CCard>
              <CCardHeader>
                <strong>Salary information</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={12}>
                    <p><strong>Full Name:</strong> {getValue(selectedEmployeeSalary.employee_full_name)}</p>
                    <p><strong>Basic Salary:</strong> {getValue(selectedEmployeeSalary.basic_salary)}</p>
                    <p><strong>Transport Allowance:</strong> {getValue(selectedEmployeeSalary.basic_salary)}</p>
                    <p><strong>Housing Allowance:</strong> {getValue(selectedEmployeeSalary.housing_allowance)}</p>
                    <p><strong>Other Allowance:</strong> {getValue(selectedEmployeeSalary.other_allowance)}</p>
                    <p><strong>Gross Salary:</strong> {getValue(selectedEmployeeSalary.gross_salary)}</p>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}

          {/* Company Information Section */}
          {selectedEmployeeSalary && (
            <CCard className="mt-3">
              <CCardHeader>
                <strong>Bank Information</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={12}>
                    <p><strong>Bank Name:</strong> {getValue(selectedEmployeeSalary.bank_name)}</p>
                    <p><strong>Account Number:</strong> {getValue(selectedEmployeeSalary.account_no)}</p>
                    <p><strong>IBAN:</strong> {getValue(selectedEmployeeSalary.iban)}</p>
                    <p><strong>Swift Code:</strong> {getValue(selectedEmployeeSalary.swift_code)}</p>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}

        </CModalBody>
      </CModal>

      {/* Modal for Creating Salary Details */}
      <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} size="lg" centered>
        <CModalHeader>
          <CModalTitle>Create Salary Record</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard>
            <CCardHeader className="bg-light text-black">
              <strong>Salary Details</strong>
            </CCardHeader>
            <CCardBody>
              {alertVisible && (
                <CAlert color="danger" onClose={() => setAlertVisible(false)} dismissible>
                  {errorMessage}
                </CAlert>
              )}
              {successAlertVisible && (
                <CAlert color="success" onClose={() => setSuccessAlertVisible(false)} dismissible>
                  {successMessage}
                </CAlert>
              )}

              <CRow className="mb-4">
                <CCol md={6} className="mb-3">
                  <label>Employee Name <span style={{ color: 'red' }}>*</span></label>
                  <CFormSelect
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Basic Salary <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    name="basicSalary"
                    value={basicSalary}
                    onChange={(e) => handleInputChange(e, setBasicSalary)}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Housing Allowance <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    value={housingAllowance}
                    onChange={(e) => handleInputChange(e, setHousingAllowance)}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Transport Allowance <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    value={transportAllowance}
                    onChange={(e) => handleInputChange(e, setTransportAllowance)}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Other Allowance</label>
                  <CFormInput
                    type="number"
                    value={otherAllowance}
                    onChange={(e) => handleInputChange(e, setOtherAllowance)}
                  />
                </CCol>

                <CCol md={12} className="text-start">
                  <CButton color="light" onClick={calculateGrossSalary} className="mt-2 mb-3" block>
                    Click to Calculate Gross Salary
                  </CButton>
                  <p><strong>Gross Salary: </strong>{calculatedGrossSalary}</p>

                </CCol>
              </CRow>
              <CRow>
                <CCol md={6} className="mb-3">
                  <label>Bank Name</label>
                  <CFormInput
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label>Account No</label>
                  <CFormInput
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label>IBAN</label>
                  <CFormInput
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label>Swift Code</label>
                  <CFormInput
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CButton color="primary" onClick={handleCreateRecord} className="mt-3" block>
                Save Salary Record
              </CButton>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>


      {selectedRecord && (
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size='lg' centered>
          <CModalHeader>
            <CModalTitle>Edit Salary Record</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {editAlertVisible && <CAlert color="danger" onClose={() => setEditAlertVisible(false)} dismissible>{editErrorMessage}</CAlert>}
            {editSuccessAlertVisible && <CAlert color="success" onClose={() => setEditSuccessAlertVisible(false)} dismissible>{editSuccessMessage}</CAlert>}
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Basic Salary"
                  type="number"
                  value={selectedRecord.basic_salary}
                  onChange={(e) => handleInputEditChange(e, 'basic_salary')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Housing Allowance"
                  type="number"
                  value={selectedRecord.housing_allowance}
                  onChange={(e) => handleInputEditChange(e, 'housing_allowance')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Transport Allowance"
                  type="number"
                  value={selectedRecord.transport_allowance}
                  onChange={(e) => handleInputEditChange(e, 'transport_allowance')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Other Allowance"
                  type="number"
                  value={selectedRecord.other_allowance}
                  onChange={(e) => handleInputEditChange(e, 'other_allowance')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Bank Name"
                  value={selectedRecord.bank_name}
                  onChange={(e) => handleInputEditChange(e, 'bank_name')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Account No"
                  value={selectedRecord.account_no}
                  onChange={(e) => handleInputEditChange(e, 'account_no')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="IBAN"
                  value={selectedRecord.iban}
                  onChange={(e) => handleInputEditChange(e, 'iban')}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Swift Code"
                  value={selectedRecord.swift_code}
                  onChange={(e) => handleInputEditChange(e, 'swift_code')}
                />
              </CCol>
            </CRow>
            <CButton color="primary" onClick={handleUpdateRecord} className="mt-3">
              Save Changes
            </CButton>
          </CModalBody>
        </CModal>
      )}

    </div>
  )
}

export default Salary
