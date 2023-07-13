import { theme } from "@/theme";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { ColorMode, Flex, Icon, ThemeProvider, ToggleButton, ToggleButtonGroup, View } from "@aws-amplify/ui-react";
import React from "react";

function AppHeader({ children }: React.PropsWithChildren) {
  return (
    <Flex as="header" direction="row" justifyContent="space-between" alignItems="center" padding="1rem" boxShadow="small" position="sticky" top="0" left="0" width="100%" backgroundColor="background.primary">
      {children}
    </Flex>
  );
}


export default function Layout({ children }: React.PropsWithChildren) {
  const [colorMode, setColorMode] = React.useState<ColorMode>("light");
  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <Flex direction="column" gap="0" width="100vw" height="100vh" backgroundColor="background.primary">
        <AppHeader>
          <Icon
            color="brand.primary.60"
            fontSize="xl"
            paths={[
              {
                d: "M10.8484 4.19838C10.7939 4.2926 10.7939 4.40867 10.8484 4.50288L21.3585 22.6711C21.413 22.7653 21.5138 22.8233 21.6228 22.8233H23.9901C24.225 22.8233 24.3718 22.5696 24.2543 22.3666L12.5605 2.15225C12.4431 1.94925 12.1495 1.94925 12.0321 2.15225L10.8484 4.19838Z"
              },{
                d: "M15.2084 22.6711C15.2629 22.7653 15.3636 22.8233 15.4726 22.8233H17.8461C18.081 22.8233 18.2278 22.5696 18.1104 22.3666L9.48857 7.46259C9.37113 7.25959 9.07755 7.25959 8.96011 7.46259C6.09213 12.4203 3.21732 17.4003 0.336955 22.3816C0.219574 22.5846 0.366371 22.8383 0.601212 22.8383H11.7185C11.9533 22.8383 12.1001 22.5846 11.9827 22.3816L10.8455 20.4158C10.791 20.3216 10.6903 20.2635 10.5813 20.2635H4.8952C4.77776 20.2635 4.70437 20.1367 4.76308 20.0352L9.0912 12.5534C9.14991 12.4519 9.29671 12.4519 9.35542 12.5534L15.2084 22.6711Z"
              }
            ]}
          />
          <ToggleButtonGroup
            value={colorMode}
            size="small"
            isExclusive
            onChange={(value) => setColorMode(value as ColorMode)}
          >
            <ToggleButton value="light">
              <MdOutlineLightMode />
            </ToggleButton>
            <ToggleButton value="dark">
              <MdOutlineDarkMode />
            </ToggleButton>
          </ToggleButtonGroup>
        </AppHeader>
        {children}
      </Flex>
    </ThemeProvider>
  )
}