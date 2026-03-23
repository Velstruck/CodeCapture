"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useUser } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewSnippet() {
  const { user } = useUser();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    // Handle File Upload
    let file_url = null;
    let file_metadata = null;

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setLoading(false);
        return;
      }
      
      const { data: uploadData, error: uploadError } = await insforge.storage
        .from('snippet-attachments')
        .uploadAuto(file);
        
      if (uploadError || !uploadData) {
        setError("Failed to upload file: " + (uploadError?.message || 'Unknown error'));
        setLoading(false);
        return;
      }
      
      file_url = uploadData.url;
      file_metadata = { filename: file.name, key: uploadData.key };
    }

    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);

    const { error: insertError } = await insforge.database.from("snippets").insert([{
      user_id: user.id,
      title,
      description,
      code,
      language,
      tags,
      file_url,
      file_metadata
    }]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>New Snippet</CardTitle>
          <CardDescription>Save a reusable piece of code to your library.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JWT Auth Middleware" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of what the code does" />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={(val) => setLanguage(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Code</span>
              </label>
              <Textarea required className="font-mono h-64" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="react, hooks, util" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachment (Max 5MB)</label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Snippet
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
