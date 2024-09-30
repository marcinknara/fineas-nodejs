import React from 'react';

function FinancialDataTable({ accounts }) {
  console.log('Accounts prop:', accounts);

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
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <tr key={account.account_id}>
              <td>{account.name}</td>
              <td>{account.type}</td>
              <td>{account.subtype}</td>
              <td>{account.available_balance}</td>
              <td>{account.current_balance}</td>
              <td>{account.mask}</td>
              <td>{account.routing}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No account data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default FinancialDataTable;