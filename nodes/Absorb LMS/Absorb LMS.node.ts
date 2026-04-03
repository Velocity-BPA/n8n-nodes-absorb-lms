/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-absorblms/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AbsorbLMS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Absorb LMS',
    name: 'absorblms',
    icon: 'file:absorblms.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Absorb LMS API',
    defaults: {
      name: 'Absorb LMS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'absorblmsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Course',
            value: 'course',
          },
          {
            name: 'Enrollment',
            value: 'enrollment',
          },
          {
            name: 'Department',
            value: 'department',
          },
          {
            name: 'Certificate',
            value: 'certificate',
          },
          {
            name: 'Report',
            value: 'report',
          }
        ],
        default: 'user',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Create User',
			value: 'createUser',
			description: 'Create a new user account',
			action: 'Create user',
		},
		{
			name: 'Delete User',
			value: 'deleteUser',
			description: 'Delete a user account',
			action: 'Delete user',
		},
		{
			name: 'Get User',
			value: 'getUser',
			description: 'Get specific user details',
			action: 'Get user',
		},
		{
			name: 'Get User Enrollments',
			value: 'getUserEnrollments',
			description: 'Get user course enrollments',
			action: 'Get user enrollments',
		},
		{
			name: 'Get Users',
			value: 'getUsers',
			description: 'Retrieve all users with filtering and pagination',
			action: 'Get users',
		},
		{
			name: 'Update User',
			value: 'updateUser',
			description: 'Update existing user information',
			action: 'Update user',
		},
	],
	default: 'getUsers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['course'] } },
  options: [
    { name: 'Get Courses', value: 'getCourses', description: 'Retrieve all courses with filtering', action: 'Get courses' },
    { name: 'Get Course', value: 'getCourse', description: 'Get specific course details', action: 'Get course' },
    { name: 'Create Course', value: 'createCourse', description: 'Create new course', action: 'Create course' },
    { name: 'Update Course', value: 'updateCourse', description: 'Update course information', action: 'Update course' },
    { name: 'Delete Course', value: 'deleteCourse', description: 'Delete course', action: 'Delete course' },
    { name: 'Get Course Sessions', value: 'getCourseSessions', description: 'Get course session details', action: 'Get course sessions' }
  ],
  default: 'getCourses',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['enrollment'] } },
  options: [
    { name: 'Get Enrollments', value: 'getEnrollments', description: 'Retrieve all enrollments with filtering', action: 'Get all enrollments' },
    { name: 'Get Enrollment', value: 'getEnrollment', description: 'Get specific enrollment details', action: 'Get an enrollment' },
    { name: 'Create Enrollment', value: 'createEnrollment', description: 'Enroll user in course', action: 'Create an enrollment' },
    { name: 'Update Enrollment', value: 'updateEnrollment', description: 'Update enrollment status', action: 'Update an enrollment' },
    { name: 'Delete Enrollment', value: 'deleteEnrollment', description: 'Remove enrollment', action: 'Delete an enrollment' },
    { name: 'Bulk Create Enrollments', value: 'bulkCreateEnrollments', description: 'Create multiple enrollments', action: 'Bulk create enrollments' }
  ],
  default: 'getEnrollments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['department'] } },
  options: [
    { name: 'Get Departments', value: 'getDepartments', description: 'Retrieve all departments', action: 'Get departments' },
    { name: 'Get Department', value: 'getDepartment', description: 'Get specific department details', action: 'Get department' },
    { name: 'Create Department', value: 'createDepartment', description: 'Create new department', action: 'Create department' },
    { name: 'Update Department', value: 'updateDepartment', description: 'Update department information', action: 'Update department' },
    { name: 'Delete Department', value: 'deleteDepartment', description: 'Delete department', action: 'Delete department' },
    { name: 'Get Department Users', value: 'getDepartmentUsers', description: 'Get users in department', action: 'Get department users' },
  ],
  default: 'getDepartments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['certificate'] } },
  options: [
    { name: 'Get Certificates', value: 'getCertificates', description: 'Retrieve all certificates', action: 'Get certificates' },
    { name: 'Get Certificate', value: 'getCertificate', description: 'Get specific certificate details', action: 'Get certificate' },
    { name: 'Create Certificate', value: 'createCertificate', description: 'Issue new certificate', action: 'Create certificate' },
    { name: 'Update Certificate', value: 'updateCertificate', description: 'Update certificate information', action: 'Update certificate' },
    { name: 'Delete Certificate', value: 'deleteCertificate', description: 'Revoke certificate', action: 'Delete certificate' },
    { name: 'Download Certificate', value: 'downloadCertificate', description: 'Download certificate file', action: 'Download certificate' },
  ],
  default: 'getCertificates',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['report'] } },
  options: [
    { name: 'Get Learner Progress Report', value: 'getLearnerProgressReport', description: 'Get learner progress analytics', action: 'Get learner progress report' },
    { name: 'Get Course Completion Report', value: 'getCourseCompletionReport', description: 'Get course completion statistics', action: 'Get course completion report' },
    { name: 'Get User Activity Report', value: 'getUserActivityReport', description: 'Get user activity and engagement data', action: 'Get user activity report' },
    { name: 'Get Department Summary Report', value: 'getDepartmentSummaryReport', description: 'Get department-level analytics', action: 'Get department summary report' },
    { name: 'Get Compliance Report', value: 'getComplianceReport', description: 'Get compliance and certification status', action: 'Get compliance report' },
    { name: 'Generate Custom Report', value: 'generateCustomReport', description: 'Generate custom report with specified parameters', action: 'Generate custom report' },
  ],
  default: 'getLearnerProgressReport',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUser', 'updateUser', 'deleteUser', 'getUserEnrollments'],
		},
	},
	default: '',
	description: 'The ID of the user',
},
{
	displayName: 'First Name',
	name: 'firstName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The first name of the user',
},
{
	displayName: 'First Name',
	name: 'firstName',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['updateUser'],
		},
	},
	default: '',
	description: 'The first name of the user',
},
{
	displayName: 'Last Name',
	name: 'lastName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The last name of the user',
},
{
	displayName: 'Last Name',
	name: 'lastName',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['updateUser'],
		},
	},
	default: '',
	description: 'The last name of the user',
},
{
	displayName: 'Email Address',
	name: 'emailAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The email address of the user',
},
{
	displayName: 'Email Address',
	name: 'emailAddress',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['updateUser'],
		},
	},
	default: '',
	description: 'The email address of the user',
},
{
	displayName: 'Username',
	name: 'username',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The username for the user account',
},
{
	displayName: 'Password',
	name: 'password',
	type: 'string',
	typeOptions: {
		password: true,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The password for the user account',
},
{
	displayName: 'Skip',
	name: 'skip',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: 0,
	description: 'Number of records to skip for pagination',
},
{
	displayName: 'Take',
	name: 'take',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: 100,
	description: 'Number of records to take for pagination',
},
{
	displayName: 'Department ID',
	name: 'departmentId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: '',
	description: 'Filter users by department ID',
},
{
	displayName: 'Is Active',
	name: 'isActive',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: true,
	description: 'Filter users by active status',
},
{
  displayName: 'Course ID',
  name: 'courseId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['course'], operation: ['getCourse', 'updateCourse', 'deleteCourse', 'getCourseSessions'] } },
  default: '',
  description: 'The ID of the course',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  displayOptions: { show: { resource: ['course'], operation: ['getCourses'] } },
  default: 0,
  description: 'Number of records to skip for pagination',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  displayOptions: { show: { resource: ['course'], operation: ['getCourses'] } },
  default: 25,
  description: 'Number of records to return',
},
{
  displayName: 'Is Active',
  name: 'isActive',
  type: 'boolean',
  displayOptions: { show: { resource: ['course'], operation: ['getCourses', 'createCourse', 'updateCourse'] } },
  default: true,
  description: 'Filter courses by active status',
},
{
  displayName: 'Department ID',
  name: 'departmentId',
  type: 'string',
  displayOptions: { show: { resource: ['course'], operation: ['getCourses', 'createCourse'] } },
  default: '',
  description: 'Filter courses by department ID',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['course'], operation: ['createCourse', 'updateCourse'] } },
  default: '',
  description: 'The name of the course',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: { show: { resource: ['course'], operation: ['createCourse', 'updateCourse'] } },
  default: '',
  description: 'The description of the course',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  default: 0,
  description: 'Number of records to skip for pagination',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollments'] } },
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  default: 50,
  description: 'Number of records to retrieve',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollments'] } },
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  default: '',
  description: 'Filter enrollments by user ID',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollments', 'createEnrollment'] } },
},
{
  displayName: 'Course ID',
  name: 'courseId',
  type: 'string',
  default: '',
  description: 'Filter enrollments by course ID or course to enroll in',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollments', 'createEnrollment'] } },
},
{
  displayName: 'Department ID',
  name: 'departmentId',
  type: 'string',
  default: '',
  description: 'Filter enrollments by department ID',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollments'] } },
},
{
  displayName: 'Enrollment ID',
  name: 'enrollmentId',
  type: 'string',
  required: true,
  default: '',
  description: 'The enrollment ID',
  displayOptions: { show: { resource: ['enrollment'], operation: ['getEnrollment', 'updateEnrollment', 'deleteEnrollment'] } },
},
{
  displayName: 'Enrolled Date',
  name: 'enrolledDate',
  type: 'dateTime',
  default: '',
  description: 'The date when the user was enrolled (ISO 8601 format)',
  displayOptions: { show: { resource: ['enrollment'], operation: ['createEnrollment'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Completed', value: 'completed' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Cancelled', value: 'cancelled' }
  ],
  default: 'active',
  description: 'The enrollment status',
  displayOptions: { show: { resource: ['enrollment'], operation: ['updateEnrollment'] } },
},
{
  displayName: 'Completion Date',
  name: 'completionDate',
  type: 'dateTime',
  default: '',
  description: 'The date when the enrollment was completed (ISO 8601 format)',
  displayOptions: { show: { resource: ['enrollment'], operation: ['updateEnrollment'] } },
},
{
  displayName: 'Enrollments',
  name: 'enrollments',
  type: 'json',
  default: '[]',
  description: 'Array of enrollment objects to create',
  displayOptions: { show: { resource: ['enrollment'], operation: ['bulkCreateEnrollments'] } },
},
{
  displayName: 'Department ID',
  name: 'departmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['getDepartment', 'updateDepartment', 'deleteDepartment', 'getDepartmentUsers'],
    },
  },
  default: '',
  description: 'The ID of the department',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['createDepartment', 'updateDepartment'],
    },
  },
  default: '',
  description: 'The name of the department',
},
{
  displayName: 'Parent ID',
  name: 'parentId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['getDepartments', 'createDepartment', 'updateDepartment'],
    },
  },
  default: '',
  description: 'The ID of the parent department',
},
{
  displayName: 'External ID',
  name: 'externalId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['createDepartment'],
    },
  },
  default: '',
  description: 'External identifier for the department',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['getDepartments'],
    },
  },
  default: 0,
  description: 'Number of records to skip for pagination',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['department'],
      operation: ['getDepartments'],
    },
  },
  default: 50,
  description: 'Number of records to take for pagination',
},
{
  displayName: 'Certificate ID',
  name: 'certificateId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['getCertificate', 'updateCertificate', 'deleteCertificate', 'downloadCertificate'],
    },
  },
  default: '',
  description: 'The ID of the certificate',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['getCertificates'],
    },
  },
  default: 0,
  description: 'Number of records to skip for pagination',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['getCertificates'],
    },
  },
  default: 50,
  description: 'Number of records to take for pagination',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['getCertificates', 'createCertificate'],
    },
  },
  default: '',
  description: 'Filter certificates by user ID or specify user for new certificate',
  required: false,
},
{
  displayName: 'Course ID',
  name: 'courseId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['getCertificates', 'createCertificate'],
    },
  },
  default: '',
  description: 'Filter certificates by course ID or specify course for new certificate',
  required: false,
},
{
  displayName: 'Issued Date',
  name: 'issuedDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['createCertificate'],
    },
  },
  default: '',
  description: 'The date the certificate was issued (ISO 8601 format)',
},
{
  displayName: 'Expiry Date',
  name: 'expiryDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['createCertificate', 'updateCertificate'],
    },
  },
  default: '',
  description: 'The expiry date of the certificate (ISO 8601 format)',
},
{
  displayName: 'Is Revoked',
  name: 'isRevoked',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['certificate'],
      operation: ['updateCertificate'],
    },
  },
  default: false,
  description: 'Whether the certificate is revoked',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getLearnerProgressReport', 'getUserActivityReport'] } },
  description: 'The ID of the user for the report',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getLearnerProgressReport', 'getCourseCompletionReport', 'getUserActivityReport', 'getDepartmentSummaryReport'] } },
  description: 'Start date for the report in ISO 8601 format',
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getLearnerProgressReport', 'getCourseCompletionReport', 'getUserActivityReport', 'getDepartmentSummaryReport'] } },
  description: 'End date for the report in ISO 8601 format',
},
{
  displayName: 'Department ID',
  name: 'departmentId',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getLearnerProgressReport', 'getDepartmentSummaryReport', 'getComplianceReport'] } },
  description: 'The ID of the department for filtering',
},
{
  displayName: 'Course ID',
  name: 'courseId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getCourseCompletionReport'] } },
  description: 'The ID of the course for the completion report',
},
{
  displayName: 'Certificate Type',
  name: 'certificateType',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['report'], operation: ['getComplianceReport'] } },
  description: 'Type of certificate for compliance filtering',
},
{
  displayName: 'Report Type',
  name: 'reportType',
  type: 'options',
  required: true,
  default: 'learner',
  displayOptions: { show: { resource: ['report'], operation: ['generateCustomReport'] } },
  options: [
    { name: 'Learner', value: 'learner' },
    { name: 'Course', value: 'course' },
    { name: 'Department', value: 'department' },
    { name: 'Compliance', value: 'compliance' },
  ],
  description: 'Type of custom report to generate',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  default: '{}',
  displayOptions: { show: { resource: ['report'], operation: ['generateCustomReport'] } },
  description: 'JSON object with filter criteria for the custom report',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'json',
  default: '{}',
  displayOptions: { show: { resource: ['report'], operation: ['generateCustomReport'] } },
  description: 'JSON object with dateFrom and dateTo properties',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  default: 0,
  displayOptions: { show: { resource: ['report'] } },
  description: 'Number of records to skip for pagination',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  default: 100,
  displayOptions: { show: { resource: ['report'] } },
  description: 'Number of records to take for pagination (max 100)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'user':
        return [await executeUserOperations.call(this, items)];
      case 'course':
        return [await executeCourseOperations.call(this, items)];
      case 'enrollment':
        return [await executeEnrollmentOperations.call(this, items)];
      case 'department':
        return [await executeDepartmentOperations.call(this, items)];
      case 'certificate':
        return [await executeCertificateOperations.call(this, items)];
      case 'report':
        return [await executeReportOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUserOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('absorblmsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseHeaders = {
				'Authorization': `Bearer ${credentials.apiKey}`,
				'Content-Type': 'application/json',
				'privateKey': credentials.privateKey,
			};

			switch (operation) {
				case 'getUsers': {
					const skip = this.getNodeParameter('skip', i, 0) as number;
					const take = this.getNodeParameter('take', i, 100) as number;
					const departmentId = this.getNodeParameter('departmentId', i, '') as string;
					const isActive = this.getNodeParameter('isActive', i, true) as boolean;

					const queryParams: string[] = [];
					queryParams.push(`skip=${skip}`);
					queryParams.push(`take=${take}`);
					if (departmentId) queryParams.push(`departmentId=${departmentId}`);
					queryParams.push(`isActive=${isActive}`);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/rest/v1/users?${queryParams.join('&')}`,
						headers: baseHeaders,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUser': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/rest/v1/users/${userId}`,
						headers: baseHeaders,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createUser': {
					const firstName = this.getNodeParameter('firstName', i) as string;
					const lastName = this.getNodeParameter('lastName', i) as string;
					const emailAddress = this.getNodeParameter('emailAddress', i) as string;
					const username = this.getNodeParameter('username', i) as string;
					const password = this.getNodeParameter('password', i) as string;

					const body = {
						firstName,
						lastName,
						emailAddress,
						username,
						password,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/rest/v1/users`,
						headers: baseHeaders,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateUser': {
					const userId = this.getNodeParameter('userId', i) as string;
					const firstName = this.getNodeParameter('firstName', i, '') as string;
					const lastName = this.getNodeParameter('lastName', i, '') as string;
					const emailAddress = this.getNodeParameter('emailAddress', i, '') as string;

					const body: any = {};
					if (firstName) body.firstName = firstName;
					if (lastName) body.lastName = lastName;
					if (emailAddress) body.emailAddress = emailAddress;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/api/rest/v1/users/${userId}`,
						headers: baseHeaders,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteUser': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/api/rest/v1/users/${userId}`,
						headers: baseHeaders,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserEnrollments': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/rest/v1/users/${userId}/enrollments`,
						headers: baseHeaders,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCourseOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('absorblmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCourses': {
          const skip = this.getNodeParameter('skip', i, 0) as number;
          const take = this.getNodeParameter('take', i, 25) as number;
          const isActive = this.getNodeParameter('isActive', i, true) as boolean;
          const departmentId = this.getNodeParameter('departmentId', i, '') as string;

          const queryParams = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
            isActive: isActive.toString(),
          });

          if (departmentId) {
            queryParams.append('departmentId', departmentId);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/courses?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCourse': {
          const courseId = this.getNodeParameter('courseId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/courses/${courseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCourse': {
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const isActive = this.getNodeParameter('isActive', i, true) as boolean;
          const departmentId = this.getNodeParameter('departmentId', i, '') as string;

          const body: any = {
            name,
            description,
            isActive,
          };

          if (departmentId) {
            body.departmentId = departmentId;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/rest/v1/courses`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCourse': {
          const courseId = this.getNodeParameter('courseId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const isActive = this.getNodeParameter('isActive', i, true) as boolean;

          const body: any = {
            name,
            description,
            isActive,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/rest/v1/courses/${courseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCourse': {
          const courseId = this.getNodeParameter('courseId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/rest/v1/courses/${courseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCourseSessions': {
          const courseId = this.getNodeParameter('courseId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/courses/${courseId}/sessions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'privateKey': credentials.privateKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEnrollmentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('absorblmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
          'privateKey': credentials.privateKey,
        },
        json: true,
        baseURL: credentials.baseUrl || 'https://api.myabsorb.com',
      };

      switch (operation) {
        case 'getEnrollments': {
          const skip = this.getNodeParameter('skip', i, 0) as number;
          const take = this.getNodeParameter('take', i, 50) as number;
          const userId = this.getNodeParameter('userId', i, '') as string;
          const courseId = this.getNodeParameter('courseId', i, '') as string;
          const departmentId = this.getNodeParameter('departmentId', i, '') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (userId) queryParams.append('userId', userId);
          if (courseId) queryParams.append('courseId', courseId);
          if (departmentId) queryParams.append('departmentId', departmentId);

          const options = {
            ...baseOptions,
            method: 'GET',
            url: `/api/rest/v1/enrollments?${queryParams.toString()}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEnrollment': {
          const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;

          const options = {
            ...baseOptions,
            method: 'GET',
            url: `/api/rest/v1/enrollments/${enrollmentId}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEnrollment': {
          const userId = this.getNodeParameter('userId', i) as string;
          const courseId = this.getNodeParameter('courseId', i) as string;
          const enrolledDate = this.getNodeParameter('enrolledDate', i, '') as string;

          const body: any = {
            userId,
            courseId,
          };

          if (enrolledDate) {
            body.enrolledDate = enrolledDate;
          }

          const options = {
            ...baseOptions,
            method: 'POST',
            url: '/api/rest/v1/enrollments',
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEnrollment': {
          const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const completionDate = this.getNodeParameter('completionDate', i, '') as string;

          const body: any = {
            status,
          };

          if (completionDate) {
            body.completionDate = completionDate;
          }

          const options = {
            ...baseOptions,
            method: 'PUT',
            url: `/api/rest/v1/enrollments/${enrollmentId}`,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteEnrollment': {
          const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;

          const options = {
            ...baseOptions,
            method: 'DELETE',
            url: `/api/rest/v1/enrollments/${enrollmentId}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'bulkCreateEnrollments': {
          const enrollments = this.getNodeParameter('enrollments', i) as string;
          let enrollmentsArray: any[];

          try {
            enrollmentsArray = JSON.parse(enrollments);
          } catch (parseError: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON format for enrollments: ${parseError.message}`, { itemIndex: i });
          }

          const options = {
            ...baseOptions,
            method: 'POST',
            url: '/api/rest/v1/enrollments/bulk',
            body: { enrollments: enrollmentsArray },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDepartmentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('absorblmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getDepartments': {
          const skip = this.getNodeParameter('skip', i) as number;
          const take = this.getNodeParameter('take', i) as number;
          const parentId = this.getNodeParameter('parentId', i) as string;

          const queryParams: string[] = [];
          if (skip) queryParams.push(`skip=${skip}`);
          if (take) queryParams.push(`take=${take}`);
          if (parentId) queryParams.push(`parentId=${parentId}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/departments${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDepartment': {
          const departmentId = this.getNodeParameter('departmentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/departments/${departmentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDepartment': {
          const name = this.getNodeParameter('name', i) as string;
          const parentId = this.getNodeParameter('parentId', i) as string;
          const externalId = this.getNodeParameter('externalId', i) as string;

          const body: any = { name };
          if (parentId) body.parentId = parentId;
          if (externalId) body.externalId = externalId;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/rest/v1/departments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDepartment': {
          const departmentId = this.getNodeParameter('departmentId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const parentId = this.getNodeParameter('parentId', i) as string;

          const body: any = { name };
          if (parentId) body.parentId = parentId;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/rest/v1/departments/${departmentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteDepartment': {
          const departmentId = this.getNodeParameter('departmentId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/rest/v1/departments/${departmentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDepartmentUsers': {
          const departmentId = this.getNodeParameter('departmentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/departments/${departmentId}/users`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCertificateOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('absorblmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseHeaders = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Key': credentials.privateKey,
      };

      switch (operation) {
        case 'getCertificates': {
          const skip = this.getNodeParameter('skip', i) as number;
          const take = this.getNodeParameter('take', i) as number;
          const userId = this.getNodeParameter('userId', i) as string;
          const courseId = this.getNodeParameter('courseId', i) as string;

          const queryParams = new URLSearchParams();
          if (skip) queryParams.append('skip', skip.toString());
          if (take) queryParams.append('take', take.toString());
          if (userId) queryParams.append('userId', userId);
          if (courseId) queryParams.append('courseId', courseId);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/certificates${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCertificate': {
          const certificateId = this.getNodeParameter('certificateId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/certificates/${certificateId}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCertificate': {
          const userId = this.getNodeParameter('userId', i) as string;
          const courseId = this.getNodeParameter('courseId', i) as string;
          const issuedDate = this.getNodeParameter('issuedDate', i) as string;
          const expiryDate = this.getNodeParameter('expiryDate', i) as string;

          const body: any = {};
          if (userId) body.userId = userId;
          if (courseId) body.courseId = courseId;
          if (issuedDate) body.issuedDate = issuedDate;
          if (expiryDate) body.expiryDate = expiryDate;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/rest/v1/certificates`,
            headers: baseHeaders,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCertificate': {
          const certificateId = this.getNodeParameter('certificateId', i) as string;
          const expiryDate = this.getNodeParameter('expiryDate', i) as string;
          const isRevoked = this.getNodeParameter('isRevoked', i) as boolean;

          const body: any = {};
          if (expiryDate) body.expiryDate = expiryDate;
          if (isRevoked !== undefined) body.isRevoked = isRevoked;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/rest/v1/certificates/${certificateId}`,
            headers: baseHeaders,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCertificate': {
          const certificateId = this.getNodeParameter('certificateId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/rest/v1/certificates/${certificateId}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'downloadCertificate': {
          const certificateId = this.getNodeParameter('certificateId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/certificates/${certificateId}/download`,
            headers: baseHeaders,
            encoding: null,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeReportOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('absorblmsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const skip = this.getNodeParameter('skip', i, 0) as number;
      const take = this.getNodeParameter('take', i, 100) as number;

      const baseHeaders: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        'privateKey': credentials.privateKey,
      };

      switch (operation) {
        case 'getLearnerProgressReport': {
          const userId = this.getNodeParameter('userId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;
          const departmentId = this.getNodeParameter('departmentId', i, '') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('userId', userId);
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (dateFrom) queryParams.append('dateFrom', dateFrom);
          if (dateTo) queryParams.append('dateTo', dateTo);
          if (departmentId) queryParams.append('departmentId', departmentId);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/reports/learner-progress?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCourseCompletionReport': {
          const courseId = this.getNodeParameter('courseId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('courseId', courseId);
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (dateFrom) queryParams.append('dateFrom', dateFrom);
          if (dateTo) queryParams.append('dateTo', dateTo);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/reports/course-completion?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserActivityReport': {
          const userId = this.getNodeParameter('userId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('userId', userId);
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (dateFrom) queryParams.append('dateFrom', dateFrom);
          if (dateTo) queryParams.append('dateTo', dateTo);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/reports/user-activity?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDepartmentSummaryReport': {
          const departmentId = this.getNodeParameter('departmentId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;

          const queryParams = new URLSearchParams();
          if (departmentId) queryParams.append('departmentId', departmentId);
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (dateFrom) queryParams.append('dateFrom', dateFrom);
          if (dateTo) queryParams.append('dateTo', dateTo);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/reports/department-summary?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getComplianceReport': {
          const departmentId = this.getNodeParameter('departmentId', i, '') as string;
          const certificateType = this.getNodeParameter('certificateType', i, '') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('skip', skip.toString());
          queryParams.append('take', take.toString());
          if (departmentId) queryParams.append('departmentId', departmentId);
          if (certificateType) queryParams.append('certificateType', certificateType);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rest/v1/reports/compliance?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'generateCustomReport': {
          const reportType = this.getNodeParameter('reportType', i) as string;
          const filters = this.getNodeParameter('filters', i, '{}') as string;
          const dateRange = this.getNodeParameter('dateRange', i, '{}') as string;

          let parsedFilters: any = {};
          let parsedDateRange: any = {};

          try {
            parsedFilters = JSON.parse(filters);
          } catch (error: any) {
            throw new Error(`Invalid filters JSON: ${error.message}`);
          }

          try {
            parsedDateRange = JSON.parse(dateRange);
          } catch (error: any) {
            throw new Error(`Invalid date range JSON: ${error.message}`);
          }

          const requestBody: any = {
            reportType,
            filters: parsedFilters,
            dateRange: parsedDateRange,
            pagination: {
              skip,
              take,
            },
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/rest/v1/reports/custom`,
            headers: baseHeaders,
            json: true,
            body: requestBody,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
