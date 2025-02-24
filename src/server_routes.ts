import Router from "lume/middlewares/router.ts";

const router = new Router();

router.get("/api", ({ _request }) => {
  const ts = Date.now();
  return new Response(JSON.stringify({ ping: ts }), { status: 200 });
});

// Add more (get / post / etc) here.

export default router;