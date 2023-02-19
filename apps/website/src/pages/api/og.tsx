import { ImageResponse } from "@vercel/og";
const fonts = fetch(
  new URL("../../assets/fonts/Inter-Black.ttf", import.meta.url),
).then(async (res) => res.arrayBuffer());

export default async function handler() {
  const fontData = await fonts;

  return new ImageResponse(
    (
      <body tw="h-full w-full bg-[#181818]">
        <div tw="flex h-full flex-col justify-center pl-[8%] pr-[3%]">
          <h1 tw="font-bold text-8xl text-white opacity-90 leading-tight">Darkcord</h1>

          <h2 tw="ml-1 mt-2.5 text-white font-medium text-2xl opacity-50 leading-none">
            Darkcord is a Node.js module to easily interact with Discord API.
          </h2>
        </div>
      </body>
    ),
    {
      width: 2048,
      height: 1170,
      statusText: "OK",
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
      fonts: [{ name: "Inter", data: fontData, style: "normal" }],
    },
  );
}

export const config = {
  runtime: "edge",
};
