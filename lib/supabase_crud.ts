import supabase from "./supabase";

const USER_TABLE = "user_details";
const TASK_TABLE = "tasks";

export async function getUser(userId) {
    const { data, error } = await supabase
      .from(USER_TABLE)
      .select('first_name, last_name')
      .eq('UUID', userId)

    if (error) throw new Error("User not found");
    return data;
  }

export async function addTask(created_by: string, title: string, deadline: Date, priority: string) {
  const { data, error } = await supabase
    .from(TASK_TABLE)
    .insert([
      {
        created_by: created_by,
        title: title,
        deadline: deadline.toISOString(),
        priority: priority,
      }
    ])

  if (error) throw error;
}

export async function getTasks(userId) {
  try {
    const { data, error} = await supabase
      .from(TASK_TABLE)
      .select('id, title, deadline, priority')
      .eq('created_by', userId)
      .order('deadline', {ascending: false});

    if (error) throw error;
    return data;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateTask(taskId, taskData) {
  try {    
    if(!taskId) {
      throw new Error("Task ID is missing");
    }
    const { data, error } = await supabase
      .from(TASK_TABLE)
      .update(taskData)
      .eq('id', taskId)
      .select()
      
      if (error) throw error;
      console.log('Updated task:', data);
    } catch (error) {
      console.log('Error updating task:', error);
    }
}