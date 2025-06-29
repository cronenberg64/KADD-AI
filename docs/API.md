# KADD-AI API Documentation

## Overview

The KADD-AI API provides endpoints for defect detection, KPI calculation, and report generation. The API is built using Next.js API routes and integrates with Firebase for data storage and authentication.

## Base URL

- **Development**: `http://localhost:9002/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All API endpoints require authentication using Firebase Auth. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### 1. Image Upload & Processing

#### POST `/api/upload`
Upload an image for defect detection processing.

**Request:**
```typescript
Content-Type: multipart/form-data

{
  "image": File, // JPG, PNG, or WebP format, max 10MB
  "metadata": {
    "batchId": string,
    "timestamp": string,
    "location": string
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "imageId": string,
    "uploadUrl": string,
    "processingStatus": "pending"
  }
}
```

#### GET `/api/images/:imageId/status`
Check the processing status of an uploaded image.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "status": "processing" | "completed" | "failed",
    "progress": number, // 0-100
    "detections": Detection[],
    "annotatedImageUrl": string
  }
}
```

### 2. Defect Detection

#### POST `/api/detect`
Trigger defect detection on an uploaded image.

**Request:**
```typescript
{
  "imageId": string,
  "confidence": number, // Optional, default: 0.5
  "iouThreshold": number // Optional, default: 0.45
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "detections": [
      {
        "id": string,
        "type": "scratch" | "dent" | "rust" | "discoloration",
        "confidence": number,
        "bbox": {
          "x": number,
          "y": number,
          "width": number,
          "height": number
        },
        "severity": "low" | "medium" | "high"
      }
    ],
    "annotatedImageUrl": string,
    "processingTime": number
  }
}
```

### 3. KPI Calculation

#### POST `/api/kpis/calculate`
Calculate KPIs based on detection results.

**Request:**
```typescript
{
  "imageId": string,
  "detections": Detection[],
  "imageDimensions": {
    "width": number,
    "height": number
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalDefects": number,
    "defectDensity": number, // defects per square meter
    "defectTypes": {
      "scratch": number,
      "dent": number,
      "rust": number,
      "discoloration": number
    },
    "severityDistribution": {
      "low": number,
      "medium": number,
      "high": number
    },
    "qualityScore": number, // 0-100
    "recommendations": string[]
  }
}
```

#### GET `/api/kpis/history`
Get historical KPI data for trend analysis.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `batchId`: string (optional)

**Response:**
```typescript
{
  "success": true,
  "data": {
    "trends": {
      "defectDensity": number[],
      "qualityScore": number[],
      "dates": string[]
    },
    "summary": {
      "averageDefects": number,
      "improvementRate": number,
      "topIssues": string[]
    }
  }
}
```

### 4. Report Generation

#### POST `/api/reports/generate`
Generate an AI-powered report based on detection results and KPIs.

**Request:**
```typescript
{
  "imageId": string,
  "kpis": KPIResult,
  "reportType": "executive" | "technical" | "detailed",
  "customization": {
    "includeCharts": boolean,
    "includeRecommendations": boolean,
    "language": "en" | "es" | "fr"
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "reportId": string,
    "report": {
      "executiveSummary": string,
      "keyFindings": string[],
      "kpiHighlights": object,
      "recommendations": string[],
      "technicalDetails": object
    },
    "generatedAt": string,
    "estimatedReadingTime": number
  }
}
```

#### GET `/api/reports/:reportId`
Retrieve a generated report.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "report": Report,
    "metadata": {
      "createdAt": string,
      "updatedAt": string,
      "version": string
    }
  }
}
```

#### GET `/api/reports`
List all generated reports with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `sortBy`: "date" | "severity" | "type"
- `order`: "asc" | "desc"

**Response:**
```typescript
{
  "success": true,
  "data": {
    "reports": ReportSummary[],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

### 5. Export & Sharing

#### POST `/api/reports/:reportId/export`
Export a report as PDF.

**Request:**
```typescript
{
  "format": "pdf" | "docx",
  "includeImages": boolean,
  "watermark": string // Optional
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "downloadUrl": string,
    "expiresAt": string,
    "fileSize": number
  }
}
```

#### POST `/api/reports/:reportId/email`
Send a report via email.

**Request:**
```typescript
{
  "recipients": string[],
  "subject": string,
  "message": string,
  "includeAttachment": boolean,
  "format": "pdf" | "docx"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "messageId": string,
    "sentAt": string,
    "recipients": string[]
  }
}
```

## Error Handling

All API endpoints return consistent error responses:

```typescript
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": object // Optional
  }
}
```

### Common Error Codes

- `AUTH_REQUIRED`: Authentication token missing or invalid
- `INVALID_INPUT`: Request validation failed
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `UNSUPPORTED_FORMAT`: File format not supported
- `PROCESSING_FAILED`: Image processing failed
- `MODEL_ERROR`: AI model inference error
- `STORAGE_ERROR`: File storage operation failed
- `RATE_LIMITED`: Too many requests

## Rate Limiting

- **Upload endpoints**: 10 requests per minute
- **Detection endpoints**: 20 requests per minute
- **Report generation**: 5 requests per minute
- **Export endpoints**: 15 requests per minute

## WebSocket Events

For real-time updates during processing:

```typescript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:9002/ws');

// Listen for processing updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'PROCESSING_UPDATE':
      console.log('Progress:', data.progress);
      break;
    case 'DETECTION_COMPLETE':
      console.log('Detections:', data.detections);
      break;
    case 'REPORT_READY':
      console.log('Report ID:', data.reportId);
      break;
  }
};
```

## SDK Usage

```typescript
import { KADDClient } from '@kadd-ai/sdk';

const client = new KADDClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:9002/api'
});

// Upload and process image
const result = await client.uploadAndProcess({
  image: file,
  metadata: { batchId: 'batch-001' }
});

// Generate report
const report = await client.generateReport({
  imageId: result.imageId,
  reportType: 'executive'
});
```

## Testing

Use the provided Postman collection or curl examples:

```bash
# Test image upload
curl -X POST http://localhost:9002/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "metadata={\"batchId\":\"test-batch\"}"
```

For more examples and testing scenarios, see the [API Testing Guide](TESTING.md). 