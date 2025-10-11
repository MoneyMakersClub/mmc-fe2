const HighlightTextarea = ({
  value,
  onChange,
  onScroll,
  placeholder,
  maxLength,
  height,
  font,
}) => {
  return (
    <div className={`relative w-[20.5625rem] ${height} mt-2`}>
      {/* 배경 하이라이트 레이어 (실제 텍스트 표시) */}
      <div
        className={`absolute inset-0 pointer-events-none text-b2 text-gray-800 ${font}`}
        style={{
          padding: '0',
          margin: '0',
          border: 'none',
          lineHeight: '1.25rem',
          fontSize: '0.9375rem',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflowY: 'scroll',
          letterSpacing: 'normal',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <span>{value.slice(0, maxLength)}</span>
        <span style={{ backgroundColor: '#F6E5E1' }}>
          {value.slice(maxLength)}
        </span>
      </div>
      {/* 실제 입력 textarea (투명한 텍스트) */}
      <textarea
        value={value}
        onChange={onChange}
        onScroll={onScroll}
        placeholder={placeholder}
        className={`absolute inset-0 w-full h-full bg-transparent appearance-none outline-none resize-none text-b2 ${font}`}
        style={{
          padding: '0',
          margin: '0',
          border: 'none',
          lineHeight: '1.25rem',
          fontSize: '0.9375rem',
          color: 'transparent',
          caretColor: '#323232',
          whiteSpace: 'pre-wrap',
          letterSpacing: 'normal',
          textAlign: 'left',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
};

export default HighlightTextarea;

