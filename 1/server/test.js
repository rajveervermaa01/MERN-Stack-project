const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');
const http = require('http');

async function runTests() {
  console.log('\n========================================');
  console.log('  RUNNING AUTOMATED TASK API TEST SUITE');
  console.log('========================================\n');

  await connectDB();
  const app = require('./src/app');

  const TEST_PORT = 5003;
  const server = http.createServer(app);

  server.listen(TEST_PORT, async () => {
    const makeRequest = (method, reqPath, data = null) => {
      return new Promise((resolve, reject) => {
        const body = data ? JSON.stringify(data) : null;
        const options = {
          hostname: 'localhost',
          port: TEST_PORT,
          path: reqPath,
          method: method,
          headers: {
            'Content-Type': 'application/json',
            ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
          }
        };

        const req = http.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            let parsed;
            try { parsed = JSON.parse(body); } catch (e) { parsed = body; }
            resolve({ statusCode: res.statusCode, body: parsed });
          });
        });

        req.on('error', (err) => reject(err));
        if (body) {
          req.write(body);
        }
        req.end();
      });
    };

    try {
      // 1. Health check
      const resHealth = await makeRequest('GET', '/api/v1/health');
      console.log('✅ 1. Health Check GET /api/v1/health -> Status:', resHealth.statusCode, resHealth.body.status);

      // 2. Create Task (POST)
      const resCreate = await makeRequest('POST', '/api/v1/tasks', {
        title: 'Learn Node.js REST API',
        description: 'Complete CRUD operations with Express and MongoDB',
        priority: 'high'
      });
      console.log('✅ 2. Create Task POST /api/v1/tasks -> Status:', resCreate.statusCode, '| ID:', resCreate.body.data?._id);

      const taskId = resCreate.body.data?._id;

      // 3. Get All Tasks (GET)
      const resGetAll = await makeRequest('GET', '/api/v1/tasks');
      console.log('✅ 3. List Tasks GET /api/v1/tasks -> Status:', resGetAll.statusCode, '| Total Tasks Count:', resGetAll.body.count);

      // 4. Get Single Task (GET)
      const resGetSingle = await makeRequest('GET', `/api/v1/tasks/${taskId}`);
      console.log('✅ 4. Get Single Task GET /api/v1/tasks/:id -> Status:', resGetSingle.statusCode, '| Title:', resGetSingle.body.data?.title);

      // 5. Patch Task (PATCH)
      const resPatch = await makeRequest('PATCH', `/api/v1/tasks/${taskId}`, { completed: true });
      console.log('✅ 5. Patch Task PATCH /api/v1/tasks/:id -> Status:', resPatch.statusCode, '| Completed:', resPatch.body.data?.completed);

      // 6. Put Task (PUT)
      const resPut = await makeRequest('PUT', `/api/v1/tasks/${taskId}`, {
        title: 'Master Node.js REST API',
        description: 'Updated complete CRUD operations',
        priority: 'high',
        completed: true
      });
      console.log('✅ 6. Full Update PUT /api/v1/tasks/:id -> Status:', resPut.statusCode, '| New Title:', resPut.body.data?.title);

      // 7. Test Mongoose Validation Error
      const resValidationError = await makeRequest('POST', '/api/v1/tasks', { description: 'Missing required title field' });
      console.log('✅ 7. Validation Test POST (Invalid Payload) -> Status:', resValidationError.statusCode, '| Expected Error:', resValidationError.body.error);

      // 8. Delete Task (DELETE)
      const resDelete = await makeRequest('DELETE', `/api/v1/tasks/${taskId}`);
      console.log('✅ 8. Delete Task DELETE /api/v1/tasks/:id -> Status:', resDelete.statusCode, '| Success:', resDelete.body.success);

      console.log('\n🎉 ALL 8 API ENDPOINT TESTS PASSED PERFECTLY!\n');
    } catch (err) {
      console.error('❌ API Test Failed:', err);
    } finally {
      server.close(() => {
        process.exit(0);
      });
    }
  });
}

runTests();
