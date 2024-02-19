// Function to handle user signup/login
const handleUserAuthentication = async (event:any) => {
    const { user } = event;
  
    // Check if the event is a signup event
    if (user.event_type === 'SIGNUP') {
      // Add the user to the database after signup
      const { email, id, user_metadata } = user.user;
      const { name } = user_metadata;
  
      const { data, error } = await supabase
        .from('users')
        .insert([{ id, email, name }]);
  
      if (error) {
        console.error('Error adding user to database:', error.message);
        return error;
      } else {
        console.log('User added to database successfully:', data);
        return data;
      }
    }
  };
  
  module.exports = handleUserAuthentication;
  