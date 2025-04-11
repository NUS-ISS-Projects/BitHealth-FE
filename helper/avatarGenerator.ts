export const getAvatarSource = (user: { id?: number; image?: any }) => {
  if (user.image) {
    return user.image;
  }
  // Use name as seed if no ID is available
  const seed = user.id;
  return { uri: `https://i.pravatar.cc/50?img=${seed}` };
};
