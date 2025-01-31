import { Amplify } from "aws-amplify";
import { type ResourcesConfig } from "aws-amplify";

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      // @ts-ignore
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: "code" as const, // explicitly type as literal
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export default Amplify;
