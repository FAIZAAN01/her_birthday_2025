import cookie from "cookie";

export default function handler(req, res) {
  res.setHeader("Set-Cookie",
    cookie.serialize("auth", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0)
    })
  );

  return res.redirect("/");
}
