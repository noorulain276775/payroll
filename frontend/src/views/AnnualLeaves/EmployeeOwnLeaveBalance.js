import React from "react";
import { useNavigate } from "react-router-dom";
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
import { BASE_URL } from "../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeOwnLeaveBalance = () => {
    return (
        <CCard>
            <CCardHeader>
                <h4 className="d-inline">My Leave Balance</h4>
            </CCardHeader>
            <CCardBody>
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Leave Type</CTableHeaderCell>
                            <CTableHeaderCell>Days Taken</CTableHeaderCell>
                            <CTableHeaderCell>Days Remaining</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {/* Map through the leave balance data here */}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
}
export default EmployeeOwnLeaveBalance;