const { createClient } = require("@supabase/supabase-js");

const getClient = () => {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase env vars missing.");
  }
  return createClient(url, serviceRoleKey);
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const supabase = getClient();
    if (event.httpMethod === "GET") {
      const { data, error } = await supabase
        .from("drug_rows")
        .select("id, clase, principio, ejemplos")
        .order("id", { ascending: true });
      if (error) {
        throw error;
      }
      return jsonResponse(200, data);
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      if (!payload.clase || !payload.principio) {
        return jsonResponse(400, { error: "Missing fields." });
      }
      const { data, error } = await supabase
        .from("drug_rows")
        .insert({
          clase: payload.clase,
          principio: payload.principio,
          ejemplos: payload.ejemplos || "",
        })
        .select("id, clase, principio, ejemplos")
        .single();
      if (error) {
        throw error;
      }
      return jsonResponse(200, data);
    }

    return jsonResponse(405, { error: "Method not allowed." });
  } catch (error) {
    return jsonResponse(500, { error: "Server error." });
  }
};
