import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../logo.svg";
import Rnd from "../components/utils";
import axios from "axios";
import { renderPreview } from "../utils/getScreenShotInRame";
import domtoimage from "../utils/domtoimage";

export const Home = () => {
  const history = useHistory();

  Rnd.start();

  axios
    .get(
      "https://content-manage-dev-1258344699.cos.ap-guangzhou.myqcloud.com/100002/upload/picture/202206/1536962228638834696.png?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDUnqdARRBeqlQovmLegRu74k9JCo8ByVl%26q-sign-time%3D1655275325%3B3233198525%26q-key-time%3D1655275325%3B3233198525%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D6be102e7ae5e60bf620ac87655dd50c2f3b4d359"
    )
    .then((res) => console.log(res));

  return (
    <div style={{ position: "relative" }}>
      <div style={{ border: "1px solid" }}>
        <div>This is Home</div>
        <img src={logo} className="App-logo" alt="logo" />
        <iframe src="https://www.bing.com/" />
        <button
          onClick={async () => {
            await domtoimage
              .toJpeg(document.getElementById("root") as HTMLElement, {
                cacheBust: true,
              })
              .then((dataUrl) => {
                var link = document.createElement("a");
                link.download = "my-image-name.jpeg";
                link.href = dataUrl;
                link.click();
              });
            // history.push("/logo");
          }}
        />
      </div>
      {/* <rnd-bak style={{ height: "2000px", width: "900px" }}>
        <rnd-elem
          x={100}
          y={100}
          w={100}
          h={100}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
        > */}
      <rame-app
        src="http://localhost:8080"
        style={{
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          backgroundImage:
            "url('https://content-manage-dev-1258344699.cos.ap-guangzhou.myqcloud.com/100002/upload/picture/202206/1533704847400009759.png?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDUnqdARRBeqlQovmLegRu74k9JCo8ByVl%26q-sign-time%3D1654498705%3B3232421905%26q-key-time%3D1654498705%3B3232421905%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3Da784b812b35fd05d53893aa3324ad9152e4bca40')",
          height: "100px",
          width: "100px",
        }}
      ></div>
      {/* </rnd-elem>
        <rnd-elem
          x={100}
          y={100}
          w={100}
          h={100}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
        >
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </rnd-elem>
        <rnd-elem
          x={100}
          y={100}
          w={100}
          h={100}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
        >
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </rnd-elem>
      </rnd-bak> */}
    </div>
  );
};
