import { supabase } from "../supabase/client";

export async function saveSiteSettings(settings) {
  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert(settings);

    if (error) throw error;

  } catch (err) {
    console.error("❌ Settings save error:", err.message);
  }
}