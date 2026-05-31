"use client";

import { useEffect, useMemo, useState } from "react";
import type { VoteBreakdown } from "@/lib/types";
import { StarIcon } from "@/components/ui-icons";

type Rating = 1 | 2 | 3;

type SenseVoteControlProps = {
  entrySlug: string;
  senseId: string;
  initialVotes: VoteBreakdown;
  compact?: boolean;
  onVotesChange?: (votes: VoteBreakdown) => void;
};

const USER_VOTES_KEY = "kalem-sozluk-user-votes";

function readUserVotes() {
  try {
    return JSON.parse(localStorage.getItem(USER_VOTES_KEY) ?? "{}") as Record<string, Rating>;
  } catch {
    return {};
  }
}

function writeUserVote(key: string, rating: Rating | null) {
  const votes = readUserVotes();

  if (rating) {
    votes[key] = rating;
  } else {
    delete votes[key];
  }

  localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
}

export function SenseVoteControl({ entrySlug, senseId, initialVotes, compact = false, onVotesChange }: SenseVoteControlProps) {
  const voteKey = `${entrySlug}:${senseId}`;
  const [votes, setVotes] = useState(initialVotes);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isPending, setIsPending] = useState(false);
  const totalStars = useMemo(() => votes.one + votes.two * 2 + votes.three * 3, [votes]);

  useEffect(() => {
    setSelectedRating(readUserVotes()[voteKey] ?? null);
  }, [voteKey]);

  async function castVote(rating: Rating) {
    if (isPending) {
      return;
    }

    const nextRating = selectedRating === rating ? null : rating;
    setIsPending(true);

    try {
      const response = await fetch(`/api/entries/${entrySlug}/senses/${senseId}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rating: nextRating,
          previousRating: selectedRating
        })
      });

      const payload = (await response.json()) as { votes?: VoteBreakdown; message?: string };

      if (!response.ok || !payload.votes) {
        throw new Error(payload.message ?? "Oy kaydedilemedi.");
      }

      writeUserVote(voteKey, nextRating);
      setSelectedRating(nextRating);
      setVotes(payload.votes);
      onVotesChange?.(payload.votes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={compact ? "vote-panel vote-panel-compact" : "vote-panel"} aria-label="Bu bilgiye yıldız ver">
      <div className="star-score" aria-label={`${totalStars} toplam yıldız`}>
        <strong>{totalStars}</strong>
        <StarIcon />
      </div>
      <div className="vote-inline">
        {[1, 2, 3].map((rating) => (
          <button
            key={rating}
            type="button"
            className={selectedRating === rating ? "is-selected" : ""}
            onClick={() => castVote(rating as Rating)}
            disabled={isPending}
            aria-label={selectedRating === rating ? `${rating} yıldız oyunu kaldır` : `${rating} yıldız ver`}
            title={selectedRating === rating ? "Oyunu kaldır" : `${rating} yıldız ver`}
          >
            {Array.from({ length: rating }).map((_, index) => (
              <StarIcon key={index} />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}
