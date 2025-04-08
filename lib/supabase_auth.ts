import supabase from "./supabase";

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const { data, error} = await supabase.auth.signUp({
      email,
      password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    //add user to user_details table
    const { user } = await supabase
    .from('user_details')
    .insert([
        {
            UUID: data.user.id,
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName
        }
    ])
    console.log("User signed up:", data.user);
  }

  return data.user;
}

export async function signIn(email: string, password: string) {
  const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (error) {
      alert(error.message);
  } else {
      console.log("User signed in", data.user);
  }

  return data.user;
}

export async function signOut() {
  const {error} = await supabase.auth.signOut();

  if (error) {
      console.error("Error signing out:", error.message);
  } else {
      console.log("User signed out");
  }
}
