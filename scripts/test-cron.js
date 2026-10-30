require("dotenv").config();

async function main() {
  const response = await fetch("http://localhost:3000/api/cron?test=true", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  const result = await response.json();

  console.log("HTTP Status:", response.status);
  console.log(JSON.stringify(result, null, 2));

  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
