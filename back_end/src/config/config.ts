import dotenv from 'dotenv';

dotenv.config();

interface AWSConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

interface AppConfig {
  env: string;
  port: string | number;
  mongoURI: string;
  aws: AWSConfig;
  TMDB_API_KEY: string;
  TMDB_BASE_URL: string;
}

const config: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || '',
  aws: {
    region: process.env.AWS_REGION || '',
    userPoolId: process.env.COGNITO_USER_POOL_ID || '',
    clientId: process.env.COGNITO_CLIENT_ID || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
  },
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  TMDB_BASE_URL: process.env.TMDB_BASE_URL || '',
};

export default config;