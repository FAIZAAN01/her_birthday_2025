// api/login.js
import cookie from "cookie";
import querystring from "querystring";

function parseRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    return res.end("Method Not Allowed");
  }

  const raw = await parseRawBody(req);
  const contentType = (req.headers["content-type"] || "").toLowerCase();

  let form = {};
  try {
    if (contentType.includes("application/json")) {
      form = raw ? JSON.parse(raw) : {};
    } else {
      // default: parse urlencoded (HTML form)
      form = querystring.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse body:", err);
    res.statusCode = 400;
    return res.end("Invalid request body");
  }

  const password = (form.password || "").toString();

  // make sure DEMO_PASSWORD is set in Vercel env
  if (password === process.env.DEMO_PASSWORD) {
    const cookieStr = cookie.serialize("auth", "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      secure: process.env.NODE_ENV === "production"
    });

    // 302 redirect with Set-Cookie header
    res.writeHead(302, {
      Location: "/secure",
      "Set-Cookie": cookieStr
    });
    return res.end();
  }

  res.statusCode = 401;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.end("<h2>Wrong Password</h2><a href='/'>Try Again</a>");
}
