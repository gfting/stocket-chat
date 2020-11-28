import React from 'react'
import { ThemeProvider } from 'theme-ui'
import { funk } from '@theme-ui/presets'
// import theme from '@theme-ui/preset-base'

// example theme.js
const funkTheme = {
    ...funk,
    styles: {
        ...funk.styles,
    },
}



export const Theme = (props) => (
    <ThemeProvider theme={funkTheme}>{props.children}</ThemeProvider>
)