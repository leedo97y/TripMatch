import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ModalCard from "./reviewModalStyle";
import axios from "axios";
import authAxios from "../../axios/authAxios";

interface ReviewProps {
  matchId: string;
  authorEmail: string;
  setReview: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  email: string;
  profileImg: string;
  nickname: string;
  introduce: string;
  age: string;
  gender: string;
  matchCount: number;
  matchPoint: string;
}

const ReviewModal: React.FC<ReviewProps> = ({
  authorEmail,
  matchId,
  setReview,
}) => {
  const [starList, setStarList] = useState([false, false, false, false, false]);
  const [point, setPoint] = useState(0);
  const [userInfo, setUserInfo] = useState<User>({
    email: "",
    profileImg: "",
    nickname: "",
    introduce: "",
    age: "",
    gender: "",
    matchCount: 0,
    matchPoint: "",
  });
  const [authorInfo, setAuthorInfo] = useState<User>({
    email: "",
    profileImg: "",
    nickname: "",
    introduce: "",
    age: "",
    gender: "",
    matchCount: 0,
    matchPoint: "",
  });

  // const isShown = useAppSelector((state) => state.modal.show);
  // const dispatch = useAppDispatch();

  const listArray = [0, 1, 2, 3, 4];
  const fullStar =
    "https://res.cloudinary.com/dk9scwone/image/upload/v1671520384/fullstar_ypgg1e.png";
  const emptyStar =
    "https://res.cloudinary.com/dk9scwone/image/upload/v1671520384/emptystar_pvmnrk.png";

  useEffect(() => {
    const getAuthorInfo = async () => {
      try {
        const fetchData = await axios.get(
          `https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app/api/main/auth/${authorEmail}`,
        );

        if (fetchData.status === 200) {
          setAuthorInfo(fetchData.data);
        }
      } catch (err: unknown) {
        console.error(err);
      }
    };
    getAuthorInfo();
  }, [authorEmail]);

  const checkStar = (idx: number) => {
    const newStarList = new Array(5).fill(false);
    for (let i = 0; i <= idx; i++) {
      newStarList[i] = true;
    }
    setStarList(newStarList);
    return;
  };

  const postPoint = async () => {
    const userData = await authAxios.get(`/api/main/mypage`);
    setUserInfo(userData.data);
    await authAxios.put(
      `/api/main/matches/${matchId}/score?authorEmail=${authorEmail}&?applicantEmail=${userInfo.email}`,
      {
        matchPoint: point,
      },
    );
    setReview(false);
    window.location.reload();
  };

  return (
    <ModalCard>
      <div className="modalCard">
        <div className="userInfo">
          <img src={authorInfo.profileImg} />
          <div className="nickname">{authorInfo.nickname}</div>
          <div className="detailInfo">
            {authorInfo.age} {authorInfo.gender}
          </div>
        </div>
        <div className="question">동행과의 여행은 어떠셨나요?</div>
        <ul className="star">
          {listArray.map((item) => {
            return (
              <li
                key={item}
                onMouseEnter={() => {
                  checkStar(item);
                  setPoint(item + 1);
                }}
              >
                <img src={starList[item] ? fullStar : emptyStar} />
              </li>
            );
          })}
        </ul>
        <div className="guide">평가는 익명으로 수집됩니다.</div>
        <div className="btn">
          <button onClick={postPoint}>확인</button>
          <button onClick={() => setReview(false)}>취소</button>
        </div>
      </div>
    </ModalCard>
  );
};

export default ReviewModal;
