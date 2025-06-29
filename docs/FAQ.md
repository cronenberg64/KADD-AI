# Frequently Asked Questions (FAQ)

## General Questions

### What is KADD-AI?

KADD-AI (KPI-Aware Defect Detection AI) is an intelligent system that uses computer vision and artificial intelligence to detect surface defects in sheet steel, calculate key performance indicators (KPIs), and generate comprehensive business reports with actionable insights.

### What types of defects can KADD-AI detect?

Currently, KADD-AI is designed to detect common surface defects in sheet steel including:
- **Scratches**: Surface abrasions and marks
- **Dents**: Depressions or indentations
- **Rust**: Corrosion spots and areas
- **Discoloration**: Color variations and stains

The system can be trained to detect additional defect types based on your specific requirements.

### How accurate is the defect detection?

The accuracy depends on the quality of the training data and the specific defect types. With properly trained models, KADD-AI typically achieves:
- **Detection Accuracy**: 85-95% for common defects
- **False Positive Rate**: <5% with proper threshold tuning
- **Processing Speed**: 2-5 seconds per image

### What image formats are supported?

KADD-AI supports the following image formats:
- **JPEG/JPG**: Most common format
- **PNG**: Lossless format
- **WebP**: Modern web-optimized format

**Requirements:**
- Maximum file size: 10MB
- Minimum resolution: 640x480 pixels
- Recommended resolution: 1920x1080 or higher

## Technical Questions

### What are the system requirements?

**Minimum Requirements:**
- Node.js 18+
- 4GB RAM
- 2GB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

**Recommended Requirements:**
- Node.js 18+
- 8GB RAM
- 10GB free disk space
- High-speed internet connection
- GPU support (for faster AI processing)

### How do I set up the development environment?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/KADD-AI.git
   cd KADD-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file with your Firebase and OpenAI credentials.

4. **Start development servers:**
   ```bash
   npm run dev          # Next.js server
   npm run genkit:dev   # AI services
   ```

### How do I deploy KADD-AI to production?

KADD-AI can be deployed using multiple methods:

1. **Firebase Hosting (Recommended):**
   ```bash
   npm run build
   firebase deploy
   ```

2. **Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Docker:**
   ```bash
   docker build -t kadd-ai .
   docker run -p 3000:3000 kadd-ai
   ```

See the [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

### How does the AI model work?

KADD-AI uses a combination of technologies:

1. **YOLOv5**: Object detection model for identifying defect locations
2. **OpenAI GPT**: Natural language processing for report generation
3. **Custom KPI Engine**: Calculates quality metrics and insights

The workflow:
1. Upload image → 2. YOLOv5 detects defects → 3. Calculate KPIs → 4. Generate AI report

## Usage Questions

### How do I upload images for analysis?

1. Navigate to the dashboard
2. Click "Upload Image" or drag and drop files
3. Supported formats: JPG, PNG, WebP (max 10MB)
4. The system will automatically process the image

### How long does processing take?

Processing times vary based on:
- **Image size**: Larger images take longer
- **Number of defects**: More defects require more analysis
- **Server load**: Peak usage may slow processing

**Typical processing times:**
- Small images (<1MB): 2-3 seconds
- Medium images (1-5MB): 3-5 seconds
- Large images (5-10MB): 5-10 seconds

### What KPIs does KADD-AI calculate?

KADD-AI calculates several key performance indicators:

- **Total Defect Count**: Number of defects found
- **Defect Density**: Defects per square meter
- **Defect Type Distribution**: Breakdown by defect type
- **Severity Analysis**: Low/Medium/High severity distribution
- **Quality Score**: Overall quality rating (0-100)
- **Trend Analysis**: Historical performance comparison

### Can I customize the reports?

Yes, KADD-AI offers several customization options:

- **Report Types**: Executive, Technical, or Detailed
- **Language**: English, Spanish, French (more coming)
- **Content**: Include/exclude charts, recommendations
- **Format**: PDF or DOCX export
- **Branding**: Add company logo and colors

### How do I export reports?

1. **Generate a report** from the dashboard
2. **Click "Export"** button
3. **Choose format**: PDF or DOCX
4. **Download** or **Email** the report

## Integration Questions

### Can KADD-AI integrate with existing systems?

Yes, KADD-AI provides several integration options:

- **REST API**: Full API for custom integrations
- **Webhooks**: Real-time notifications
- **Database Export**: Export data to external systems
- **Email Integration**: Automated report distribution
- **Cloud Storage**: Direct integration with cloud providers

### What APIs are available?

KADD-AI provides comprehensive APIs:

- **Image Upload**: POST `/api/upload`
- **Defect Detection**: POST `/api/detect`
- **KPI Calculation**: POST `/api/kpis/calculate`
- **Report Generation**: POST `/api/reports/generate`
- **Export**: POST `/api/reports/:id/export`

See the [API Documentation](API.md) for complete details.

### Can I use my own AI models?

Yes, KADD-AI is designed to be extensible:

1. **Custom Models**: Train your own YOLOv5 models
2. **Model Integration**: Replace default models
3. **Custom Defect Types**: Add new defect classifications
4. **Domain Adaptation**: Fine-tune for your specific use case

## Troubleshooting

### The application won't start

**Common solutions:**
1. Check Node.js version (requires 18+)
2. Verify all dependencies are installed: `npm install`
3. Check environment variables in `.env.local`
4. Ensure ports 9002 and 3000 are available
5. Check console for error messages

### Images aren't uploading

**Troubleshooting steps:**
1. Check file format (JPG, PNG, WebP only)
2. Verify file size (max 10MB)
3. Check internet connection
4. Verify Firebase Storage configuration
5. Check browser console for errors

### Defect detection is inaccurate

**Improvement suggestions:**
1. Use higher resolution images
2. Ensure proper lighting in images
3. Train custom models for your specific defects
4. Adjust confidence thresholds
5. Provide feedback to improve model accuracy

### Reports aren't generating

**Common causes:**
1. Check OpenAI API key configuration
2. Verify internet connection
3. Check API rate limits
4. Ensure sufficient processing time
5. Review error logs

### Performance is slow

**Optimization tips:**
1. Use smaller image files
2. Enable GPU acceleration
3. Upgrade server resources
4. Use CDN for static assets
5. Implement caching strategies

## Security Questions

### Is my data secure?

Yes, KADD-AI implements several security measures:

- **Authentication**: Firebase Auth integration
- **Encryption**: Data encrypted in transit and at rest
- **Access Control**: Role-based permissions
- **Audit Logs**: Track all system activities
- **GDPR Compliance**: Data protection regulations

### Where is my data stored?

Data storage locations depend on your configuration:

- **Images**: Firebase Cloud Storage
- **Reports**: Firestore database
- **User Data**: Firebase Authentication
- **Processing**: Your server or cloud provider

### Can I use KADD-AI offline?

Currently, KADD-AI requires an internet connection for:
- AI model inference
- Report generation
- Cloud storage access

Offline capabilities are planned for future releases.

## Pricing and Licensing

### Is KADD-AI free to use?

KADD-AI is open-source and free to use, but you may incur costs for:
- **OpenAI API**: Per-request pricing
- **Firebase Services**: Usage-based pricing
- **Cloud Hosting**: Server costs
- **Custom Model Training**: Computational resources

### What license does KADD-AI use?

KADD-AI is released under the MIT License, which allows:
- Commercial use
- Modification
- Distribution
- Private use

See the [LICENSE](../LICENSE) file for complete terms.

## Support and Community

### How do I get help?

Multiple support channels are available:

- **Documentation**: Check the [docs](docs/) folder
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Email**: Contact the maintainers directly

### How can I contribute?

We welcome contributions! See the [Contributing Guide](../CONTRIBUTING.md) for details:

- **Code Contributions**: Bug fixes and new features
- **Documentation**: Improve guides and examples
- **Testing**: Help with testing and quality assurance
- **Community**: Answer questions and help others

### Where can I find updates?

Stay updated through:
- **GitHub Releases**: Version updates and changelog
- **Blog**: Technical articles and announcements
- **Newsletter**: Monthly updates (coming soon)
- **Social Media**: Follow for latest news

---

**Still have questions?** Open an [issue](https://github.com/your-username/KADD-AI/issues) or join our [discussions](https://github.com/your-username/KADD-AI/discussions)! 