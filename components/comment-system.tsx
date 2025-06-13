"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, CheckCircle } from "lucide-react"
import { mockUsers, mockComments, currentUser, type Comment, type User } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface CommentSystemProps {
  articleUrl: string
  articleTitle: string
}

export function CommentSystem({ articleUrl, articleTitle }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((comment) => comment.articleUrl === articleUrl),
  )
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getPoliticalColor = (lean: string) => {
    switch (lean) {
      case "left":
        return "bg-blue-100 text-blue-800"
      case "right":
        return "bg-red-100 text-red-800"
      case "center":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCommentChange = (value: string) => {
    setNewComment(value)

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1) {
      const searchTerm = value.slice(lastAtIndex + 1).toLowerCase()
      if (searchTerm.length > 0) {
        const suggestions = mockUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm) || user.displayName.toLowerCase().includes(searchTerm),
        )
        setMentionSuggestions(suggestions)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const insertMention = (user: User) => {
    const lastAtIndex = newComment.lastIndexOf("@")
    const beforeMention = newComment.slice(0, lastAtIndex)
    const afterMention = newComment.slice(lastAtIndex).replace(/@\w*/, `@${user.username} `)
    setNewComment(beforeMention + afterMention)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  const renderCommentContent = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1)
        const user = mockUsers.find((u) => u.username === username)
        return (
          <span key={index} className="text-blue-600 font-medium hover:underline cursor-pointer">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const submitComment = () => {
    if (!newComment.trim()) return

    const mentions = extractMentions(newComment)
    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      articleUrl,
      articleTitle,
      content: newComment,
      mentions,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      edited: false,
    }

    if (replyingTo) {
      setComments((prev) => prev.map((c) => (c.id === replyingTo ? { ...c, replies: [...c.replies, comment] } : c)))
    } else {
      setComments((prev) => [comment, ...prev])
    }

    setNewComment("")
    setReplyingTo(null)
  }

  const likeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply,
              ),
            },
      ),
    )
  }

  const getUserById = (userId: string) => mockUsers.find((u) => u.id === userId)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Discussion ({comments.length})</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment Input */}
          <div className="space-y-2">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentUser.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder={replyingTo ? "Write a reply..." : "Share your thoughts..."}
                  value={newComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                {showSuggestions && mentionSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-40 overflow-y-auto">
                    <CardContent className="p-2">
                      {mentionSuggestions.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => insertMention(user)}
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{user.displayName}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Use @username to mention other users</div>
              <div className="flex gap-2">
                {replyingTo && (
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                )}
                <Button size="sm" onClick={submitComment} disabled={!newComment.trim()}>
                  {replyingTo ? "Reply" : "Comment"}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => {
              const user = getUserById(comment.userId)
              if (!user) return null

              return (
                <div key={comment.id} className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.displayName}</span>
                        <span className="text-sm text-gray-500">@{user.username}</span>
                        {user.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        <Badge variant="outline" className={`text-xs ${getPoliticalColor(user.politicalLean)}`}>
                          {user.politicalLean}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="text-sm">{renderCommentContent(comment.content)}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button
                          className="flex items-center gap-1 hover:text-red-500"
                          onClick={() => likeComment(comment.id)}
                        >
                          <Heart className="w-4 h-4" />
                          {comment.likes}
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-blue-500"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
                      {comment.replies.map((reply) => {
                        const replyUser = getUserById(reply.userId)
                        if (!replyUser) return null

                        return (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={replyUser.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {replyUser.displayName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{replyUser.displayName}</span>
                                <span className="text-xs text-gray-500">@{replyUser.username}</span>
                                {replyUser.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPoliticalColor(replyUser.politicalLean)}`}
                                >
                                  {replyUser.politicalLean}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              <div className="text-sm">{renderCommentContent(reply.content)}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <button
                                  className="flex items-center gap-1 hover:text-red-500"
                                  onClick={() => likeComment(reply.id)}
                                >
                                  <Heart className="w-3 h-3" />
                                  {reply.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
