/*

https://pixe.la/v1/docs/

The goal here is to be able to save graphs (habits) that users can save to their account in the database
*/

import { API_BASE_URL } from '../config/constants';

interface PixelaUser {
  // can register with these 4 fields
  token: string;
  username: string;
  agreeTermsOfService: "yes" | "no";
  notMinor: "yes" | "no";
}

export const registerUser = async (userData: PixelaUser) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async (username: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      }
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logoutUser = async (username: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      }
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getUser = async (username: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      }
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Get user failed:', error);
    throw error;
  }
};

export const updateUser = async (username: string, token: string, userData: PixelaUser) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
};

export const deleteUser = async (username: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      }
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Delete user failed:', error);
    throw error;
  }
};

export const getUserGraphs = async (username: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}/graphs`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': token
      }
    });

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Get user graphs failed:', error);
    throw error;
  }
};
