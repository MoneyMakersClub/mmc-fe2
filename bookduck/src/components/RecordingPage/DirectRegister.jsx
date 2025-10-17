import { useState } from "react";
import bookCover from "../../assets/common/book-cover.svg";
import TextField from "../common/TextField";
import ButtonComponent from "../common/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { postRegisterBook } from "../../api/recording";
import useBookInfoStore from "../../store/useBookInfoStore";

const DirectRegister = ({ onBookSelect }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [publisher, setPublisher] = useState("");
  const [imgFile, setImgFile] = useState();
  const { setBookInfo } = useBookInfoStore();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setImgFile(file);
      // 파일 처리 로직 추가 가능
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const handlePages = (e) => {
    setPages(e.target.value);
  };
  const handlePublisher = (e) => {
    setPublisher(e.target.value);
  };

  const handleRecording = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("pageCount", pages);
    formData.append("publisher", publisher);
    {
      imgFile && formData.append("coverImage", imgFile);
    }

    const res = await postRegisterBook(formData);
    console.log(res);
    if (res) {
      if (onBookSelect) {
        onBookSelect(res.data);
      } else {
        setBookInfo(res.data);
        navigate("/archive?recording=true", { replace: true });
      }
    }
  };

  return (
    <div className="w-full w-max-[64rem] ">
      <div className="w-full flex flex-col justify-center items-center pb-[2.15rem] px-4">
        <div
          onClick={() => document.getElementById("fileInput").click()}
          className="mt-5"
        >
          <img
            className="w-[6.5rem] h-[9.75rem] object-cover rounded-[0.25rem] cursor-pointer"
            src={imgFile ? URL.createObjectURL(imgFile) : bookCover}
            alt="Book Cover"
          />
        </div>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="w-full flex flex-col gap-8 mb-[1.23rem]">
          <TextField
            type="제목"
            title
            placeholder="제목"
            check={false}
            handleValue={handleTitle}
            inputValue={title}
          />
          <TextField
            type="제목"
            title
            placeholder="저자 명"
            check={false}
            handleValue={handleAuthor}
            inputValue={author}
          />
          <TextField
            type="제목"
            title
            placeholder="페이지 수 (선택)"
            check={false}
            handleValue={handlePages}
            inputValue={pages}
          />
          <TextField
            type="제목"
            title
            placeholder="출판사 (선택)"
            check={false}
            handleValue={handlePublisher}
            inputValue={publisher}
          />
        </div>
        <div className="flex justify-center items-center w-full h-[7rem] mb-[0.94rem] bg-gray-50 text-b2 text-gray-400 text-center">
          직접 등록한 책에 대해서는 별점 및 한줄평과
          <br /> 독서 기록 모두 나만 남길 수 있어요.
        </div>
        <ButtonComponent
          onClick={handleRecording}
          text="완료"
          type="primary"
          disabled={!(title && author)}
        />
      </div>
    </div>
  );
};

export default DirectRegister;
