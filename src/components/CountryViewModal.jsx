import React from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const CountryViewModal = ({ isOpen, onClose, country, isLoading = false }) => {
  if (!country) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Country Details" size="lg">
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Country Header */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {country.alpha2Code}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{country.name}</h2>
                <p className="text-gray-600">Country Information</p>
              </div>
            </div>

            {/* Country Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country Name</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {country.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Flag</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {country.flag}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        country.status?.toLowerCase() === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {country.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Codes and Currency */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Codes & Currency
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alpha 2 Code</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                      {country.alpha2Code}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alpha 3 Code</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                      {country.alpha3_code}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calling Code</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      +{country.callingCode}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                      {country.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Country ID */}
            <div className="border-t border-gray-200 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country ID</label>
                <p className="mt-1 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md font-mono">
                  {country.id}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default CountryViewModal;
