export function serializeUser(user) {
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      display_name: user.display_name || metadata.display_name || undefined,
      avatar_url: user.avatar_url || metadata.avatar_url || undefined,
    },
  };
}
