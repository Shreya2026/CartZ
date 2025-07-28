// Simple test to check if backend is accessible
console.log('Testing backend connectivity...');

const testUrls = [
  'http://localhost:5000/api/health',
  'http://localhost:5000/api/test-cors',
  'http://localhost:5000/api/products'
];

testUrls.forEach(async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ ${url}: ${response.status} - ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`❌ ${url}: ERROR - ${error.message}`);
  }
});
