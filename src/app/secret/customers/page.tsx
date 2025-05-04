'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import type { Customer, CustomerStatus } from '@/types/database'; // Corrected import path

// Define the possible statuses for the dropdown
const customerStatuses: CustomerStatus[] = [
  "Potential Customer / negotiating",
  "Paid few groups",
  "Paid full groups"
];

// Define Facebook group type
interface FacebookGroup {
  id: number;
  name: string;
  url: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for Facebook groups
  const [facebookGroups, setFacebookGroups] = useState<FacebookGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState<boolean>(false);
  
  // State to control form visibility
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for the add customer form
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<CustomerStatus>(customerStatuses[0]);
  const [newFacebookUrl, setNewFacebookUrl] = useState('');
  const [newContactProfile, setNewContactProfile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch customers and facebook groups
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch customers
        const customersResponse = await fetch('/api/customers');
        if (!customersResponse.ok) {
          throw new Error(`HTTP error! status: ${customersResponse.status}`);
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData as Customer[]);
        
        // Fetch Facebook groups
        setLoadingGroups(true);
        const groupsResponse = await fetch('/api/facebook-groups');
        if (!groupsResponse.ok) {
          throw new Error(`Failed to fetch Facebook groups: ${groupsResponse.status}`);
        }
        const groupsData = await groupsResponse.json();
        setFacebookGroups(groupsData);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
        setLoadingGroups(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission to add a new customer
  const handleAddCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!newName) {
      setFormError('Customer name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          status: newStatus,
          facebookProfileUrl: newFacebookUrl || null,
          contactProfile: newContactProfile || null,
          email: newEmail || null,
          groupsPurchased: selectedGroups,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newCustomer = await response.json();
      
      // Add the new customer to the state to update the table
      setCustomers([newCustomer, ...customers]);

      // Reset form fields
      setNewName('');
      setNewStatus(customerStatuses[0]);
      setNewFacebookUrl('');
      setNewContactProfile('');
      setNewEmail('');
      setSelectedGroups([]);
      
      // Hide the form after successful submission
      setShowAddForm(false);

    } catch (e) {
      console.error("Failed to add customer:", e);
      setFormError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle group selection
  const handleGroupSelect = (groupName: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName) // Remove if already selected
        : [...prev, groupName] // Add if not already selected
    );
  };

  // Function for handling edits to a customer's groups
  const handleEditGroupSelect = (groupName: string) => {
    if (!editingCustomer) return;
    
    const currentGroups = [...(editingCustomer.groupsPurchased || [])];
    const updatedGroups = currentGroups.includes(groupName)
      ? currentGroups.filter(g => g !== groupName)
      : [...currentGroups, groupName];
    
    setEditingCustomer({
      ...editingCustomer,
      groupsPurchased: updatedGroups
    });
  };

  // Function to open edit modal
  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  // Function to update a customer
  const handleUpdateCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
    
    setIsEditing(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCustomer.name,
          status: editingCustomer.status,
          facebookProfileUrl: editingCustomer.facebookProfileUrl || null,
          contactProfile: editingCustomer.contactProfile || null,
          email: editingCustomer.email || null,
          groupsPurchased: editingCustomer.groupsPurchased || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedCustomer = await response.json();
      
      // Update the customer in the state
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      
      // Close the modal
      setShowEditModal(false);
      setEditingCustomer(null);

    } catch (e) {
      console.error("Failed to update customer:", e);
      setFormError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsEditing(false);
    }
  };

  // Function to open delete confirmation
  const handleDeleteClick = (customerId: string) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  // Function to delete a customer
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/customers/${customerToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      // Remove the customer from state
      setCustomers(customers.filter(c => c.id !== customerToDelete));
      
      // Close the modal
      setShowDeleteModal(false);
      setCustomerToDelete(null);

    } catch (e) {
      console.error("Failed to delete customer:", e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to reset form and hide it
  const handleCancelAdd = () => {
    setNewName('');
    setNewStatus(customerStatuses[0]);
    setNewFacebookUrl('');
    setNewContactProfile('');
    setNewEmail('');
    setSelectedGroups([]);
    setFormError(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customers</h1>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Customer
          </button>
        )}
      </div>

      {/* Add Customer Form - only shown when showAddForm is true */}
      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="mb-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Customer</h2>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Name*</label>
              <input 
                type="text" 
                id="name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status*</label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as CustomerStatus)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {customerStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="facebookUrl" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Facebook Profile URL</label>
              <input 
                type="url" 
                id="facebookUrl" 
                value={newFacebookUrl}
                onChange={(e) => setNewFacebookUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
             <div>
              <label htmlFor="contactProfile" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Contact Profile</label>
              <input 
                type="text" 
                id="contactProfile" 
                value={newContactProfile}
                onChange={(e) => setNewContactProfile(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Internal profile name/ID"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                id="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Groups Purchased
              </label>
              {loadingGroups ? (
                <p className="text-sm text-gray-500">Loading groups...</p>
              ) : (
                <div className="border border-gray-300 rounded p-2 max-h-60 overflow-y-auto">
                  {facebookGroups.length === 0 ? (
                    <p className="text-sm text-gray-500">No Facebook groups available</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {facebookGroups.map(group => (
                        <div key={group.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`group-${group.id}`}
                            checked={selectedGroups.includes(group.name)}
                            onChange={() => handleGroupSelect(group.name)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`group-${group.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {group.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
          <div className="mt-4 flex space-x-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Customer'}
            </button>
            <button 
              type="button" 
              onClick={handleCancelAdd}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Customer Table */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Existing Customers</h2>
      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">Error loading customers: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Facebook Profile</th>
                <th scope="col" className="px-6 py-3">Contact Profile</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Groups Purchased</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.name}</td>
                    <td className="px-6 py-4">{customer.status}</td>
                    <td className="px-6 py-4">
                      {customer.facebookProfileUrl ? (
                        <a href={customer.facebookProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Link
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">{customer.contactProfile || 'N/A'}</td>
                    <td className="px-6 py-4">{customer.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {customer.groupsPurchased && customer.groupsPurchased.length > 0
                        ? customer.groupsPurchased.join(', ')
                        : 'None'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdateCustomer}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Customer</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCustomer(null);
                      setFormError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Name*</label>
                    <input 
                      type="text" 
                      id="edit-name" 
                      value={editingCustomer.name}
                      onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-status" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status*</label>
                    <select
                      id="edit-status"
                      value={editingCustomer.status}
                      onChange={(e) => setEditingCustomer({...editingCustomer, status: e.target.value as CustomerStatus})}
                      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {customerStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-facebookUrl" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Facebook Profile URL</label>
                    <input 
                      type="url" 
                      id="edit-facebookUrl" 
                      value={editingCustomer.facebookProfileUrl || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, facebookProfileUrl: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-contactProfile" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Contact Profile</label>
                    <input 
                      type="text" 
                      id="edit-contactProfile" 
                      value={editingCustomer.contactProfile || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, contactProfile: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                      type="email" 
                      id="edit-email" 
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Groups Purchased
                    </label>
                    {loadingGroups ? (
                      <p className="text-sm text-gray-500">Loading groups...</p>
                    ) : (
                      <div className="border border-gray-300 rounded p-2 max-h-60 overflow-y-auto">
                        {facebookGroups.length === 0 ? (
                          <p className="text-sm text-gray-500">No Facebook groups available</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {facebookGroups.map(group => (
                              <div key={`edit-group-${group.id}`} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`edit-group-${group.id}`}
                                  checked={(editingCustomer.groupsPurchased || []).includes(group.name)}
                                  onChange={() => handleEditGroupSelect(group.name)}
                                  className="mr-2"
                                />
                                <label 
                                  htmlFor={`edit-group-${group.id}`} 
                                  className="text-sm cursor-pointer"
                                >
                                  {group.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCustomer(null);
                      setFormError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditing}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isEditing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-5">
                Are you sure you want to delete this customer? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCustomerToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 