exports.handler = async (event) => {
  const { monto, de, a } = event.queryStringParameters;
  const API_KEY = process.env.API_KEY;

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${de}/${a}/${monto}`);
    const data = await response.json();

    if (data.result === "success") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          result: "success",
          conversion_result: data.conversion_result,
          conversion_rate: data.conversion_rate,
        }),
      };
    } else {
      throw new Error(data["error-type"]);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "No se pudo obtener la tasa de cambio" }),
    };
  }
};