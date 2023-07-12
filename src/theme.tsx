import { Theme, defaultDarkModeOverride } from "@aws-amplify/ui-react";

export const theme: Theme = {
  name: "theme",
  overrides: [
    defaultDarkModeOverride,
    //     {
    //       colorMode: "dark",
    //       tokens: {
    //         components: {
    //           card: {
    //             backgroundColor: "black",
    //           },
    //           textfield: {
    //             color: "white",
    //           },
    //           button: {
    //             primary: {
    //               backgroundColor: "purple",
    //               color: "white",
    //             },
    //             color: "white",
    //           },
    //         },
    //       },
    //     },
  ],
};
