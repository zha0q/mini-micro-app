import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../logo.svg";
import { Rnd } from "react-rnd";
import Resize from "../components/utils/resize";

const getTranslateValue = (s: any) => {
  const reg = s.match(/translate\((.*?)\)/);
  return reg && reg[1].split(" "); // [20,20]
};

export const Home = () => {
  const history = useHistory();
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const newResize = useRef<any>(null);

  useEffect(() => {
    if (!newResize.current) {
      newResize.current = new Resize(document.getElementById("xixi"));
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ border: "1px solid" }}>
        <div>This is Home</div>
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={() => {
            history.push("/logo");
          }}
        />
      </div>
      <Rnd
        style={{ border: "1px solid" }}
        size={{
          width: width,
          height: height,
        }}
        position={{ x, y }}
        onDragStop={(e, data) => {
          setX(data.x);
          setY(data.y);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setWidth(parseInt(ref.style.width));
          setHeight(parseInt(ref.style.height));
          setX(position.x);
          setY(position.y);
        }}
      >
        <div>
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </div>
      </Rnd>
      <div id="xixi" style={{ border: "1px solid" }}>
        <rame-app
          src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
          style={{
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
