import { useState, useEffect } from "react";
import { callApi } from "./callApi";
import { scrollToBottom } from "./scrollToBottom";
// import { usePrevious } from "./usePrevious";

const ShowChat = ({chatnumber, username}) => {
    // const prevChatnumber = usePrevious(chatnumber);
    const [msgs, setMsgs] = useState([]);
    const [nextmsg, setNextmsg] = useState('');
    useEffect(() => {
        async function fetchData() {
            let jdata = await callApi(`getchat?number=${chatnumber}`);
            if (jdata.msgs) {
                setMsgs(jdata.msgs);
            }
        }
        const timer = setInterval(() => {
          fetchData();
        },10000); // every 10 seconds
        return () => clearInterval(timer);

        // if (!prevChatnumber || prevChatnumber !== chatnumber) {
        //     fetchData();
        // }
    // },[chatnumber,prevChatnumber]);
    });

    useEffect(() => {
        scrollToBottom("ScrollableChat");
    },[msgs])

    const handleKeyDown = async(event) => {
        if (event.key === "Enter" && nextmsg.length > 0) {
          event.preventDefault();
          let jdata = await callApi(`chatmessage?number=${chatnumber}&name=${username}&msg=${nextmsg}`);
          if (jdata.msgs) {
              setMsgs(jdata.msgs);
              setNextmsg('');
          }
          return;
        }
        if (event.key === "Backspace" && nextmsg.length > 0) {
          event.preventDefault();
          let newNextmsg = nextmsg.slice(0,nextmsg.length-1);
          setNextmsg(newNextmsg);
        }
      }
    
      return (
        <div id="ScrollableChat" className="thinChat">
          <table>
            <tbody>
              {msgs.map((value, index) => (<tr key={`ChatMessageFrom${index}`}>
                  <td className="thinChatFrom">{value.name}</td>
                  <td className="thinChatMsg">{value.msg}</td>
                </tr>))}
              <tr>
                <td colSpan="2">
                  {username === "" ?
                    <span>Please log in to use chat</span>
                  :
                    <textarea className={nextmsg === "" ? "thinChatInputEmpty" : "thinChatInput"}
                      name="nextmsgInputArea"
                      value={nextmsg}
                      onChange={(e) => {setNextmsg(e.target.value);}}
                      onKeyDownCapture={handleKeyDown}
                      placeholder="chat..."
                    />
                  }
                </td>
              </tr>
            </tbody>
          </table>
          {nextmsg.length > 100 && <span class="trWarning">Messages longer than 100 characters are truncated</span>}
       </div>
      )
}

export default ShowChat;