import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  CAlert,
  CTab
} from '@coreui/react'

import { BASE_URL } from '../../../config'

const EmployeeSalaryRevisions = () => {
  const [salaryRevisions, setSalaryRevisions] = useState([])
  const [error, setError] = useState(null)

  const { employeeId } = useParams()
  const token = localStorage.getItem('authToken')
  const userId = localStorage.getItem('user_id')



  useEffect(() => {
    if (!token) {
      window.location.href = '/'
      return
    }

    const fetchSalaryRevisions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/salary-revisions/?user=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSalaryRevisions(response.data)
        console.log(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          localStorage.removeItem('user_type')
          window.location.href = '/'
        } else {
          setError('Failed to fetch salary revisions.')
        }
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

        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Basic Salary</CTableHeaderCell>
              <CTableHeaderCell>Transport Allowance</CTableHeaderCell>
              <CTableHeaderCell>Housing Allowance</CTableHeaderCell>
              <CTableHeaderCell>Other Allowances</CTableHeaderCell>
              <CTableHeaderCell>Total Gross Salary</CTableHeaderCell>
              <CTableHeaderCell>Revision Date</CTableHeaderCell>
              <CTableHeaderCell>Reason</CTableHeaderCell>
              <CTableHeaderCell>Effective From</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {salaryRevisions.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ textAlign: 'center' }}>
                  {error ? (
                    <CAlert color="danger">{error}</CAlert>
                  ) : (
                    'No salary revisions found for you.'
                  )}
                </CTableDataCell>
              </CTableRow>
            ) : (
              <>
                {/* First Record - Special Row for Previous Salary */}
                <CTableRow>
                  <CTableDataCell>{salaryRevisions[0].previous_basic_salary}</CTableDataCell>
                  <CTableDataCell>{salaryRevisions[0].previous_transport_allowance}</CTableDataCell>
                  <CTableDataCell>{salaryRevisions[0].previous_housing_allowance}</CTableDataCell>
                  <CTableDataCell>{salaryRevisions[0].previous_other_allowance}</CTableDataCell>
                  <CTableDataCell>{salaryRevisions[0].previous_gross_salary}</CTableDataCell>
                  <CTableDataCell>-</CTableDataCell>
                  <CTableDataCell>First Salary</CTableDataCell>
                  <CTableDataCell>-</CTableDataCell>
                </CTableRow>


                {salaryRevisions.map((revision) =>

                  <CTableRow key={revision.id}>
                    <CTableDataCell>{revision.revised_basic_salary}</CTableDataCell>
                    <CTableDataCell>{revision.revised_transport_allowance}</CTableDataCell>
                    <CTableDataCell>{revision.revised_housing_allowance}</CTableDataCell>
                    <CTableDataCell>{revision.revised_other_allowance}</CTableDataCell>
                    <CTableDataCell>{revision.revised_gross_salary}</CTableDataCell>
                    <CTableDataCell>{revision.revision_date}</CTableDataCell>
                    <CTableDataCell>{revision.revision_reason}</CTableDataCell>
                    <CTableDataCell>{revision.revised_salary_effective_from}</CTableDataCell>
                  </CTableRow>

                )}
              </>
            )}
          </CTableBody>

        </CTable>

      </CCardBody>
    </CCard>
  )
}

export default EmployeeSalaryRevisions
