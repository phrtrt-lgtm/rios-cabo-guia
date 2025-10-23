import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

interface ReviewsData {
  reviews: Review[];
  rating: number | null;
  totalReviews: number;
}

interface ReviewsSectionProps {
  placeName: string;
  address: string;
}

export const ReviewsSection = ({ placeName, address }: ReviewsSectionProps) => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchReviews = async () => {
    if (reviewsData) return; // Already fetched
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-place-reviews', {
        body: { placeName, address }
      });

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviewsData({ reviews: [], rating: null, totalReviews: 0 });
      } else {
        setReviewsData(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setReviewsData({ reviews: [], rating: null, totalReviews: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded && !reviewsData) {
      fetchReviews();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="w-full justify-between hover:bg-accent/10"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="w-4 h-4" />
          Ver Avaliações do Google
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isExpanded && (
        <>
          {loading ? (
            <div className="space-y-3 mt-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : reviewsData && reviewsData.reviews.length > 0 ? (
            <div className="mt-4">
              {/* Rating Summary */}
              {reviewsData.rating && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-foreground">{reviewsData.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {reviewsData.totalReviews} avaliações
                  </span>
                </div>
              )}

              {/* Reviews */}
              <div className="space-y-3">
                {reviewsData.reviews.map((review, index) => (
                  <div key={index} className="bg-accent/5 p-3 rounded-lg border border-accent/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm text-foreground">{review.author_name}</p>
                        <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-4">Nenhuma avaliação disponível.</p>
          )}
        </>
      )}
    </div>
  );
};
