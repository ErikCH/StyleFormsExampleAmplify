import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import awsExports from "@/aws-exports";
import "@aws-amplify/ui-react/styles.css";
import { ColorMode, ThemeProvider } from "@aws-amplify/ui-react";
import { theme } from "@/theme";
import { createContext } from "react";
import React from "react";
Amplify.configure(awsExports);

export const ThemeContext = createContext<{
  colorMode: ColorMode;
  setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>;
}>({ colorMode: "system", setColorMode: () => null });

export default function App({ Component, pageProps }: AppProps) {
  const [colorMode, setColorMode] = React.useState<ColorMode>("system");

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      <ThemeProvider theme={theme} colorMode={colorMode!}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
