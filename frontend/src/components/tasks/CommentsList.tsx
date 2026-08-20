import { useState } from 'react';
import { Comment } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { Paperclip, Send } from 'lucide-react';

interface CommentsListProps {
  comments: Comment[];
  currentUser: any;
  onAddComment: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function CommentsList({ comments, currentUser, onAddComment, isSubmitting }: CommentsListProps) {
  const [commentText, setCommentText] = useState('');

  const handleAdd = async () => {
    if (!commentText.trim()) return;
    await onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-primary">Comments</h3>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar name={comment.author.fullName} size="md" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-primary">{comment.author.fullName}</span>
                <span className="text-xs text-tertiary">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-secondary">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-tertiary">
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-tertiary">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add comment */}
        <div className="flex gap-3 pt-2">
          <Avatar name={currentUser?.fullName || 'Guest'} size="md" />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-primary bg-secondary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-tertiary transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              onClick={handleAdd}
              disabled={isSubmitting || !commentText.trim()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500 disabled:opacity-50 disabled:text-secondary transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
