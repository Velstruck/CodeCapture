CREATE TABLE snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  ai_improvements TEXT,
  ai_explanation TEXT,
  file_url TEXT,
  file_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own snippets"
  ON snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own snippets"
  ON snippets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
  ON snippets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
  ON snippets FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX snippets_user_id_idx ON snippets (user_id);
CREATE INDEX snippets_created_at_idx ON snippets (created_at DESC);
CREATE INDEX snippets_tags_idx ON snippets USING GIN (tags);
