"use client"
import Auth from "@/components/auth"
import { Button, Box, Grid, Modal, Stack } from "@mui/material"
import {
    useContractWrite,
    useContractRead,
    useContract,
    useAddress,
    Web3Button,
} from "@thirdweb-dev/react"
import { useState } from "react"
import erc20abi from "../assests/erc20abi.json"

export default function Home() {
    const stakeAddress = "0xeC0EDe248ae913c1EeD13bE8D5a22589DF2F1692"
    const tokenAddress = "0xb4a432E8e344D04328202986E1C64c5f5BED11B9"
    const address = useAddress()
    const { data: stakeContract } = useContract(stakeAddress)
    // const { data: tokenAddress } = useContractRead(stakeContract, "token")
    const { data: tokenContract } = useContract(tokenAddress, erc20abi)
    const { data: owner } = useContractRead(stakeContract, "owner")
    const { data: accumulated } = useContractRead(
        stakeContract,
        "TotalAccumulatedReward",
        [address]
    )
    const { data: pending } = useContractRead(
        stakeContract,
        "TotalPendingReward",
        [address]
    )
    const { data: staked } = useContractRead(stakeContract, "CurrentlyStaked", [
        address,
    ])
    const { data: withdrawn } = useContractRead(
        stakeContract,
        "TotalWithdrawal",
        [address]
    )
    const { data: delegates } = useContractRead(stakeContract, "TotalDelegates")
    const { data: poolstake } = useContractRead(
        stakeContract,
        "TotalStakedInPool"
    )
    const { data: symbol } = useContractRead(tokenContract, "symbol")
    const { data: tokenBalance } = useContractRead(tokenContract, "balanceOf", [
        address,
    ])
    const { data: approved } = useContractRead(tokenContract, "allowance", [
        address,
        stakeAddress,
    ])

    const [formData, setFormData] = useState({
        stakeAmount: "0",
        stakeTime: "0",
        restakeAmount: "0",
        restakeTime: "0",
    })
    const [modalState, setModalState] = useState({
        stake: false,
        restake: false,
    })
    const { mutateAsync: unstake } = useContractWrite(stakeContract, "UnStake")
    const { mutateAsync: withdraw } = useContractWrite(
        stakeContract,
        "Withdraw"
    )
    const { mutateAsync: claim } = useContractWrite(stakeContract, "Claim")

    // const handleModals = (modal: string) => {
    //     setModalState((prevState) => ({ ...prevState, [modal]: true }))
    // }

    const style = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    }
    return (
        <Grid
            container
            // height="100vh"
            alignItems="center"
            justifyContent="center"
            direction="column"
            className="pt-10"
        >
            <Auth>
                <h1 className="text-center my-10">
                    Welcome to BFF Gram Staking Dapp
                </h1>
                <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-4/5">
                    <Box
                        className="border-4 border-blue-400 border-solid shadow flex flex-col items-center my-4 py-4 border-r-4 justify-center"
                        // sx={{
                        //     boxShadow: 3,
                        //     borderRadius: 2,
                        //     p: 2,
                        //     // width: 300,
                        //     // height: 300,
                        //     margin: "auto",
                        //     // border: "1px solid #ccc",

                        // }}
                    >
                        <h2>
                            Token Balance:{" "}
                            {(parseInt(tokenBalance) * 1e-18).toFixed(2)}{" "}
                            {symbol}
                        </h2>
                        <h2>Claimed Rewards: {(accumulated * 1e-18).toFixed(4)} {symbol}</h2>
                        <h2>Pending Rewards: {(pending * 1e-18).toFixed(2)} {symbol}</h2>
                        <h2>Staked Amount: {(staked * 1e-18).toFixed(2)} {symbol}</h2>
                        <h2>Withdrawn Amount: {(withdrawn * 1e-18).toFixed(2)} {symbol}</h2>
                        <h2>Total Delegates: {delegates?.toString()}</h2>
                        <h2>Total Pool Stake: {(poolstake * 1e-18).toFixed(2)} {symbol}</h2>
                    </Box>
                    <Box className="border-4 border-blue-400 border-solid shadow flex flex-col items-center border-r-4 my-4 py-4 justify-center">
                        <Button
                            variant="contained"
                            onClick={() =>
                                setModalState((prevState) => ({
                                    ...prevState,
                                    stake: true,
                                }))
                            }
                            className="w-[150px] h-[40px] m-2"
                        >
                            Stake
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() =>
                                setModalState((prevState) => ({
                                    ...prevState,
                                    restake: true,
                                }))
                            }
                            className="w-[150px] h-[40px] m-2"
                        >
                            Restake
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => await unstake({ args: [] })}
                            className="w-[150px] h-[40px] m-2"
                        >
                            Unstake
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => await withdraw({ args: [] })}
                            className="w-[150px] h-[40px] m-2"
                        >
                            Withdraw
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => await claim({ args: [] })}
                            className="w-[150px] h-[40px] m-2"
                        >
                            Claim
                        </Button>
                        <Modal
                            open={modalState.stake}
                            onClose={() => {
                                setModalState((prevState) => ({
                                    ...prevState,
                                    stake: false,
                                }))
                            }}
                        >
                            <Box sx={style}>
                                <Stack gap={2}>
                                    <div className="">Stake Amount</div>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                stakeAmount: e.target.value,
                                            }))
                                        }
                                        value={formData.stakeAmount}
                                        className=""
                                    />
                                    <label>Stake Time</label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                stakeTime: e.target.value,
                                            }))
                                        }
                                        value={formData.stakeTime}
                                    />
                                    {parseInt(approved) <
                                    parseFloat(formData.stakeAmount) * 1e18 ? (
                                        <Web3Button
                                            contractAddress={tokenAddress}
                                            contractAbi={erc20abi}
                                            action={async (contract) => {
                                                await contract.call("approve", [
                                                    stakeAddress,
                                                    (
                                                        parseInt(
                                                            formData.stakeAmount
                                                        ) * 1e18
                                                    ).toLocaleString(
                                                        "fullwide",
                                                        { useGrouping: false }
                                                    ),
                                                ])
                                            }}
                                        >
                                            Approve
                                        </Web3Button>
                                    ) : (
                                        <Web3Button
                                            contractAddress={stakeAddress}
                                            action={async (contract) => {
                                                await contract.call("Stake", [
                                                    (
                                                        parseFloat(
                                                            formData.stakeAmount
                                                        ) * 1e18
                                                    ).toLocaleString(
                                                        "fullwide",
                                                        { useGrouping: false }
                                                    ),
                                                    parseInt(
                                                        formData.stakeTime
                                                    ) * 86400,
                                                ])
                                            }}
                                        >
                                            Stake
                                        </Web3Button>
                                    )}
                                </Stack>
                            </Box>
                        </Modal>
                        <Modal
                            open={modalState.restake}
                            onClose={() => {
                                setModalState((prevState) => ({
                                    ...prevState,
                                    restake: false,
                                }))
                            }}
                        >
                            <Box sx={style}>
                                <Stack gap={2}>
                                    <label>Restake Amount</label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                restakeAmount: e.target.value,
                                            }))
                                        }
                                        value={formData.restakeAmount}
                                    />
                                    <label>Restake Time</label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                restakeTime: e.target.value,
                                            }))
                                        }
                                        value={formData.restakeTime}
                                    />
                                    {parseInt(approved) <
                                    parseFloat(formData.restakeAmount) *
                                        1e18 ? (
                                        <Web3Button
                                            contractAddress={tokenAddress}
                                            contractAbi={erc20abi}
                                            action={async (contract) => {
                                                await contract.call("approve", [
                                                    stakeAddress,
                                                    (
                                                        parseFloat(
                                                            formData.restakeAmount
                                                        ) * 1e18
                                                    ).toLocaleString(
                                                        "fullwide",
                                                        { useGrouping: false }
                                                    ),
                                                ])
                                            }}
                                        >
                                            Approve
                                        </Web3Button>
                                    ) : (
                                        <Web3Button
                                            contractAddress={stakeAddress}
                                            action={async (contract) => {
                                                await contract.call("ReStake", [
                                                    (
                                                        parseFloat(
                                                            formData.restakeAmount
                                                        ) * 1e18
                                                    ).toLocaleString(
                                                        "fullwide",
                                                        { useGrouping: false }
                                                    ),
                                                    parseInt(
                                                        formData.restakeTime
                                                    ) * 86400,
                                                ])
                                            }}
                                        >
                                            Restake
                                        </Web3Button>
                                    )}
                                </Stack>
                            </Box>
                        </Modal>
                    </Box>
                    {/* <Box className="space-y-4 flex flex-col">
                            <Web3Button
                                contractAddress={stakeAddress}
                                action={async (contract) => {
                                    await contract.call("Unstake")
                                }}
                                className="bg-blue-600 text-white"
                            >
                                Unstake
                            </Web3Button>
                            <Web3Button
                                contractAddress={stakeAddress}
                                action={async (contract) => {
                                    await contract.call("Withdraw")
                                }}
                            >
                                Withdraw
                            </Web3Button>
                            <Web3Button
                                contractAddress={stakeAddress}
                                action={async (contract) => {
                                    await contract.call("Claim")
                                }}
                            >
                                Claim
                            </Web3Button>
                        </Box> */}
                </Box>
            </Auth>
        </Grid>
    )
}
