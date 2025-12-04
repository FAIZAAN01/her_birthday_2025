import fs from "fs";
import path from "path";
import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  if (cookies.auth !== "1") return res.status(403).send("Forbidden");

  const filePath = path.join(process.cwd(), "public", "secure.html");
  let html = fs.readFileSync(filePath, "utf8");

  html = html.replace("shinu_PLACEHOLDER", process.env.shinu);

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
