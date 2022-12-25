import React, { useState, useEffect } from "react";
import { Content, Layer } from "./TableContentStyle";
import { PostType } from "../../../type/userPost";
import axios from "axios";

const MyPageTable: React.FC = () => {
  const [data, setData] = useState<PostType[]>([]);
  const [status, setStatus] = useState(true);

  // const baseUrl = "https://e14cb7f4-6c52-45e6-84b4-2e92c7458bf0.mock.pstmn.io/userInfo";

  useEffect(() => {
    const getData = async () => {
      const fetchData = await axios.get("http://localhost:4000/postUserInfo");
      setData(fetchData.data[0].posts);
    };
    getData();
  }, []);

  // const handleChangeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   // const id = data[0].postId;

  //   const upDateData = {
  //     postId: data[0].postId,
  //     title: data[0].title,
  //     status: value === "모집중" ? setStatus(status) : setStatus(!status),
  //   };

  //   const putData = async () => {
  //     const fetchData = await axios.put(
  //       "http://localhost:4000/postUserInfo",
  //       upDateData,
  //     );
  //     setData(fetchData.data[0]);
  //   };
  //   putData();
  // };

  // axios({
  //   url: "http://localhost:4000/postUserInfo",
  //   method: "put",
  //   data: {
  //     postId: 1,
  //     status: false,
  //   },
  // });

  return (
    <>
      <Content>
        <Layer>
          <table>
            <thead>
              <tr id="first">
                <th>제목</th>
                <th>지역</th>
                <th>여행기간</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => {
                return (
                  <tr key={item.postId}>
                    <td id="title">{item.title}</td>
                    <td>{item.region}</td>
                    <td>
                      {item.duration[0].start} ~ {item.duration[0].end}
                    </td>
                    <td id="last">
                      <select>
                        <option value="모집중">모집중</option>
                        <option value="모집마감">모집마감</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Layer>
      </Content>
    </>
  );
};

export default MyPageTable;
