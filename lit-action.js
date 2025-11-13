const go = async (a, b) => {
  try {
    const URL =
      "Put your server URL here, you can use ngrok or any other service to get a public URL";

    const response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        a,
        b,
      }),
    }).then((res) => res.json());
    return response.data;
  } catch (error) {
    return false;
  }
};
