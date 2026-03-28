import { supabase } from "../supabase/client";

export async function saveSection(section) {
  try {
    const { error } = await supabase
      .from("sections")
      .update({
        content: section.content,
      })
      .eq("id", section.id);

    if (error) throw error;

  } catch (err) {
    console.error("❌ Supabase save error:", err.message);
  }
}