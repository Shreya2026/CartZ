import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const testEndpoints = async () => {
      const tests = [
        { name: 'Health Check', url: '/health' },
        { name: 'CORS Test', url: '/test-cors' },
        { name: 'Products API', url: '/products' }
      ];

      const testResults = [];

      for (const test of tests) {
        try {
          console.log(`Testing ${test.name}: ${api.defaults.baseURL}${test.url}`);
          const response = await api.get(test.url);
          testResults.push({
            name: test.name,
            status: 'SUCCESS',
            data: response.data,
            statusCode: response.status
          });
        } catch (error) {
          console.error(`${test.name} failed:`, error);
          testResults.push({
            name: test.name,
            status: 'ERROR',
            error: error.message,
            details: error.response?.data || 'Network error'
          });
        }
      }

      setResults(testResults);
    };

    testEndpoints();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className={`p-4 rounded ${result.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className="font-semibold">{result.name}</h3>
            <p className={`text-sm ${result.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {result.status}
            </p>
            {result.status === 'SUCCESS' ? (
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <div className="text-xs mt-2">
                <p>Error: {result.error}</p>
                <pre className="bg-gray-100 p-2 rounded mt-1">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;
