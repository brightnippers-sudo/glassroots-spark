import { useState } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Download,
  RotateCcw,
  Play,
  Clock,
  Users,
  Award
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResultsPublisher = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mappingData, setMappingData] = useState({});
  const [validationResults, setValidationResults] = useState(null);

  // Mock data
  const publishHistory = [
    {
      id: 1,
      batch: "BATCH-2024-001",
      competition: "Scholars Cambridge Maths 2024",
      rows: 15420,
      published: "2024-03-15 14:30",
      publishedBy: "Admin",
      status: "Published"
    },
    {
      id: 2,
      batch: "BATCH-2024-002",
      competition: "SCMC Science Challenge",
      rows: 8950,
      published: "2024-03-10 16:45",
      publishedBy: "Admin",
      status: "Published"
    }
  ];

  const sampleMapping = {
    registration_id: "ID",
    participant_email: "Email",
    score: "Total_Score",
    percentile: "Percentile",
    rank: "Rank",
    category: "Category"
  };

  const mockPreviewData = [
    { registration_id: "REG001", participant_email: "john@example.com", score: 95, percentile: 98, rank: 1, category: "Lower Primary" },
    { registration_id: "REG002", participant_email: "sarah@example.com", score: 89, percentile: 92, rank: 5, category: "Lower Primary" },
    { registration_id: "REG003", participant_email: "mike@example.com", score: 87, percentile: 90, rank: 8, category: "Upper Primary" }
  ];

  const validationWarnings = [
    { type: "Missing", count: 5, message: "Registration IDs not found in system" },
    { type: "Invalid", count: 2, message: "Scores out of valid range (0-100)" },
    { type: "Duplicate", count: 1, message: "Duplicate entries detected" }
  ];

  const steps = [
    { id: 1, title: "Upload CSV", description: "Upload results file" },
    { id: 2, title: "Map Columns", description: "Map CSV columns to fields" },
    { id: 3, title: "Preview & Validate", description: "Review data and warnings" },
    { id: 4, title: "Publish", description: "Confirm and publish results" }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep(2);
    }
  };

  const handleMapping = () => {
    setCurrentStep(3);
    setValidationResults(validationWarnings);
  };

  const handlePublish = () => {
    setCurrentStep(4);
    // Simulate publish process
    setTimeout(() => {
      setCurrentStep(1);
      setUploadedFile(null);
      setMappingData({});
      setValidationResults(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Results Publisher</h1>
        <div className="flex gap-3">
          <GlassButton variant="secondary">
            <FileText className="w-4 h-4" />
            Download Template
          </GlassButton>
          <GlassButton variant="ghost">
            <RotateCcw className="w-4 h-4" />
            Rollback Last
          </GlassButton>
        </div>
      </div>

      {/* Progress Steps */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-8 h-0.5 w-16 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Step Content */}
      {currentStep === 1 && (
        <GlassCard className="p-8">
          <div className="text-center">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Upload Results CSV</h2>
            <p className="text-muted-foreground mb-6">
              Upload a CSV file containing participant results. Make sure your file includes registration IDs or emails.
            </p>
            
            <div className="border-2 border-dashed border-white/20 rounded-base p-8 mb-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium">Click to upload CSV file</p>
                  <p className="text-sm text-muted-foreground">or drag and drop your file here</p>
                </div>
              </label>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Download the CSV template to ensure your file has the correct format and column headers.
              </AlertDescription>
            </Alert>
          </div>
        </GlassCard>
      )}

      {currentStep === 2 && uploadedFile && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Map CSV Columns</h2>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 glass rounded-base">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Detected 3,247 rows
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Map your CSV columns to the required system fields:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(sampleMapping).map(([field, csvColumn]) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium text-foreground capitalize">
                    {field.replace('_', ' ')}
                    {field === 'registration_id' || field === 'participant_email' ? (
                      <span className="text-red-500 ml-1">*</span>
                    ) : null}
                  </label>
                  <select className="w-full glass-card border border-white/10 rounded-base p-3 bg-transparent text-foreground">
                    <option value="">{csvColumn}</option>
                    <option value="ID">ID</option>
                    <option value="Email">Email</option>
                    <option value="Score">Score</option>
                    <option value="Total_Score">Total_Score</option>
                    <option value="Percentile">Percentile</option>
                    <option value="Rank">Rank</option>
                    <option value="Category">Category</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6">
              <GlassButton variant="primary" onClick={handleMapping}>
                Continue to Preview
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => setCurrentStep(1)}>
                Back
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Validation Warnings */}
          {validationResults && validationResults.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Validation Warnings
              </h3>
              <div className="space-y-3">
                {validationResults.map((warning, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">{warning.count} {warning.type}:</span> {warning.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Preview Data */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Preview (First 20 rows)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentile</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPreviewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.registration_id}</TableCell>
                    <TableCell>{row.participant_email}</TableCell>
                    <TableCell>{row.score}</TableCell>
                    <TableCell>{row.percentile}%</TableCell>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>{row.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>

          {/* Dry Run Report */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Dry Run Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-4 rounded-base text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">3,240</p>
                <p className="text-sm text-muted-foreground">Rows to Insert</p>
              </div>
              <div className="glass p-4 rounded-base text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-sm text-muted-foreground">Rows to Update</p>
              </div>
              <div className="glass p-4 rounded-base text-center">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Conflicts/Warnings</p>
              </div>
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <GlassButton variant="primary" onClick={handlePublish}>
              <Play className="w-4 h-4" />
              Proceed to Publish
            </GlassButton>
            <GlassButton variant="ghost" onClick={() => setCurrentStep(2)}>
              Back to Mapping
            </GlassButton>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <GlassCard className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Publishing Results...</h2>
            <p className="text-muted-foreground mb-6">
              Processing 3,247 records and generating certificates for top performers.
            </p>
            
            <Progress value={75} className="mb-4" />
            <p className="text-sm text-muted-foreground">Step 3 of 4: Generating certificates...</p>

            <Alert className="mt-6 text-left">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Results will be published to the leaderboards and participants will receive email notifications.
                Certificates will be generated for top 10% performers in each category.
              </AlertDescription>
            </Alert>
          </div>
        </GlassCard>
      )}

      {/* Publish History */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Publication History</h2>
            <GlassButton variant="secondary" size="sm">
              <Download className="w-4 h-4" />
              Export Log
            </GlassButton>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.batch}</TableCell>
                  <TableCell>{entry.competition}</TableCell>
                  <TableCell>{entry.rows.toLocaleString()}</TableCell>
                  <TableCell>{entry.published}</TableCell>
                  <TableCell>{entry.publishedBy}</TableCell>
                  <TableCell>
                    <Badge className="bg-success/20 text-success">{entry.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <GlassButton variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton variant="ghost" size="sm">
                        <RotateCcw className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
};

export default ResultsPublisher;