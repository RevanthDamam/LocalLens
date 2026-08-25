export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      display_name: user.display_name || undefined,
      avatar_url: user.avatar_url || undefined,
    },
  };
}
