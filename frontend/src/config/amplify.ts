import { Amplify } from "aws-amplify";

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;
const bucket = import.meta.env.VITE_S3_BUCKET;

// Log configuration for debugging
console.log("Loading Amplify Configuration:", {
  region,
  userPoolId: userPoolId ? "configured" : "missing",
  userPoolClientId: userPoolClientId ? "configured" : "missing",
  bucket: bucket ? "configured" : "missing",
});

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      region,
    },
  },
  Storage: bucket
    ? {
        S3: {
          bucket,
          region,
        },
      }
    : undefined,
};

try {
  Amplify.configure(amplifyConfig);
  // console.log("✅ Amplify configured successfully");
} catch (error) {
  console.error("❌ Error configuring Amplify:", error);
}

export default Amplify;
