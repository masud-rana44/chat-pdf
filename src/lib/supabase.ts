import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadToSupabase(file: File) {
  const fileKey = `uploads/${Date.now()}_${file.name.replace(/\s/g, "_")}`;

  const { data, error } = await supabase.storage
    .from("pdfs")
    .upload(fileKey, file);

  if (error) {
    throw new Error(`Upload filled: ${error.message}`);
  }

  return {
    file_key: data.path,
    file_name: file.name,
  };
}

export function getSupabaseUrl(file_key: string) {
  const { data } = supabase.storage.from("pdfs").getPublicUrl(file_key);

  return data.publicUrl;
}
