import { NextApiHandler } from "next";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
// const doc = new PDFDocument()
// const pdfPath = path.join(tmpdir(), `${store.id}${moment().format('YYYYMMDD')}.pdf`)
// const writeStream = doc.pipe(fs.createWriteStream(pdfPath)

interface Store {
  getItem: (slug: string) => Promise<Item | undefined>;
  putItem: (slug: string, item: Item) => Promise<boolean>;
}

interface Item {
  offer?: string;
  answer?: string;
}

class FileStore implements Store {
  path: string;
  fileName: string;
  constructor() {
    if (!existsSync("/tmp/test")) {
      mkdirSync("/tmp/test");
    }
    this.path = "/tmp/test";
    this.fileName = "file.json";
  }
  public async getItem(slug: string): Promise<Item | undefined> {
    const data = JSON.parse(
      readFileSync(`${this.path}/${this.fileName}`, "utf-8")
    );
    const item: Item = data[slug] || undefined;
    return item;
  }
  public async putItem(slug: string, item: Item) {
    const data = {
      [slug]: item,
    };

    writeFileSync(`${this.path}/${this.fileName}`, JSON.stringify(data));

    return true;
  }
}
const fileStore = new FileStore();

const handlePost: NextApiHandler = async (req, res) => {
  // for updating an offer to a slug
  const { data, type } = req.body;
  const { slug } = req.query;
  if (!data || !type) {
    throw new Error("Need have an offer gey in the body of the post request");
  }
  if (!slug || !(typeof slug == "string")) {
    throw new Error("need to pass a slug as a query param");
  }

  const worked = await fileStore.putItem(slug, {
    [type as "offer" | "answer"]: data,
  });
  res.json({
    worked,
  });
};
const handleGet: NextApiHandler = async (req, res) => {
  // for getting any current offers with a slug
  const { slug } = req.query;
  if (!slug || !(typeof slug == "string")) {
    throw new Error("need to pass a slug as a query param");
  }
  const data = (await fileStore.getItem(slug)) || null;
  res.json(data);
};
const handleSignal: NextApiHandler = async (req, res) => {
  switch (req.method?.toLocaleUpperCase()) {
    case "POST":
      return await handlePost(req, res);
    case "GET":
      return await handleGet(req, res);
  }
};

export default handleSignal;
