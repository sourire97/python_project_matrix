const compression = require("compression");
const cors = require("cors");
const { indexRouter } = require("./src/router/indexRouter");
const { userRouter } = require("./src/router/userRouter");

const express = require("express");
const app = express();
const port = 3000;

/* express 미들웨어 설정 */

// 정적파일 제공
app.use(express.static(front));

// cors 설정
// cors 허가된 것만 도메인을 쓰게 하는 것인데, 아래 코드는 보안설정을 느슨하게 해준 것이다.
app.use(cors());

// body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());

// 라우터 분리
indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
