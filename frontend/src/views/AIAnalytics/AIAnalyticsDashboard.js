import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CButtonGroup,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CAlert,
  CSpinner,
  CBadge,
  CProgress,
  CListGroup,
  CListGroupItem,
  CTooltip,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBarChart,
  cilChartLine,
  cilArrowUp,
  cilArrowDown,
  cilWarning,
  cilCheckCircle,
  cilInfo,
  cilLightbulb,
  cilUser,
  cilMoney,
  cilCalendar,
  cilSpeedometer,
  cilCheck,
  cilArrowDown,
  cilReload,
  cilArrowRight,
  cilPeople,
  cilReload
} from '@coreui/icons';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  generateLeavePredictions,
  generateSalaryPredictions,
  detectEmployeeAnomalies,
  predictEmployeePerformance,
  optimizeTeamWorkload,
  clearError
} from '../../store/slices/aiAnalyticsSlice';
import {
  selectAILoading,
  selectAIError,
  selectLeavePredictions,
  selectSalaryPredictions,
  selectAnomalies,
  selectPerformancePredictions,
  selectWorkloadAnalysis,
  selectAIInsights,
  selectHighPotentialEmployees,
  selectRiskAssessment,
  selectModelAccuracy,
  selectDataQuality,
  selectRecommendations,
  selectLastUpdated
} from '../../store/slices/aiAnalyticsSlice';
import { useReduxOperations } from '../../hooks/useReduxOperations';

const AIAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { checkAuth } = useReduxOperations();
  
  // Redux state
  const isLoading = useSelector(selectAILoading);
  const error = useSelector(selectAIError);
  const leavePredictions = useSelector(selectLeavePredictions);
  const salaryPredictions = useSelector(selectSalaryPredictions);
  const anomalies = useSelector(selectAnomalies);
  const performancePredictions = useSelector(selectPerformancePredictions);
  const workloadAnalysis = useSelector(selectWorkloadAnalysis);
  const insights = useSelector(selectAIInsights);
  const highPotentialEmployees = useSelector(selectHighPotentialEmployees);
  const riskAssessment = useSelector(selectRiskAssessment);
  const modelAccuracy = useSelector(selectModelAccuracy);
  const dataQuality = useSelector(selectDataQuality);
  const recommendations = useSelector(selectRecommendations);
  const lastUpdated = useSelector(selectLastUpdated);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [predictionSettings, setPredictionSettings] = useState({
    leaveThreshold: 0.8,
    salaryConfidence: 0.85,
    anomalyThreshold: 2.0,
    performanceFeatures: ['experience', 'training', 'attendance']
  });

  useEffect(() => {
    if (!checkAuth()) return;
    
    // Generate initial AI insights
    generateInitialInsights();
  }, [checkAuth]);

  const generateInitialInsights = async () => {
    try {
      // Generate mock data for demonstration
      const mockLeaveData = generateMockLeaveData();
      const mockSalaryData = generateMockSalaryData();
      const mockEmployeeData = generateMockEmployeeData();
      const mockTeamData = generateMockTeamData();

      // Dispatch AI analysis actions
      await Promise.all([
        dispatch(generateLeavePredictions({ historicalData: mockLeaveData })),
        dispatch(generateSalaryPredictions({ historicalData: mockSalaryData })),
        dispatch(detectEmployeeAnomalies({ employeeData: mockEmployeeData, threshold: 2.0 })),
        dispatch(predictEmployeePerformance({ employeeData: mockEmployeeData })),
        dispatch(optimizeTeamWorkload({ teamData: mockTeamData, workloadData: generateMockWorkloadData() }))
      ]);
    } catch (error) {
      console.error('Error generating initial insights:', error);
    }
  };

  const generateMockLeaveData = () => {
    const data = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      data.push({
        date: date.toISOString(),
        leave_days: Math.floor(Math.random() * 20) + 5,
        leave_type: ['Annual', 'Sick', 'Personal'][Math.floor(Math.random() * 3)],
        employee_id: Math.floor(Math.random() * 100) + 1
      });
    }
    return data;
  };

  const generateMockSalaryData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      data.push({
        basic_salary: 50000 + Math.random() * 20000,
        total_salary: 60000 + Math.random() * 25000,
        performance_score: 0.6 + Math.random() * 0.4,
        years_experience: Math.floor(Math.random() * 10) + 1
      });
    }
    return data;
  };

  const generateMockEmployeeData = () => {
    const data = [];
    for (let i = 0; i < 25; i++) {
      data.push({
        employee_id: i + 1,
        employee_name: `Employee ${i + 1}`,
        attendance_rate: 0.8 + Math.random() * 0.2,
        performance_score: 0.5 + Math.random() * 0.5,
        leave_days: Math.floor(Math.random() * 30),
        overtime_hours: Math.floor(Math.random() * 20),
        years_experience: Math.floor(Math.random() * 10) + 1,
        education_level: Math.floor(Math.random() * 5) + 1,
        training_hours: Math.floor(Math.random() * 40),
        previous_performance: 0.5 + Math.random() * 0.5,
        team_collaboration_score: 0.6 + Math.random() * 0.4,
        current_performance: 0.5 + Math.random() * 0.5
      });
    }
    return data;
  };

  const generateMockTeamData = () => {
    return [
      { id: 1, name: 'Development Team', capacity: 100 },
      { id: 2, name: 'Design Team', capacity: 80 },
      { id: 3, name: 'Marketing Team', capacity: 90 },
      { id: 4, name: 'Sales Team', capacity: 120 }
    ];
  };

  const generateMockWorkloadData = () => {
    return [
      { team_id: 1, workload: 85 },
      { team_id: 2, workload: 45 },
      { team_id: 3, workload: 95 },
      { team_id: 4, workload: 110 }
    ];
  };

  const handleRefresh = () => {
    generateInitialInsights();
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'seasonal': return cilCalendar;
      case 'trend': return cilArrowRight;
      case 'prediction': return cilBarChart;
      case 'talent_management': return cilPeople;
      case 'feature_analysis': return cilLightbulb;
      default: return cilInfo;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'seasonal': return 'info';
      case 'trend': return 'primary';
      case 'prediction': return 'warning';
      case 'talent_management': return 'success';
      case 'feature_analysis': return 'secondary';
      default: return 'light';
    }
  };

  if (isLoading && !lastUpdated) {
    return (
      <div className="text-center py-5">
        <CSpinner size="lg" />
        <p className="mt-3">Initializing AI Analytics...</p>
      </div>
    );
  }

  return (
    <div className="ai-analytics-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">
                          <CIcon icon={cilBarChart} className="me-2 text-primary" />
            AI-Powered Analytics Dashboard
          </h2>
          <p className="text-muted mb-0">
            Intelligent insights and predictions for strategic HR decision-making
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <CButton
            color="outline-secondary"
            onClick={() => setShowSettings(true)}
            className="d-flex align-items-center gap-2"
          >
            <CIcon icon={cilCog} />
            Settings
          </CButton>
          
          <CButton
            color="primary"
            onClick={handleRefresh}
            className="d-flex align-items-center gap-2"
            disabled={isLoading}
          >
            <CIcon icon={cilReload} />
            {isLoading ? 'Analyzing...' : 'Refresh Insights'}
          </CButton>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <CAlert color="danger" dismissible onClose={() => dispatch(clearError())}>
          <strong>AI Analysis Error:</strong> {error}
        </CAlert>
      )}

      {/* Navigation Tabs */}
      <CButtonGroup className="mb-4">
        <CButton
          color={activeTab === 'overview' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </CButton>
        <CButton
          color={activeTab === 'predictions' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </CButton>
        <CButton
          color={activeTab === 'anomalies' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('anomalies')}
        >
          Anomaly Detection
        </CButton>
        <CButton
          color={activeTab === 'performance' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('performance')}
        >
          Performance AI
        </CButton>
        <CButton
          color={activeTab === 'workload' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('workload')}
        >
          Workload Optimization
        </CButton>
      </CButtonGroup>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <CRow>
          {/* AI Status Cards */}
          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody className="text-center p-4">
                <div className="mb-3">
                  <CIcon icon={cilBarChart} size="2xl" className="text-primary" />
                </div>
                <h4 className="mb-2">AI Status</h4>
                <CBadge color="success" className="mb-2">Active</CBadge>
                <p className="text-muted mb-0">All models operational</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody className="text-center p-4">
                <div className="mb-3">
                  <CIcon icon={cilSpeedometer} size="2xl" className="text-info" />
                </div>
                <h4 className="mb-2">Data Quality</h4>
                <CBadge color="success" className="mb-2">{dataQuality}</CBadge>
                <p className="text-muted mb-0">High-quality training data</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody className="text-center p-4">
                <div className="mb-3">
                  <CIcon icon={cilArrowRight} size="2xl" className="text-success" />
                </div>
                <h4 className="mb-2">Model Accuracy</h4>
                <CBadge color="success" className="mb-2">
                  {Object.values(modelAccuracy).length > 0 
                    ? `${Math.round(Object.values(modelAccuracy).reduce((a, b) => a + b, 0) / Object.values(modelAccuracy).length)}%`
                    : 'N/A'
                  }
                </CBadge>
                <p className="text-muted mb-0">Average accuracy across models</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={3}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody className="text-center p-4">
                <div className="mb-3">
                  <CIcon icon={cilInfo} size="2xl" className="text-warning" />
                </div>
                <h4 className="mb-2">Active Insights</h4>
                <CBadge color="primary" className="mb-2">{insights.length}</CBadge>
                <p className="text-muted mb-0">AI-generated recommendations</p>
              </CCardBody>
            </CCard>
          </CCol>

          {/* AI Insights */}
          <CCol md={8}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilInfo} className="me-2" />
                  AI-Generated Insights
                </h5>
              </CCardHeader>
              <CCardBody>
                {insights.length > 0 ? (
                  <CListGroup flush>
                    {insights.map((insight, index) => (
                      <CListGroupItem key={index} className="d-flex align-items-start gap-3">
                        <CBadge color={getInsightColor(insight.type)} className="mt-1">
                          <CIcon icon={getInsightIcon(insight.type)} size="sm" />
                        </CBadge>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{insight.message}</h6>
                          <p className="text-muted mb-0 small">{insight.recommendation}</p>
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilInfo} size="2xl" className="text-muted mb-3" />
                    <p className="text-muted">No insights available yet. Generate predictions to see AI recommendations.</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {/* Risk Assessment */}
          <CCol md={4}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  Risk Assessment
                </h5>
              </CCardHeader>
              <CCardBody>
                {riskAssessment ? (
                  <div className="text-center">
                    <CBadge 
                      color={getRiskColor(riskAssessment)} 
                      size="lg" 
                      className="mb-3"
                    >
                      {riskAssessment.toUpperCase()} RISK
                    </CBadge>
                    <p className="text-muted">
                      {anomalies.length} anomalies detected
                    </p>
                    <CProgress 
                      value={riskAssessment === 'critical' ? 100 : 
                             riskAssessment === 'high' ? 75 :
                             riskAssessment === 'medium' ? 50 : 25} 
                      color={getRiskColor(riskAssessment)}
                      className="mb-2"
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilCheck} size="2xl" className="text-success mb-3" />
                    <p className="text-muted">No risks detected</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {/* High Potential Employees */}
          <CCol md={12}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilUser} className="me-2" />
                  High-Potential Employees
                </h5>
              </CCardHeader>
              <CCardBody>
                {highPotentialEmployees && highPotentialEmployees.length > 0 ? (
                  <CRow>
                    {highPotentialEmployees.slice(0, 4).map((employee, index) => (
                      <CCol md={3} key={index}>
                        <div className="text-center p-3 border rounded">
                          <CIcon icon={cilUser} size="xl" className="text-primary mb-2" />
                          <h6 className="mb-1">{employee.employeeName}</h6>
                          <CBadge color="success" className="mb-2">High Potential</CBadge>
                          <p className="text-muted small mb-0">
                            Predicted: {employee.predictedPerformance}
                          </p>
                        </div>
                      </CCol>
                    ))}
                  </CRow>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilInfo} size="2xl" className="text-muted mb-3" />
                    <p className="text-muted">No high-potential employees identified yet.</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <CRow>
          {/* Leave Predictions */}
          <CCol md={6}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilCalendar} className="me-2" />
                  Leave Pattern Predictions
                </h5>
              </CCardHeader>
              <CCardBody>
                {leavePredictions ? (
                  <div>
                    <div className="mb-3">
                      <CBadge color="info" className="me-2">
                        Accuracy: {modelAccuracy.leave || 'N/A'}%
                      </CBadge>
                    </div>
                    <div style={{ height: '200px' }}>
                      <Line
                        data={{
                          labels: leavePredictions.map(p => `Month ${p.month}`),
                          datasets: [{
                            label: 'Predicted Leave Days',
                            data: leavePredictions.map(p => p.predictedLeaveDays),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CSpinner size="sm" />
                    <p className="text-muted mt-2">Generating leave predictions...</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {/* Salary Predictions */}
          <CCol md={6}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilMoney} className="me-2" />
                  Salary Trend Predictions
                </h5>
              </CCardHeader>
              <CCardBody>
                {salaryPredictions ? (
                  <div>
                    <div className="mb-3">
                      <CBadge color="success" className="me-2">
                        Trend: {salaryPredictions[0]?.growthRate > 0 ? 'Upward' : 'Downward'}
                      </CBadge>
                    </div>
                    <div style={{ height: '200px' }}>
                      <Bar
                        data={{
                          labels: salaryPredictions.map(p => `Month ${p.month}`),
                          datasets: [{
                            label: 'Predicted Salary',
                            data: salaryPredictions.map(p => p.predictedSalary),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CSpinner size="sm" />
                    <p className="text-muted mt-2">Generating salary predictions...</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Anomaly Detection Tab */}
      {activeTab === 'anomalies' && (
        <CRow>
          <CCol md={12}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  Anomaly Detection Results
                </h5>
              </CCardHeader>
              <CCardBody>
                {anomalies && anomalies.length > 0 ? (
                  <div>
                    <div className="mb-3">
                      <CBadge color={getRiskColor(riskAssessment)} className="me-2">
                        Risk Level: {riskAssessment?.toUpperCase()}
                      </CBadge>
                      <span className="text-muted">
                        {anomalies.length} anomalies detected
                      </span>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Expected Range</th>
                            <th>Severity</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {anomalies.map((anomaly, index) => (
                            <tr key={index}>
                              <td>{anomaly.employeeName}</td>
                              <td>
                                <CBadge color="secondary">{anomaly.metric}</CBadge>
                              </td>
                              <td>{anomaly.value}</td>
                              <td>{anomaly.expectedRange}</td>
                              <td>
                                <CBadge color={
                                  anomaly.severity === 'high' ? 'danger' :
                                  anomaly.severity === 'medium' ? 'warning' : 'info'
                                }>
                                  {anomaly.severity}
                                </CBadge>
                              </td>
                              <td>{anomaly.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilCheck} size="2xl" className="text-success mb-3" />
                    <p className="text-muted">No anomalies detected. All employees are performing within expected ranges.</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Performance AI Tab */}
      {activeTab === 'performance' && (
        <CRow>
          <CCol md={12}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilArrowRight} className="me-2" />
                  Performance Predictions & Analysis
                </h5>
              </CCardHeader>
              <CCardBody>
                {performancePredictions ? (
                  <div>
                    <div className="mb-3">
                      <CBadge color="info" className="me-2">
                        Model Accuracy: {modelAccuracy.performance || 'N/A'}%
                      </CBadge>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Current Performance</th>
                            <th>Predicted Performance</th>
                            <th>Potential</th>
                            <th>Recommendations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performancePredictions.slice(0, 10).map((prediction, index) => (
                            <tr key={index}>
                              <td>{prediction.employeeName}</td>
                              <td>
                                <CProgress 
                                  value={prediction.currentPerformance * 100} 
                                  color="info"
                                  className="mb-0"
                                  style={{ width: '80px' }}
                                />
                              </td>
                              <td>
                                <CProgress 
                                  value={prediction.predictedPerformance * 100} 
                                  color="success"
                                  className="mb-0"
                                  style={{ width: '80px' }}
                                />
                              </td>
                              <td>
                                <CBadge color={
                                  prediction.potential === 'high' ? 'success' :
                                  prediction.potential === 'medium' ? 'warning' : 'info'
                                }>
                                  {prediction.potential}
                                </CBadge>
                              </td>
                              <td>
                                <ul className="list-unstyled mb-0">
                                  {prediction.recommendations.slice(0, 2).map((rec, i) => (
                                    <li key={i} className="small text-muted">{rec}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CSpinner size="sm" />
                    <p className="text-muted mt-2">Generating performance predictions...</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Workload Optimization Tab */}
      {activeTab === 'workload' && (
        <CRow>
          <CCol md={12}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-white border-bottom">
                <h5 className="mb-0">
                  <CIcon icon={cilSpeedometer} className="me-2" />
                  Workload Optimization Analysis
                </h5>
              </CCardHeader>
              <CCardBody>
                {workloadAnalysis ? (
                  <div>
                    <CRow>
                      <CCol md={6}>
                        <h6>Current Workload Distribution</h6>
                        <div style={{ height: '200px' }}>
                          <Doughnut
                            data={{
                              labels: workloadAnalysis.teams.map(t => t.teamName),
                              datasets: [{
                                data: workloadAnalysis.teams.map(t => t.currentWorkload),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 0.6)',
                                  'rgba(54, 162, 235, 0.6)',
                                  'rgba(255, 206, 86, 0.6)',
                                  'rgba(75, 192, 192, 0.6)'
                                ],
                                borderColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)'
                                ],
                                borderWidth: 1
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false
                            }}
                          />
                        </div>
                      </CCol>
                      
                      <CCol md={6}>
                        <h6>Optimization Recommendations</h6>
                        {recommendations && recommendations.length > 0 ? (
                          <CListGroup flush>
                            {recommendations.slice(0, 5).map((rec, index) => (
                              <CListGroupItem key={index} className="d-flex align-items-start gap-3">
                                <CBadge color={rec.priority === 'high' ? 'danger' : 'warning'} className="mt-1">
                                  {rec.priority}
                                </CBadge>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{rec.team}</h6>
                                  <p className="text-muted mb-0 small">{rec.action}</p>
                                </div>
                              </CListGroupItem>
                            ))}
                          </CListGroup>
                        ) : (
                          <p className="text-muted">No optimization recommendations available.</p>
                        )}
                      </CCol>
                    </CRow>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CSpinner size="sm" />
                    <p className="text-muted mt-2">Analyzing workload distribution...</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="text-center mt-4">
          <small className="text-muted">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </small>
        </div>
      )}

      {/* Settings Modal */}
      <CModal visible={showSettings} onClose={() => setShowSettings(false)}>
        <CModalHeader>
          <CModalTitle>AI Analytics Settings</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <CFormLabel>Leave Prediction Threshold</CFormLabel>
              <CFormInput
                type="range"
                min="0.5"
                max="1.0"
                step="0.1"
                value={predictionSettings.leaveThreshold}
                onChange={(e) => setPredictionSettings(prev => ({
                  ...prev,
                  leaveThreshold: parseFloat(e.target.value)
                }))}
              />
              <small className="text-muted">{predictionSettings.leaveThreshold}</small>
            </CCol>
            
            <CCol md={6}>
              <CFormLabel>Anomaly Detection Threshold</CFormLabel>
              <CFormInput
                type="range"
                min="1.0"
                max="4.0"
                step="0.5"
                value={predictionSettings.anomalyThreshold}
                onChange={(e) => setPredictionSettings(prev => ({
                  ...prev,
                  anomalyThreshold: parseFloat(e.target.value)
                }))}
              />
              <small className="text-muted">{predictionSettings.anomalyThreshold}</small>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSettings(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => setShowSettings(false)}>
            Save Settings
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AIAnalyticsDashboard;
