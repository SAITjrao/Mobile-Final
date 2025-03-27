import supabase from "./supabase";

const TABLE_NAME = "user_details";

export async function getUser() {
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not found");
    }
  }