// next.config.mjs
import { parse } from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath);
const envConfig = parse(envFile);

const nextConfig = {
  env: envConfig,
};

export default nextConfig;
