# KPI-Aware Defect Detection Report Generator (KADD-AI)

An intelligent AI-powered system that detects surface defects in sheet steel using computer vision, calculates key performance indicators (KPIs), and generates comprehensive business reports with actionable insights.

## Features

- **Defect Detection**: Advanced YOLOv5 model for accurate surface defect identification in sheet steel
- **Image Annotation**: Automatic generation of annotated images with bounding boxes and defect labels
- **KPI Calculation**: Real-time computation of critical metrics including:
  - Total defect count and density
  - Defect type frequency analysis
  - Severity scoring and classification
  - Quality assessment metrics
- **AI Report Generation**: Intelligent report creation with:
  - Executive summaries in business language
  - Key observations and findings
  - KPI highlights and trends
  - Actionable recommendations
- **Dashboard UI**: Modern, responsive interface for:
  - Image upload and processing
  - Real-time defect visualization
  - KPI dashboard with charts
  - Report viewing and management
- **Export & Integration**: 
  - PDF report export functionality
  - Email integration for report distribution
  - Report history and search capabilities

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Firebase account (for backend services)
- OpenAI API key (for AI report generation)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/KADD-AI.git
   cd KADD-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:9002
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start AI services (in a separate terminal)**
   ```bash
   npm run genkit:dev
   ```

The application will be available at `http://localhost:9002`

## Usage

### 1. Upload Images
- Navigate to the dashboard
- Click "Upload Image" or drag and drop steel sheet images
- Supported formats: JPG, PNG, WebP
- Maximum file size: 10MB

### 2. Run Defect Detection
- After upload, the system automatically processes the image
- YOLOv5 model detects and classifies surface defects
- Results are displayed with bounding boxes and labels

### 3. View KPIs
- Real-time KPI calculations appear in the dashboard
- View defect counts, density, and severity scores
- Analyze trends with interactive charts

### 4. Generate Reports
- Click "Generate Report" to create AI-powered analysis
- Review executive summary and recommendations
- Customize report content if needed

### 5. Export & Share
- Download reports as PDF files
- Email reports directly from the application
- Access report history for past analyses

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization

### AI & Machine Learning
- **YOLOv5** - Object detection model for defect identification
- **OpenAI GPT** - Natural language report generation
- **Genkit** - AI workflow orchestration

### Backend & Infrastructure
- **Firebase** - Authentication, storage, and hosting
- **Firebase Studio** - Development environment
- **Node.js** - Runtime environment

### Development Tools
- **Cursor** - AI-powered code editor
- **Trae AI** - AI development assistance
- **ESLint & Prettier** - Code quality and formatting

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AI Services   │    │   Backend       │
│   (Next.js)     │◄──►│   (Genkit)      │◄──►│   (Firebase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard UI  │    │   YOLOv5 Model  │    │   Storage &     │
│   - Upload      │    │   - Detection   │    │   Authentication│
│   - Visualization│   │   - Annotation  │    │   - Reports     │
│   - Reports     │    │   - KPIs        │    │   - History     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

1. **Model Training Pipeline**: YOLOv5 training on steel defect datasets
2. **API Layer**: RESTful endpoints for image processing and report generation
3. **KPI Engine**: Real-time calculation of quality metrics
4. **Report Generator**: AI-powered business report creation
5. **Frontend Dashboard**: React-based user interface
6. **Storage System**: Firebase-based file and data management

## Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/KADD-AI.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Code Style Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include unit tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- YOLOv5 community for the object detection model
- OpenAI for GPT integration
- Firebase team for backend services
- All contributors and users of this project

---

