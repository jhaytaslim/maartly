import http from "k6/http";
import { check, sleep, Random } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001/api";
const COMPANIES = Array.from({ length: 1000 }, (_, i) => `co${i + 1}`);

export const options = {
  stages: [{ duration: "2m", target: __ENV.K6_VUS || 200 }],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

export function setup() {
  const tokens = {};
  COMPANIES.forEach((companyId) => {
    const res = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify({
        email: `test@${companyId}.com`,
        password: "pass",
        companyName: companyId,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.status === 201) tokens[companyId] = res.json().token;
  });
  return { tokens };
}

export default function (data) {
  const companyId = Random.choice(Object.keys(data.tokens));
  const token = data.tokens[companyId];
  const params = { headers: { Authorization: `Bearer ${token}` } };

  // Storefront (50%)
  let res = http.get(`${BASE_URL}/storefront?companyId=${companyId}`, params);
  check(res, { "status 200": (r) => r.status === 200 });

  // POS (30%)
  if (Math.random() < 0.3) {
    res = http.post(
      `${BASE_URL}/orders`,
      JSON.stringify({ companyId, items: [{ id: 1, qty: 1 }] }),
      { ...params, headers: { "Content-Type": "application/json" } }
    );
    check(res, { "order 201": (r) => r.status === 201 });
  }

  // Inventory (20%)
  if (Math.random() < 0.2) {
    res = http.get(`${BASE_URL}/products?companyId=${companyId}`, params);
    check(res, { "products loaded": (r) => r.status === 200 });
  }

  sleep(1);
}
