import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import countriesApi from '../api/countries';
import CountryModal from './CountryModal';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';

const Countries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, country: null });

  // Fetch countries based on user access level
  const {
    data: countries = [],
    isLoading: countriesLoading,
    error: countriesError
  } = useQuery({
    queryKey: ['countries', user?.accessLevel],
    queryFn: () => countriesApi.getAll(user?.accessLevel || 1),
    enabled: !!user?.accessLevel
  });

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.alpha2Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.alpha3Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const createCountryMutation = useMutation({
    mutationFn: countriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['countries', user?.accessLevel]);
      setIsModalOpen(false);
      setEditingCountry(null);
    },
    onError: (error) => {
      console.error('Error creating country:', error);
    }
  });

  const updateCountryMutation = useMutation({
    mutationFn: ({ countryId, countryData }) => countriesApi.update(countryId, countryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['countries', user?.accessLevel]);
      setIsModalOpen(false);
      setEditingCountry(null);
    },
    onError: (error) => {
      console.error('Error updating country:', error);
    }
  });

  const deleteCountryMutation = useMutation({
    mutationFn: countriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['countries', user?.accessLevel]);
      setDeleteDialog({ isOpen: false, country: null });
    },
    onError: (error) => {
      console.error('Error deleting country:', error);
    }
  });

  const handleCreateCountry = (countryData) => {
    createCountryMutation.mutate(countryData);
  };

  const handleUpdateCountry = (countryData) => {
    if (editingCountry) {
      updateCountryMutation.mutate({ countryId: editingCountry.id, countryData });
    }
  };

  const handleDeleteCountry = (country) => {
    deleteCountryMutation.mutate(country.id);
  };

  const handleEditCountry = (country) => {
    setEditingCountry(country);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCountry(null);
  };

  const handleDeleteClick = (country) => {
    setDeleteDialog({ isOpen: true, country });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.country) {
      handleDeleteCountry(deleteDialog.country);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (countriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (countriesError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Countries</h3>
        <p className="text-gray-700">{countriesError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <p className="mt-1 text-sm text-gray-700">
            Manage country information and settings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Country
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Countries Table */}
      {filteredCountries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
          <p className="text-gray-700 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new country.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Country
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Calling Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {filteredCountries.map((country, index) => (
                  <motion.tr
                    key={country.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {country.alpha2Code}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {country.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{country.alpha2Code}</div>
                        <div className="text-gray-500">{country.alpha3Code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">
                        {country.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">
                        +{country.callingCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(country.status)}`}>
                        {country.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCountry(country)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                          title="Edit country"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(country)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                          title="Delete country"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CountryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingCountry ? handleUpdateCountry : handleCreateCountry}
        country={editingCountry}
        isLoading={createCountryMutation.isLoading || updateCountryMutation.isLoading}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, country: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Country"
        message={`Are you sure you want to delete "${deleteDialog.country?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteCountryMutation.isLoading}
      />
    </div>
  );
};

export default Countries;
