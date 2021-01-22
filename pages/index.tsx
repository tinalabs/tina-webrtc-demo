import { usePlugin } from "tinacms";
import Layout from "../components/Layout";
import { usePeerEditingForm } from "../web-rtc-tina/hooks";

type Fields = {
  title: string;
  subtitle: string;
};
const IndexPage = () => {
  const [modifiedValues, form, , connected] = usePeerEditingForm<Fields>({
    id: "test",
    label: "Home Page",
    onSubmit: (data) => {
      console.log(data);
    },
    initialValues: {
      title: "Hello from tinacms",
      subtitle: "This is a subtitle",
    },
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
  });

  usePlugin(form);
  // const [inputVal, setInputVal] = useState("");

  // this is bad
  if (typeof window == "undefined") {
    console.log("working");
    return <div>loading...</div>;
  }

  return (
    <Layout title="Home">
      <h1>{modifiedValues.title}</h1>
      <p>{modifiedValues.subtitle}</p>
      <div>{connected && "you are connected to a peer!"}</div>
    </Layout>
  );
};
export default IndexPage;
