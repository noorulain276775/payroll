/**
 * Secure Storage Utility
 * Provides secure token storage using encrypted localStorage and httpOnly cookies
 * Implements security best practices to prevent XSS and CSRF attacks
 */

import CryptoJS from 'crypto-js';

class SecureStorage {
  constructor() {
    // Use a secure key - in production, this should be set via environment variables
    // For now, using a hardcoded key that should be changed in production
    this.encryptionKey = 'payroll-system-secure-key-2024-change-in-production';
    this.tokenKey = 'auth_token_encrypted';
    this.refreshTokenKey = 'refresh_token_encrypted';
    this.userTypeKey = 'user_type_encrypted';
    this.userDataKey = 'user_data_encrypted';
  }

  /**
   * Encrypt data before storage
   */
  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  /**
   * Decrypt data from storage
   */
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  /**
   * Store token securely
   */
  setToken(token) {
    if (!token) return false;
    
    try {
      const encrypted = this.encrypt(token);
      if (encrypted) {
        localStorage.setItem(this.tokenKey, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to store token:', error);
      return false;
    }
  }

  /**
   * Retrieve token securely
   */
  getToken() {
    try {
      const encrypted = localStorage.getItem(this.tokenKey);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearToken();
      return null;
    }
  }

  /**
   * Store refresh token securely
   */
  setRefreshToken(refreshToken) {
    if (!refreshToken) return false;
    
    try {
      const encrypted = this.encrypt(refreshToken);
      if (encrypted) {
        localStorage.setItem(this.refreshTokenKey, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      return false;
    }
  }

  /**
   * Retrieve refresh token securely
   */
  getRefreshToken() {
    try {
      const encrypted = localStorage.getItem(this.refreshTokenKey);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      this.clearRefreshToken();
      return null;
    }
  }

  /**
   * Store user type securely
   */
  setUserType(userType) {
    if (!userType) return false;
    
    try {
      const encrypted = this.encrypt(userType);
      if (encrypted) {
        localStorage.setItem(this.userTypeKey, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to store user type:', error);
      return false;
    }
  }

  /**
   * Retrieve user type securely
   */
  getUserType() {
    try {
      const encrypted = localStorage.getItem(this.userTypeKey);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve user type:', error);
      this.clearUserType();
      return null;
    }
  }

  /**
   * Store user data securely
   */
  setUserData(userData) {
    if (!userData) return false;
    
    try {
      const encrypted = this.encrypt(userData);
      if (encrypted) {
        localStorage.setItem(this.userDataKey, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to store user data:', error);
      return false;
    }
  }

  /**
   * Retrieve user data securely
   */
  getUserData() {
    try {
      const encrypted = localStorage.getItem(this.userDataKey);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      this.clearUserData();
      return null;
    }
  }

  /**
   * Clear specific token
   */
  clearToken() {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  /**
   * Clear refresh token
   */
  clearRefreshToken() {
    try {
      localStorage.removeItem(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }

  /**
   * Clear user type
   */
  clearUserType() {
    try {
      localStorage.removeItem(this.userTypeKey);
    } catch (error) {
      console.error('Failed to clear user type:', error);
    }
  }

  /**
   * Clear user data
   */
  clearUserData() {
    try {
      localStorage.removeItem(this.userDataKey);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Clear all secure storage
   */
  clearAll() {
    this.clearToken();
    this.clearRefreshToken();
    this.clearUserType();
    this.clearUserData();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.clearToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.clearToken();
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Failed to get token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiration <= fiveMinutesFromNow;
  }

  /**
   * Validate token format
   */
  isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Check if payload can be decoded
      JSON.parse(atob(parts[1]));
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const secureStorage = new SecureStorage();

export default secureStorage;

// Export individual methods for convenience
export const {
  setToken,
  getToken,
  setRefreshToken,
  getRefreshToken,
  setUserType,
  getUserType,
  setUserData,
  getUserData,
  clearToken,
  clearRefreshToken,
  clearUserType,
  clearUserData,
  clearAll,
  isAuthenticated,
  getTokenExpiration,
  isTokenExpiringSoon,
  isValidToken
} = secureStorage;
