// =============================================================================
// UNIT TEST TEMPLATE - FULL POWER
// =============================================================================

import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';

/**
 * 🧪 UNIT TEST TEMPLATE
 * 
 * This template follows CLAUDE.md standards for comprehensive testing
 * Copy this template for all new components/modules
 */

// Import the module under test
import { ComponentName } from '../src/path/to/component';

describe('ComponentName', () => {
  // 🎯 TEST SETUP
  let component;
  let mockDependency;
  let mockEventBus;
  let mockConfig;

  beforeEach(() => {
    // 🔧 Setup mocks
    mockDependency = {
      method: jest.fn(),
      asyncMethod: jest.fn().mockResolvedValue('success'),
      property: 'mock-value'
    };

    mockEventBus = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    };

    mockConfig = {
      timeout: 5000,
      retries: 3,
      debug: false
    };

    // 🏗️ Initialize component
    component = new ComponentName(mockDependency, mockEventBus, mockConfig);
  });

  afterEach(() => {
    // 🧹 Cleanup
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
    // Clean up DOM if needed
    document.body.innerHTML = '';
    
    // Clean up timers
    jest.clearAllTimers();
  });

  // ==========================================================================
  // 🏗️ CONSTRUCTOR TESTS
  // ==========================================================================
  describe('Constructor', () => {
    it('should initialize with correct dependencies', () => {
      expect(component.dependency).toBe(mockDependency);
      expect(component.eventBus).toBe(mockEventBus);
      expect(component.config).toEqual(mockConfig);
    });

    it('should throw error with invalid dependencies', () => {
      expect(() => {
        new ComponentName(null, mockEventBus, mockConfig);
      }).toThrow('Dependency is required');
    });

    it('should use default config when not provided', () => {
      const componentWithDefaults = new ComponentName(mockDependency, mockEventBus);
      expect(componentWithDefaults.config.timeout).toBe(3000); // default value
    });
  });

  // ==========================================================================
  // ⚡ CORE FUNCTIONALITY TESTS
  // ==========================================================================
  describe('Core Methods', () => {
    describe('primaryMethod', () => {
      it('should execute successfully with valid input', async () => {
        // Arrange
        const input = { id: 'test-123', data: 'test-data' };
        const expectedOutput = { success: true, id: 'test-123' };
        mockDependency.method.mockReturnValue(expectedOutput);

        // Act
        const result = await component.primaryMethod(input);

        // Assert
        expect(result).toEqual(expectedOutput);
        expect(mockDependency.method).toHaveBeenCalledWith(input);
        expect(mockEventBus.emit).toHaveBeenCalledWith('method:success', expectedOutput);
      });

      it('should handle errors gracefully', async () => {
        // Arrange
        const input = { id: 'test-123' };
        const error = new Error('Processing failed');
        mockDependency.method.mockRejectedValue(error);

        // Act
        const result = await component.primaryMethod(input);

        // Assert
        expect(result).toEqual({ success: false, error: 'Processing failed' });
        expect(mockEventBus.emit).toHaveBeenCalledWith('method:error', error);
      });

      it('should validate input parameters', async () => {
        // Act & Assert
        await expect(component.primaryMethod(null)).rejects.toThrow('Input is required');
        await expect(component.primaryMethod({})).rejects.toThrow('Input.id is required');
      });

      it('should respect timeout configuration', async () => {
        // Arrange
        jest.useFakeTimers();
        const input = { id: 'test-123', data: 'test-data' };
        mockDependency.method.mockImplementation(() => 
          new Promise(resolve => setTimeout(resolve, 10000))
        );

        // Act
        const resultPromise = component.primaryMethod(input);
        jest.advanceTimersByTime(6000); // Exceed timeout

        // Assert
        await expect(resultPromise).rejects.toThrow('Operation timed out');
        
        jest.useRealTimers();
      });
    });

    describe('secondaryMethod', () => {
      it('should process data correctly', () => {
        // Arrange
        const inputData = ['item1', 'item2', 'item3'];
        const expectedOutput = ['ITEM1', 'ITEM2', 'ITEM3'];

        // Act
        const result = component.secondaryMethod(inputData);

        // Assert
        expect(result).toEqual(expectedOutput);
      });

      it('should handle empty arrays', () => {
        // Act
        const result = component.secondaryMethod([]);

        // Assert
        expect(result).toEqual([]);
      });
    });
  });

  // ==========================================================================
  // 🎭 STATE MANAGEMENT TESTS
  // ==========================================================================
  describe('State Management', () => {
    it('should initialize with correct default state', () => {
      expect(component.state).toEqual({
        isLoading: false,
        hasError: false,
        data: null,
        lastUpdated: null
      });
    });

    it('should update state correctly', () => {
      // Arrange
      const newData = { id: 1, name: 'Test' };

      // Act
      component.setState({ data: newData, isLoading: false });

      // Assert
      expect(component.state.data).toEqual(newData);
      expect(component.state.isLoading).toBe(false);
      expect(component.state.lastUpdated).toBeInstanceOf(Date);
    });

    it('should emit state change events', () => {
      // Act
      component.setState({ isLoading: true });

      // Assert
      expect(mockEventBus.emit).toHaveBeenCalledWith('state:changed', {
        previous: expect.any(Object),
        current: expect.objectContaining({ isLoading: true })
      });
    });
  });

  // ==========================================================================
  // 🔄 EVENT HANDLING TESTS
  // ==========================================================================
  describe('Event Handling', () => {
    it('should register event listeners on init', () => {
      // Act
      component.init();

      // Assert
      expect(mockEventBus.on).toHaveBeenCalledWith('data:updated', expect.any(Function));
      expect(mockEventBus.on).toHaveBeenCalledWith('config:changed', expect.any(Function));
    });

    it('should handle data update events', () => {
      // Arrange
      const eventData = { id: 1, value: 'updated' };
      component.init();
      const eventHandler = mockEventBus.on.mock.calls.find(
        call => call[0] === 'data:updated'
      )[1];

      // Act
      eventHandler(eventData);

      // Assert
      expect(component.state.data).toEqual(eventData);
    });

    it('should clean up event listeners on destroy', () => {
      // Arrange
      component.init();

      // Act
      component.destroy();

      // Assert
      expect(mockEventBus.off).toHaveBeenCalledWith('data:updated', expect.any(Function));
      expect(mockEventBus.off).toHaveBeenCalledWith('config:changed', expect.any(Function));
    });
  });

  // ==========================================================================
  // 🔒 ERROR HANDLING TESTS
  // ==========================================================================
  describe('Error Handling', () => {
    it('should catch and handle synchronous errors', () => {
      // Arrange
      mockDependency.method.mockImplementation(() => {
        throw new Error('Sync error');
      });

      // Act
      const result = component.safeExecute(() => mockDependency.method());

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Sync error');
      expect(mockEventBus.emit).toHaveBeenCalledWith('error', expect.any(Error));
    });

    it('should handle async errors with retry logic', async () => {
      // Arrange
      let attemptCount = 0;
      mockDependency.asyncMethod.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve('success');
      });

      // Act
      const result = await component.executeWithRetry(() => mockDependency.asyncMethod());

      // Assert
      expect(result).toBe('success');
      expect(attemptCount).toBe(3);
    });

    it('should fail after max retries', async () => {
      // Arrange
      mockDependency.asyncMethod.mockRejectedValue(new Error('Persistent failure'));

      // Act & Assert
      await expect(
        component.executeWithRetry(() => mockDependency.asyncMethod())
      ).rejects.toThrow('Max retries exceeded');
    });
  });

  // ==========================================================================
  // ⚡ PERFORMANCE TESTS
  // ==========================================================================
  describe('Performance', () => {
    it('should complete operations within performance budget', async () => {
      // Arrange
      const startTime = performance.now();
      const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({ id: i, data: `item-${i}` }));

      // Act
      await component.processLargeDataSet(largeDataSet);
      const endTime = performance.now();

      // Assert
      const executionTime = endTime - startTime;
      expect(executionTime).toBeLessThan(100); // Should complete in <100ms
    });

    it('should handle memory efficiently', () => {
      // Arrange
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);

      // Act
      component.processAndCleanup(largeArray);

      // Assert
      // Memory should not increase significantly after cleanup
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(1000000); // Less than 1MB increase
    });
  });

  // ==========================================================================
  // 🧩 INTEGRATION TESTS (within unit test suite)
  // ==========================================================================
  describe('Integration Scenarios', () => {
    it('should work correctly with real dependencies', async () => {
      // Arrange - Use real dependencies instead of mocks
      const realDependency = new RealDependency();
      const realEventBus = new EventBus();
      const realComponent = new ComponentName(realDependency, realEventBus, mockConfig);

      // Act
      const result = await realComponent.primaryMethod({ id: 'integration-test' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.id).toBe('integration-test');
    });

    it('should handle dependency failures gracefully', async () => {
      // Arrange
      const faultyDependency = {
        method: () => { throw new Error('Dependency failure'); },
        asyncMethod: () => Promise.reject(new Error('Async failure'))
      };
      const faultyComponent = new ComponentName(faultyDependency, mockEventBus, mockConfig);

      // Act
      const result = await faultyComponent.primaryMethod({ id: 'fault-test' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Dependency failure');
    });
  });

  // ==========================================================================
  // 🎯 EDGE CASES
  // ==========================================================================
  describe('Edge Cases', () => {
    it('should handle null/undefined inputs', async () => {
      const testCases = [null, undefined, '', 0, false, [], {}];
      
      for (const testCase of testCases) {
        const result = await component.handleEdgeCase(testCase);
        expect(result).toBeDefined();
        expect(result.handled).toBe(true);
      }
    });

    it('should handle extremely large inputs', async () => {
      // Arrange
      const largeString = 'x'.repeat(1000000); // 1MB string
      const largeObject = {
        data: Array.from({ length: 100000 }, (_, i) => ({ id: i, value: `data-${i}` }))
      };

      // Act & Assert
      await expect(component.processLargeInput(largeString)).resolves.toBeDefined();
      await expect(component.processLargeInput(largeObject)).resolves.toBeDefined();
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const operations = Array.from({ length: 10 }, (_, i) => 
        component.primaryMethod({ id: `concurrent-${i}` })
      );

      // Act
      const results = await Promise.all(operations);

      // Assert
      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.id).toBe(`concurrent-${index}`);
      });
    });
  });
});

// =============================================================================
// 🔧 HELPER FUNCTIONS FOR TESTS
// =============================================================================

/**
 * Create mock DOM element for testing
 */
function createMockElement(tag = 'div', attributes = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * Wait for async operations to complete
 */
function waitForAsync(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock fetch for API testing
 */
function mockFetch(response, options = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: options.ok !== false,
    status: options.status || 200,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response))
  });
}

/**
 * Create performance test wrapper
 */
function performanceTest(testName, testFn, maxTime = 100) {
  return async () => {
    const startTime = performance.now();
    await testFn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > maxTime) {
      throw new Error(`Performance test "${testName}" took ${duration}ms (max: ${maxTime}ms)`);
    }
  };
}

export {
  createMockElement,
  waitForAsync,
  mockFetch,
  performanceTest
}; 