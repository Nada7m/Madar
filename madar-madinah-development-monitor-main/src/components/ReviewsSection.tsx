import React from "react";
import { Star } from "lucide-react";
import { getReviewsForProject } from "@/data/reviews";

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ projectId }: { projectId: string }) {
  const data = getReviewsForProject(projectId);

  if (!data) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">لا توجد قيَم أو آراء لهذا المكان.</div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start">
              <div className="text-2xl font-extrabold text-foreground">{data.overall.toFixed(1)} / 5</div>
              <div className="mt-1 flex items-center gap-2">
                <Stars value={data.overall} />
                <div className="text-sm text-muted-foreground">{data.count} تقييم</div>
              </div>
            </div>
          </div>

          <div className="ml-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">{b.label}</div>
                <div className="mt-1 flex items-center gap-2">
                  <Stars value={b.value} />
                  <div className="text-sm font-semibold text-foreground">{b.value.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground">آراء الزوار</h3>
          <div className="mt-3 grid gap-3">
            {data.comments.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-background/50 p-4">
                <div className="text-sm text-foreground">{c}</div>
                <div className="mt-2 text-xs text-muted-foreground">— زائر</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
