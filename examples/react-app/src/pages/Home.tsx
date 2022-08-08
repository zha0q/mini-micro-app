import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../logo.svg";
import Rnd from "../components/utils";
import axios from "axios";
import { renderPreview } from "../utils/getScreenShotInRame";
import domtoimage from "../utils/domtoimage";
import { MyAVLTree } from "../components/utils/avlTree";

export const Home = () => {
  const history = useHistory();

  const rightRef = useRef(null);
  const [targetWidthRef, setTargetWidthRef] = useState(0);

  Rnd.start();

  const initRightWidth = (padding = 300) => {
    const curDom = rightRef.current as unknown as HTMLDivElement;
    const scaleNum =
      (document.body.clientWidth - padding) / document.body.clientWidth;
    setTargetWidthRef(
      parseInt(
        document.defaultView?.getComputedStyle(curDom, null)["width"] ?? "0",
        10
      )
    );
  };

  useEffect(() => {
    const resizeCallback = initRightWidth.bind(null, 300);
    resizeCallback();

    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  axios
    .get(
      "https://content-manage-dev-1258344699.cos.ap-guangzhou.myqcloud.com/100002/upload/picture/202206/1536962228638834696.png?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDUnqdARRBeqlQovmLegRu74k9JCo8ByVl%26q-sign-time%3D1655275325%3B3233198525%26q-key-time%3D1655275325%3B3233198525%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D6be102e7ae5e60bf620ac87655dd50c2f3b4d359"
    )
    .then((res) => console.log(res));

  return (
    <div style={{ position: "relative" }} ref={rightRef}>
      <rnd-bak style={{ height: "2000px", width: "100%" }}>
        <rnd-elem
          x={100}
          y={100}
          w={300}
          h={300}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
          targetWidth={targetWidthRef}
        >
          <rame-app
            src="http://82.157.137.133:8765/"
            style={{
              pointerEvents: "none",
            }}
          />
        </rnd-elem>

        <rnd-elem
          x={100}
          y={100}
          w={300}
          h={300}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
          targetWidth={targetWidthRef}
        >
          <rame-app
            src="http://82.157.137.133:8765/"
            style={{
              pointerEvents: "none",
            }}
          />
        </rnd-elem>

        <rnd-elem
          x={100}
          y={100}
          w={300}
          h={300}
          dragable={true}
          resizable={true}
          sensitive={8}
          nearLineDistance={8}
          targetWidth={targetWidthRef}
        >
          <rame-app
            src="http://82.157.137.133:8765/"
            style={{
              pointerEvents: "none",
            }}
          />
        </rnd-elem>
      </rnd-bak>
    </div>
  );
};
