import styled from "styled-components";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Loading() {
  return (
    <>
      <Loader>Loading...</Loader>
    </>
  );
}
export default Loading;
