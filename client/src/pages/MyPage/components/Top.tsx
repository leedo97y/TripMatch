import React, { useEffect, useState } from "react";
import { UserInfo } from "../../../type/userInfo";
import { Top, TripCount, Score } from "./TopStyle";
import authAxios from "../../../axios/authAxios";

const MyPageTop: React.FC = () => {
  const [data, setData] = useState<UserInfo>();

  useEffect(() => {
    const postData = async () => {
      const fetchData = await authAxios.get("/api/main/mypage");
      setData(fetchData.data);
    };
    postData();
  }, []);

  return (
    <Top key={data?.email}>
      <img src={data?.profileImg} />
      <h1>{data?.nickname}님, 안녕하세요 !</h1>
      <TripCount>
        <span>동행 횟수</span>
        <span>{data?.matchCount ?? 0}</span>
      </TripCount>
      <Score>
        <span>나의 점수</span>
        <span>
          <span id="scoreNum">{data?.matchPoint ?? 0}</span>/5
        </span>
      </Score>
    </Top>
  );
};

export default MyPageTop;
