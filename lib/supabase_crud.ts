import supabase from "./supabase";

const TABLE_NAME = "user_details";

export async function getUser() {
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not found");
    }
  }

export async function addTask(created_by: string, title: string, date_due: string, priority: string) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        created_by: created_by,
        title: title,
        date_due: date_due,
        priority: priority,
      }
    ])
}