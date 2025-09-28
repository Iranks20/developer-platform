import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const CountryModal = ({ isOpen, onClose, onSubmit, country, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    alpha2Code: '',
    callingCode: '',
    alpha3Code: '',
    flag: '',
    currency: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (country) {
      // Capitalize the first letter of status to match select options
      const capitalizedStatus = country.status ? 
        country.status.charAt(0).toUpperCase() + country.status.slice(1).toLowerCase() : 'Active';
      
      setFormData({
        name: country.name || '',
        alpha2Code: country.alpha2Code || '',
        callingCode: country.callingCode || '',
        alpha3Code: country.alpha3_code || '',
        flag: country.flag || '',
        currency: country.currency || '',
        status: capitalizedStatus
      });
    } else {
      setFormData({
        name: '',
        alpha2Code: '',
        callingCode: '',
        alpha3Code: '',
        flag: '',
        currency: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [country, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Only validate fields that are shown in the form
    if (!country) {
      // Validation for create mode (all fields required)
      if (!formData.name.trim()) {
        newErrors.name = 'Country name is required';
      }

      if (!formData.alpha2Code.trim()) {
        newErrors.alpha2Code = 'Alpha 2 code is required';
      } else if (formData.alpha2Code.length !== 2) {
        newErrors.alpha2Code = 'Alpha 2 code must be exactly 2 characters';
      }

      if (!formData.callingCode.trim()) {
        newErrors.callingCode = 'Calling code is required';
      }

      if (!formData.alpha3Code.trim()) {
        newErrors.alpha3Code = 'Alpha 3 code is required';
      } else if (formData.alpha3Code.length !== 3) {
        newErrors.alpha3Code = 'Alpha 3 code must be exactly 3 characters';
      }

      if (!formData.currency.trim()) {
        newErrors.currency = 'Currency is required';
      }
    }

    // Flag is always required (for both create and edit)
    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert status to lowercase for API submission
      const submitData = {
        ...formData,
        status: formData.status.toLowerCase()
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      alpha2Code: '',
      callingCode: '',
      alpha3Code: '',
      flag: '',
      currency: '',
      status: 'Active'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={country ? 'Edit Country' : 'Add New Country'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!country && (
          <>
            {/* Country Name - Only for create */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Country Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter country name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Alpha 2 Code - Only for create */}
            <div>
              <label htmlFor="alpha2Code" className="block text-sm font-medium text-gray-700 mb-1">
                Alpha 2 Code *
              </label>
              <input
                type="text"
                id="alpha2Code"
                value={formData.alpha2Code}
                onChange={(e) => handleChange('alpha2Code', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.alpha2Code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., RW"
                maxLength="2"
              />
              {errors.alpha2Code && <p className="mt-1 text-sm text-red-600">{errors.alpha2Code}</p>}
            </div>

            {/* Alpha 3 Code - Only for create */}
            <div>
              <label htmlFor="alpha3Code" className="block text-sm font-medium text-gray-700 mb-1">
                Alpha 3 Code *
              </label>
              <input
                type="text"
                id="alpha3Code"
                value={formData.alpha3Code}
                onChange={(e) => handleChange('alpha3Code', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.alpha3Code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., RWA"
                maxLength="3"
              />
              {errors.alpha3Code && <p className="mt-1 text-sm text-red-600">{errors.alpha3Code}</p>}
            </div>

            {/* Calling Code - Only for create */}
            <div>
              <label htmlFor="callingCode" className="block text-sm font-medium text-gray-700 mb-1">
                Calling Code *
              </label>
              <input
                type="text"
                id="callingCode"
                value={formData.callingCode}
                onChange={(e) => handleChange('callingCode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.callingCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 250"
              />
              {errors.callingCode && <p className="mt-1 text-sm text-red-600">{errors.callingCode}</p>}
            </div>

            {/* Currency - Only for create */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <input
                type="text"
                id="currency"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currency ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., RWF"
              />
              {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
            </div>
          </>
        )}

        {/* Flag - Always editable */}
        <div>
          <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
            Flag *
          </label>
          <input
            type="text"
            id="flag"
            value={formData.flag}
            onChange={(e) => handleChange('flag', e.target.value.toLowerCase())}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.flag ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., rwanda"
          />
          {errors.flag && <p className="mt-1 text-sm text-red-600">{errors.flag}</p>}
        </div>

        {/* Status - Always editable */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {country ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              country ? 'Update Country' : 'Create Country'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CountryModal;
