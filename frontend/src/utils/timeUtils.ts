export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  
  // Convert to Nairobi timezone
  const nairobiNow = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Nairobi"}));
  const nairobiPostDate = new Date(postDate.toLocaleString("en-US", {timeZone: "Africa/Nairobi"}));
  
  const diffInMs = nairobiNow.getTime() - nairobiPostDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInSeconds < 60) {
    return 'now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}hrs ago`;
  } else if (diffInDays <= 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return nairobiPostDate.toLocaleDateString('en-KE') + ' ' + nairobiPostDate.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    });
  }
};