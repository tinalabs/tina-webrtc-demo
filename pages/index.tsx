import { useForm, usePlugin } from "tinacms";
import Layout from "../components/Layout";
import SimplePeer from "simple-peer";
import { useEffect, useMemo, useState } from "react";
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
type Fields = {
  title: string;
  subtitle: string;
};
const IndexPage = () => {
  const [formState, setFormState] = useState({
    title: "Hello from tinacms",
    subtitle: "This is a subtitle",
  });

  const [modifiedValues, form] = useForm<Fields>(
    {
      id: "test",
      label: "Home Page",
      onSubmit: (values) => {
        console.log(values);
        // p.send(values);
      },
      onChange: (values) => {
        console.log(values.values);
        p.send(JSON.stringify(values.values));
      },
    },
    {
      values: formState,
      fields: [
        {
          component: "text",
          name: "title",
          label: "Title",
        },
        {
          component: "text",
          name: "subtitle",
          label: "Subtitle",
        },
      ],
      label: "test",
    }
  );
  usePlugin(form);
  const [signal, setSignal] = useState("");
  const [inputVal, setInputVal] = useState("");

  const p = useMemo(() => {
    // this doesnt work in SSR
    if (typeof window == "undefined") {
      return (undefined as unknown) as SimplePeer.Instance;
    } else {
      const p = new SimplePeer({
        initiator: !(location.hash === "#1"),
        trickle: false,
      });
      return p;
    }
  }, []);
  const secondPeer = useMemo(() => {
    // this doesnt work in SSR
    if (typeof window == "undefined") {
      return (undefined as unknown) as boolean;
    } else {
      return location.hash === "#1";
    }
  }, []);

  useEffect(() => {
    p.on("error", (err) => console.log("error", err));

    p.on("signal", (data) => {
      console.log("SIGNAL", JSON.stringify(data));
      setSignal(JSON.stringify(data));
      if (data.type === "offer") {
        console.log("posting");
        postData("/api/signal?slug=/", { data, type: "offer" });
      } else if (data.type == "answer") {
        console.log("posting awnser");
        postData("/api/signal?slug=/", { data, type: "answer" });
      }
    });

    p.on("connect", () => {
      console.log("CONNECT");
      // p.send("whatever" + Math.random());
    });

    p.on("data", (data) => {
      console.log("data: " + data);
      setFormState(JSON.parse(data));
    });
    const fetchOffer = async () => {
      if (secondPeer) {
        const res = await fetch("/api/signal?slug=/");
        const { offer } = await res.json();
        if (offer) {
          p.signal(offer);
        }
      } else {
        setTimeout(async () => {
          const res = await fetch("/api/signal?slug=/");
          const { answer } = await res.json();
          if (answer) {
            p.signal(answer);
          }
        }, 10000);
      }
    };
    fetchOffer();
  }, []);

  // this is bad
  if (typeof window == "undefined") {
    console.log("working");
    return <div>loading...</div>;
  }

  return (
    <Layout title="Home">
      <h1>{modifiedValues.title}</h1>
      <p>{modifiedValues.subtitle}</p>
      <div>{signal}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          p.signal(inputVal);
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
        />
      </form>
    </Layout>
  );
};
export default IndexPage;
