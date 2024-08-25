import React from 'react';

function FinancialDataTable({ account }) {
  return (
    <div>
      <h2>Accounts Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Subtype</th>
            <th>Available Balance</th>
            <th>Current Balance</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
  {account && account.accounts && account.accounts.length > 0 ? (
    account.accounts.map((acc) => (
      <tr key={acc.account_id}>
        <td>{acc.name}</td>
        <td>{acc.type}</td>
        <td>{acc.subtype}</td>
        <td>{acc.balances.available}</td>
        <td>{acc.balances.current}</td>
        <td>{acc.balances.iso_currency_code}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">No accounts available</td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
}
export default FinancialDataTable;