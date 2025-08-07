interface MessageStatusProps {
  isDelivered: boolean;
  isRead: boolean;
  isSentByMe: boolean;
}

export default function MessageStatus({ isDelivered, isRead, isSentByMe }: MessageStatusProps) {
  if (!isSentByMe) return null;

  return (
    <div className="flex items-center ml-1">
      {isRead ? (
        // Double blue ticks for read
        <div className="flex">
          <svg width="12" height="8" viewBox="0 0 12 8" className="text-blue-500">
            <path
              d="M1 4l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="12" height="8" viewBox="0 0 12 8" className="text-blue-500 -ml-1">
            <path
              d="M1 4l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : isDelivered ? (
        // Double gray ticks for delivered but not read
        <div className="flex">
          <svg width="12" height="8" viewBox="0 0 12 8" className="text-gray-400">
            <path
              d="M1 4l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg width="12" height="8" viewBox="0 0 12 8" className="text-gray-400 -ml-1">
            <path
              d="M1 4l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        // Single gray tick for sent but not delivered
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-gray-400">
          <path
            d="M1 4l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}