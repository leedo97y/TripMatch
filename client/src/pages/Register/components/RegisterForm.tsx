import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import {
  AuthFormBlock,
  Footer,
  StyledInput,
  Button,
  Select,
  ResultText,
  TextArea,
} from "../../../components/Auth/AuthStyle";
import {
  checkConfirmPassword,
  checkIntroduce,
  checkNickname,
  checkPassword,
} from "../../../components/Auth/validation";

const RegisterForm = () => {
  const baseUrl =
    "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app:3003";

  const AgeOption = [
    { value: "default", name: "선택" },
    { value: "10대", name: "10대" },
    { value: "20대", name: "20대" },
    { value: "30대", name: "30대" },
    { value: "40대", name: "40대" },
    { value: "50대", name: "50대" },
    { value: "60대 이상", name: "60대 이상" },
  ];

  const navigate = useNavigate();

  const [userState, setUserState] = useImmer({
    email: "",
    reqAuthNumber: false, // 인증번호 요청 후 true, 이메일 변경 감지용 (onChange 시 false로 바뀜)
    reqAuthNumberAxios: false, // 클릭마다 api 요청 방지, 인증번호 요청 api
    authNumber: "",
    checkAuthNumberAxios: false, // 클릭마다 api 요청 방지, 인증번호 일치 확인 요청 api
    certified: false, // 인증번호 일치 시 true
    nickName: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    introduce: "",
  });

  const [validText, setValidText] = useImmer({
    email: "이메일 주소를 입력해주세요",
    authNumber: "이메일로 받은 인증번호를 입력해주세요",
    nickName: "2~8자, 특수문자 제외",
    password: "8~20자, 영문, 숫자, 특수문자 모두 사용",
    confirmPassword: "비밀번호를 다시 한 번 입력해주세요",
    introduce:
      "SNS 계정을 적어주시면 상대방의 동행 수락 가능성이 높아집니다 :)",
  });

  // userState.password 변경 시에도 userState.confirmPassword 가 변해야 하므로 useEffect 사용
  useEffect(() => {
    setValidText((draft) => {
      draft.confirmPassword = checkConfirmPassword(
        userState.confirmPassword,
        userState.password,
        validText.password,
      );
    });
  }, [
    setValidText,
    userState.confirmPassword,
    userState.password,
    validText.password,
  ]);

  const handleReqAuthNumber = async () => {
    // axios 요청 - email로 인증번호 보내기, 409 번이면 이메일 중복 텍스트, 201이면 성공 텍스트

    const checkEmail = (email: string) => {
      const RegExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

      if (email === "") {
        return "이메일 주소를 입력해주세요";
      } else if (userState.reqAuthNumber) {
        return "인증번호 전송에 실패하였습니다";
      } else if (RegExp.test(email)) {
        return "이메일로 인증번호를 전송하였습니다";
      } else {
        return "잘못된 이메일 주소입니다";
      }
    };

    const checkResult = checkEmail(userState.email);

    if (
      checkResult === "이메일로 인증번호를 전송하였습니다" &&
      !userState.reqAuthNumber
    ) {
      try {
        setUserState((draft) => {
          draft.reqAuthNumber = true;
        });
        const res = await axios.post(`${baseUrl}/api/main/auth/email`, {
          email: userState.email,
        });
        if (res.status === 201) {
          setUserState((draft) => {
            draft.reqAuthNumberAxios = true;
          });
          setValidText((draft) => {
            draft.email = "이메일로 인증번호가 전송되었습니다";
          });
        } else if (res.status === 409) {
          setValidText((draft) => {
            draft.email = "이미 존재하는 이메일 주소입니다";
          });
          setUserState((draft) => {
            draft.reqAuthNumberAxios = true;
          });
        } else {
          setUserState((draft) => {
            draft.reqAuthNumberAxios = false;
          });
          throw new Error(
            `에러코드 ${res.status}. 인증번호 전송에 실패하였습니다`,
          );
        }
      } catch (error) {
        setValidText((draft) => {
          draft.email = "인증번호 전송에 실패하였습니다";
        });
        console.error(error);
      }
    } else {
      setTimeout(() => {
        setValidText((draft) => {
          draft.email = checkResult;
        });
      }, 500);
    }
  };

  const handleCheckAuthnumber = async () => {
    // 할일: certified: true 시, 이메일 input과 인증번호 input 수정불가로 막기

    const checkAuthNumber = (authNumber: string) => {
      const RegExp = /^[a-zA-Z0-9]+$/g;
      if (userState.reqAuthNumber === false) {
        return "이메일로 인증번호를 재요청 해주세요";
      } else if (authNumber === "") {
        return "인증번호를 입력해주세요";
      } else if (RegExp.test(userState.authNumber)) {
        return "입력완료";
      } else {
        return "인증번호가 일치하지 않습니다";
      }
    };

    const checkResult = checkAuthNumber(userState.authNumber);

    if (
      checkResult === "입력완료" &&
      userState.reqAuthNumber &&
      userState.reqAuthNumberAxios &&
      !userState.checkAuthNumberAxios
    ) {
      try {
        setUserState((draft) => {
          draft.checkAuthNumberAxios = true;
        });
        const res = await axios.post(`${baseUrl}/api/main/auth/certify`, {
          email: userState.email,
          authNumber: userState.authNumber,
        });
        if (res.status === 200) {
          setUserState((draft) => {
            draft.certified = true;
          });
          setValidText((draft) => {
            draft.authNumber = "이메일이 인증 되었습니다";
          });
        } else if (res.status === 400) {
          setValidText((draft) => {
            draft.email = "인증번호가 일치하지 않습니다";
          });
          setUserState((draft) => {
            draft.certified = false;
          });
        } else {
          throw new Error(`에러코드 ${res.status}. 인증에 실패하였습니다`);
        }
      } catch (error) {
        setValidText((draft) => {
          draft.authNumber = "인증번호가 일치하지 않습니다";
        });
        setUserState((draft) => {
          draft.certified = false;
        });
        console.error(error);
      }
    } else {
      if (!userState.certified) {
        setTimeout(() => {
          setValidText((draft) => {
            if (checkResult === "입력완료") {
              draft.authNumber = "인증번호가 일치하지 않습니다";
            } else {
              draft.authNumber = checkResult;
            }
          });
        }, 500);
      }
    }
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.email = e.target.value;
      draft.reqAuthNumber = false;
    });
    setValidText((draft) => {
      draft.email = "이메일 주소를 입력해주세요";
    });
  };

  const onChangeAuthNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.authNumber = e.target.value;
      draft.checkAuthNumberAxios = false;
      draft.certified = false;
    });
    setValidText((draft) => {
      draft.authNumber = "이메일로 받은 인증번호를 입력해주세요";
    });
  };

  const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.nickName = e.target.value;
    });
    setValidText((draft) => {
      draft.nickName = checkNickname(e.target.value);
    });
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.password = e.target.value;
    });
    setValidText((draft) => {
      draft.password = checkPassword(e.target.value);
    });
  };

  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.confirmPassword = e.target.value;
    });
  };

  const onChangeGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((draft) => {
      draft.gender = e.target.value;
    });
  };

  const onChangeAge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserState((draft) => {
      draft.age = e.target.value;
    });
  };

  const onChangeIntroduce = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const checkResult = checkIntroduce(e.target.value);
    setUserState((draft) => {
      draft.introduce = e.target.value;
      if (
        checkResult ===
        "SNS 계정을 적어주시면 상대방의 동행 수락 가능성이 높아집니다 :)"
      ) {
        draft.introduce = e.target.value;
      }
    });
    setValidText((draft) => {
      draft.introduce = checkResult;
    });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      email: userState.email,
      nickname: userState.nickName,
      password: userState.password,
      gender: userState.gender,
      age: userState.age,
      introduce: userState.introduce,
    };

    if (userState.certified === true) {
      const res = await axios.post(`${baseUrl}/api/main/auth/join`, userData);
      if (res.status === 201) {
        navigate("/auth/login");
      } else if (res.status === 403) {
        alert("이메일 인증 후에 회원가입 해주세요");
      } else {
        console.error(`에러코드 ${res.status}. 회원가입에 실패하였습니다`);
        alert("회원가입에 실패하였습니다. 인터넷 연결을 확인해주세요");
      }
    }
  };

  return (
    <AuthFormBlock>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="emailInput">email*</label>
        <StyledInput
          id="emailInput"
          autoComplete="on"
          name="userEmail"
          placeholder="이메일 주소를 입력해주세요"
          onChange={onChangeEmail}
          value={userState.email}
          readOnly={userState.certified ? true : false}
          required
        />
        <ResultText>{validText.email}</ResultText>
        <Button type="button" onClick={handleReqAuthNumber}>
          인증번호 요청
        </Button>

        <label htmlFor="authNumberInput">인증번호*</label>
        <StyledInput
          id="authNumberInput"
          autoComplete="off"
          name="authNumber"
          placeholder="인증번호를 입력해주세요"
          onChange={onChangeAuthNumber}
          value={userState.authNumber}
          readOnly={userState.certified ? true : false}
          required
        />
        <ResultText>{validText.authNumber}</ResultText>
        <Button type="button" onClick={handleCheckAuthnumber}>
          인증번호 확인
        </Button>

        <label htmlFor="nicknameInput">닉네임*</label>
        <StyledInput
          id="nicknameInput"
          autoComplete="on"
          name="nickname"
          placeholder="닉네임을 입력해주세요"
          onChange={onChangeNickName}
          value={userState.nickName}
          required
        />
        <ResultText>{validText.nickName}</ResultText>

        <label htmlFor="passwordInput">비밀번호*</label>
        <StyledInput
          id="passwordInput"
          autoComplete="off"
          name="Password"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          onChange={onChangePassword}
          value={userState.password}
          required
        />
        <ResultText>{validText.password}</ResultText>

        <label htmlFor="passwordConfirmInput">비밀번호 확인*</label>
        <StyledInput
          id="passwordConfirmInput"
          autoComplete="off"
          name="PasswordConfirm"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          onChange={onChangeConfirmPassword}
          value={userState.confirmPassword}
          readOnly={userState.password === "" ? true : false}
          required
        />
        <ResultText>{validText.confirmPassword}</ResultText>

        <label>성별*</label>
        <label className="gender">
          <input
            type="radio"
            name="gender"
            value="남성"
            checked={userState.gender === "남성"}
            onChange={onChangeGender}
            required
          />
          남성
        </label>
        <label className="gender">
          <input
            type="radio"
            name="gender"
            value="여성"
            checked={userState.gender === "여성"}
            onChange={onChangeGender}
          />
          여성
        </label>

        <label htmlFor="ageSelect">나이*</label>
        <Select
          id="ageSelect"
          className="ageSelect"
          defaultValue="default"
          onChange={onChangeAge}
          required
        >
          {AgeOption.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.value === "default" ? true : false}
            >
              {option.name}
            </option>
          ))}
        </Select>

        <label htmlFor="introduceText">자기소개*</label>
        <TextArea
          name="introduce"
          id="introduceText"
          rows={8}
          placeholder="100자 이내로 소개해주세요"
          onChange={onChangeIntroduce}
          required
        ></TextArea>
        <p className="useIntroDescription">{validText.introduce}</p>

        <Button className="formSubmit" type="submit">
          회원가입
        </Button>
      </form>
      <Footer>
        <Link to="/auth/login">로그인</Link>
      </Footer>
    </AuthFormBlock>
  );
};

export default RegisterForm;
