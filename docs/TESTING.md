# Testing Guide for KADD-AI

This guide covers testing strategies and best practices for the KPI-Aware Defect Detection Report Generator (KADD-AI) project.

## Testing Strategy

### Test Categories

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test API endpoints and service interactions
3. **E2E Tests**: Test complete user workflows
4. **AI Model Tests**: Test defect detection accuracy
5. **Performance Tests**: Test system performance under load

## Unit Testing

### Setup

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Component Testing Example

```typescript
// src/components/ImageUploader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageUploader } from './ImageUploader'

describe('ImageUploader', () => {
  it('should handle file upload', () => {
    const mockOnUpload = jest.fn()
    render(<ImageUploader onUpload={mockOnUpload} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText(/upload/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    expect(mockOnUpload).toHaveBeenCalledWith(file)
  })
})
```

### Utility Function Testing

```typescript
// src/lib/utils.test.ts
import { calculateDefectDensity } from './utils'

describe('calculateDefectDensity', () => {
  it('should calculate correct density', () => {
    const detections = [
      { id: '1', type: 'scratch', confidence: 0.9 },
      { id: '2', type: 'dent', confidence: 0.8 }
    ]
    const imageArea = 2.0
    
    const density = calculateDefectDensity(detections, imageArea)
    expect(density).toBe(1.0) // 2 defects / 2 m² = 1 defect/m²
  })
})
```

## Integration Testing

### API Testing

```typescript
// tests/api/upload.test.ts
import request from 'supertest'
import { app } from '../../src/app'

describe('POST /api/upload', () => {
  it('should upload image successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('image', 'tests/fixtures/test-image.jpg')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
```

## E2E Testing with Playwright

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Test Example

```typescript
// tests/e2e/upload-flow.spec.ts
import { test, expect } from '@playwright/test'

test('should upload image and generate report', async ({ page }) => {
  await page.goto('/')
  
  // Upload image
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.click('text=Upload Image')
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles('tests/fixtures/test-image.jpg')
  
  // Wait for processing
  await page.waitForSelector('text=Detection Complete')
  
  // Generate report
  await page.click('text=Generate Report')
  await page.waitForSelector('text=Report Generated')
})
```

## AI Model Testing

### Accuracy Testing

```typescript
// tests/ai/model-accuracy.test.ts
import { YOLOModel } from '../../src/ai/models/yolo'

describe('YOLO Model Accuracy', () => {
  test('should achieve minimum accuracy threshold', async () => {
    const model = new YOLOModel()
    await model.load()
    
    const testDataset = await loadTestDataset()
    let correctDetections = 0
    let totalDetections = 0

    for (const { image, expectedDefects } of testDataset) {
      const detections = await model.detect(image)
      // Compare with ground truth
      correctDetections += calculateCorrectDetections(detections, expectedDefects)
      totalDetections += expectedDefects.length
    }

    const accuracy = correctDetections / totalDetections
    expect(accuracy).toBeGreaterThan(0.85) // 85% minimum accuracy
  })
})
```

## Performance Testing

### Load Testing

```bash
npm install --save-dev artillery
```

```yaml
# tests/performance/load-test.yml
config:
  target: 'http://localhost:9002'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 300
      arrivalRate: 50

scenarios:
  - name: "Upload and Process"
    flow:
      - post:
          url: "/api/upload"
          multipart:
            - name: "image"
              file: "tests/fixtures/test-image.jpg"
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run performance tests
npx artillery run tests/performance/load-test.yml
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run test:e2e
```

## Test Data Management

### Test Images

```
tests/fixtures/
├── images/
│   ├── normal/          # Standard test images
│   ├── defects/         # Images with known defects
│   ├── edge-cases/      # Blurry, low-light, etc.
│   └── invalid/         # Wrong format, oversized
```

### Mock Data

```typescript
// tests/mocks/test-data.ts
export const mockDetections = [
  {
    id: '1',
    type: 'scratch',
    confidence: 0.95,
    bbox: { x: 100, y: 150, width: 50, height: 20 }
  }
]
```

## Best Practices

1. **Test Coverage**: Aim for 80%+ code coverage
2. **Test Isolation**: Each test should be independent
3. **Mock External Services**: Don't rely on external APIs in tests
4. **Meaningful Assertions**: Test behavior, not implementation
5. **Fast Tests**: Keep unit tests under 100ms each
6. **Clear Test Names**: Use descriptive test names
7. **Test Data**: Use realistic test data
8. **Error Cases**: Test error conditions and edge cases

## Manual Testing Checklist

- [ ] Image upload functionality
- [ ] Defect detection accuracy
- [ ] KPI calculation correctness
- [ ] Report generation quality
- [ ] Export functionality
- [ ] Responsive design
- [ ] Cross-browser compatibility
- [ ] Performance under load
- [ ] Error handling
- [ ] Security validation

For more detailed testing information, refer to the [Contributing Guide](../CONTRIBUTING.md). 