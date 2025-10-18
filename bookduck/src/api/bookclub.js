import { get, post, patch, del } from "./example";

// 북클럽 생성
export const createClub = async (clubData) => {
  return await post("/clubs", clubData);
};

// 북클럽 멤버 목록 조회
export const getClubMembers = async (clubId) => {
  return await get(`/clubs/${clubId}/members`);
};

// 북클럽 가입
export const joinClub = async (clubId) => {
  return await post(`/clubs/${clubId}/members`);
};

// 북클럽 상세 조회
export const getClubDetail = async (clubId) => {
  return await get(`/clubs/${clubId}`);
};

// 북클럽 삭제
export const deleteClub = async (clubId) => {
  return await del(`/clubs/${clubId}`);
};

// 북클럽 정보 수정
export const updateClub = async (clubId, clubData) => {
  return await patch(`/clubs/${clubId}`, clubData);
};

// 북클럽 내 게시글 목록 조회
export const getClubArchives = async (clubId, memberId = null, page = 0, size = 20) => {
  const params = new URLSearchParams();
  
  if (memberId) {
    params.append('memberId', memberId);
  }
  
  const pageable = {
    page: page,
    size: size,
    sort: []
  };
  params.append('pageable', JSON.stringify(pageable));
  
  return await get(`/clubs/${clubId}/archives?${params.toString()}`);
};

// 북클럽 검색
export const searchClubs = async ({ keyword, clubStatus, page = 0, size = 20 }) => {
  const params = new URLSearchParams();
  params.append('keyword', keyword);
  if (clubStatus !== null && clubStatus !== undefined) {
    params.append('clubStatus', clubStatus);
  }
  params.append('pageable', JSON.stringify({ page, size, sort: [] }));
  return await get(`/clubs/search?${params.toString()}`);
};

// 내가 가입된 북클럽 목록 조회
export const getJoinedClubs = async (sort = "latest") => {
  return await get(`/clubs/joined?sort=${sort}`);
};

// 북클럽 멤버 강퇴
export const kickClubMember = async (clubId, memberId) => {
  return await del(`/clubs/${clubId}/members/${memberId}`);
};

// 북클럽 멤버 탈퇴
export const leaveClub = async (clubId) => {
  return await del(`/clubs/${clubId}/members/me`);
};

// 북클럽 정렬 조회
export const getSortedClubs = async (clubStatus = null, sort = "latest") => {
  const params = new URLSearchParams({ sort });
  if (clubStatus !== null) {
    params.append("clubStatus", clubStatus);
  }
  return await get(`/clubs/joined?${params.toString()}`);
};

// 최신 북클럽 목록 조회 (둘러보기용)
export const getNewClubs = async (page = 0, size = 20, orderBy = "latest") => {
  const params = new URLSearchParams();
  if (orderBy) {
    params.append('orderBy', orderBy);
  }
  const pageable = {
    page: page,
    size: size,
    sort: []
  };
  params.append('pageable', JSON.stringify(pageable));
  return await get(`/clubs/new?${params.toString()}`);
};
