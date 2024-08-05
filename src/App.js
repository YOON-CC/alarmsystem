import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // CSS 파일 가져오기

const App = () => {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [token, setToken] = useState(""); // 토큰 상태 추가
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          return; // 토큰이 없으면 요청하지 않음
        }

        // Axios 요청을 위한 설정
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
          },
        };

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/recommend/search`,
          config
        ); // 데이터를 가져올 API 주소
        const newData = response.data.data; // 실제 데이터는 response.data.data에 위치

        if (
          previousData &&
          JSON.stringify(previousData) !== JSON.stringify(newData)
        ) {
          // 데이터 변경 감지
          playSound();
        }

        setPreviousData(data);
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const playSound = () => {
      const audio = new Audio("/sound/sound.mp3"); // 소리 파일 URL
      audio.play();
    };

    // 30초마다 fetchData 함수 호출
    const intervalId = setInterval(fetchData, 30000);

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(intervalId);
  }, [data, previousData, token]); // token을 의존성 배열에 추가

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setToken(inputValue); // 입력값을 토큰으로 설정
  };

  return (
    <div>
      <h1>클린프리 질문 요청 현황</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter token here"
        />
        <button onClick={handleSubmit}>Set Token</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Member UUID</th>
            <th>Result ID</th>
            <th>Question</th>
            <th>Analyze</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.memberUuid}</td>
                <td>{item.resultId}</td>
                <td>{item.question}</td>
                <td>{item.analyze ? "Yes" : "No"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
