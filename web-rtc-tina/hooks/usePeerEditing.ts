import { useEffect, useMemo, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { Form, FormOptions, useCMS, useForm } from "tinacms";
import { usePeers } from "../components";
import { postData } from "../util";

export function usePeerEditingForm<FormShape = any>(
  options: FormOptions<FormShape>
): [FormShape, Form, boolean, boolean] {
  const [formState, setFormState] = useState(options.initialValues);
  const cms = useCMS();
  const ssr = typeof window == "undefined";
  const secondPeer = ssr ? true : location.hash === "#1";
  // const [connected, setConnected] = useState(false);
  const connctedRef = useRef(false);
  const { setPeer, connected, setConnected } = usePeers();

  const p = useMemo(() => {
    if (ssr) {
      return (undefined as unknown) as SimplePeer.Instance;
    }
    const p = new SimplePeer({
      initiator: !secondPeer,
      trickle: false,
    });
    return p;
  }, []);

  setPeer(p);

  useEffect(() => {
    cms.events.subscribe("sidebar:*", (e) => {
      if (!connctedRef.current) {
        return;
      }
      if (e.type === "sidebar:opened") {
        p.send(
          JSON.stringify({
            sidebar: {
              value: true,
            },
          })
        );
      }
      if (e.type === "sidebar:closed") {
        p.send(
          JSON.stringify({
            sidebar: {
              value: false,
            },
          })
        );
      }
    });
    p.on("error", (err) => console.log("error", err));

    p.on("signal", (data) => {
      console.log("SIGNAL", JSON.stringify(data));
      if (data.type === "offer") {
        console.log("posting");
        postData("/api/signal?slug=/", { data, type: "offer" });
      } else if (data.type == "answer") {
        console.log("posting answer");
        postData("/api/signal?slug=/", { data, type: "answer" });
      }
    });

    p.on("connect", () => {
      console.log("CONNECT");
      connctedRef.current = true;
      setConnected(true);
    });

    p.on("data", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.formChange) {
        setFormState(parsedData.formChange);
      }
      if (parsedData.sidebar) {
        if (cms.sidebar) {
          cms.sidebar.isOpen = parsedData.sidebar.value;
        }
      }
    });
    const fetchOffer = async () => {
      if (secondPeer) {
        const res = await fetch("/api/signal?slug=/");
        const { offer } = await res.json();
        if (offer) {
          p.signal(offer);
        }
      }
    };
    fetchOffer();
  }, []);

  const [modifiedValues, form, loading] = useForm<FormShape>(
    {
      ...options,
      onChange: (values) => {
        if (options.onChange) {
          options.onChange(values);
        }
        // need to check if it can send data
        // This doesnt work with useState connected it only works with the ref (that why we need both)
        if (connctedRef.current) {
          p.send(JSON.stringify({ formChange: values.values }));
        }
      },
    },
    {
      values: formState,
      fields: options.fields,
      label: options.label,
    }
  );

  return [modifiedValues, form, loading, connected];
}
