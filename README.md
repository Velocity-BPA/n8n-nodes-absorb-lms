# n8n-nodes-absorb-lms

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Absorb LMS, enabling automation of learning management workflows. It includes 6 resources with full CRUD operations for managing users, courses, enrollments, departments, certificates, and reports within your Absorb LMS platform.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![LMS](https://img.shields.io/badge/LMS-Absorb-green)
![Learning](https://img.shields.io/badge/Learning-Management-orange)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-red)

## Features

- **User Management** - Create, read, update, delete, and search users with full profile support
- **Course Operations** - Manage course catalog, content, assignments, and availability settings  
- **Enrollment Automation** - Automate student enrollment, progress tracking, and completion workflows
- **Department Structure** - Organize users and courses within departmental hierarchies
- **Certificate Processing** - Generate, validate, and distribute completion certificates automatically
- **Advanced Reporting** - Extract learning analytics, completion data, and custom report generation
- **Bulk Operations** - Process multiple records efficiently with batch operations
- **Real-time Sync** - Keep external systems synchronized with Absorb LMS data changes

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-absorb-lms`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-absorb-lms
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-absorb-lms.git
cd n8n-nodes-absorb-lms
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-absorb-lms
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Absorb LMS API key from the Admin portal | Yes |
| Base URL | Your Absorb LMS instance URL (e.g., https://company.myabsorb.com) | Yes |
| Environment | Select Production or Sandbox environment | Yes |

## Resources & Operations

### 1. User

| Operation | Description |
|-----------|-------------|
| Create | Create a new user account with profile information |
| Get | Retrieve user details by ID or username |
| Get Many | List users with filtering and pagination |
| Update | Modify user profile, settings, or status |
| Delete | Remove user account and associated data |
| Search | Find users by name, email, or custom fields |
| Activate | Activate inactive user accounts |
| Deactivate | Deactivate user accounts while preserving data |

### 2. Course

| Operation | Description |
|-----------|-------------|
| Create | Create new course with content and settings |
| Get | Retrieve course details and configuration |
| Get Many | List courses with filtering options |
| Update | Modify course content, settings, or availability |
| Delete | Remove course and associated enrollments |
| Publish | Make course available to learners |
| Archive | Archive course while preserving completion data |
| Duplicate | Create copy of existing course structure |

### 3. Enrollment

| Operation | Description |
|-----------|-------------|
| Create | Enroll user in course with specific settings |
| Get | Retrieve enrollment status and progress |
| Get Many | List enrollments with filtering by user or course |
| Update | Modify enrollment settings or due dates |
| Delete | Remove enrollment and reset progress |
| Complete | Mark enrollment as completed |
| Reset | Reset enrollment progress to beginning |
| Bulk Enroll | Enroll multiple users in courses simultaneously |

### 4. Department

| Operation | Description |
|-----------|-------------|
| Create | Create new department with hierarchy settings |
| Get | Retrieve department details and structure |
| Get Many | List departments with parent-child relationships |
| Update | Modify department name, settings, or hierarchy |
| Delete | Remove department and reassign users |
| Move Users | Transfer users between departments |
| Get Hierarchy | Retrieve complete department tree structure |

### 5. Certificate

| Operation | Description |
|-----------|-------------|
| Create | Generate new certificate template |
| Get | Retrieve certificate details and design |
| Get Many | List available certificates and templates |
| Update | Modify certificate template or settings |
| Delete | Remove certificate template |
| Generate | Create certificate for user completion |
| Download | Retrieve certificate file in PDF format |
| Validate | Verify certificate authenticity |

### 6. Report

| Operation | Description |
|-----------|-------------|
| Create | Generate new custom report |
| Get | Retrieve report data and results |
| Get Many | List available reports and schedules |
| Update | Modify report parameters or schedule |
| Delete | Remove custom report |
| Execute | Run report and retrieve current data |
| Schedule | Set up automated report generation |
| Export | Download report in various formats (CSV, PDF, Excel) |

## Usage Examples

```javascript
// Create a new user and enroll in course
const newUser = {
  "firstName": "John",
  "lastName": "Smith", 
  "username": "jsmith",
  "email": "john.smith@company.com",
  "departmentId": "12345",
  "password": "TempPass123!"
};

// Get user progress for specific course
const progress = {
  "userId": "67890",
  "courseId": "course-101",
  "includeScores": true,
  "includeTimeSpent": true
};

// Bulk enroll users in multiple courses
const bulkEnrollment = {
  "userIds": ["123", "456", "789"],
  "courseIds": ["course-101", "course-102"],
  "enrollmentDate": "2024-01-15",
  "dueDate": "2024-03-15",
  "sendNotifications": true
};

// Generate completion report for department
const departmentReport = {
  "reportType": "completion",
  "departmentId": "dept-sales",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "format": "excel",
  "includeInactive": false
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key is correct and has proper permissions |
| Resource Not Found | Requested user, course, or enrollment doesn't exist | Check resource ID and ensure it exists in your LMS |
| Permission Denied | API key lacks permission for requested operation | Contact admin to grant appropriate API permissions |
| Rate Limit Exceeded | Too many API requests in short timeframe | Implement delays between requests or use bulk operations |
| Invalid Data Format | Request data doesn't match required schema | Validate input data against API documentation |
| Enrollment Conflict | User already enrolled or course unavailable | Check enrollment status before creating new enrollment |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-absorb-lms/issues)
- **Absorb LMS API Documentation**: [Absorb Developer Portal](https://support.absorblms.com/hc/en-us/sections/360007689214-API-Documentation)
- **Learning Management Community**: [Absorb User Community](https://community.absorblms.com/)