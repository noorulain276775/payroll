import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '../../../config';
import {
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CModalTitle,
    CCard,
    CCardBody,
    CCardHeader,
    CAlert,
} from '@coreui/react';

const LeaveBalanceManager = () => {
    const [leaveBalances, setLeaveBalances] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBalance, setSelectedBalance] = useState(null);
    const token = localStorage.getItem('authToken');
    const [formData, setFormData] = useState({
        employee: '',
        annual_leave_balance: '',
        sick_leave_balance: '',
        maternity_leave_balance: '',
        paternity_leave_balance: '',
        compassionate_leave_balance: '',
        unpaid_leave_balance: '',
        personal_leave_balance: '',
        emergency_leave_balance: '',
        others_leave_balance: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch leave balances
    const fetchLeaveBalances = () => {
        setLoading(true);
        axios.get(`${BASE_URL}${API_ENDPOINTS.LEAVE_BALANCES}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setLeaveBalances(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load leave balances");
                setLoading(false);
            });
    };

    // Fetch employee list
    useEffect(() => {
        axios.get(`${BASE_URL}${API_ENDPOINTS.EMPLOYEES}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setEmployees(res.data);
            });

        fetchLeaveBalances();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Check for required fields
        if (!formData.employee) {
            setAlertMessage("Employee is required.");
            return;
        }

        const leaveTypes = [
            "annual_leave_balance",
            "sick_leave_balance",
            "maternity_leave_balance",
            "paternity_leave_balance",
            "compassionate_leave_balance",
            "unpaid_leave_balance",
            "personal_leave_balance",
            "emergency_leave_balance",
            "others_leave_balance"
        ];

        for (const type of leaveTypes) {
            if (formData[type] === '' || formData[type] === null) {

                setAlertMessage(`Please fill in all leave balance fields. Missing: ${type.replace(/_/g, ' ')}`);
                setTimeout(() => {
                    setAlertMessage('');
                }, 5000);
                return;
            }
        }
        setAlertMessage('');
        axios.post(`${BASE_URL}${API_ENDPOINTS.LEAVE_BALANCES}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setShowModal(false);
                fetchLeaveBalances();
                setFormData({
                    employee: '',
                    annual_leave_balance: '',
                    sick_leave_balance: '',
                    maternity_leave_balance: '',
                    paternity_leave_balance: '',
                    compassionate_leave_balance: '',
                    unpaid_leave_balance: '',
                    personal_leave_balance: '',
                    emergency_leave_balance: '',
                    others_leave_balance: '',
                });
            })
            .catch(err => {
                console.error(err);
                setAlertMessage("Failed to create leave balance.");
            });
    };


    const handleUpdate = async () => {
        try {
            await axios.put(`${BASE_URL}${API_ENDPOINTS.LEAVE_BALANCES}${selectedBalance.id}/`, selectedBalance, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            fetchLeaveBalances(); // refresh data
        } catch (error) {
            console.error("Update failed", error);
        }
    };
    return (
        <CCard>
            <div>
                <CCardHeader>
                    <div className="d-flex justify-content-between align-items-end mb-2 mt-2">
                        <h4>Employee Leave Balances</h4>
                        <CButton color="primary" onClick={() => setShowModal(true)}>
                            <i className="cui-plus"></i> Add New
                        </CButton>
                    </div>
                </CCardHeader>

                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Annual</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Sick</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Maternity</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Paternity</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Compassionate</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Unpaid</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Personal</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Emergency</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Others</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                <CTableRow>
                                    <CTableDataCell colSpan="11" className="text-center">Loading...</CTableDataCell>
                                </CTableRow>
                            ) : leaveBalances.length === 0 ? (
                                <CTableRow>
                                    <CTableDataCell colSpan="11" className="text-center">No leave balances found.</CTableDataCell>
                                </CTableRow>
                            ) : (
                                leaveBalances.map((balance) => (
                                    <CTableRow key={balance.id}>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {balance.employee_details?.first_name} {balance.employee_details?.last_name}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.annual_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.sick_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.maternity_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.paternity_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.compassionate_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.unpaid_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.personal_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.emergency_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{balance.others_leave_balance}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <CDropdown>
                                                <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                                                <CDropdownMenu>
                                                    <CDropdownItem onClick={() => {
                                                        setSelectedBalance(balance);
                                                        setShowEditModal(true);
                                                    }}>Edit</CDropdownItem>
                                                </CDropdownMenu>
                                            </CDropdown>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>



                <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" centered>
                    <div className='m-2'>
                        {alertMessage && (
                            <CAlert color="danger" dismissible onClose={() => setAlertMessage('')}>
                                {alertMessage}
                            </CAlert>
                        )}


                    </div>

                    <CModalHeader onClose={() => setShowModal(false)}>
                        <h5 className="modal-title">Create Leave Balance</h5>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="employee">Employee</CFormLabel>
                                    <CFormSelect
                                        id="employee"
                                        name="employee"
                                        value={formData.employee}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Select Employee --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.first_name} {emp.last_name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="annual_leave_balance">Annual Leave (Decimal)</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        step="0.1"
                                        id="annual_leave_balance"
                                        name="annual_leave_balance"
                                        value={formData.annual_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>


                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="sick_leave_balance">Sick Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="sick_leave_balance"
                                        name="sick_leave_balance"
                                        value={formData.sick_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="compassionate_leave_balance">Compassionate Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="compassionate_leave_balance"
                                        name="compassionate_leave_balance"
                                        value={formData.compassionate_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="maternity_leave_balance">Maternity Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="maternity_leave_balance"
                                        name="maternity_leave_balance"
                                        value={formData.maternity_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="paternity_leave_balance">Paternity Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="paternity_leave_balance"
                                        name="paternity_leave_balance"
                                        value={formData.paternity_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="personal_leave_balance">Personal Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="personal_leave_balance"
                                        name="personal_leave_balance"
                                        value={formData.personal_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="emergency_leave_balance">Emergency Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="emergency_leave_balance"
                                        name="emergency_leave_balance"
                                        value={formData.emergency_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="unpaid_leave_balance">Unpaid Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="unpaid_leave_balance"
                                        name="unpaid_leave_balance"
                                        value={formData.unpaid_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <CFormLabel htmlFor="others_leave_balance">Others Leave</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id="others_leave_balance"
                                        name="others_leave_balance"
                                        value={formData.others_leave_balance}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </CForm>

                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </CButton>
                        <CButton color="primary" onClick={handleSubmit} disabled={!formData.employee} >
                            Save
                        </CButton>
                    </CModalFooter>
                </CModal>

                {selectedBalance && (
                    <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg" centered>
                        <CModalHeader>
                            <CModalTitle>Edit Leave Balance</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CForm>
                                {['annual_leave_balance', 'sick_leave_balance', 'maternity_leave_balance', 'paternity_leave_balance', 'compassionate_leave_balance', 'unpaid_leave_balance', 'personal_leave_balance', 'emergency_leave_balance', 'others_leave_balance'].map((field) => (
                                    <div key={field} className="mb-3">
                                        <CFormLabel htmlFor={field}>
                                            {field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            id={field}
                                            name={field}
                                            value={selectedBalance[field] ?? ''}
                                            onChange={(e) =>
                                                setSelectedBalance(prev => ({
                                                    ...prev,
                                                    [field]: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                ))}

                            </CForm>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
                            <CButton color="primary" onClick={handleUpdate}>Save Changes</CButton>
                        </CModalFooter>
                    </CModal>
                )}
            </div>
        </CCard>
    )
}

export default LeaveBalanceManager
