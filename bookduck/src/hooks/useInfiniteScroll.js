import { useEffect, useRef } from "react";

// 무한 스크롤 훅
export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage = false,
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { loaderRef };
};
