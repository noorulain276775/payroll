import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../config';
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CCard,
  CCardHeader,
  CCardBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
} from '@coreui/react'

const EmployeeLeavesRequests = () => {
  const [leaves, setLeaves] = useState([])

  const token = localStorage.getItem('authToken')

  useEffect(() => {
    if (!token) {
      window.location.reload()
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
        console.log(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken')
          window.location.reload()
        }
      }
    }

    fetchLeaves()
  }, [token])

  return (
    <CCard>
      <div>
        <CCardHeader>
          <h4 className="d-inline">My Leaves</h4>
        </CCardHeader>
        <CCardBody>

          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Applied On</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Leave Type</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Start Date</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>End Date</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Days Taken</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Reason</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Status</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Reviewed on</CTableHeaderCell>
                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Approved by</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leaves.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" style={{ textAlign: 'center' }}>
                    No data available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                leaves.map((s) => (
                  <CTableRow key={s.id}>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.applied_on}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.leave_type}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.start_date}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.end_date}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.days_taken}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>{s.reason}</CTableDataCell>

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

export default EmployeeLeavesRequests
