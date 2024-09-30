import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import FinancialDataTable from '../components/FinancialDataTable';
import PlaidLinkButton from '../components/PlaidLinkButton';

axios.defaults.baseURL = 'http://localhost:8000';

function DashboardPage() {
  const { auth } = useContext(AuthContext);
  const [accountsData, setAccountsData] = useState([]);

  // Fetch accounts data on mount
  useEffect(() => {
    const fetchAccountsData = async () => {
      console.log('Fetching accounts data...');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in again');
      }

      try {
        // Fetch accounts data
        const accountsResponse = await axios.get('/plaid/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Accounts data received:', accountsResponse.data);
        setAccountsData(accountsResponse.data.accounts);
      } catch (error) {
        console.error('Error fetching accounts data:', error);
      }
    };

    if (auth) {
      fetchAccountsData();
    }
  }, [auth]);

  const refreshAccountsData = () => {
    // Fetch accounts data again
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, please log in again');
    }

    axios.get('/plaid/accounts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Accounts data refreshed:', response.data);
        setAccountsData(response.data.accounts);
      })
      .catch(error => {
        console.error('Error fetching accounts data:', error);
      });
  };

  return (
    <>
      <h1>Plaid Dashboard</h1>
      <PlaidLinkButton onSuccess={refreshAccountsData} />
      <FinancialDataTable accounts={accountsData} />
    </>
  );
}

export default DashboardPage;