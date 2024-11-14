// This approach to loading environment variables provides better error message handling when missing
// https://www.austinshelby.com/blog/the-correct-way-to-load-environment-variables-in-nextjs



// Function only works for build-time and server environment variables.
// This does not work for browser run-time NEXT_PUBLIC... variables,
// which must instead be inlined as process.env.NEXT_PUBLIC...
function getEnvironmentVariable(environmentVariableName: string): string {
  // Comes from process or file .env.local
  const environmentValue = process.env[environmentVariableName];
  if (!environmentValue) {
    throw new Error(
      `Could not find environment variable: ${environmentVariableName}`
    );
  } else {
    return environmentValue;
  }
};

export const config = {
  DB_TOKEN: getEnvironmentVariable('DB_TOKEN'),
};
