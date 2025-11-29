"use client";

import { useState } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useReviews from "@/hooks/use-reviews";
import useCreateReview from "@/hooks/use-create-review";
import useUpdateReview from "@/hooks/use-update-review";
import useDeleteReview from "@/hooks/use-delete-review";
import useUser from "@/hooks/use-user";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

type ReviewsSectionProps = {
  carId: string;
};

const ReviewsSection = ({ carId }: ReviewsSectionProps) => {
  const { reviews, isLoading } = useReviews(carId);
  const { user } = useUser();
  const userId = user?.data?.id;
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const userReview = reviews?.find((r) => r.userId === userId);

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleCreateReview = async () => {
    if (!carId) return;
    await createReview.mutateAsync({
      carId: Number(carId),
      rating,
      comment: comment || null,
    });
    setIsCreateOpen(false);
    setComment("");
    setRating(5);
  };

  const handleUpdateReview = async (reviewId: number) => {
    const review = reviews?.find((r) => r.id === reviewId);
    if (!review) return;
    await updateReview.mutateAsync({
      id: reviewId,
      rating,
      comment: comment || null,
      carId: review.carId,
    });
    setEditingReview(null);
    setComment("");
    setRating(5);
  };

  const handleDeleteReview = async (reviewId: number, reviewCarId: number) => {
    if (!confirm(i18n.reviews.deleteConfirm)) return;
    await deleteReview.mutateAsync({ id: reviewId, carId: reviewCarId });
  };

  const openEditDialog = (review: { id: number; rating: number; comment: string | null; carId: number }) => {
    setEditingReview(review.id);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  if (isLoading) {
    return <div className="text-muted-foreground">{i18n.reviews.loading}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{i18n.reviews.title}</CardTitle>
            <CardDescription>
              {reviews && reviews.length > 0 ? (
                <>
                  {averageRating.toFixed(1)} / 5.0 ({reviews.length} {reviews.length !== 1 ? i18n.reviews.reviews : i18n.reviews.review})
                </>
              ) : (
                i18n.reviews.noReviews
              )}
            </CardDescription>
          </div>
          {userId && !userReview && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>{i18n.reviews.addReview}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{i18n.reviews.addReviewTitle}</DialogTitle>
                  <DialogDescription>{i18n.reviews.addReviewDescription}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1">{i18n.reviews.rating}</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment" className="mb-1">{i18n.reviews.comment}</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={i18n.reviews.commentPlaceholder}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleCreateReview}
                    disabled={createReview.isPending}
                    className="w-full"
                  >
                    {i18n.reviews.submitReview}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.userEmail}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {userId === review.userId && (
                  <div className="flex gap-2">
                    <Dialog
                      open={editingReview === review.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingReview(null);
                          setComment("");
                          setRating(5);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(review)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{i18n.reviews.editReview}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-1">{i18n.reviews.rating}</Label>
                            <div className="flex gap-2 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      star <= rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-comment" className="mb-1">{i18n.reviews.comment.replace(" (optional)", "")}</Label>
                            <Textarea
                              id="edit-comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button
                            onClick={() => handleUpdateReview(review.id)}
                            disabled={updateReview.isPending}
                            className="w-full"
                          >
                            {i18n.reviews.updateReview}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id, review.carId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">
            {i18n.reviews.noReviewsMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;

