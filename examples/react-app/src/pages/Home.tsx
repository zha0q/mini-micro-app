import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../logo.svg";
import { Rnd, Bak } from "../components/utils";

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
  const newResize2 = useRef<any>(null);
  const newResize3 = useRef<any>(null);
  const newResize4 = useRef<any>(null);
  const bak = useRef<any>(null);

  useEffect(() => {
    if (!newResize3.current) {
      bak.current = new Bak(document.getElementById("bak") as HTMLElement);
      // newResize.current = new Rnd(
      //   document.getElementById("xixi") as HTMLElement,
      //   bak.current,
      //   {
      //     draggable: true,
      //     resizable: true,
      //     sensitive: 8,
      //     nearLineDistance: 10,
      //   }
      // );
      // newResize2.current = new Rnd(
      //   document.getElementById("haha") as HTMLElement,
      //   bak.current,
      //   {
      //     draggable: true,
      //     resizable: true,
      //     sensitive: 8,
      //     nearLineDistance: 10,
      //   }
      // );
      newResize3.current = new Rnd(
        document.getElementById("jjking") as HTMLElement,
        bak.current,
        {
          draggable: false,
          resizable: false,
          sensitive: 8,
          nearLineDistance: 10,
        }
      );
      newResize4.current = new Rnd(
        document.getElementById("otto") as HTMLElement,
        bak.current,
        {
          draggable: true,
          resizable: true,
          sensitive: 8,
          nearLineDistance: 10,
        }
      );
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
      <div id="bak" style={{ height: "1200px", width: "900px" }}>
        {/* <div id="xixi" style={{ height: "250px", width: "120px" }}>
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </div>
        <div id="haha" style={{ height: "200px", width: "100px" }}>
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </div> */}
        <div id="jjking" style={{ height: "200px", width: "100px" }}>
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          id="otto"
          style={{
            height: "200px",
            width: "100px",
            transform: "translate(300px, 100px)",
          }}
        >
          <rame-app
            src="https://tmpl-dev.tencent-cloud.com/content/components/home-carousel?footerID=undefined&columnID=undefined&showChangeThemeIcon=undefined&showEmailIcon=undefined&showMessageCenterIcon=undefined&showSearchInput=undefined&logo=undefined"
            style={{
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
