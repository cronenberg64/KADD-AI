# Contributing to KADD-AI

Thank you for your interest in contributing to the KPI-Aware Defect Detection Report Generator (KADD-AI)! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes
- Focusing on what is best for the overall community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Firebase CLI (for backend development)
- Python 3.8+ (for AI model development)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/KADD-AI.git
   cd KADD-AI
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/KADD-AI.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (if working on AI models)
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
NODE_ENV=development
```

### 3. Start Development Servers

```bash
# Terminal 1: Start Next.js development server
npm run dev

# Terminal 2: Start AI services
npm run genkit:dev

# Terminal 3: Run tests in watch mode (optional)
npm run test:watch
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow strict TypeScript configuration
- Use meaningful type names and interfaces
- Avoid `any` type - use proper typing

```typescript
// Good
interface DetectionResult {
  id: string;
  type: DefectType;
  confidence: number;
  bbox: BoundingBox;
}

// Bad
const result: any = { id: '123', type: 'scratch' };
```

### React Components

- Use functional components with hooks
- Follow naming conventions: PascalCase for components
- Use proper prop types and interfaces
- Implement error boundaries where appropriate

```typescript
// Good
interface ImageUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024
}) => {
  // Component implementation
};
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── ai/                 # AI-related code
│   ├── flows/          # AI workflow definitions
│   └── models/         # AI model configurations
└── app/                # Next.js app directory
```

### Naming Conventions

- **Files**: kebab-case (`image-uploader.tsx`)
- **Components**: PascalCase (`ImageUploader`)
- **Functions**: camelCase (`handleImageUpload`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`DetectionResult`)

### Comments and Documentation

- Use JSDoc for function documentation
- Add inline comments for complex logic
- Keep comments up-to-date with code changes

```typescript
/**
 * Calculates defect density based on detection results and image dimensions
 * @param detections - Array of detected defects
 * @param imageArea - Total image area in square meters
 * @returns Defect density (defects per square meter)
 */
export const calculateDefectDensity = (
  detections: Detection[],
  imageArea: number
): number => {
  return detections.length / imageArea;
};
```

## Testing Guidelines

### Unit Tests

- Write tests for all utility functions
- Test React components with React Testing Library
- Aim for 80%+ code coverage
- Use descriptive test names

```typescript
// Good test example
describe('calculateDefectDensity', () => {
  it('should return correct density for multiple defects', () => {
    const detections = [
      { id: '1', type: 'scratch', confidence: 0.9 },
      { id: '2', type: 'dent', confidence: 0.8 }
    ];
    const imageArea = 2.0; // 2 square meters
    
    const density = calculateDefectDensity(detections, imageArea);
    
    expect(density).toBe(1.0); // 2 defects / 2 m² = 1 defect/m²
  });

  it('should return 0 for empty detections', () => {
    const density = calculateDefectDensity([], 1.0);
    expect(density).toBe(0);
  });
});
```

### Integration Tests

- Test API endpoints
- Test complete user workflows
- Use test databases for data persistence tests

### E2E Tests

- Test critical user journeys
- Use Playwright or Cypress
- Test across different browsers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, well-documented code
- Add tests for new functionality
- Update documentation as needed
- Follow the code style guidelines

### 3. Commit Your Changes

Use conventional commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(upload): add drag and drop support for image uploads"
git commit -m "fix(detection): resolve false positive in rust detection"
git commit -m "docs(api): update API documentation with new endpoints"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

### 5. Pull Request Guidelines

**Title Format:**
```
type(scope): brief description
```

**Description Template:**
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] No TypeScript errors

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### 6. Review Process

- All PRs require at least one review
- Address review comments promptly
- Maintainers may request changes
- PRs are merged after approval

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

### Feature Requests

Use the feature request template:

```markdown
## Problem Statement
Describe the problem this feature would solve

## Proposed Solution
Describe the proposed solution

## Alternative Solutions
Describe any alternative solutions considered

## Additional Context
Any other context or screenshots
```

## Documentation

### Code Documentation

- Document all public APIs
- Include usage examples
- Keep documentation up-to-date

### User Documentation

- Write clear, concise user guides
- Include screenshots and examples
- Update documentation with new features

### API Documentation

- Document all endpoints
- Include request/response examples
- Provide error code explanations

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Create release branch**
   ```bash
   git checkout -b release/v1.2.0
   ```

2. **Update version**
   ```bash
   npm version patch|minor|major
   ```

3. **Update changelog**
   - Document all changes
   - Include breaking changes
   - List new features and fixes

4. **Create pull request**
   - Review all changes
   - Ensure tests pass
   - Update documentation

5. **Merge and tag**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

6. **Deploy**
   - Deploy to staging
   - Run smoke tests
   - Deploy to production

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check the docs folder
- **Code Review**: Ask in pull requests

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame

Thank you for contributing to KADD-AI!