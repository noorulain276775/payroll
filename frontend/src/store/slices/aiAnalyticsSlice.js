import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiAnalyticsService from '../../services/aiAnalytics';

// Async thunks for AI analytics
export const generateLeavePredictions = createAsyncThunk(
  'aiAnalytics/generateLeavePredictions',
  async ({ historicalData, employeeId }, { rejectWithValue }) => {
    try {
      const result = aiAnalyticsService.predictLeavePatterns(historicalData, employeeId);
      if (result.error) {
        return rejectWithValue(result.error);
      }
      return result;
    } catch (error) {
      return rejectWithValue('Failed to generate leave predictions');
    }
  }
);

export const generateSalaryPredictions = createAsyncThunk(
  'aiAnalytics/generateSalaryPredictions',
  async ({ historicalData, marketData }, { rejectWithValue }) => {
    try {
      const result = aiAnalyticsService.predictSalaryTrends(historicalData, marketData);
      if (result.error) {
        return rejectWithValue(result.error);
      }
      return result;
    } catch (error) {
      return rejectWithValue('Failed to generate salary predictions');
    }
  }
);

export const detectEmployeeAnomalies = createAsyncThunk(
  'aiAnalytics/detectEmployeeAnomalies',
  async ({ employeeData, threshold }, { rejectWithValue }) => {
    try {
      const result = aiAnalyticsService.detectAnomalies(employeeData, threshold);
      if (result.error) {
        return rejectWithValue(result.error);
      }
      return result;
    } catch (error) {
      return rejectWithValue('Failed to detect anomalies');
    }
  }
);

export const predictEmployeePerformance = createAsyncThunk(
  'aiAnalytics/predictEmployeePerformance',
  async ({ employeeData, features }, { rejectWithValue }) => {
    try {
      const result = aiAnalyticsService.predictPerformance(employeeData, features);
      if (result.error) {
        return rejectWithValue(result.error);
      }
      return result;
    } catch (error) {
      return rejectWithValue('Failed to predict performance');
    }
  }
);

export const optimizeTeamWorkload = createAsyncThunk(
  'aiAnalytics/optimizeTeamWorkload',
  async ({ teamData, workloadData }, { rejectWithValue }) => {
    try {
      const result = aiAnalyticsService.optimizeWorkload(teamData, workloadData);
      if (result.error) {
        return rejectWithValue(result.error);
      }
      return result;
    } catch (error) {
      return rejectWithValue('Failed to optimize workload');
    }
  }
);

const initialState = {
  // Leave predictions
  leavePredictions: null,
  leavePatterns: null,
  leaveInsights: [],
  
  // Salary predictions
  salaryPredictions: null,
  salaryTrends: null,
  marketInsights: null,
  
  // Anomaly detection
  anomalies: [],
  riskAssessment: null,
  employeeClusters: [],
  
  // Performance predictions
  performancePredictions: null,
  highPotentialEmployees: [],
  featureImportance: [],
  
  // Workload optimization
  workloadAnalysis: null,
  optimizationRecommendations: [],
  
  // General state
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  // AI model status
  modelAccuracy: {},
  dataQuality: 'unknown',
  recommendations: []
};

const aiAnalyticsSlice = createSlice({
  name: 'aiAnalytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPredictions: (state) => {
      state.leavePredictions = null;
      state.salaryPredictions = null;
      state.performancePredictions = null;
      state.workloadAnalysis = null;
    },
    clearAnomalies: (state) => {
      state.anomalies = [];
      state.riskAssessment = null;
      state.employeeClusters = [];
    },
    updateDataQuality: (state, action) => {
      state.dataQuality = action.payload;
    },
    addRecommendation: (state, action) => {
      state.recommendations.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    setModelAccuracy: (state, action) => {
      state.modelAccuracy = { ...state.modelAccuracy, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Leave Predictions
      .addCase(generateLeavePredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateLeavePredictions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leavePredictions = action.payload.predictions;
        state.leavePatterns = action.payload.patterns;
        state.leaveInsights = action.payload.insights;
        state.modelAccuracy.leave = action.payload.modelAccuracy;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(generateLeavePredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Salary Predictions
      .addCase(generateSalaryPredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateSalaryPredictions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salaryPredictions = action.payload.predictions;
        state.salaryTrends = action.payload.currentTrend;
        state.marketInsights = action.payload.marketInsights;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(generateSalaryPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Anomaly Detection
      .addCase(detectEmployeeAnomalies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(detectEmployeeAnomalies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.anomalies = action.payload.anomalies;
        state.riskAssessment = action.payload.riskAssessment;
        state.employeeClusters = action.payload.clusters;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(detectEmployeeAnomalies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Performance Predictions
      .addCase(predictEmployeePerformance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(predictEmployeePerformance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performancePredictions = action.payload.predictions;
        state.highPotentialEmployees = action.payload.highPotential;
        state.featureImportance = action.payload.featureImportance;
        state.modelAccuracy.performance = action.payload.modelAccuracy;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(predictEmployeePerformance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Workload Optimization
      .addCase(optimizeTeamWorkload.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(optimizeTeamWorkload.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workloadAnalysis = action.payload.currentDistribution;
        state.optimizationRecommendations = action.payload.recommendations;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(optimizeTeamWorkload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearPredictions,
  clearAnomalies,
  updateDataQuality,
  addRecommendation,
  clearRecommendations,
  setModelAccuracy
} = aiAnalyticsSlice.actions;

// Selectors
export const selectAIAnalytics = (state) => state.aiAnalytics;
export const selectLeavePredictions = (state) => state.aiAnalytics.leavePredictions;
export const selectSalaryPredictions = (state) => state.aiAnalytics.salaryPredictions;
export const selectAnomalies = (state) => state.aiAnalytics.anomalies;
export const selectPerformancePredictions = (state) => state.aiAnalytics.performancePredictions;
export const selectWorkloadAnalysis = (state) => state.aiAnalytics.workloadAnalysis;
export const selectAIInsights = (state) => state.aiAnalytics.leaveInsights;
export const selectHighPotentialEmployees = (state) => state.aiAnalytics.highPotentialEmployees;
export const selectRiskAssessment = (state) => state.aiAnalytics.riskAssessment;
export const selectModelAccuracy = (state) => state.aiAnalytics.modelAccuracy;
export const selectDataQuality = (state) => state.aiAnalytics.dataQuality;
export const selectRecommendations = (state) => state.aiAnalytics.recommendations;
export const selectAILoading = (state) => state.aiAnalytics.isLoading;
export const selectAIError = (state) => state.aiAnalytics.error;
export const selectLastUpdated = (state) => state.aiAnalytics.lastUpdated;

export default aiAnalyticsSlice.reducer;
