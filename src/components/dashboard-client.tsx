"use client";

import { useState, useRef, useMemo, useEffect, useActionState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Image as ImageIcon,
  X,
  LayoutGrid,
  Bot,
  PieChartIcon,
  Download,
} from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { processImage } from '@/lib/actions';
import type { AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const initialState: {
  result: AnalysisResult | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="gap-2">
      {pending ? (
        <>
          <Loader2 className="animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        'Analyze Image'
      )}
    </Button>
  );
}

export function DashboardClient() {
  const [state, formAction] = useActionState(processImage, initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 10MB.',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDimensions({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
  };

  const clearFile = () => {
    setImageFile(null);
    setPreviewUrl(null);
    formRef.current?.reset();
  };

  const defectDistribution = useMemo(() => {
    if (!state.result) return [];
    const counts = state.result.detections.reduce((acc, defect) => {
      acc[defect.label] = (acc[defect.label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [state.result]);

  const handlePrint = () => {
    window.print();
  };
  
  const result = state.result;

  return (
    <div className="w-full">
      {!result ? (
        <div className="mx-auto max-w-4xl p-6 py-12 text-center md:p-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Steel Sheet Quality Analysis</h1>
          <p className="mt-4 text-muted-foreground">
            Upload high-resolution images of steel sheets for AI-powered defect detection. Our advanced model will identify surface defects and generate comprehensive quality reports with actionable business insights.
          </p>
          <form ref={formRef} action={formAction} className="mt-8">
            <input
              type="hidden"
              name="imageDataUrl"
              value={previewUrl || ''}
            />
            <input type="hidden" name="width" value={dimensions.width} />
            <input type="hidden" name="height" value={dimensions.height} />

            <div className="flex flex-col items-center gap-4">
              <label
                htmlFor="file-upload"
                className="relative block w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                    <span className="mt-2 font-semibold text-foreground">
                      Upload Steel Sheet Image
                    </span>
                    <span className="text-sm">Drag and drop your image here, or click to select</span>
                </div>
                <input
                  id="file-upload"
                  name="image"
                  type="file"
                  className="sr-only"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP • Max size: 10MB</p>

              {previewUrl && (
                <div className="relative mt-4 rounded-md border bg-white p-2 shadow-sm">
                  <Image
                    src={previewUrl}
                    alt="Image preview"
                    width={200}
                    height={200}
                    onLoad={handleImageLoad}
                    className="h-auto max-h-48 w-auto rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={clearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {previewUrl && <div className="mt-4"><SubmitButton /></div>}
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 p-6 md:p-8 print-content">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Annotated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={result.annotatedImage}
                alt="Annotated steel sheet"
                width={800}
                height={600}
                className="w-full rounded-md border"
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="kpis" className="lg:col-span-1">
            <TabsList className="grid w-full grid-cols-3 no-print">
              <TabsTrigger value="kpis">
                <LayoutGrid className="mr-2 h-4 w-4" />
                KPIs
              </TabsTrigger>
              <TabsTrigger value="report">
                <Bot className="mr-2 h-4 w-4" />
                Report
              </TabsTrigger>
              <TabsTrigger value="charts">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Charts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kpis">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-muted-foreground">
                        Total Defects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {result.kpis.totalDefects}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-muted-foreground">
                        Severity Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {result.kpis.severityScore.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base text-muted-foreground">
                        Most Common Defect
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {result.kpis.mostCommonDefectType}
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="report" id="report-content">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>AI-Generated Report</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2 no-print"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  {result.report.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph.replace(/^###? /g, '')}</p>
                  )).reduce((acc, p, i) => {
                      const text = p.props.children;
                      if (text.startsWith('**') && text.endsWith('**')) {
                          return [...acc, <h3 key={`h-${i}`} className="font-bold my-4">{text.slice(2, -2)}</h3>];
                      }
                      if (text.startsWith('1.') || text.startsWith('2.') || text.startsWith('3.')) {
                          return [...acc, <h4 key={`h4-${i}`} className="font-semibold mt-4 mb-2">{text}</h4>];
                      }
                      return [...acc, p];
                  }, [] as JSX.Element[])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts">
              <Card>
                <CardHeader>
                  <CardTitle>Defect Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{}}
                    className="mx-auto aspect-square h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={defectDistribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          strokeWidth={5}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="lg:col-span-2 no-print mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Analyze Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
