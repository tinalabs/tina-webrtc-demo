import { useEffect, useState } from "react";
import { Form, FormOptions, useCMS, useForm, Field, TextField } from "tinacms";
import { usePeers } from "../components";
import styled from "styled-components";
const DisabledTextInput = styled.div`
  input {
    pointer-events: none !important;
    background-color: var(--tina-color-grey-2) !important;
    border-color: lightblue;
    border-width: 2px;
  }
`;
export function usePeerForm<FormShape = any>(
  options: FormOptions<FormShape>,
  config: {
    useLock: boolean;
  }
): [FormShape, Form, boolean, boolean] {
  const [formState, setFormState] = useState(options.initialValues);
  const [peerFields, setPeerFields] = useState(options.fields);
  const [disabledItems, setDisabledItems] = useState([] as string[]);
  const [currentFieldEditing, setCurrentFieldEditing] = useState("");
  const cms = useCMS();

  // const ssr = typeof window == "undefined";
  // const secondPeer = ssr ? true : location.hash === "#1";

  // const connctedRef = useRef(false);
  const { peer: p, connected, connectedRef: connctedRef } = usePeers();

  // const p = useMemo(() => {
  //   if (ssr) {
  //     return (undefined as unknown) as SimplePeer.Instance;
  //   }
  //   const p = new SimplePeer({
  //     initiator: !secondPeer,
  //     trickle: false,
  //   });
  //   return p;
  // }, []);

  // setPeer(p);
  const unLockForms = () => {
    console.log(options.fields);
    console.log("unlocking");
    setDisabledItems([]);
    setPeerFields(options.fields);
  };
  const lockField = (name: string) => {
    if (!disabledItems.includes(name)) {
      setDisabledItems([...disabledItems, name]);
      const lockedTitleField = {
        name: name,
        component: (props) => (
          <DisabledTextInput
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <TextField {...props} />
          </DisabledTextInput>
        ),
      } as Field;
      const newPeerFields = peerFields;
      const fieldsIndex = newPeerFields?.findIndex(
        (field) => field.name === name
      );
      if (
        newPeerFields &&
        typeof fieldsIndex === "number" &&
        fieldsIndex !== -1
      ) {
        console.log(name);
        if (newPeerFields[fieldsIndex].component === "text") {
          newPeerFields[fieldsIndex] = lockedTitleField;
          console.log({ newPeerFields });
          setPeerFields([...newPeerFields]);
        }
      }
    }
  };

  useEffect(() => {
    // cms.events.subscribe("sidebar:*", (e) => {
    //   if (!connctedRef.current) {
    //     return;
    //   }
    //   if (e.type === "sidebar:opened") {
    //     p.send(
    //       JSON.stringify({
    //         sidebar: {
    //           value: true,
    //         },
    //       })
    //     );
    //   }
    //   if (e.type === "sidebar:closed") {
    //     p.send(
    //       JSON.stringify({
    //         sidebar: {
    //           value: false,
    //         },
    //       })
    //     );
    //   }
    // });

    // p.on("error", (err) => console.log("error", err));

    // p.on("signal", (data) => {
    //   console.log("SIGNAL", JSON.stringify(data));
    //   if (data.type === "offer") {
    //     console.log("posting");
    //     postData("/api/signal?slug=/", { data, type: "offer" });
    //   } else if (data.type == "answer") {
    //     console.log("posting answer");
    //     postData("/api/signal?slug=/", { data, type: "answer" });
    //   }
    // });
    // p.on("connect", () => {
    //   console.log("CONNECT");
    //   connctedRef.current = true;
    //   setConnected(true);
    // });

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
      if (parsedData.formClicked) {
        lockField(parsedData.formClicked);
      }
      if (parsedData.formUnClicked) {
        unLockForms();
      }
    });
  }, [p]);

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
      fields: peerFields,
      label: options.label,
    }
  );

  form.subscribe(
    ({ active }) => {
      if (!config.useLock) {
        return;
      }
      if (connctedRef.current && active) {
        if (!currentFieldEditing) {
          console.log("setting active");
          console.log(active);
          setCurrentFieldEditing(active);
          p.send(JSON.stringify({ formClicked: active }));
        }
      } else if (connctedRef.current && currentFieldEditing) {
        if (currentFieldEditing) {
          console.log("sending unlock");
          setCurrentFieldEditing("");
          p.send(JSON.stringify({ formUnClicked: true }));
        }
      }
    },
    { active: true }
  );

  return [modifiedValues, form, loading, connected];
}
