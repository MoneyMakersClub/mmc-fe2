import { useState, useEffect } from "react";
import UserDuck from "../../components/CharacterPage/UserDuck";
import TabBarComponent from "../../components/common/TabBarComponent";
import Skin from "../../components/CharacterPage/Skin";
import ButtonComponent from "../../components/common/ButtonComponent";
import NavigationHeader from "../../components/common/NavigationHeader";
import { getUserId } from "../../api/oauth";
import { getItemLists, patchUserItem } from "../../api/character";
const CharacterCustomPage = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [itemLists, setItemLists] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedItemIds, setSelectedItemIds] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [initialEquippedItems, setInitialEquippedItems] = useState({});
  const [itemDetails, setItemDetails] = useState({});

  const tabToItemType = {
    전체: "ALL",
    소품: "PROP",
    모자: "HAT",
    얼굴: "FACE",
    옷: "CLOTHES",
    가방: "BAG",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItemLists();
        console.log("조회성공: ", res);
        setItemLists(res?.itemList || []);

        // isEquipped가 true인 아이템들을 초기 선택 상태로 설정
        const equippedItems = {};
        const equippedItemIds = {};
        const details = {};

        res?.itemList.forEach((item) => {
          details[item.itemId] = {
            userItemId: item.userItemId,
            itemType: item.itemType,
          };

          if (item.isEquipped) {
            equippedItems[item.itemType] = item.itemName;
            equippedItemIds[item.itemType] = item.itemId;
          }
        });

        setItemDetails(details);
        setSelectedItems(equippedItems);
        setSelectedItemIds(equippedItemIds);
        setInitialEquippedItems(equippedItemIds);
        setIsChanged(false);
      } catch (err) {
        console.error("오류 발생: ", err);
      }
    };
    fetchData();
  }, []);

  const handleItemSelect = (item) => {
    let newSelectedItemIds;

    if (activeTab !== "전체") {
      const itemType = tabToItemType[activeTab];

      if (selectedItemIds[itemType] === item.itemId) {
        newSelectedItemIds = { ...selectedItemIds };
        delete newSelectedItemIds[itemType];
      } else {
        newSelectedItemIds = {
          ...selectedItemIds,
          [itemType]: item.itemId,
        };
      }
    } else {
      if (selectedItemIds[item.itemType] === item.itemId) {
        newSelectedItemIds = { ...selectedItemIds };
        delete newSelectedItemIds[item.itemType];
      } else {
        newSelectedItemIds = {
          ...selectedItemIds,
          [item.itemType]: item.itemId,
        };
      }
    }

    const isEqual =
      Object.keys(newSelectedItemIds).length ===
        Object.keys(initialEquippedItems).length &&
      Object.keys(newSelectedItemIds).every(
        (key) => newSelectedItemIds[key] === initialEquippedItems[key]
      );

    setIsChanged(!isEqual);
    setSelectedItemIds(newSelectedItemIds);
    setSelectedItems((prev) => {
      if (newSelectedItemIds[item.itemType] === undefined) {
        const newSelectedItems = { ...prev };
        delete newSelectedItems[item.itemType];
        return newSelectedItems;
      }

      return {
        ...prev,
        [item.itemType]: item.itemName,
      };
    });
  };

  const handleSave = async () => {
    try {
      const equippedUserItemIdList = {};

      Object.entries(selectedItemIds).forEach(([itemType, itemId]) => {
        if (itemId && itemDetails[itemId]) {
          equippedUserItemIdList[itemType] = itemDetails[itemId].userItemId;
        } else {
          equippedUserItemIdList[itemType] = null;
        }
      });

      await patchUserItem(equippedUserItemIdList);
      setIsChanged(false);
    } catch (error) {
      console.error("아이템 장착 상태 변경 실패:", error);
    }
  };

  // 현재 탭에 따라 아이템 필터링
  const filteredItems = itemLists.filter((item) =>
    activeTab === "전체" ? true : item.itemType === tabToItemType[activeTab]
  );
  console.log("filteredItems: ", filteredItems);

  return (
    <div className=" flex flex-col bg-orange-50">
      <NavigationHeader title="" />
      <div className="flex justify-center h-[317px]">
        <UserDuck userId={getUserId()} selectedItems={selectedItems} />
      </div>
      <div className="bg-white shadow-custom w-full rounded-t-[1.25rem]">
        <div className="pt-1">
          <TabBarComponent
            tabs={["전체", "소품", "모자", "얼굴", "옷", "가방"]}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            size="big"
          />

          <div className="flex flex-col px-4 pt-4 gap-4 h-full overflow-y-scroll">
            <div className="grid grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Skin
                  key={item.itemId}
                  item={item}
                  onItemSelect={handleItemSelect}
                  isSelected={selectedItemIds[item.itemType] === item.itemId}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="fixed flex bottom-0 left-0 w-full justify-center pt-1.5 h-[5.5rem] bg-white">
          <ButtonComponent
            text="저장"
            color={isChanged ? "primary" : "gray700"}
            disabled={!isChanged}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};
export default CharacterCustomPage;
