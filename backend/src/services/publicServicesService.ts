import { query } from "../config/db";
import type { PublicService } from "../types";

type ServiceRow = {
  id: string;
  name: string;
  category: string;
  phone: string;
  website: string;
};

export async function listPublicServices(
  category?: string,
  search?: string,
): Promise<PublicService[]> {
  let sql = `SELECT id, name, category, phone, website FROM services WHERE 1=1`;
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    sql += ` AND UPPER(category) = UPPER($${params.length})`;
  }

  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (name ILIKE $${params.length} OR category ILIKE $${params.length})`;
  }

  sql += ` ORDER BY name ASC LIMIT 100`;

  const result = await query<ServiceRow>(sql, params);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    phone: row.phone,
    website: row.website,
  }));
}
