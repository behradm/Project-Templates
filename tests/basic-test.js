// Basic test script to verify the application works
const http = require('http');

// Test that the server is running and responding
function testServerResponse() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Server is responding with status 200');
          // Check for keywords that should be in the HTML response
          if (data.includes('Next.js Fullstack Template')) {
            console.log('✅ Homepage contains the template title');
            
            if (data.includes('Sign in with GitHub')) {
              console.log('✅ GitHub authentication option is available');
            } else {
              console.log('❌ GitHub authentication option is missing');
              resolve(false);
              return;
            }
            
            if (data.includes('Email address') && data.includes('Password')) {
              console.log('✅ Email/password login form is present');
            } else {
              console.log('❌ Email/password login form is missing');
              resolve(false);
              return;
            }
            
            // Modified to check for either variant of the text
            if (data.includes("Don't have an account?") || data.includes("Don&#x27;t have an account?")) {
              console.log('✅ Sign up option is available');
            } else {
              console.log('❌ Sign up option is missing');
              resolve(false);
              return;
            }
            
            // All checks passed
            resolve(true);
          } else {
            console.log('❌ Homepage does not contain expected content');
            resolve(false);
          }
        } else {
          console.log(`❌ Server responded with unexpected status: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error connecting to server: ${error.message}`);
      reject(error);
    });

    req.end();
  });
}

// Test signup API functionality
function testSignupAPI() {
  return new Promise((resolve, reject) => {
    // Generate a unique test email to avoid conflicts
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testPassword123';
    
    const data = JSON.stringify({
      email: testEmail,
      password: testPassword
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    console.log(`🧪 Testing signup API with email: ${testEmail}`);
    
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          
          if (res.statusCode === 201 && parsedData.success) {
            console.log('✅ Signup API successfully created a user');
            console.log(`✅ User ID: ${parsedData.userId}`);
            resolve(true);
          } else {
            console.log(`❌ Signup API failed: ${parsedData.message || 'Unknown error'}`);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse API response');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error testing signup API: ${error.message}`);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting basic application tests...');
  
  try {
    // Test basic server response
    console.log('\n📋 TESTING SERVER RESPONSE:');
    const serverResponseResult = await testServerResponse();
    
    // Test signup API
    console.log('\n📋 TESTING SIGNUP API:');
    const signupResult = await testSignupAPI();
    
    if (serverResponseResult && signupResult) {
      console.log('\n🎉 All tests passed! The application is running correctly with working authentication.');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed. Please check the logs above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Tests failed with an error:', error);
    process.exit(1);
  }
}

// Wait for the server to be fully ready before running tests
setTimeout(runTests, 2000);
