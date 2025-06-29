import {
  AlertTriangle,
  Upload,
  BarChart3,
  History,
  Settings,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardClient } from '@/components/dashboard-client';
import { SystemStatus } from '@/components/system-status';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">KADD-AI</h1>
            <p className="text-xs text-muted-foreground">
              KPI-Aware Defect Detection
            </p>
          </div>
        </div>
        <SystemStatus />
      </header>
      <main className="flex flex-1 flex-col">
        <Tabs defaultValue="upload-analyze" className="flex flex-1 flex-col">
          <div className="border-b bg-white px-4 md:px-6 dark:bg-gray-900 sticky top-16 z-10">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger
                value="upload-analyze"
                className="gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Upload className="h-4 w-4" />
                Upload & Analyze
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <BarChart3 className="h-4 w-4" />
                Results & Report
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <History className="h-4 w-4" />
                Report History
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="upload-analyze" className="flex-1 bg-muted/30">
            <DashboardClient />
          </TabsContent>
          <TabsContent value="results" className="flex-1 bg-muted/30 p-4 md:p-6">
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Results & Report</h2>
                <p className="text-muted-foreground">
                  Analysis results will be displayed here after processing an image.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="flex-1 bg-muted/30 p-4 md:p-6">
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Report History</h2>
                <p className="text-muted-foreground">
                  A list of past analysis reports will be available here.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="flex-1 bg-muted/30 p-4 md:p-6">
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">
                  Application settings and configurations will be accessible here.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
