import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  url: string;
};

type Error = {
  error: string;
};

type ISolicitaCertificado = {
  name: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { name, email } = req.body;

  const contact: ISolicitaCertificado = { email: email, name: name };
  const lambda_url =
    "https://ga1ke4385g.execute-api.us-east-1.amazonaws.com/dev/generateCertificateVisualization";
  try {
    const resp = await axios.post(lambda_url, contact);
    return res.status(201).json(resp.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error occured." });
  }
}
