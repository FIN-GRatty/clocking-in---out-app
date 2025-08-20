const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Clocking Out API...\n');

  try {
    // Test 1: Get admin overview
    console.log('1. Testing admin overview...');
    const overviewResponse = await fetch(`${BASE_URL}/api/admin/overview`);
    const overview = await overviewResponse.json();
    console.log('✅ Admin overview:', overview);

    // Test 2: Create test employee
    console.log('\n2. Creating test employee...');
    const createResponse = await fetch(`${BASE_URL}/api/employee/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'TEST001',
        name: 'Test Employee',
        email: 'test@company.com'
      })
    });
    const createResult = await createResponse.json();
    console.log('✅ Employee creation:', createResult);

    // Test 3: Get employee status
    console.log('\n3. Getting employee status...');
    const statusResponse = await fetch(`${BASE_URL}/api/employee/TEST001/status`);
    const status = await statusResponse.json();
    console.log('✅ Employee status:', status);

    // Test 4: Clock in
    console.log('\n4. Testing clock in...');
    const clockInResponse = await fetch(`${BASE_URL}/api/time/clockin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'TEST001' })
    });
    const clockInResult = await clockInResponse.json();
    console.log('✅ Clock in:', clockInResult);

    // Test 5: Start lunch
    console.log('\n5. Testing lunch start...');
    const lunchStartResponse = await fetch(`${BASE_URL}/api/time/lunch/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'TEST001' })
    });
    const lunchStartResult = await lunchStartResponse.json();
    console.log('✅ Lunch start:', lunchStartResult);

    // Test 6: End lunch
    console.log('\n6. Testing lunch end...');
    const lunchEndResponse = await fetch(`${BASE_URL}/api/time/lunch/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'TEST001' })
    });
    const lunchEndResult = await lunchEndResponse.json();
    console.log('✅ Lunch end:', lunchEndResult);

    // Test 7: Clock out
    console.log('\n7. Testing clock out...');
    const clockOutResponse = await fetch(`${BASE_URL}/api/time/clockout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'TEST001' })
    });
    const clockOutResult = await clockOutResponse.json();
    console.log('✅ Clock out:', clockOutResult);

    // Test 8: Get time history
    console.log('\n8. Getting time history...');
    const historyResponse = await fetch(`${BASE_URL}/api/employee/TEST001/history`);
    const history = await historyResponse.json();
    console.log('✅ Time history:', history);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📱 You can now test the frontend at: http://localhost:3000');
    console.log('🔑 Login with: ADMIN001 (admin) or TEST001 (employee)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 5000');
    console.log('   Run: npm start');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/overview`);
    if (response.ok) {
      testAPI();
    } else {
      console.log('❌ Server responded but with error status');
    }
  } catch (error) {
    console.log('❌ Cannot connect to server. Make sure it\'s running on port 5000');
    console.log('   Run: npm start');
  }
}

checkServer();
