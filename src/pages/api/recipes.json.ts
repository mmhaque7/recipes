import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const recipes = await getCollection(
    "recipes",
    ({ data }) => data.published !== false
  );
  const minimal = recipes.map((r) => ({
    slug: r.slug,
    title: r.data.title,
    description: r.data.description ?? "",
    tags: r.data.tags ?? [],
    ingredients: r.data.ingredients ?? [],
    steps: r.data.steps ?? [],
    heroImage: r.data.heroImage ?? "",
  }));
  return new Response(JSON.stringify(minimal), {
    headers: { "Content-Type": "application/json" },
  });
};
