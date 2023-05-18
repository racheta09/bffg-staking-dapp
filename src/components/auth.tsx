import { ReactElement, useEffect, useState } from "react"
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import { Grid } from "@mui/material"

export default function Auth({
    children,
}: {
    children: React.ReactNode
}): ReactElement {
    const [isLoggedin, setIsLoggedin] = useState(false)
    const address = useAddress()

    useEffect(() => {
        if (address) {
            setIsLoggedin(true)
        } else {
            setIsLoggedin(false)
        }
    }, [address])

    if (!isLoggedin) {
        return (
            <Grid container
            height="100vh"
            alignItems="center"
            justifyContent="center"
            direction="column">
                <div>
                    <h1 className={"text-lg"}>Welcome to BFF Gram Staking Dapp</h1>
                    <ConnectWallet btnTitle="Login to Continue"/>
                </div>
            </Grid>
        )
    }
    return <>{children}</>
}
