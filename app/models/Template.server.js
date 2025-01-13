import invariant from "tiny-invariant";
import db from "../db.server";

export async function getTemplate(id, graphql) {
  const template = await db.template.findFirst({ where: { id } });

  if (!template) {
    return null;
  }

  return template
}