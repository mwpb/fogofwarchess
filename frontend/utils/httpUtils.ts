import m from "mithril";

export type ResponseData = {
  body: any;
  status: number;
};

export let postToServer = async (
  path: string,
  data: any
): Promise<ResponseData> => {
  try {
    let body = await m.request({
      method: "POST",
      url: `/${path}`,
      body: data,
      withCredentials: true,
    });
    return {
      body: body,
      status: 200,
    };
  } catch (err) {
    return {
      body: err.response,
      status: err.code,
    };
  }
};
