import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method Not Allowed");

  const password = req.body?.password;

  if (password === process.env.DEMO_PASSWORD) {
    res.setHeader("Set-Cookie",
      cookie.serialize("auth", "1", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 12
      })
    );
    return res.redirect("/secure");
  }

  res.status(401).send("<h2>Wrong Password</h2><a href='/'>Try Again</a>");
}
