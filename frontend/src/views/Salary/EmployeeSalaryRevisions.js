import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CCardHeader,
  CCard,
  CCardBody,
} from '@coreui/react'

import { BASE_URL } from '../../../config'

const EmployeeSalaryRevisions = () => {
  const [salaryRevisions, setSalaryRevisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { employeeId } = useParams()
  const token = localStorage.getItem('authToken')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      window.location.reload()
      return
    }

    const fetchSalaryRevisions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/salary-revisions/?employee=${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSalaryRevisions(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken')
          window.location.reload()
        } else {
          setError('Failed to fetch salary revisions.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSalaryRevisions()
  }, [token, employeeId])

  return (
    <CCard>
      <CCardHeader>
        <h4 className="d-inline">My Salary Revisions</h4>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Employee</CTableHeaderCell>
                <CTableHeaderCell>Revision Date</CTableHeaderCell>
                <CTableHeaderCell>Previous Salary</CTableHeaderCell>
                <CTableHeaderCell>New Salary</CTableHeaderCell>
                <CTableHeaderCell>Reason</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {salaryRevisions.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" style={{ textAlign: 'center' }}>
                    No data available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                salaryRevisions.map((revision) => (
                  <CTableRow key={revision.id}>
                    <CTableDataCell>{revision.employee?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(revision.revision_date).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>{revision.old_salary}</CTableDataCell>
                    <CTableDataCell>{revision.new_salary}</CTableDataCell>
                    <CTableDataCell>{revision.reason}</CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default EmployeeSalaryRevisions
