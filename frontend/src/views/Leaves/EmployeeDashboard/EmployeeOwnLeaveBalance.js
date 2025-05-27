import React, { useEffect, useState } from "react";
import dayjs from "dayjs"
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CTableHeaderCell,
    CTableHead,
} from "@coreui/react";
import { BASE_URL } from "../../../../config";
import axios from "axios";

const EmployeeOwnLeaveBalance = () => {
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [leaveSummary, setLeaveSummary] = useState({});

    const token = localStorage.getItem("authToken");

    const fetchLeaveBalance = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/leaves/employee-leave-balance`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaveBalance(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.reload();
            }
            if (error.response && error.response.status === 404) {
                setLeaveBalance(null);
                return;
            }
        }
    }



    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/employee/approve/leaves-requests/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaves(response.data);
            const summary = calculateApprovedLeavesSummary(response.data);
            setLeaveSummary(summary);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.reload();
            }
        }
    };


    useEffect(() => {
        if (!token) {
            window.location.reload();
            return;
        }
        fetchLeaveBalance();
        fetchLeaves();
    }, [token]);

    const calculateApprovedLeavesSummary = (leavesData) => {
        const currentYear = new Date().getFullYear();
        const summary = {};

        leavesData.forEach((leave) => {
            const leaveYear = new Date(leave.start_date).getFullYear();
            if (leave.status === "Approved" && leaveYear === currentYear) {
                const type = leave.leave_type;
                const days = parseFloat(leave.days_taken);
                summary[type] = (summary[type] || 0) + days;
            }
        });

        return summary;
    };


    return (
        <CCard>
            <CCardHeader>
                <h4 className="d-inline">My Leave Balance</h4>
            </CCardHeader>
            <CCardBody>
                <CTable bordered>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Annual Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Sick Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Emergency Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Compassionate Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Maternity Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Paternity Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Personal Excuse</CTableHeaderCell>
                            <CTableHeaderCell>Other Leaves</CTableHeaderCell>
                            <CTableHeaderCell>Unpaid Leaves</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {leaveBalance ? (
                            <CTableRow>
                                <CTableDataCell>{leaveBalance.annual_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.sick_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.emergency_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.compassionate_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.maternity_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.paternity_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.personal_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.other_leave_balance}</CTableDataCell>
                                <CTableDataCell>{leaveBalance.unpaid_leave_balance}</CTableDataCell>
                            </CTableRow>
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan="9" className="text-center">
                                    No leave balance data available.
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
                <h5 className="mt-4">Leave Summary for {new Date().getFullYear()}</h5>
                <CTable striped bordered hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Leave Type</CTableHeaderCell>
                            <CTableHeaderCell>Days Taken</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {Object.keys(leaveSummary).length > 0 ? (
                            Object.entries(leaveSummary).map(([type, days], index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{type}</CTableDataCell>
                                    <CTableDataCell>{days}</CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan="2" className="text-center">
                                    No leaves taken this year.
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>

            </CCardBody>
        </CCard>
    );
};

export default EmployeeOwnLeaveBalance;
