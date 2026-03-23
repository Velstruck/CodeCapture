"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useUser } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit, Paperclip, Sparkles, Code, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Snippet = {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  file_url: string | null;
  file_metadata: { filename: string; key: string } | null;
  ai_summary: string | null;
  ai_improve: string | null;
  ai_explain: string | null;
  created_at: string;
};

export default function SnippetDetail() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [aiLoading, setAiLoading] = useState<"summary" | "improve" | "explain" | null>(null);

  useEffect(() => {
    async function fetchSnippet() {
      const { data, error } = await insforge.database.from("snippets").select("*").eq("id", id).single();
      if (!error && data) {
        setSnippet(data);
      }
      setLoading(false);
    }
    fetchSnippet();
  }, [id]);

  const handleDelete = async () => {
    if (!snippet) return;
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    
    setDeleting(true);
    
    if (snippet.file_metadata?.key) {
      await insforge.storage.from("snippet-attachments").remove(snippet.file_metadata.key);
    }
    
    await insforge.database.from("snippets").delete().eq("id", snippet.id);
    router.push("/dashboard");
  };

  const handleAiAction = async (action: "summary" | "improve" | "explain") => {
    if (!snippet) return;
    setAiLoading(action);

    try {
      const res = await fetch(`/api/ai/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: snippet.code })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Save to DB so we don't need to generate again
        const updateField = `ai_${action}`;
        await insforge.database.from("snippets").update({ [updateField]: data.result }).eq("id", snippet.id);
        
        setSnippet(prev => prev ? { ...prev, [updateField]: data.result } : null);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to call AI.");
    } finally {
      setAiLoading(null);
    }
  };

  if (loading) return <div>Loading snippet...</div>;
  if (!snippet) return <div>Snippet not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{snippet.title}</h1>
          <p className="text-muted-foreground">{snippet.description}</p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.tags?.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Edit not implemented in this demo. LMAO!")}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" disabled={deleting} onClick={handleDelete}>
            {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete
          </Button>
        </div>
      </div>

      {snippet.file_url && snippet.file_metadata && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{snippet.file_metadata.filename}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => window.open(snippet.file_url!, "_blank")}>
              Download
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted py-3 border-b">
              <CardTitle className="text-sm font-mono flex items-center justify-between">
                <span>code.{snippet.language}</span>
                <span className="text-muted-foreground text-xs">{snippet.code.split('\n').length} lines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-4 overflow-x-auto text-sm font-mono bg-[#0d1117]">
                <code>{snippet.code}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-80 space-y-4 shrink-0">
          {['summary', 'improve', 'explain'].map((action) => {
             const actionLabels = {
               summary: { icon: FileText, label: "Summarize Code" },
               improve: { icon: Sparkles, label: "Suggest Improvements" },
               explain: { icon: Code, label: "Explain Step-by-Step" }
             };
             const detailKey = `ai_${action}` as keyof Snippet;
             const Icon = actionLabels[action as keyof typeof actionLabels].icon;
             
             return (
               <Card key={action} className="overflow-hidden">
                 <CardHeader className="py-3 bg-muted/30">
                   <CardTitle className="text-sm flex justify-between items-center">
                     <span className="flex items-center gap-2 capitalize">
                       <Icon className="w-4 h-4" /> 
                       {action}
                     </span>
                     {!snippet[detailKey] && (
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 text-xs" 
                         disabled={aiLoading === action}
                         onClick={() => handleAiAction(action as any)}
                       >
                         {aiLoading === action ? <Loader2 className="w-3 h-3 animate-spin"/> : "Generate"}
                       </Button>
                     )}
                   </CardTitle>
                 </CardHeader>
                 {snippet[detailKey] && (
                   <CardContent className="p-4 text-sm prose prose-sm dark:prose-invert">
                     <ReactMarkdown>{snippet[detailKey] as string}</ReactMarkdown>
                   </CardContent>
                 )}
                 {!snippet[detailKey] && aiLoading !== action && (
                    <CardContent className="p-4 text-sm text-muted-foreground italic text-center py-6">
                      Click generate to see AI {action}.
                    </CardContent>
                 )}
                 {aiLoading === action && (
                    <CardContent className="p-4 text-sm text-muted-foreground text-center py-6 flex flex-col items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin text-primary" />
                       Generating...
                    </CardContent>
                 )}
               </Card>
             );
          })}
        </div>
      </div>
    </div>
  );
}
