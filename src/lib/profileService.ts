import { supabase } from './supabase';

/**
 * Creates or updates a user profile in the profiles table
 * @param userId - The user's UUID from auth.user
 * @param username - Optional username for the profile
 * @param bio - Optional bio for the profile
 * @param avatarUrl - Optional avatar URL for the profile
 * @returns Promise with the result of the operation
 */
export async function upsertProfile(
  userId: string,
  username?: string,
  bio?: string,
  avatarUrl?: string
) {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Prepare profile data
    const profileData: Record<string, any> = {
      id: userId,
    };

    // Only add defined fields to avoid overwriting with null/undefined
    if (username) profileData.username = username;
    if (bio) profileData.bio = bio;
    if (avatarUrl) profileData.avatar_url = avatarUrl;

    // If profile exists, update it, otherwise insert new profile
    if (existingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) throw error;
      return { success: true, message: 'Profile updated successfully' };
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) throw error;
      return { success: true, message: 'Profile created successfully' };
    }
  } catch (error) {
    console.error('Error upserting profile:', error);
    return { success: false, error };
  }
}

/**
 * Creates a default profile for a new user
 * @param userId - The user's UUID from auth.user
 * @returns Promise with the result of the operation
 */
export async function createDefaultProfile(userId: string) {
  try {
    // Check if profile already exists first
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return { success: true, message: 'Profile already exists' };
    }

    // Generate a random username based on the user ID
    const randomUsername = `user_${userId.substring(0, 8)}`;

    return upsertProfile(
      userId,
      randomUsername,
      'Tell us about yourself...',
      null
    );
  } catch (error) {
    console.error('Error creating default profile:', error);
    return { success: false, error };
  }
}