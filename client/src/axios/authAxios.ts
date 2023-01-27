import axios from "axios";

// accesstoken 이 필요한 api 요청에는 해당 authAxios 를 사용해주시고, 필요하지 않은 api 요청에는 기본 axios 를 사용해주세요

// tempUrl 은 추후 삭제 예정
const baseUrl = "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app";
const refreshTokenURl = `${baseUrl}/api/main/auth/refresh`;

const refreshAccessToken = async () => {
  // 세션스토리지에서 refresh token 가져오기
  const refreshToken = sessionStorage.getItem("refreshToken");
  // 서버에 새 access token 요청해서 받기
  const response = await axios.get(refreshTokenURl, {
    headers: {
      ["x-access-token"]: `Bearer ${sessionStorage.getItem("x-access-token")}`,
      refresh: refreshToken,
    },
  });
  const accessToken = response.data["x-access-token"];
  // 새 accesstoke 저장하기
  sessionStorage.setItem("x-access-token", accessToken);
};

const authAxios = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: "",
  },
});

/* axios 요청 전에 거쳐감
첫번째 인자 config는 axios 에 전달되는 첫번째 요청 객체를 의미한다. url, method, baseURL, header, params,data, timeout responseType, transformRequest 등의 속성을 가진다
 두번째 인자 error 는 실패시 데이터를 가진 객체이다. 실패시 반환하여 인터셉터.response의 두번째 인자에서 처리하게 한다 */
authAxios.interceptors.request.use(
  async (config) => {
    // const accessToken = sessionStorage.getItem("x-access-token");
    /*엑세스 토큰이 없다면 리프레시토큰으로 갱신해준다 -22.12.27 비로그인 유저의 경우 엑세트 토큰 유무 검증 없어도 서버에서 에러를 띠우거나 인터셉터로 커스텀된 axios 가 아닌 기본 axios 를 사용할 수 있으므로, 굳이 엑세스 토큰 유무를 물어서 refreshAcessToken 함수내의 axios 를 실행시켜 작업이 길어질 수 있으니, 아래 코드는 생략해도 좋을 듯 하다 */
    // if (!accessToken) {
    //   await refreshAccessToken();
    // }
    // 요청 객체 헤더에 Authorizaion 은 null 이 아니므로 non-null 연산자 (!.) 를 사용하여 lint 에러를 해결하고 bearer 로 세션에서 가져온 엑세스 토큰을 넣어주자
    config.headers!["x-access-token"] = `Bearer ${sessionStorage.getItem(
      "x-access-token",
    )}`;
    // 엑세스 토큰을 헤더에 가진 요청 객체를 반환하여, 정상적인 axios 요청을 계속 실행하자
    return config;
  },
  // 요청 실패 시, 요청 실패를 응답으로 보내자
  (error) => {
    return Promise.reject(error);
  },
);

/* axios response 로 받은 데이터는 모두 아래 코드를 거쳐서 받음
첫번째 인자로 성공 시 실행할 코드, 두번째 인자는 요청 실패시 재시도 하는 코드 */
authAxios.interceptors.response.use(
  // 요청 성공 시 실행할 코드
  (response) => {
    return response;
  },
  // 요청 실패 시 실행할 코드
  async (error) => {
    // 요청에 실패한 객체는 error 중에 error.config 이다. 이 요청 객체를 다시 한번 사용해야한다. 변수에 담아쓰자
    const originalRequest = error.config;
    // _retry 속성은 axios interceptor 에서 사용하는 속성으로, 요청 실패 시, 재시도 할 횟수를 지정하는 속성이다
    // _retry 의 값으로 재시도라면 true 를, 재시도가 아니면 false 를 줘서 첫번째 요청 재시도인지를 확인한다
    if (error.response.status === 401 && !originalRequest._retry) {
      // 첫번째 요청 후엔 true 로 바꾸어 두번째 요청부터는 재요청이 아닌 에러를 띄우게 해주자
      originalRequest._retry = true;
      // refresh 토큰으로 Access 토큰을 갱신해준다(세션에 저장해준다)
      await refreshAccessToken();
      // 요청 객체의 heaers 속성에 Authorization 속성에 Bearer로 세션에서 가져온 엑세스 토큰을 넣어준다
      originalRequest.headers![
        "x-access-token"
      ] = `Bearer ${sessionStorage.getItem("x-access-token")}`;
      // 위의 과정을 거쳐서 헤더에 엑세스 토큰을 담은  axios 요청 객체를 return 하여 axios 요청을 실행해준다
      return axios(originalRequest);
    }
    // status 코드 가 401 이거나, 이미 재요청이 처음이 아니라면, 요청 실패로 에러 객체를 반환하자
    return Promise.reject(error);
  },
);

export default authAxios;
