import React, { useState, useEffect } from "react";
import { get, patch } from "../../api/example";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import BottomSheetModal from "../common/BottomSheetModal";
import Divider2 from "../common/Divider2";
import goEdit from "../../assets/mainPage/go-edit.svg";
import goRight from "../../assets/mainPage/go-right.svg";
import cancel from "../../assets/mainPage/cancel.svg";
import menu from "../../assets/mainPage/menu-vertical.svg";
import editIcon from "../../assets/bookinfoPage/edit.svg";
import deleteIcon from "../../assets/bookinfoPage/trash.svg";
import plusIcon from "../../assets/mainPage/plus.svg";
import helpCircle from "../../assets/mainPage/help-circle.svg";
import DraggableList from "./DraggableList";
import { getUserId } from "../../api/oauth";
import ReadingSpaceDuck from "../../assets/otherUserPage/readingspace-duck.svg";

const ReadingSpaceComponent = ({
  setColor,
  setIsNavBar,
  visible,
  setVisible,
  bottomSheetShow,
  setBottomSheetShow,
  setShowDeleteModal = () => {},
  setShowOutModal = () => {},
  setShowFullModal = () => {},
  setIsFloatingVisible,
  isEditMode,
  setIsEditMode,
  isAllDelete = false,
  setIsAllDelete,
  isMine = true,
  otherUserId,
}) => {
  const navigate = useNavigate();
  //상태관리
  const [isHelp, setIsHelp] = useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState(null);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [initialHeight, setInitialHeight] = useState(screenHeight - 350);
  const [expandedHeight, setExpandedHeight] = useState(screenHeight * 0.95);

  useEffect(() => {
    // console.log(screenHeight);
    setInitialHeight(screenHeight - 350);
    setExpandedHeight(screenHeight * 0.95);
  }, [screenHeight]);

  // useEffect(() => {
  //   console.log("이니샬", initialHeight);
  // }, [initialHeight]);

  // useEffect(() => {
  //   console.log("확장", expandedHeight);
  // }, [expandedHeight]);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // API - 리딩스페이스 조회
  const getCards = async () => {
    try {
      const id = isMine ? await getUserId() : otherUserId;
      setUserId(id);
      const response = await get(`/users/${id}/readingspace`);
      // console.log(response);
      {
        isMine
          ? setCards(response.cardList)
          : setCards(
              response.cardList.filter((card) => card.visibility === "PUBLIC")
            );
      }
    } catch (error) {
      console.error("리딩스페이스 조회 오류", error);
    }
  };

  //API- 편집 저장
  const patchCards = async (updatedCards) => {
    try {
      const updatedCardList = { updatedCardList: updatedCards };
      const response = await patch(`/readingspace`, updatedCardList);
      setIsEditMode(false);
      console.log(response);
      console.log("편집 완료");
    } catch (error) {
      console.error("편집 저장 오류", error);
    }
  };

  const handleSave = () => {
    const updatedCardList = cards.map((card, index) => ({
      cardId: card.cardId,
      cardIndex: index + 1,
    }));
    patchCards(updatedCardList);
  };

  //useEffect 훅
  useEffect(() => {
    if (isMine) {
      if (isEditMode) {
        setColor("bg-gray-5");
      } else {
        setColor("bg-gray-50");
      }
    }
  }, [isEditMode]);

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    if (isAllDelete) {
      patchCards([]).then(() => {
        setCards([]); // API 응답 후 상태 업데이트
        console.log("전체 삭제 완료 및 UI 업데이트");
      });
      setIsAllDelete(false);
    }
  }, [isAllDelete]);

  const handleHelpClick = () => {
    setIsHelp(!isHelp);
  };
  const handleMenuClick = () => {
    if (height.get() < expandedHeight) {
      api.start({ height: expandedHeight });
      setBottomSheetShow(true);
    } else {
      setBottomSheetShow(true);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setBottomSheetShow(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 200);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleBackdropClick = () => {
    if (!isEditMode) {
      setVisible(false); // 닫는 애니메이션 시작
      setTimeout(() => {
        setBottomSheetShow(false); // 애니메이션이 끝난 후 모달 완전히 닫기
      }, 300);
    }
  };

  const handleAddCard = () => {
    if (cards.length === 7) {
      setShowFullModal(true);
    } else {
      navigate("/selectcard");
    }
  };

  const handleGoEdit = () => {
    setIsHelp((h) => !h);
    setIsEditMode(true);
  };

  //드래그 관련
  const [{ height }, api] = useSpring(
    () => ({
      height: initialHeight,
      onChange: () => {
        setIsFloatingVisible(height.get() < initialHeight + 50);
        setHelpVisible(height.get() > initialHeight + 50);
        if (isMine) {
          setIsNavBar(height.get() < initialHeight + 50);
        }
      },
    }),
    [initialHeight]
  );

  const bind = useDrag(
    ({ movement: [, my], memo = height.get(), last, event }) => {
      event.preventDefault();
      if (isEditMode) return memo;
      if (last) {
        api.start({
          height: my < -100 ? expandedHeight : initialHeight,
        });
      } else {
        const newHeight = Math.max(
          initialHeight,
          Math.min(expandedHeight, memo - my)
        );
        api.start({ height: newHeight });
      }
      return memo;
    },
    { axis: "y", pointer: { touch: true } }
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCards = Array.from(cards);
    const [movedCard] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, movedCard);

    setCards(reorderedCards);
  };

  return (
    <div
      style={{
        maxWidth: "64rem",
      }}
    >
      <div className="relative z-0">
        <DragDropContext onDragEnd={handleDragEnd} className="z-[-3] bg-white ">
          <animated.div
            style={{
              maxWidth: "64rem",
              height,
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.10)",
              overflowY: "auto",
              touchAction: "none",
            }}
            className={` ${
              isEditMode ? "bg-[#DDD]" : "bg-white"
            } fixed z-40  bottom-0 left-0 right-0 mx-auto rounded-t-[1.875rem] shadow-lg cursor-pointer overflow-hidden`}
          >
            <div className="relative mb-10">
              <div
                className={`sticky top-0 z-50  h-[4rem] ${
                  isEditMode ? "bg-[#DDD]" : "bg-white"
                }`}
              >
                <div className="flex h-8 w-full py-4" {...bind()}>
                  <div className="h-1 w-12 bg-gray-300 rounded-full mx-auto" />
                </div>

                <div className="flex flex-row items-center justify-between px-5  mb-18">
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-btn3 text-gray-800 pt-1 font-semibold">
                      리딩 스페이스
                    </p>
                    {isMine && !isEditMode && isHelpVisible && (
                      <img src={helpCircle} onClick={handleHelpClick} />
                    )}
                    {isEditMode && (
                      <div className="py-2 px-4 text-btn4 ml-2 bg-[#E8E4D5] rounded-[6.25rem]">
                        카드를 드래그하여 이동해보세요
                      </div>
                    )}

                    {isHelp && (
                      <div className="absolute top-[1rem] left-[7.5rem] w-[12.625rem] h-[3rem]">
                        <img
                          src={goEdit}
                          className="absolute top-2 left-0 w-full h-full object-cover"
                        />
                        <img
                          src={cancel}
                          className="absolute top-4 right-[0.6rem]"
                          onClick={() => setIsHelp((h) => !h)}
                        />
                        <span className="absolute top-[1rem] left-[1.2rem] text-c1 text-gray-800">
                          위젯을 드래그하여 이동해보세요
                        </span>
                        <button
                          className="absolute left-[1.2rem] top-[2rem] text-black "
                          onClick={handleGoEdit}
                        >
                          <div className="flex ">
                            <span className="text-c1 underline underline-offset-2 decoration-grau-600 text-gray-600 mr-2">
                              편집하러 가기
                            </span>
                            <img src={goRight} />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2 flex-nowrap">
                    {isMine && (
                      <div
                        className="w-[2rem] flex justify-end"
                        onClick={handleMenuClick}
                      >
                        <img src={menu} alt="menu" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Droppable
                  droppableId="droppableList"
                  isDropDisabled={!isEditMode}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-1 "
                    >
                      {cards.length === 0 ? (
                        isMine ? (
                          // 카드가 없을 때 렌더링
                          <div className="m-auto mt-[5rem] flex flex-col items-center w-[13.6875rem]">
                            <div className=" text-gray-500 text-c1 mb-[0.38rem]">
                              리딩 스페이스가 텅 비어있네요!
                            </div>
                            <div className="text-b1 text-gray-500 font-semibold mb-4">
                              나만의 리딩 스페이스를 꾸며보세요
                            </div>
                            <button
                              className="text-white text-btn2 bg-orange-300 px-4 py-2 rounded-[0.5rem]"
                              onClick={() => navigate("/selectcard")}
                            >
                              추가하기
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center m-[4rem]">
                            <p className=" text-gray-500 text-c1 mb-[2rem]">
                              리딩스페이스가 텅 비어있어요.
                            </p>
                            <img src={ReadingSpaceDuck} />
                          </div>
                        )
                      ) : (
                        <DraggableList
                          cards={cards}
                          setCards={setCards}
                          isEditMode={isEditMode}
                        />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              {isEditMode && height.get() === expandedHeight && (
                <div className="fixed  gap-4 w-full bottom-0 flex-row  h-[4rem] bg-[#DDD] p-4 flex justify-between items-center z-50 ">
                  <button
                    className="w-full h-[3rem] flex items-center justify-center text-white bg-gray-400 rounded-lg"
                    onClick={() => setShowOutModal(true)}
                  >
                    나가기
                  </button>
                  <button
                    className="w-full h-[3rem] flex items-center justify-center text-white bg-gray-700 rounded-lg"
                    onClick={handleSave}
                  >
                    저장하기
                  </button>
                </div>
              )}
            </div>
          </animated.div>
        </DragDropContext>
      </div>
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
        style={{ zIndex: 100, position: "absolute" }}
      >
        <div className="w-full rounded-t-xl pb-[3.125rem] pt-4 px-5 bg-gray-10 ">
          <div className="flex flex-col bg-white rounded-lg">
            <div
              className="flex items-center p-4 gap-3 text-btn2 cursor-pointer"
              onClick={handleAddCard}
            >
              <img className="w-6 h-6" src={plusIcon} />
              추가하기
            </div>
            <Divider2 />
            <div
              className="flex items-center p-4 gap-3 text-btn2 cursor-pointer"
              onClick={handleEditClick}
            >
              <img className="w-6 h-6" src={editIcon} />
              편집하기
            </div>
            <Divider2 />
            <div
              className="flex items-center p-4 gap-3 text-btn2 cursor-pointer"
              onClick={handleDelete}
            >
              <img src={deleteIcon} />
              전체 삭제하기
            </div>
          </div>
          <div
            className="flex justify-center items-center mt-[2.5625rem] p-4 bg-white rounded-lg cursor-pointer"
            onClick={handleBackdropClick}
          >
            취소
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
};

export default ReadingSpaceComponent;
