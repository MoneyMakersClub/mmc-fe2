import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FriendListComponent from "../../components/common/FriendListComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "../../api/example";

const SearchUserComponent = ({ search }) => {
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  const DATA_LIMIT = 10;

  // API 호출 함수
  const getUsers = async ({ pageParam = 0 }) => {
    const response = await get(
      `/users/search?keyword=${search}&page=${pageParam}&size=${DATA_LIMIT}`
    );
    console.log("API Response:", response, "페이지", pageParam); // API 응답 전체 확인
    const data = response.pageContent.map((user) => ({
      userId: user.userId,
      nickname: user.nickname,
      isFriend: user.isFriend,
      isOfficial: user.isOfficial,
    }));
    console.log("Processed Data:", data); // `pageContent` 처리 결과 확인
    return {
      users: data,
      nextPage: response.currentPage + 1,
      totalPages: response.totalPages,
    };
  };

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["users", search],
      queryFn: getUsers,
      getNextPageParam: (lastPage) =>
        lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
      initialPageParam: 0,
    });

  console.log("Rendered data:", data);

  useEffect(() => {
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  const users = data?.pages.flatMap((page) => page.users);
  return (
    <div className="px-4">
      {users && users.length > 0 ? (
        users.map((user) => (
          <FriendListComponent
            key={user.userId}
            userId={user.userId}
            isOfficial={user.isOfficial}
            userName={user.nickname}
            text={user.isFriend ? "친구" : "none"}
            handleClick={() => navigate(`/user/${user.userId}`)}
          />
        ))
      ) : (
        <div className="flex flex-col items-center mt-[8.06rem]">
          <span className="text-st text-gray-800 font-semibold">
            '{search}'
          </span>
          <span className="text-b1 text-gray-800">
            일치하는 검색 결과가 없어요.
          </span>
        </div>
      )}
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};

export default SearchUserComponent;
