"use client"
import NavBar from "@/components/navbar"
import "./globals.css"
import { lightTheme } from "./theme/themes"
import { ThemeProvider, CssBaseline, Toolbar } from "@mui/material"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

// export const metadata = {
//     title: "BFF Gram Staking Dapp",
//     description: "BFF Gram Staking Dapp",
// }

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const activeChainId = ChainId.BinanceSmartChainTestnet
    return (
        <html lang="en">
            <head><title>BFF Gram Staking Dapp</title></head>
            <ThirdwebProvider activeChain={activeChainId}>
                <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <body>
                        <NavBar />
                        <Toolbar />
                        {children}
                    </body>
                </ThemeProvider>
            </ThirdwebProvider>
        </html>
    )
}
