import { API_ENDPOINTS } from "@/shared/constants/api";
import { AllOriginsProxyError } from "@/shared/errors/AllOriginsProxyError";

async function fetchDirect<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new AllOriginsProxyError(
        `HTTP ${response.status}: ${response.statusText}`,
        url,
        "direct",
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AllOriginsProxyError) {
      throw error;
    }

    // CORS or network error - throw specific error to trigger fallback
    throw new AllOriginsProxyError(
      `Direct fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      url,
      "direct",
    );
  }
}

async function fetchViaProxy<T>(url: string): Promise<T> {
  const proxyUrl = `${API_ENDPOINTS.PROXY_BASE}${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new AllOriginsProxyError(
        `HTTP ${response.status}: ${response.statusText}`,
        url,
        "proxy",
      );
    }

    const proxyResponse = await response.json();

    if (!proxyResponse.contents) {
      throw new AllOriginsProxyError(
        "No contents in proxy response",
        url,
        "proxy",
      );
    }

    try {
      return JSON.parse(proxyResponse.contents);
    } catch (parseError) {
      throw new AllOriginsProxyError(
        `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}`,
        url,
        "proxy",
      );
    }
  } catch (error) {
    if (error instanceof AllOriginsProxyError) {
      throw error;
    }

    throw new AllOriginsProxyError(
      `Proxy error: ${error instanceof Error ? error.message : "Unknown error"}`,
      url,
      "proxy",
    );
  }
}

export async function fetchWithProxy<T>(url: string): Promise<T> {
  // Step 1: Try direct fetch first
  try {
    const result = await fetchDirect<T>(url);
    return result;
  } catch (directError) {
    console.warn(
      `⚠️ Direct fetch failed: ${directError instanceof Error ? directError.message : "Unknown error"}`,
    );

    // Step 2: Fallback to proxy if direct fails
    try {
      const result = await fetchViaProxy<T>(url);
      return result;
    } catch (proxyError) {
      console.error(`❌ Both direct and proxy failed for: ${url}`);

      // Throw the more informative error
      if (proxyError instanceof AllOriginsProxyError) {
        throw proxyError;
      }

      throw new AllOriginsProxyError(
        `Both direct and proxy methods failed. Direct: ${directError instanceof Error ? directError.message : "Unknown"}. Proxy: ${proxyError instanceof Error ? proxyError.message : "Unknown"}`,
        url,
        "proxy",
      );
    }
  }
}
