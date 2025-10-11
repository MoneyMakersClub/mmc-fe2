import plus_orange from "../../assets/common/plus-orange.svg";

const BookclubCreateIcon = ({ handleClick, isActive }) => {
  return (
    <div
      onClick={handleClick}
      className="flex gap-1 items-center mr-[0.37rem] cursor-pointer"
    >
      <img src={plus_orange} />
      <div className="text-b2 text-gray-800">새 북클럽</div>
    </div>
  );
};

export default BookclubCreateIcon;
