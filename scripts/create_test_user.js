
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiprahxzuyktyiezkdan.supabase.co';
const supabaseAnonKey = 'sb_publishable_DWvkg0Id7eptV-FZ8SZ_-Q_dUXMInJD';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
    const email = 'testsprite_user@creator.os';
    const password = 'TestPassword123!';

    console.log(`Attempting to sign up user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        // If user already exists, Supabase typically returns the user object but obfuscated or just success if confirmation is needed.
        // If "User already registered", it might return an empty user depending on config.
        console.log('User created/retrieved successfully');
        if (data.user) console.log('User ID:', data.user.id);
    }
}

createTestUser();
