"use client";

import { useEffect, useState, useMemo } from "react";
import { insforge } from "@/lib/insforge";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type Snippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  created_at: string;
};

export default function Dashboard() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSnippets() {
      const { data, error } = await insforge.database
        .from('snippets')
        .select(`id, title, description, language, tags, created_at`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSnippets(data);
      }
      setLoading(false);
    }
    fetchSnippets();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    snippets.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => {
      let matchesSearch = true;
      if (searchQuery) {
        try {
          const regex = new RegExp(searchQuery, "i");
          matchesSearch = regex.test(s.title) || regex.test(s.description || "");
        } catch {
          matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        }
      }
      const matchesTag = selectedTag ? s.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [snippets, searchQuery, selectedTag]);

  if (loading) return <div>Loading snippets...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Snippets</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by regex (e.g. ^auth.*) or text..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-card"
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedTag === null ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Badge>
          {allTags.map(tag => (
             <Badge 
               key={tag}
               variant={selectedTag === tag ? "default" : "outline"}
               className="cursor-pointer"
               onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
             >
               {tag}
             </Badge>
          ))}
        </div>
      )}

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-card text-lg">
          No snippets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map(snippet => (
            <Card 
              key={snippet.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors group flex flex-col h-full"
              onClick={() => router.push(`/snippet/${snippet.id}`)}
            >
              <CardHeader>
                <CardTitle className="truncate group-hover:text-primary transition-colors">
                  {snippet.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {snippet.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex justify-between items-center">
                   <Badge variant="secondary">{snippet.language}</Badge>
                   <span className="text-xs text-muted-foreground">
                     {new Date(snippet.created_at).toLocaleDateString()}
                   </span>
                </div>
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-sm truncate max-w-[80px]">#{tag}</span>
                    ))}
                    {snippet.tags.length > 3 && <span className="text-xs text-muted-foreground">+{snippet.tags.length - 3}</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
