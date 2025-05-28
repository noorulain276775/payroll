import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../../config';
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
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

const ManageLeaveRequests = () => {
  const [leaves, setLeaves] = useState([])

  const token = localStorage.getItem('authToken')

  useEffect(() => {
    if (!token) {
      window.location.href = '/'
      return
    }

    // Fetch Leaves
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/leaves/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setLeaves(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/'
        }
      }
    }

    fetchLeaves()
  }, [token])

  const handleReject = (id) => {
    const confirmReject = window.confirm(
      'Do you want to reject this leave?\n\nThis action cannot be undone. Please make sure you want to do it.'
    )
    if (!confirmReject) return
    axios
      .put(`${BASE_URL}/leaves/${id}/reject/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeaves(leaves.map((leave) => (leave.id === id ? response.data : leave)))
      })
      .catch((error) => {
        console.error('Error rejecting leave:', error)
      })
  }

  const handleApprove = (id) => {
    const confirmApprove = window.confirm(
      'Do you want to approve this leave?\n\nThis action cannot be undone. Please make sure you want to do it.'
    )
    if (!confirmApprove) return
    axios
      .put(`${BASE_URL}/leaves/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeaves(leaves.map((leave) => (leave.id === id ? response.data : leave)))
      })
      .catch((error) => {
        console.error('Error approving leave:', error)
      })
  }

  return (
    <CCard>
      <div>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-end mt-2 mb-2">
            <h4>All Employees Leave Requests</h4>
            {/* <CButton color="primary" onClick={() => setCreateModalVisible(true)} className="mt-4">
          <i className="cui-plus"></i> Add New
        </CButton> */}
          </div>
        </CCardHeader>
        <CCardBody>

          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee Name</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Leave Type</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Start Date</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>End Date</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Days Taken</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Reason</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Applied On</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Status</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Reviewed on</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Approved by</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Change Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leaves.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" style={{ textAlign: 'center' }}>
                    No data available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                leaves.map((s) => (
                  <CTableRow key={s.id}>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.employee.first_name} {s.employee.last_name}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.leave_type}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.start_date}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.end_date}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.days_taken}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.reason}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.applied_on}</CTableDataCell>
                    <CTableDataCell
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        color:
                          s.status === 'Approved'
                            ? 'green'
                            : s.status === 'Rejected'
                              ? 'red'
                              : 'blue',
                        fontWeight: 'bold',
                      }}
                    >
                      {s.status}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.approved_on}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.approved_by ? `${s.approved_by.first_name} ${s.approved_by.last_name}` : '—'}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <CDropdown>
                        <CDropdownToggle color="secondary" disabled={!s || s.status !== 'Pending'}>
                          Actions
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem key={`reject-${s.id}`} onClick={() => handleReject(s.id)}>
                            Reject
                          </CDropdownItem>
                          <CDropdownItem key={`approve-${s.id}`} onClick={() => handleApprove(s.id)}>
                            Approve
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </div>
    </CCard>
  )
}

export default ManageLeaveRequests
