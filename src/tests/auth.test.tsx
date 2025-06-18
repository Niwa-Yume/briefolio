import { login, loginWithProvider, register } from '../contexts/authUtils';

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() => Promise.resolve({ error: null })),
      signInWithOAuth: jest.fn(() => Promise.resolve({ error: null })),
      signUp: jest.fn(() => Promise.resolve({ error: null })),
    }
  }
}));

describe('login', () => {
  it('appelle supabase.auth.signInWithPassword avec email et mot de passe', async () => {
    const { supabase } = require('../lib/supabase');
    await expect(login('test@email.com', 'password123')).resolves.toBeUndefined();
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@email.com', password: 'password123' });
  });
});

describe('loginWithProvider', () => {
  it('appelle supabase.auth.signInWithOAuth avec provider github', async () => {
    const { supabase } = require('../lib/supabase');
    await expect(loginWithProvider('github')).resolves.toBeUndefined();
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  });

  it('appelle supabase.auth.signInWithOAuth avec provider google', async () => {
    const { supabase } = require('../lib/supabase');
    await expect(loginWithProvider('google')).resolves.toBeUndefined();
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  });
});

describe('register', () => {
  it('appelle supabase.auth.signUp avec email et mot de passe', async () => {
    const { supabase } = require('../lib/supabase');
    await expect(register('test@email.com', 'password123')).resolves.toBeUndefined();
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: 'password123',
      options: { data: { needs_profile_completion: true } },
    });
  });
});
