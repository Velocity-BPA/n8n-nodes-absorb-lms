/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AbsorbLMS } from '../nodes/Absorb LMS/Absorb LMS.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AbsorbLMS Node', () => {
  let node: AbsorbLMS;

  beforeAll(() => {
    node = new AbsorbLMS();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Absorb LMS');
      expect(node.description.name).toBe('absorblms');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('User Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				privateKey: 'test-private-key',
				baseUrl: 'https://api.myabsorb.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get users successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUsers')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(100)
			.mockReturnValueOnce('')
			.mockReturnValueOnce(true);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			users: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.myabsorb.com/api/rest/v1/users?skip=0&take=100&isActive=true',
			headers: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				privateKey: 'test-private-key',
			},
			json: true,
		});

		expect(result).toHaveLength(1);
		expect(result[0].json.users[0].firstName).toBe('John');
	});

	it('should get specific user successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUser')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: '123',
			firstName: 'John',
			lastName: 'Doe',
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.myabsorb.com/api/rest/v1/users/123',
			headers: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				privateKey: 'test-private-key',
			},
			json: true,
		});

		expect(result[0].json.id).toBe('123');
	});

	it('should create user successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createUser')
			.mockReturnValueOnce('John')
			.mockReturnValueOnce('Doe')
			.mockReturnValueOnce('john.doe@example.com')
			.mockReturnValueOnce('johndoe')
			.mockReturnValueOnce('password123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: '456',
			firstName: 'John',
			lastName: 'Doe',
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.myabsorb.com/api/rest/v1/users',
			headers: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				privateKey: 'test-private-key',
			},
			body: {
				firstName: 'John',
				lastName: 'Doe',
				emailAddress: 'john.doe@example.com',
				username: 'johndoe',
				password: 'password123',
			},
			json: true,
		});

		expect(result[0].json.id).toBe('456');
	});

	it('should handle errors with continueOnFail', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser').mockReturnValueOnce('123');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser').mockReturnValueOnce('123');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});
});

describe('Course Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        privateKey: 'test-private-key',
        baseUrl: 'https://api.myabsorb.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Course Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get courses with filters', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCourses')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce('dept-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      courses: [{ id: '1', name: 'Test Course' }]
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { courses: [{ id: '1', name: 'Test Course' }] },
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle get courses error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCourses');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should get specific course', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCourse')
      .mockReturnValueOnce('course-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'course-123',
      name: 'Specific Course'
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { id: 'course-123', name: 'Specific Course' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should create course', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCourse')
      .mockReturnValueOnce('New Course')
      .mockReturnValueOnce('Course description')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce('dept-456');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'new-course-123',
      name: 'New Course'
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { id: 'new-course-123', name: 'New Course' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should update course', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCourse')
      .mockReturnValueOnce('course-123')
      .mockReturnValueOnce('Updated Course')
      .mockReturnValueOnce('Updated description')
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'course-123',
      name: 'Updated Course'
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { id: 'course-123', name: 'Updated Course' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete course', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCourse')
      .mockReturnValueOnce('course-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { success: true },
      pairedItem: { item: 0 }
    }]);
  });

  it('should get course sessions', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCourseSessions')
      .mockReturnValueOnce('course-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      sessions: [{ id: 'session-1', name: 'Session 1' }]
    });

    const result = await executeCourseOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { sessions: [{ id: 'session-1', name: 'Session 1' }] },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Enrollment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key',
        privateKey: 'test-private-key',
        baseUrl: 'https://api.myabsorb.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get enrollments successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEnrollments')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce('course456')
      .mockReturnValueOnce('dept789');

    const mockResponse = { enrollments: [{ id: 'enroll1', userId: 'user123', courseId: 'course456' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/api/rest/v1/enrollments'),
      })
    );
  });

  it('should get specific enrollment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEnrollment')
      .mockReturnValueOnce('enroll123');

    const mockResponse = { id: 'enroll123', userId: 'user123', courseId: 'course456' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/api/rest/v1/enrollments/enroll123',
      })
    );
  });

  it('should create enrollment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEnrollment')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce('course456')
      .mockReturnValueOnce('2023-12-01T00:00:00.000Z');

    const mockResponse = { id: 'enroll123', userId: 'user123', courseId: 'course456' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/api/rest/v1/enrollments',
        body: {
          userId: 'user123',
          courseId: 'course456',
          enrolledDate: '2023-12-01T00:00:00.000Z',
        },
      })
    );
  });

  it('should update enrollment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateEnrollment')
      .mockReturnValueOnce('enroll123')
      .mockReturnValueOnce('completed')
      .mockReturnValueOnce('2023-12-01T00:00:00.000Z');

    const mockResponse = { id: 'enroll123', status: 'completed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: '/api/rest/v1/enrollments/enroll123',
        body: {
          status: 'completed',
          completionDate: '2023-12-01T00:00:00.000Z',
        },
      })
    );
  });

  it('should delete enrollment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteEnrollment')
      .mockReturnValueOnce('enroll123');

    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: '/api/rest/v1/enrollments/enroll123',
      })
    );
  });

  it('should bulk create enrollments successfully', async () => {
    const enrollmentsArray = [
      { userId: 'user1', courseId: 'course1' },
      { userId: 'user2', courseId: 'course2' }
    ];
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('bulkCreateEnrollments')
      .mockReturnValueOnce(JSON.stringify(enrollmentsArray));

    const mockResponse = { created: 2, enrollments: ['enroll1', 'enroll2'] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/api/rest/v1/enrollments/bulk',
        body: { enrollments: enrollmentsArray },
      })
    );
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEnrollment').mockReturnValueOnce('invalid-id');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Enrollment not found'));

    const result = await executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Enrollment not found' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEnrollment').mockReturnValueOnce('invalid-id');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Enrollment not found'));

    await expect(executeEnrollmentOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Enrollment not found');
  });
});

describe('Department Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.myabsorb.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getDepartments', () => {
    it('should get departments successfully', async () => {
      const mockResponse = { departments: [{ id: '1', name: 'IT Department' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getDepartments')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDepartmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.myabsorb.com/api/rest/v1/departments?skip=0&take=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getDepartments error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDepartments');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeDepartmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createDepartment', () => {
    it('should create department successfully', async () => {
      const mockResponse = { id: '123', name: 'New Department' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createDepartment')
        .mockReturnValueOnce('New Department')
        .mockReturnValueOnce('parent-123')
        .mockReturnValueOnce('ext-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDepartmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.myabsorb.com/api/rest/v1/departments',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Department',
          parentId: 'parent-123',
          externalId: 'ext-123',
        },
        json: true,
      });
    });
  });

  describe('updateDepartment', () => {
    it('should update department successfully', async () => {
      const mockResponse = { id: '123', name: 'Updated Department' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateDepartment')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('Updated Department')
        .mockReturnValueOnce('new-parent-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDepartmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.myabsorb.com/api/rest/v1/departments/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Department',
          parentId: 'new-parent-123',
        },
        json: true,
      });
    });
  });

  describe('deleteDepartment', () => {
    it('should delete department successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteDepartment')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDepartmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.myabsorb.com/api/rest/v1/departments/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('Certificate Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        privateKey: 'test-private-key',
        baseUrl: 'https://api.myabsorb.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get certificates successfully', async () => {
    const mockResponse = { certificates: [{ id: 1, userId: '123', courseId: '456' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCertificates')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('456');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates?skip=0&take=50&userId=123&courseId=456',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      json: true,
    });
  });

  it('should get certificate by ID successfully', async () => {
    const mockResponse = { id: 1, userId: '123', courseId: '456' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCertificate')
      .mockReturnValueOnce('cert123');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates/cert123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      json: true,
    });
  });

  it('should create certificate successfully', async () => {
    const mockResponse = { id: 1, userId: '123', courseId: '456', issuedDate: '2023-01-01T00:00:00Z' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCertificate')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('456')
      .mockReturnValueOnce('2023-01-01T00:00:00Z')
      .mockReturnValueOnce('2024-01-01T00:00:00Z');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      body: {
        userId: '123',
        courseId: '456',
        issuedDate: '2023-01-01T00:00:00Z',
        expiryDate: '2024-01-01T00:00:00Z',
      },
      json: true,
    });
  });

  it('should update certificate successfully', async () => {
    const mockResponse = { id: 1, expiryDate: '2025-01-01T00:00:00Z', isRevoked: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCertificate')
      .mockReturnValueOnce('cert123')
      .mockReturnValueOnce('2025-01-01T00:00:00Z')
      .mockReturnValueOnce(true);

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates/cert123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      body: {
        expiryDate: '2025-01-01T00:00:00Z',
        isRevoked: true,
      },
      json: true,
    });
  });

  it('should delete certificate successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCertificate')
      .mockReturnValueOnce('cert123');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates/cert123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      json: true,
    });
  });

  it('should download certificate successfully', async () => {
    const mockResponse = Buffer.from('certificate data');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('downloadCertificate')
      .mockReturnValueOnce('cert123');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.myabsorb.com/api/rest/v1/certificates/cert123/download',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-API-Key': 'test-private-key',
      },
      encoding: null,
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCertificates');

    const result = await executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCertificates');

    await expect(
      executeCertificateOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Report Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.myabsorb.com',
        privateKey: 'test-private-key'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getLearnerProgressReport', () => {
    it('should get learner progress report successfully', async () => {
      const mockResponse = { data: [{ userId: '123', progress: 75 }], total: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLearnerProgressReport')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('2024-01-01')
        .mockReturnValueOnce('2024-12-31')
        .mockReturnValueOnce('dept-123')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/api/rest/v1/reports/learner-progress'),
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key',
          'privateKey': 'test-private-key',
        }),
        json: true,
      });
    });

    it('should handle errors when getting learner progress report', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLearnerProgressReport');

      await expect(executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getCourseCompletionReport', () => {
    it('should get course completion report successfully', async () => {
      const mockResponse = { data: [{ courseId: 'course-123', completionRate: 85 }], total: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCourseCompletionReport')
        .mockReturnValueOnce('course-123')
        .mockReturnValueOnce('2024-01-01')
        .mockReturnValueOnce('2024-12-31')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserActivityReport', () => {
    it('should get user activity report successfully', async () => {
      const mockResponse = { data: [{ userId: '123', activityScore: 90 }], total: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserActivityReport')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('2024-01-01')
        .mockReturnValueOnce('2024-12-31')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getDepartmentSummaryReport', () => {
    it('should get department summary report successfully', async () => {
      const mockResponse = { data: [{ departmentId: 'dept-123', summary: {} }], total: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getDepartmentSummaryReport')
        .mockReturnValueOnce('dept-123')
        .mockReturnValueOnce('2024-01-01')
        .mockReturnValueOnce('2024-12-31')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getComplianceReport', () => {
    it('should get compliance report successfully', async () => {
      const mockResponse = { data: [{ complianceStatus: 'compliant' }], total: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getComplianceReport')
        .mockReturnValueOnce('dept-123')
        .mockReturnValueOnce('safety')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('generateCustomReport', () => {
    it('should generate custom report successfully', async () => {
      const mockResponse = { reportId: 'custom-123', status: 'generated' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('generateCustomReport')
        .mockReturnValueOnce('learner')
        .mockReturnValueOnce('{"department": "sales"}')
        .mockReturnValueOnce('{"dateFrom": "2024-01-01", "dateTo": "2024-12-31"}')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: expect.stringContaining('/api/rest/v1/reports/custom'),
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key',
          'privateKey': 'test-private-key',
        }),
        json: true,
        body: expect.objectContaining({
          reportType: 'learner',
          filters: { department: 'sales' },
          dateRange: { dateFrom: '2024-01-01', dateTo: '2024-12-31' },
        }),
      });
    });

    it('should handle invalid JSON in filters', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('generateCustomReport')
        .mockReturnValueOnce('learner')
        .mockReturnValueOnce('invalid json')
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      await expect(executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid filters JSON');
    });
  });
});
});
