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
  CAlert,
  CCardFooter
} from '@coreui/react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Payroll = () => {
  const [makePayroll, setMakePayroll] = useState([]) // creating payroll and setting data here
  const [selectedEmployeePayroll, setSelectedEmployeePayroll] = useState(null) // selected employee for viewing his specific payroll for view Modal
  const [employees, setEmployees] = useState([]) // fetching employeees on useState to show on Add new payroll
  const [payroll, setPayroll] = useState([]) // fetching payroll on useState
  const [selectedEmployee, setSelectedEmployee] = useState(null) // while creatingpayroll record when a employee selected
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [overtimeDays, setOverTimeDays] = useState(0)
  const [normalOvertimeDays, setNormalOvertimeDays] = useState(0)
  const [overtimeAmount, setOvertimeAmount] = useState(0)
  const [normalOvertimeAmount, setNormalOvertimeAmount] = useState(0)
  const [unpaidDays, setUnpaidDays] = useState(0)
  const [UnpaidAmount, setUnpaidAmount] = useState(0)
  const [otherDeduction, setOtherDeduction] = useState(0)
  const [remarks, setRemarks] = useState('')
  const [calculatedTotalSalary, setCalculatedTotalSalary] = useState(null)
  const [grossSalary, setGrossSalary] = useState(0)
  const [basicSalary, setBasicSalary] = useState(0)
  const [dailySalary, setdailySalary] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const navigate = useNavigate()

  const [selectedRecord, setSelectedRecord] = useState(null) // For selection of record needs to be edited
  const [editModalVisible, setEditModalVisible] = useState(false)
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

    // Fetch Payrolls
    const fetchPayrolls = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_all_payroll/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayroll(response.data);
        console.log('payrolls:', response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      }
    };

    // Fetch Employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_all_employees/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
        console.log('Employees:', response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.reload();
          navigate('/');
        }
      }
    };

    fetchEmployees();
    fetchPayrolls();

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
    setSelectedEmployeePayroll(s)
    setModalVisible(true)
  }

  const handleSendSalary = (s) => {
    axios
      .get(`http://127.0.0.1:8000/send_salary_slip/${s.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error.response.data.detail);
      });
  }


  // create Payroll record
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  const handleCreateRecord = () => {
    console.log(normalOvertimeDays)
    console.log(normalOvertimeAmount)
    const data = {
      employee: selectedEmployee,
      month: month,
      year: year,
      overtime_days: overtimeDays,
      normal_overtime_days: normalOvertimeDays,
      unpaid_days: unpaidDays,
      other_deduction: otherDeduction,
      remarks: remarks
    }
    const resetForm = () => {
      setSelectedEmployee(null);
      setMonth(null);
      setYear(null);
      setOverTimeDays(0);
      setOvertimeAmount(0);
      setUnpaidDays(0);
      setUnpaidAmount(0);
      setOtherDeduction(0);
      setNormalOvertimeAmount(0);
      setNormalOvertimeDays(0);
      setGrossSalary(0);
      setdailySalary(0);
      setBasicSalary(0);
      setOtherDeduction(0);
      setCalculatedTotalSalary(null);
    };

    axios
      .post('http://127.0.0.1:8000/create_payroll/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Payroll Created:', response.data)
        setMakePayroll([...makePayroll, response.data])
        setErrorMessage(null);
        setSuccessMessage('Salary details created successfully.');
        setSuccessAlertVisible(true);
        resetForm();

      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data?.employee?.[0];
          if (errorMessage === 'salary details with this employee already exists.') {
            setErrorMessage('Payroll of this month for this employee already exist, Please edit the payroll if you want changes.');
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

  const calculateTotalSalary = () => {
    const gross_salary = parseFloat(grossSalary) || 0;
    const overtime_amount = overtimeDays * (dailySalary * 1.5) || 0;
    setOvertimeAmount(overtime_amount);
    const normal_overtime_amount = normalOvertimeDays * (dailySalary * 1.25) || 0;
    setNormalOvertimeAmount(normal_overtime_amount);
    console.log(normalOvertimeAmount)
    const unpaid_days_amount = unpaidDays * dailySalary || 0;
    setUnpaidAmount(unpaid_days_amount)
    const other_deductions = parseFloat(otherDeduction) || 0;
    const total_salary_for_month = (gross_salary + overtime_amount + normal_overtime_amount) - (unpaid_days_amount + other_deductions)
    setCalculatedTotalSalary(total_salary_for_month);
  };

  const handleDateChange = (date) => {
    if (date) {
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
  }
  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    console.log("This is employee ID: ", employeeId);
    setSelectedEmployee(employeeId);

    axios.get(`http://127.0.0.1:8000/salary-details/${employeeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const salaryDetails = response.data;
        console.log("salary_details:", salaryDetails);

        const basicSalaryValue = salaryDetails.basic_salary; // Extract basic salary
        const dailySalaryValue = basicSalaryValue / 30; // Calculate daily salary

        setBasicSalary(basicSalaryValue); // Update basic salary state
        setGrossSalary(salaryDetails.gross_salary); // Update gross salary state
        setdailySalary(dailySalaryValue); // Use the calculated daily salary directly
      })
      .catch((error) => {
        console.error('Error fetching salary details:', error);
      });
  };


  const handleEdit = (record) => {
    setSelectedRecord(record)
    console.log(selectedRecord)
    setEditModalVisible(true)
  }

  const handleUpdateRecord = () => {
    const { id, employee, ...updatedFields } = selectedRecord;

    const payload = { ...updatedFields, employee };

    axios
      .put(`http://127.0.0.1:8000/update-payroll-record/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPayroll(
          payroll.map((s) => (s.id === response.data.id ? response.data : s))
        );
        setEditSuccessAlertVisible(true);
        setEditSuccessMessage('Record updated successfully.');
        setEditErrorMessage(null);
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
        setEditErrorMessage(error.response.data.detail);
        setEditAlertVisible(true);
      });
  };
  const handleInputEditChange = (e, field) => {
    setSelectedRecord({ ...selectedRecord, [field]: e.target.value })
  }

  const handleInputChange = (e, setter) => {
    setter(e.target.value)
  }


  return (
    <div>
      <div className='d-flex justify-content-between align-items-end mb-4'>
        <h4>Payrolls</h4>
        <CButton color="primary" onClick={() => setCreateModalVisible(true)} className="mt-4">
          <i className="cui-plus"></i> Add New
        </CButton>
      </div>

      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee Name</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Month</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Year</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Holiday Overtime Days</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Normal Overtime Days</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Unpaid Days</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Other Deductions</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Total Salary</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {payroll.map((s) => (
            <CTableRow key={s.id}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.employee_full_name}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{getMonthName(s.month)}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.year}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.overtime_days || 0}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.normal_overtime_days || 0}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.unpaid_days}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.other_deductions || 0}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>AED {s.total_salary_for_month}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CDropdown>
                  <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handleView(s)}>View</CDropdownItem>
                    <CDropdownItem onClick={() => handleEdit(s)}>Edit</CDropdownItem>
                    <CDropdownItem onClick={() => handleSendSalary(s)}>Send Salary Slip</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Viewing Employee Details */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" centered>
        <CModalHeader style={{ backgroundColor: '#f8f9fa' }}>
          <CModalTitle className="text-center" style={{ fontWeight: 'bold', color: '#4e73df' }}>
            Employee Payroll Slip
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ backgroundColor: '#f0f3f5' }}>
          {selectedEmployeePayroll && (
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="text-center" style={{ backgroundColor: '#4e73df', color: 'white' }}>
                <strong>Payroll Slip</strong> <br />
                <small>
                  {getMonthName(selectedEmployeePayroll.month)} {selectedEmployeePayroll.year} - {selectedEmployeePayroll.employee_full_name}
                </small>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={12}>
                    <p><strong style={{ marginRight: '10px' }}>Employee Full Name:</strong> {selectedEmployeePayroll.employee_full_name}</p>
                    <p><strong style={{ marginRight: '10px' }}>Gross Salary:</strong> {selectedEmployeePayroll.gross_salary}</p>
                    <p><strong style={{ marginRight: '10px' }}>One day salary:</strong> {selectedEmployeePayroll.daily_salary}</p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <hr />
                    <p><strong style={{ marginRight: '10px' }}>Holiday Overtime Days:</strong> {selectedEmployeePayroll.overtime_days}</p>
                    <p>
                      <strong style={{ marginRight: '10px' }}>Holiday Overtime Amount:</strong>
                      AED {((selectedEmployeePayroll?.daily_salary || 0) * 1.5 * (selectedEmployeePayroll?.overtime_days || 0)).toFixed(2)}
                    </p>
                    <p><strong style={{ marginRight: '10px' }}>Normal Overtime Days:</strong> {selectedEmployeePayroll.normal_overtime_days || 0}</p>
                    <p>
                      <strong style={{ marginRight: '10px' }}>Normal Overtime Amount:</strong>
                      AED {((selectedEmployeePayroll?.daily_salary || 0) * 1.25 * (selectedEmployeePayroll?.normal_overtime_days || 0)).toFixed(2)}
                    </p>
                    <p><strong style={{ marginRight: '10px' }}>Unpaid Days:</strong>{selectedEmployeePayroll.unpaid_days}</p>
                    <p>
                      <strong style={{ marginRight: '10px' }}>Total Unpaid Deduction:</strong>
                      AED {((selectedEmployeePayroll?.daily_salary || 0) * (selectedEmployeePayroll?.unpaid_days || 0)).toFixed(2)}
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <hr />
                    <p><strong style={{ marginRight: '10px' }}>Other Deductions:</strong>AED {selectedEmployeePayroll.other_deductions || 0}</p>
                    <p><strong style={{ marginRight: '10px' }}>Remarks:</strong> {selectedEmployeePayroll.remarks || "N/A"}</p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#d4edda', // light green background
                        border: '2px solidrgb(34, 155, 62)', // dark green border
                        borderRadius: '12px', // rounded corners
                        color: '#155724', // dark green text color
                      }}
                    >
                      <p style={{
                        padding: 0, margin: 0
                      }}><strong style={{ marginRight: '10px' }}>Total Salary for the Month:</strong>AED {selectedEmployeePayroll.total_salary_for_month}</p>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
              <CCardFooter className="text-center" style={{ backgroundColor: '#f8f9fa' }}>
                <p style={{ fontStyle: 'italic', color: '#6c757d' }}>
                  Please check all the information before sending the salary slip to employees
                </p>
              </CCardFooter>
            </CCard>
          )}
        </CModalBody>
      </CModal>




      {/* Modal for Creating Salary Details */}
      <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} size="lg" centered>
        <CModalHeader>
          <CModalTitle>Create Payroll</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard>
            <CCardHeader className="bg-light text-black">
              <strong>Monthly Salary Breakdown</strong>
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
                  <label>Select Month and Year <span style={{ color: 'red' }}>*</span></label>
                  <DatePicker
                    selected={month && year ? new Date(year, month - 1) : null}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Select month and year"
                    className="form-control"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '1rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    }}
                    calendarClassName="custom-datepicker"
                    popperStyle={{
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '14px',
                      border: '1px solid #e3e3e3',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </CCol>


                <CCol md={6} className="mb-3">
                  <label>Holiday Overtime Days <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    value={overtimeDays}
                    onChange={(e) => handleInputChange(e, setOverTimeDays)}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label>Normal Overtime Days <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    value={normalOvertimeDays}
                    onChange={(e) => handleInputChange(e, setNormalOvertimeDays)}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Unpaid Leaves <span style={{ color: 'red' }}>*</span></label>
                  <CFormInput
                    type="number"
                    value={unpaidDays}
                    onChange={(e) => handleInputChange(e, setUnpaidDays)}
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <label>Other Deductions</label>
                  <CFormInput
                    type="number"
                    value={otherDeduction}
                    onChange={(e) => handleInputChange(e, setOtherDeduction)}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <label>Remarks</label>
                  <CFormInput
                    value={remarks}
                    onChange={(e) => handleInputChange(e, setRemarks)}
                  />
                </CCol>

                <CCol md={12} className="text-start">
                  <CButton color="light" onClick={calculateTotalSalary} className="mt-2 mb-3" block>
                    Click to Calculate
                  </CButton>
                  <p><strong>Holiday overtime amount: </strong>{(overtimeAmount || 0).toFixed(2)}</p>
                  <p><strong>Normal overtime amount: </strong>{(normalOvertimeAmount || 0).toFixed(2)}</p>
                  <p><strong>Unpaid leaves amount: </strong>{(UnpaidAmount || 0).toFixed(2)}</p>
                  <p><strong>Total Salary for the month Salary: </strong>{(calculatedTotalSalary || 0).toFixed(2)}</p>


                </CCol>
              </CRow>
              <CButton color="primary" onClick={handleCreateRecord} className="mt-3" block>
                Save Payroll Record
              </CButton>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>

      {selectedRecord && (
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" centered>
          <CModalHeader>
            <CModalTitle>Edit Salary Record</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* Alerts */}
            {editAlertVisible && (
              <CAlert color="danger" onClose={() => setEditAlertVisible(false)} dismissible>
                {editErrorMessage}
              </CAlert>
            )}
            {editSuccessAlertVisible && (
              <CAlert color="success" onClose={() => setEditSuccessAlertVisible(false)} dismissible>
                {editSuccessMessage}
              </CAlert>
            )}
            <CRow>
              {/* Month Picker */}
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Month
                </label>
                <CFormSelect
                  value={selectedRecord.month}
                  onChange={(e) => handleInputEditChange({ target: { value: parseInt(e.target.value) } }, 'month')}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '100%',
                  }}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Year Picker */}
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Year
                </label>
                <DatePicker
                  selected={new Date(selectedRecord.year, 0)} // Selects only the year
                  onChange={(date) =>
                    handleInputEditChange({ target: { value: date.getFullYear() } }, 'year')
                  }
                  dateFormat="yyyy" // Year only
                  showYearPicker // Enables year picker
                  placeholderText="Select Year"
                  className="form-control" // To match Bootstrap's input styling
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#fff',
                  }}
                />
              </CCol>

              {/* Other Fields */}
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Overtime Days
                </label>
                <CFormInput
                  type="number"
                  value={selectedRecord.overtime_days}
                  onChange={(e) => handleInputEditChange(e, 'overtime_days')}
                  style={{
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </CCol>
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Normal Overtime Days
                </label>
                <CFormInput
                  type="number"
                  value={selectedRecord.normal_overtime_days}
                  onChange={(e) => handleInputEditChange(e, 'normal_overtime_days')}
                  style={{
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </CCol>
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Unpaid Leaves
                </label>
                <CFormInput
                  type="number"
                  value={selectedRecord.unpaid_days}
                  onChange={(e) => handleInputEditChange(e, 'unpaid_days')}
                  style={{
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </CCol>
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Other Deduction in AED
                </label>
                <CFormInput
                  type="number"
                  value={selectedRecord.other_deductions}
                  onChange={(e) => handleInputEditChange(e, 'other_deductions')}
                  style={{
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </CCol>
              <CCol md={6} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Remarks
                </label>
                <CFormInput
                  type="text"
                  value={selectedRecord.remarks}
                  onChange={(e) => handleInputEditChange(e, 'remarks')}
                  style={{
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </CCol>
            </CRow>
            <CButton color="primary" onClick={handleUpdateRecord} style={{ marginTop: '15px', padding: '10px 20px' }}>
              Save Changes
            </CButton>
          </CModalBody>
        </CModal>
      )}

    </div>
  )
}

export default Payroll;
