import { supabase } from './supabase';

/**
 * Met à jour ou crée un profil utilisateur sans écraser les champs non fournis.
 */
export async function upsertProfile(
  userId: string,
  username?: string,
  bio?: string,
  avatarUrl?: string
) {
  try {
    // Récupère le profil existant
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Prépare les données à mettre à jour
    const profileData: Record<string, any> = {};
    if (username !== undefined) profileData.username = username;
    if (bio !== undefined) profileData.bio = bio;
    if (avatarUrl !== undefined) profileData.avatar_url = avatarUrl;

    let result;
    if (existingProfile) {
      // Met à jour uniquement les champs fournis
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Crée un nouveau profil
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData }])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return { success: true, profile: result };
  } catch (error) {
    console.error('Error upserting profile:', error);
    return { success: false, error };
  }
}