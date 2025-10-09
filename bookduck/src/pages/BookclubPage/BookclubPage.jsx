import BasicHeader from "../../components/common/BasicHeader";
import BottomNavbar from "../../components/common/BottomNavbar";

const BookclubPage = () => {
  return (
    <>
      <div className="flex flex-col">
        <BasicHeader title="북클럽" />
        <div className="flex flex-col items-center justify-center flex-1 p-4 mt-20">
          <div className="text-h2 font-semibold text-gray-700">북클럽</div>
          <div className="text-b1 text-gray-500 mt-2">공사중..</div>
        </div>
        <BottomNavbar />
      </div>
    </>
  );
};

export default BookclubPage;

