import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "./ProfileModalStyle";
import { useImmer } from "use-immer";
import defaultImage from "../../images/user-default.jpg";

type TProfileModal = {
  email: string;
};

const baseUrl =
  "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app:3003";
// 요청 실패시 보일 기본 이미지
const defaultImgUrl = defaultImage;

const ProfileModal: React.FC<TProfileModal> = ({ email }) => {
  const [modal, setModal] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [userData, setUserData] = useImmer({
    email: "",
    nickname: "",
    gender: "",
    age: "",
    introduce: "",
    profileImg: "",
    matchCount: 0,
    matchPoint: "",
  });
  useEffect(() => {
    const callProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/main/auth/${email}`);
        if (res.status === 200) {
          setUserData((draft) => {
            draft.email = res.data.email;
            draft.nickname = res.data.nickname;
            draft.gender = res.data.gender;
            draft.age = res.data.age;
            draft.introduce = res.data.introduce;
            draft.profileImg = res.data.profileImg;
            draft.matchCount = res.data.matchCount;
            draft.matchPoint = res.data.matchPoint;
          });
        } else {
          // throw new Error(
          //   `에러코드 ${res.status}, 유저 프로필 요청에 실패하였습니다(204면 탈퇴한 유저)`,
          // );
        }
      } catch (error) {
        // console.error(error);
      }
    };
    callProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      {modal && (
        <Modal onClick={toggleModal}>
          <div className="overlay">
            <div className="content">
              <div className="contentWrapper">
                <img
                  className="profileImg"
                  src={
                    userData.profileImg === ""
                      ? defaultImgUrl
                      : userData.profileImg
                  }
                  alt="profile image"
                  ref={imageRef}
                  onError={() => {
                    if (imageRef.current) {
                      imageRef.current.src = defaultImgUrl;
                    }
                  }}
                />
                <div className="infoContainer">
                  <div className="nicknameEmailWrapper">
                    <span className="nickname">
                      {userData.nickname === "" ? "-" : userData.nickname}
                    </span>
                    <span className="email">
                      {userData.email === "" ? "-" : userData.email}
                    </span>
                  </div>
                  <div className="genderAge">
                    <span className="etc">
                      {userData.gender === "" ? "-" : userData.gender}
                    </span>
                    <span className="etc">
                      {userData.age === "" ? "-" : userData.age}
                    </span>
                  </div>
                  <div className="matches">
                    <span className="etc">
                      동행횟수&#x2001; {userData.matchCount} 회
                    </span>
                    <span className="etc">
                      동행점수&#x2001;{" "}
                      {userData.matchPoint === "" ? "-" : userData.matchPoint} /
                      5
                    </span>
                    <div className="etcWrapper"></div>
                  </div>
                </div>
              </div>
              <div className="introTextArea">
                {userData.introduce === ""
                  ? "이미 탈퇴한 유저입니다."
                  : userData.introduce}
              </div>
              <img
                className="close"
                src="https://res.cloudinary.com/dk9scwone/image/upload/v1671625307/free-icon-cancel-8532370_kuiqk1.png"
                alt="close"
                onClick={toggleModal}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
