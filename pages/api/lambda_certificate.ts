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
  const { name, email, token } = req.body;

  const resp = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
  );
  if (resp.status !== 200) {
    return res.status(400).json({ error: "reCAPTCHA don't match!" });
  }

  const contact: ISolicitaCertificado = { email: email, name: name };

  try {
    const resp = await axios.post(process.env.LAMBDA_URL as string, contact);
    return res.status(201).json(resp.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error occurred." });
  }
}
