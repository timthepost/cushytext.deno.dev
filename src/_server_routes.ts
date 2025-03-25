import Router from "lume/middlewares/router.ts";

const router = new Router();

router.get("/api", ({ _request }) => {
  const ts = Date.now();
  return new Response(JSON.stringify({ ping: ts }), { status: 200 });
});

// Add more (get / post / etc) here.
router.post("/api/feedback", async ({ request }) => {
  const payload = await (request.blob());
  const data = await payload.text();
  const obj = JSON.parse(data);
  const kv = await Deno.openKv();
  const res = await kv.set(
    ["anonFeedback", obj.basename, Date.now(), crypto.randomUUID()],
    data,
  );
  if (res.ok) {
    return new Response(JSON.stringify(data), { status: 201 });
  } else {
    console.error("Error inserting feedback with kv.set()");
    return new Response(JSON.stringify(["error:", "kv.set() failed"]), {
      status: 500,
    });
  }
});

export default router;
