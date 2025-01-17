"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function WeatherCard({ weather }: { weather: any }) {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Current Weather</CardTitle>
        <CardDescription className="text-neutral-600">
          {weather.location.name}, {weather.location.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800">
        <div className="flex items-center gap-4">
          <img 
            src={`https:${weather.current.condition.icon}`} 
            alt={weather.current.condition.text}
            className="w-16 h-16"
          />
          <div>
            <p className="text-2xl font-bold">{weather.current.temp_c}°C</p>
            <p>{weather.current.condition.text}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>Humidity: {weather.current.humidity}%</div>
          <div>Wind: {weather.current.wind_kph} km/h</div>
          <div>Feels like: {weather.current.feelslike_c}°C</div>
          <div>UV Index: {weather.current.uv}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (loc: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(loc)}`
      );
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Could not fetch weather data. Please try another location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        
        <div className="mb-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            fetchWeather(location);
          }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or zip code"
                className="flex-1 p-2 border rounded"
              />
              <PurpleButton type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Get Weather'}
              </PurpleButton>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}
