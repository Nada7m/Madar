import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useHistoryBack(fallbackRoute: string = "/") {
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's browser history available
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = () => {
    if (canGoBack && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: fallbackRoute });
    }
  };

  return { goBack, canGoBack };
}
