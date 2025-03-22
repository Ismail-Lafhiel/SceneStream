import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const TokenDebugger = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      console.log("Debug: Full session:", session);

      if (!session.tokens) {
        setError("No tokens found in session");
        setLoading(false);
        return;
      }

      const idToken = session.tokens.idToken;

      if (!idToken) {
        setError("No ID token found in session");
        setLoading(false);
        return;
      }

      const payload = idToken.payload;
      setTokenData({
        sub: payload.sub,
        email: payload.email,
        groups: payload["cognito:groups"] || [],
        fullPayload: payload,
      });
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Force refresh the token
  const refreshToken = async () => {
    setLoading(true);
    try {
      console.log("Debug: Forcing token refresh");
      await fetchAuthSession({ forceRefresh: true });
      console.log("Debug: Token refreshed successfully");
      fetchTokenData();
    } catch (err) {
      console.error("Error refreshing token:", err);
      setError(`Error refreshing token: ${err}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cognito Token Debugger</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchTokenData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Refresh Data
        </button>
        <button
          onClick={refreshToken}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          Force Token Refresh
        </button>
      </div>

      {loading && <p className="text-lg">Loading token data...</p>}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {tokenData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <p>
              <strong>User ID:</strong> {tokenData.sub}
            </p>
            <p>
              <strong>Email:</strong> {tokenData.email}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Groups</h2>
            {tokenData.groups.length > 0 ? (
              <ul className="list-disc list-inside">
                {tokenData.groups.map((group: string) => (
                  <li
                    key={group}
                    className={
                      group === "ADMIN" ? "font-bold text-green-600" : ""
                    }
                  >
                    {group}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600 font-medium">
                User is not a member of any groups
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Full Token Payload</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(tokenData.fullPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDebugger;
