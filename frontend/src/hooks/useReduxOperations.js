import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useState } from 'react';

/**
 * Custom hook for common Redux operations
 * Provides authentication check, navigation, and common patterns
 */
export const useReduxOperations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check authentication and redirect if needed - memoized with useCallback
  const checkAuth = useCallback((redirectTo = '/') => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  // Safe dispatch with authentication check - memoized with useCallback
  const safeDispatch = useCallback((action, requireAuth = true) => {
    if (requireAuth && !checkAuth()) {
      return false;
    }
    dispatch(action);
    return true;
  }, [dispatch, checkAuth]);

  // Handle API errors - memoized with useCallback
  const handleApiError = useCallback((error, fallbackMessage = 'An error occurred') => {
    if (error?.response?.status === 401) {
      navigate('/');
      return 'Session expired. Please login again.';
    }
    return error?.response?.data?.message || error?.message || fallbackMessage;
  }, [navigate]);

  return {
    dispatch,
    navigate,
    isAuthenticated,
    checkAuth,
    safeDispatch,
    handleApiError,
  };
};

/**
 * Hook for managing loading states
 */
export const useLoadingState = (loadingSelector, errorSelector) => {
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  const hasError = Boolean(error);
  const isSuccess = !isLoading && !hasError;

  return {
    isLoading,
    error,
    hasError,
    isSuccess,
  };
};

/**
 * Hook for managing form states
 */
export const useFormState = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateFields = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const setFieldError = (field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  const validateForm = (validationRules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const value = formData[field];
      const rules = validationRules[field];

      if (rules.required && (!value || value.trim() === '')) {
        newErrors[field] = `${field} is required`;
        isValid = false;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
        isValid = false;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${field} format is invalid`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    formData,
    errors,
    updateField,
    updateFields,
    setFieldError,
    clearErrors,
    resetForm,
    validateForm,
  };
};

/**
 * Hook for managing pagination
 */
export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const updatePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    updatePageSize,
    setTotalCount,
  };
};
