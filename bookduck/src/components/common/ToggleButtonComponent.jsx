/* eslint-disable react/prop-types */
/*사용예시
const [isToggleOn, setIsToggleOn] = useState(false);
<ToggleButton
    isOn={isToggleOn}
    onToggle={() => setIsToggleOn(!isToggleOn)}
/>
*/

const ToggleButton = ({ isOn, onToggle }) => {
  return (
    <div
      className={`w-[3.1875rem] h-[1.9375rem] flex items-center p-0.5 rounded-full cursor-pointer ${
        isOn ? "bg-orange-300" : "bg-gray-100"
      }`}
      onClick={onToggle}
    >
      <div
        className={`bg-white w-[1.6875rem] h-[1.6875rem] rounded-[6.25rem] shadow-lg transform duration-300 ease-in-out ${
          isOn ? "translate-x-5" : ""
        }`}
      />
    </div>
  );
};

export default ToggleButton;
