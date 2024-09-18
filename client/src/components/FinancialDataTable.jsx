import React from 'react';

const FinancialDataTable = ({ account }) => {
  // Check if account or account.accounts is undefined or null
  if (!account || !account.accounts) {
    return <p>No account data available</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Account Name</th>
          <th>Account Type</th>
          <th>Subtype</th>
          <th>Available Balance</th>
          <th>Current Balance</th>
          <th>Account Number (Masked)</th>
          <th>Routing Number</th>
        </tr>
      </thead>
      <tbody>
        {account.accounts.map((account) => (
          <tr key={account.account_id}>
            <td>{account.name}</td>
            <td>{account.type}</td>
            <td>{account.subtype}</td>
            <td>{account.balances.available}</td>
            <td>{account.balances.current}</td>
            <td>{account.mask}</td>
            <td>{account.routing}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FinancialDataTable;