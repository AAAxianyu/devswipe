const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
let authToken = '';

// 测试配置
const testUser = {
  username: 'testuser_' + Date.now(),
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  tech_stack: ['JavaScript', 'React', 'Node.js']
};

const testProject = {
  title: '测试项目 ' + Date.now(),
  description: '这是一个用于测试的项目，包含完整的功能验证。',
  cover_image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Test+Project',
  image_urls: ['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Image+1'],
  project_url: 'https://github.com/test/project',
  status: 'demo',
  tags: ['JavaScript', 'React', 'Testing']
};

async function testEndpoint(name, testFn) {
  try {
    console.log(`🔍 测试 ${name}...`);
    await testFn();
    console.log(`✅ ${name} 测试通过`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} 测试失败:`, error.response?.data?.error || error.message);
    return false;
  }
}

async function testHealthCheck() {
  const response = await axios.get(`${BACKEND_URL}/health`);
  if (response.data.status !== 'ok') {
    throw new Error('健康检查失败');
  }
}

async function testUserRegistration() {
  const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, testUser);
  if (!response.data.token) {
    throw new Error('注册响应缺少token');
  }
  authToken = response.data.token;
}

async function testUserLogin() {
  const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
    email: testUser.email,
    password: testUser.password
  });
  if (!response.data.token) {
    throw new Error('登录响应缺少token');
  }
  authToken = response.data.token;
}

async function testGetProfile() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (response.data.username !== testUser.username) {
    throw new Error('用户资料不匹配');
  }
}

async function testCreateProject() {
  const response = await axios.post(`${BACKEND_URL}/api/v1/projects`, testProject, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (!response.data.id) {
    throw new Error('项目创建失败');
  }
  testProject.id = response.data.id;
}

async function testGetProject() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/projects/${testProject.id}`);
  if (response.data.title !== testProject.title) {
    throw new Error('项目详情不匹配');
  }
}

async function testSearchProjects() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/projects/search?q=测试`);
  if (!Array.isArray(response.data.projects)) {
    throw new Error('搜索结果格式错误');
  }
}

async function testGetFeed() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/projects/feed`);
  if (!Array.isArray(response.data.projects)) {
    throw new Error('项目流格式错误');
  }
}

async function testProjectInteraction() {
  const response = await axios.post(`${BACKEND_URL}/api/v1/projects/${testProject.id}/interact`, {
    type: 'like',
    view_duration: 5.5,
    session_id: 'test_session_' + Date.now()
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (!response.data.message) {
    throw new Error('交互记录失败');
  }
}

async function testAddComment() {
  const response = await axios.post(`${BACKEND_URL}/api/v1/projects/${testProject.id}/comments`, {
    content: '这是一个测试评论',
    is_technical: false
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (!response.data.id) {
    throw new Error('评论添加失败');
  }
}

async function testGetComments() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/projects/${testProject.id}/comments`);
  if (!Array.isArray(response.data.comments)) {
    throw new Error('评论列表格式错误');
  }
}

async function testGetProjectStats() {
  const response = await axios.get(`${BACKEND_URL}/api/v1/projects/${testProject.id}/stats`);
  if (typeof response.data.total_views !== 'number') {
    throw new Error('项目统计格式错误');
  }
}

async function testUpdateProject() {
  const updateData = {
    title: testProject.title + ' (已更新)',
    description: testProject.description + ' 更新内容'
  };
  const response = await axios.put(`${BACKEND_URL}/api/v1/projects/${testProject.id}`, updateData, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (response.data.title !== updateData.title) {
    throw new Error('项目更新失败');
  }
}

async function testDeleteProject() {
  const response = await axios.delete(`${BACKEND_URL}/api/v1/projects/${testProject.id}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if (!response.data.message) {
    throw new Error('项目删除失败');
  }
}

async function runAllTests() {
  console.log('🚀 开始全面功能测试...\n');
  
  const tests = [
    ['健康检查', testHealthCheck],
    ['用户注册', testUserRegistration],
    ['用户登录', testUserLogin],
    ['获取用户资料', testGetProfile],
    ['创建项目', testCreateProject],
    ['获取项目详情', testGetProject],
    ['搜索项目', testSearchProjects],
    ['获取项目流', testGetFeed],
    ['项目交互', testProjectInteraction],
    ['添加评论', testAddComment],
    ['获取评论列表', testGetComments],
    ['获取项目统计', testGetProjectStats],
    ['更新项目', testUpdateProject],
    ['删除项目', testDeleteProject]
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, testFn] of tests) {
    const success = await testEndpoint(name, testFn);
    if (success) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // 空行分隔
  }

  console.log('📊 测试总结:');
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！系统功能正常。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关功能。');
  }
}

// 运行测试
runAllTests().catch(console.error);

