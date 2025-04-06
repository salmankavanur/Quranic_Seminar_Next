"use client"; // Mark as a Client Component

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Uses the fixed SafeInput
import { FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionActions } from "./submission-actions";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Helper function to create download URL
function getDownloadUrl(filePath: string) {
  if (!filePath) return null;

  try {
    const url = new URL(filePath);
    const path = url.pathname.split("/public/")[1];

    if (!path) return null;

    const bucket = url.pathname.includes("/submissions/") ? "submissions" : "documents";
    const fileName = path.split("/").pop();

    return `/api/download?path=${encodeURIComponent(path)}&bucket=${bucket}&filename=${encodeURIComponent(fileName)}`;
  } catch (error) {
    console.error("Error creating download URL:", error);
    return null;
  }
}

interface SubmissionsClientProps {
  abstracts: any[];
  papers: any[];
  abstractCounts: {
    all: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  paperCounts: {
    all: number;
    pending: number;
    accepted: number;
    rejected: number;
    qualified: number;
  };
}

export function SubmissionsClient({
  abstracts,
  papers,
  abstractCounts,
  paperCounts,
}: SubmissionsClientProps) {
  const [activeTab, setActiveTab] = useState("abstracts");
  const [paperFilter, setPaperFilter] = useState("all");
  const [abstractFilter, setAbstractFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAbstracts = abstracts
    .filter((abstract) => abstractFilter === "all" || abstract.status === abstractFilter)
    .filter(
      (abstract) =>
        abstract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredPapers = papers
    .filter((paper) => paperFilter === "all" || paper.status === paperFilter)
    .filter(
      (paper) =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tabs defaultValue="abstracts" onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="abstracts">Abstract Submissions</TabsTrigger>
        <TabsTrigger value="papers">Paper Submissions</TabsTrigger>
      </TabsList>

      <TabsContent value="abstracts">
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search abstracts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4 flex space-x-2">
          <Button
            variant={abstractFilter === "all" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setAbstractFilter("all")}
          >
            All ({abstractCounts.all})
          </Button>
          <Button
            variant={abstractFilter === "pending" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setAbstractFilter("pending")}
          >
            Pending ({abstractCounts.pending})
          </Button>
          <Button
            variant={abstractFilter === "accepted" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setAbstractFilter("accepted")}
          >
            Accepted ({abstractCounts.accepted})
          </Button>
          <Button
            variant={abstractFilter === "rejected" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setAbstractFilter("rejected")}
          >
            Rejected ({abstractCounts.rejected})
          </Button>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Topic</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbstracts.length > 0 ? (
                filteredAbstracts.map((abstract: any) => (
                  <tr key={abstract._id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3 truncate">{abstract.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {abstract.first_name} {abstract.last_name}
                    </td>
                    <td className="px-4 py-3 truncate">{abstract.sub_theme}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          abstract.status === "accepted"
                            ? "success"
                            : abstract.status === "rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {abstract.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(abstract.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <SubmissionActions submission={abstract} type="abstract" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No abstract submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="papers">
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search papers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={paperFilter === "all" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPaperFilter("all")}
          >
            All ({paperCounts.all})
          </Button>
          <Button
            variant={paperFilter === "pending" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPaperFilter("pending")}
          >
            Pending ({paperCounts.pending})
          </Button>
          <Button
            variant={paperFilter === "accepted" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPaperFilter("accepted")}
          >
            Accepted ({paperCounts.accepted})
          </Button>
          <Button
            variant={paperFilter === "qualified" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPaperFilter("qualified")}
          >
            Qualified ({paperCounts.qualified})
          </Button>
          <Button
            variant={paperFilter === "rejected" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPaperFilter("rejected")}
          >
            Rejected ({paperCounts.rejected})
          </Button>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.length > 0 ? (
                filteredPapers.map((paper: any) => (
                  <tr key={paper._id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3 truncate">{paper.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {paper.first_name} {paper.last_name}
                    </td>
                    <td className="px-4 py-3">
                      {paper.file_path ? (
                        <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                          <a
                            href={getDownloadUrl(paper.file_path)}
                            download
                            onClick={(e) => handleDownload(e, getDownloadUrl(paper.file_path) || "")}
                          >
                            <FileDown className="h-4 w-4 mr-1" />
                            <span className="text-xs">Download</span>
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          paper.status === "qualified"
                            ? "warning"
                            : paper.status === "accepted"
                            ? "success"
                            : paper.status === "rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {paper.status === "qualified" ? "Qualified for Presentation" : paper.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(paper.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <SubmissionActions submission={paper} type="paper" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No paper submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}