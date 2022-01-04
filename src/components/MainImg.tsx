import styled from "styled-components";
import { IGetDatas } from "../api";
import { makeImagePath } from "../utility";

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  font-size: 22px;
  width: 50%;
  line-height: 120%;
`;

interface IMain {
  data?: IGetDatas;
}

function MainImg({ data }: IMain) {
  return (
    <>
      <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        {(data?.results[0].title && <Title>{data?.results[0].title}</Title>) ||
          (data?.results[0].name && <Title>{data?.results[0].name}</Title>)}
        <Overview>{data?.results[0].overview}</Overview>
      </Banner>
    </>
  );
}

export default MainImg;
