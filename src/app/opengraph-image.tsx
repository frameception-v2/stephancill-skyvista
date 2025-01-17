import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-b from-sky-400 to-blue-600">
        <div tw="flex flex-col items-center bg-white/90 p-8 rounded-2xl shadow-2xl">
          <h1 tw="text-6xl font-bold text-sky-900 mb-4">{PROJECT_TITLE}</h1>
          <h3 tw="text-2xl text-sky-800 text-center">{PROJECT_DESCRIPTION}</h3>
          <div tw="mt-6 text-xl text-sky-700">Powered by Farcaster Frames</div>
          <div tw="mt-4 flex items-center">
            <img 
              src="https://emojicdn.elk.sh/🌤️" 
              tw="w-12 h-12 mr-2" 
              alt="Weather icon"
            />
            <img 
              src="https://emojicdn.elk.sh/🌡️" 
              tw="w-12 h-12 mr-2" 
              alt="Temperature icon"
            />
            <img 
              src="https://emojicdn.elk.sh/💧" 
              tw="w-12 h-12" 
              alt="Humidity icon"
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
