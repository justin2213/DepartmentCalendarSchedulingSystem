import dotenv from 'dotenv';
dotenv.config();

export const callback = async (req, res) => {
  const code = req.query.code;
  const next = req.query.next ?? process.env.DEFAULT_NEXT_URL; // Use the environment variable

  if (code) {
    const supabase = createServerClient(
      process.env.SUPABASE_URL, // Use the environment variable
      process.env.SUPABASE_SERVICE_ROLE_KEY, // Use the environment variable
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.cookie ?? ''); // Use req directly
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.setHeader('Set-Cookie', serializeCookieHeader(name, value, options)) // Use res directly
            );
          },
        },
      }
    );

    // Exchange the code for a session and set the session cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect back to the frontend, with no slice on the URL
  res.redirect(303, next);
};