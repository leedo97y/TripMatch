import styled from "styled-components";
import NoticeForm from "./components/NoticeForm";

const NoticeWrite = () => {
  return (
    <Container>
      <Title>게시글 쓰기</Title>
      <NoticeForm />
    </Container>
  );
};

export default NoticeWrite;

const Container = styled.div`
  width: 1000px;
  margin: auto;
  padding: 20px 0 15vh;
`;

const Title = styled.h2`
  font-size: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;
