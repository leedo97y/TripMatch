import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthFormBlock,
  Footer,
  StyledInput,
  Button,
  ResultText,
} from "../../../components/Auth/AuthStyle";
import axios from "axios";

const FindPasswordForm = () => {
  const baseUrl =
    "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app";
  // const loginUrl = `${baseUrl}/main/auth/login`;
  const [email, setEmail] = useState("");
  const [validText, setValidText] = useState(
    "새 비밀번호를 받을 이메일 주소를 입력해주세요",
  );
  const navigate = useNavigate();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkEmail = (email: string) => {
      const RegExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

      if (email === "") {
        return "이메일 주소를 입력해주세요";
      } else if (RegExp.test(email)) {
        return "올바른 형식의 이메일 주소입니다";
      } else {
        return "잘못된 이메일 주소입니다";
      }
    };

    const checkResult = checkEmail(email);
    setValidText(checkResult);
    try {
      const sendOj = { email: email };
      const res = await axios.post(`${baseUrl}/api/main/auth/password`, sendOj);
      if (res.status === 200) {
        alert(
          "입력하신 이메일로 비밀번호가 전송되었습니다. 이메일을 확인해주세요",
        );
        navigate("/auth/login");
      } else if (res.status === 400) {
        alert("가입되지 않은 이메일입니다");
      } else {
        throw new Error(
          `에러코드 ${res.status}. 새 비밀번호 전송에 실패하였습니다`,
        );
      }
    } catch (error) {
      alert("새 비밀번호 전송에 실패하였습니다");
      console.error(error);
    }
  };

  return (
    <AuthFormBlock>
      <p className="pageTitle">비밀번호 찾기</p>
      <form onSubmit={onSubmitEmail}>
        <div>
          <label htmlFor="idInput">email</label>
          <StyledInput
            id="idInput"
            autoComplete="on"
            name="userEmail"
            placeholder="이메일"
            onChange={onChangeEmail}
            value={email}
            required
          />
          <ResultText>{validText}</ResultText>
        </div>
        <Button className="formSubmit" type="submit">
          비밀번호 찾기
        </Button>
      </form>
      <Footer>
        <Link to="/auth/login">로그인</Link>
        <Link to="/auth/register">회원가입</Link>
      </Footer>
    </AuthFormBlock>
  );
};

export default FindPasswordForm;
