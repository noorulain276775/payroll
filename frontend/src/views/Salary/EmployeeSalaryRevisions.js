import React from 'react'
import { BASE_URL } from '../../../config'

import axios from 'axios'
import {
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CTableHeaderCell,
    CTableHead,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const EmployeeSalaryRevisions = () => {
    const [salaryRevisions, setSalaryRevisions] = useState([])
    const { employeeId } = useParams()
    const token = localStorage.getItem('authToken')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            window.location.reload()
            return
        }

        // Fetch Salary Revisions
        const fetchSalaryRevisions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/salary-revisions/?employee=${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setSalaryRevisions(response.data)
                console.log(response.data)
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken')
                    window.location.reload()
                }
            }
        }

        // fetchSalaryRevisions()
    }, [token, employeeId])

    return (
        <div>
            <div className='d-flex justify-content-between align-items-end mb-4'>
                <h4>Salary Record</h4>
            </div>
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
                    {salaryRevisions.map((revision) => (
                        <CTableRow key={revision.id}>
                            <CTableDataCell>{revision.employee.name}</CTableDataCell>
                            <CTableDataCell>{new Date(revision.revision_date).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{revision.old_salary}</CTableDataCell>
                            <CTableDataCell>{revision.new_salary}</CTableDataCell>
                            <CTableDataCell>{revision.reason}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    )
}
export default EmployeeSalaryRevisions