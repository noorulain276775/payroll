import React, { useEffect, useState } from "react";
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

const EmployeeLeavesSummary = () => {
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchLeaveSummary = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/employees/leave-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Process raw data into grouped summary
        const processed = processLeaveData(response.data);
        setSummaryData(processed);
      } catch (error) {
        console.error("Error fetching leave summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveSummary();
  }, [token]);

  // Function to process raw leaves into summary per employee and leave type
  const processLeaveData = (leaves) => {
    const currentYear = new Date().getFullYear();
    const summary = {};

    leaves.forEach((leave) => {
      // Only count approved leaves from current year
      if (
        leave.status === "Approved" &&
        new Date(leave.start_date).getFullYear() === currentYear
      ) {
        const empId = leave.employee.id;
        const empName = `${leave.employee.first_name} ${leave.employee.last_name}`;
        const leaveType = leave.leave_type;
        const days = parseFloat(leave.days_taken);

        if (!summary[empId]) {
          summary[empId] = {
            employeeName: empName,
            leaves: {},
          };
        }

        if (!summary[empId].leaves[leaveType]) {
          summary[empId].leaves[leaveType] = 0;
        }

        summary[empId].leaves[leaveType] += days;
      }
    });

    return summary;
  };

  return (
    <CCard>
      <CCardHeader>
        <h4 className="d-inline">Employee Leaves Summary</h4>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(summaryData).length === 0 ? (
          <p>No leave data found for the current year.</p>
        ) : (
          Object.entries(summaryData).map(([empId, empData]) => (
            <div key={empId} style={{ marginBottom: "2rem" }}>
              <h5>{empData.employeeName}</h5>
              <CTable bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      Leave Type
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "100px", textAlign: "center" }}>
                      Total Days Taken
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Object.entries(empData.leaves).map(([leaveType, days]) => (
                    <CTableRow key={leaveType}>
                      <CTableDataCell style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {leaveType}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: "100px", textAlign: "center" }}>
                        {days.toFixed(0)}
                      </CTableDataCell>

                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ))
        )}
      </CCardBody>
    </CCard>
  );
};

export default EmployeeLeavesSummary;
