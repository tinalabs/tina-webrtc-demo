import { useForm, usePlugin } from "tinacms";
import Layout from "../components/Layout";
import SimplePeer from "simple-peer";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    p.on("error", (err) => console.log("error", err));

    p.on("signal", (data) => {
      console.log("SIGNAL", JSON.stringify(data));
      setSignal(JSON.stringify(data));
    });

    p.on("connect", () => {
      console.log("CONNECT");
      // p.send("whatever" + Math.random());
    });

    p.on("data", (data) => {
      console.log("data: " + data);
      setFormState(JSON.parse(data));
    });
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
