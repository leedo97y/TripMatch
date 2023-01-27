import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, ModalCard, TripInfo } from "./FestivalListStyle";
import axios from "axios";
import TitleStyle from "../Title/TitleStyle";
import Title from "../Title/Title";

interface Item {
  [key: string]: string;
}

interface ItemObj {
  item: Item;
  stateFn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LocationProps {
  location: string;
}

const FestivalList: React.FC<LocationProps> = ({ location }) => {
  const [InfoList, setInfoList] = useState<Item[]>([]);
  const [itemInfo, setItemInfo] = useState<Item>({});
  const [modalOn, setModalOn] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const navigate = useNavigate();

  const getInfo = async (infoType: string, location: string) => {
    const infoList = await axios
      .get(
        `https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app/api/main/infoes/${infoType}`,
      )
      .then((res) =>
        res.data.sort((a: Item, b: Item) => {
          return Number(a.eventstartdate) - Number(b.eventstartdate);
        }),
      );
    location === "/"
      ? setInfoList(infoList.slice(0, 8))
      : setInfoList(infoList);
    return;
  };

  useEffect(() => {
    getInfo("festival", location);
  }, [location]);

  const dateFormat = (date: string) => {
    return date.slice(0, 4) + "." + date.slice(4, 6) + "." + date.slice(6, 8);
  };

  const InfoModal: React.FC<ItemObj> = ({ item, stateFn }) => {
    return (
      <ModalCard
        onClick={(e) => {
          e.stopPropagation();
          stateFn(false);
        }}
      >
        <div className="modalCard">
          <img
            className="closeModal"
            src="https://res.cloudinary.com/dk9scwone/image/upload/v1671625307/free-icon-cancel-8532370_kuiqk1.png"
            onClick={(e) => {
              e.stopPropagation();
              setModalOn(false);
            }}
          />

          <img
            src={item.firstimage}
            className="modalImg"
            onClick={() => {
              window.open(item.firstimage, "_blank");
            }}
          />
          <div className="info">
            <div className="modalTitle">{item.title}</div>
            {item.eventstartdate ? (
              <div className="festivalDate">
                {dateFormat(item.eventstartdate)}~
                {dateFormat(item.eventenddate)}
              </div>
            ) : (
              <div></div>
            )}
            <div className="address">{item.addr1}</div>
            <div className="tel">
              {item.tel ? item.tel : "연락처가 없습니다."}
            </div>
          </div>
        </div>
      </ModalCard>
    );
  };

  return (
    <div>
      {location === "/" ? (
        <Title title="여행정보" location="/" />
      ) : (
        <TitleStyle>
          <h3>
            <span
              className={`${toggleOn}`}
              onClick={() => {
                getInfo("festival", location);
                setToggleOn(true);
              }}
            >
              축제정보
            </span>
            <span
              className={`${!toggleOn}`}
              onClick={() => {
                getInfo("stay", location);
                setToggleOn(false);
              }}
            >
              숙박정보
            </span>
          </h3>
        </TitleStyle>
      )}
      <Container>
        <TripInfo>
          {InfoList &&
            InfoList.map((item) => {
              return (
                <div
                  className="item"
                  key={item._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemInfo(item);
                    setModalOn(true);
                  }}
                >
                  <img src={item.firstimage} />
                  <div className="itemTitle">
                    {item.title.length > 29
                      ? item.title.slice(0, 29) + "..."
                      : item.title}
                  </div>
                  {location === "/" ||
                    (item.eventstartdate && (
                      <div className="itemDate">
                        {dateFormat(item.eventstartdate)}~
                        {dateFormat(item.eventenddate)}
                      </div>
                    ))}
                </div>
              );
            })}
          {modalOn && <InfoModal item={itemInfo} stateFn={setModalOn} />}
        </TripInfo>
        {location !== "/" ? (
          <div className="shortCutBtn">
            <div>혼자 가기 외로울 땐?</div>
            <button
              onClick={() => {
                if (sessionStorage.getItem("email")) {
                  navigate("/match/write");
                } else {
                  navigate("/auth/login");
                }
              }}
            >
              동행 신청 바로가기
            </button>
          </div>
        ) : (
          false
        )}
      </Container>
    </div>
  );
};

export default FestivalList;
