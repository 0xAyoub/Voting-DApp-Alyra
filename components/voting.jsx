import { Flex, Heading, Textarea, Input, Text, Button, useToast, Box, Grid, Divider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import Contract from '../Voting.json'
import { ethers } from 'ethers'

export const Voting = () => {

    const { address, isConnected } = useAccount()
    const provider = useProvider() 
    const { data: signer } = useSigner()
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const toast = useToast()

    useEffect(() => {
        if(isConnected) {
          getDatas()
        }
      }, [isConnected])

    // ADD EVENT
    const [voter, setVoter] = useState(null)
    const [proposal, setProposal] = useState(null)
    const [vote, setVote] = useState(null)
    const [tallyVote, setTallyVote] = useState(null)
    const [winner, getWinner] = useState(null)

    const [proposalsIdState, getProposalsIdState] = useState(null)
    const [proposals, getProposals] = useState(null)

    const getDatas = async() => {
        const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
        let filter = {
            address: contractAddress,
            fromBlock: process.env.NEXT_PUBLIC_BLOCK

        }

        let events = await contract.queryFilter(filter)
        console.log(contractAddress)

        let proposalsIdArray = []

        events.forEach(event => {
            if(event.event === "ProposalRegistered"){
                // event.args => Id des proposals
                proposalsIdArray.push(event.args)
            }
        })
        getProposalsIdState(proposalsIdArray)

    }
    const getProposal = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, provider)

            let proposalsArray = []
    
            for (const oneProposal of proposalsIdState) {
                let array = await contract.getOneProposal(oneProposal.toString())
                proposalsArray.push(array[0].toString())
            }
            
            getProposals(proposalsArray)
        } catch (e) {
            console.log(e.message)
        }
     
    }

  
    const getWin = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            getWinner(tallyVote)            

        } catch (e) {
            console.log(e.message)
        }
    }
    const getTallyVotes =  async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.tallyVotes()
            await add.wait()
            let win = await contract.winningProposalID()
            setTallyVote(win.toString())
            toast({
                title: 'Success!',
                description: "Votes has been tallied.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })           

        } catch (e) {
            toast({
                title: 'Error!',
                description: e.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const addVoter = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.addVoter(voter)
            await add.wait()
            getDatas()
            toast({
                title: 'Success!',
                description: "You have added a voter.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            console.log(e)
        }
    }
    const addProposal = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.addProposal(proposal)
            await add.wait()
            getDatas()
            toast({
                title: 'Success!',
                description: "You have added a proposal.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            console.log(e)
        }
    }
    const addVote = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.setVote(vote)
            await add.wait()
            toast({
                title: 'Success!',
                description: "You have voted.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            console.log(e)
        
        }
    }
    

    const startVotersRegistering = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.startVotersRegistering()
            await add.wait()
            toast({
                title: 'Success!',
                description: "Proposal registering session have started.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const startRegisteringSession = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.startProposalsRegistering()
            await add.wait()
            toast({
                title: 'Success!',
                description: "Proposal registering session have started.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const endRegisteringSession = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.endProposalsRegistering()
            await add.wait()
            toast({
                title: 'Success!',
                description: "Proposal registering session is stopped.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const startVotingSession = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.startVotingSession()
            await add.wait()
            toast({
                title: 'Success!',
                description: "Voting session have started.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    const endVotingSession = async () => {
        try {
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            let add = await contract.endVotingSession()
            await add.wait()
            toast({
                title: 'Success!',
                description: "Voting session is stopped.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

        } catch (e) {
            toast({
                title: 'Error!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }


    return(

        <Flex display="block">

            <Flex justifyContent='space-evenly' borderRadius="10px" padding="20px" borderColor="grey" borderWidth="1px" marginTop="80px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block">
                <Text fontSize="20px" fontWeight="700">ADMIN</Text>
                <Flex justifyContent="space-between">
                    <Button colorScheme="green" onClick={() => startVotersRegistering()}>Start Voting Session</Button>
                    <Button colorScheme="blue" onClick={() => startRegisteringSession()}>Start Proposals Session</Button>
                    <Button colorScheme="red" onClick={() => endRegisteringSession()}>Stop Proposals Session</Button>
                    <Button colorScheme="blue" onClick={() => startVotingSession()}>Start Voting Session</Button>
                    <Button colorScheme="red" onClick={() => endVotingSession()}>Stop Voting Session</Button>
                    <Button colorScheme="purple" onClick={() => getTallyVotes()}>Tally Votes</Button>
                </Flex>
            </Flex>

            <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                    <Flex display="block">
                        <Flex borderRadius="10px" padding="20px" width="45vw" borderColor="grey" borderWidth="1px" marginTop="10px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block">
                            <Text fontSize="20px" fontWeight="500">Add a voter (only Owner)</Text>
                            <Input placeholder='Address' marginTop="10px" width="30vw" onChange={e => setVoter(e.target.value)}></Input>
                            <Button colorScheme="blue" display="block" marginTop="10px" onClick={() => addVoter()}>Add</Button>
                        </Flex>

                        <Flex borderRadius="10px" padding="20px" width="45vw" borderColor="grey" borderWidth="1px" marginTop="80px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block">
                            <Text fontSize="20px" fontWeight="500">Add proposal (only Voters)</Text>
                            <Textarea placeholder='Text' marginTop="10px" width="30vw" onChange={e => setProposal(e.target.value)}></Textarea>
                            <Button colorScheme="blue" display="block" marginTop="10px" onClick={() => addProposal()}>Add</Button>
                        </Flex>

                        <Flex borderRadius="10px" padding="20px" width="45vw" borderColor="grey" borderWidth="1px" marginTop="80px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block">
                            <Text fontSize="20px" fontWeight="500">Set vote (only Voters)</Text>
                            <Input placeholder='Id of proposal' marginTop="10px" width="30vw" onChange={e => setVote(e.target.value)}></Input>
                            <Button colorScheme="green" display="block" marginTop="10px" onClick={() => addVote()}>Set</Button>
                        </Flex>

                        <Flex borderRadius="10px" padding="20px" width="45vw" borderColor="grey" borderWidth="1px" marginTop="80px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block">
                            <Button colorScheme="green" display="block" marginTop="10px" onClick={() => getWin()}>Winner is : {winner}</Button>
                        </Flex>

                        </Flex>
                    
                    <Flex display="block">
                        <Flex borderRadius="10px" padding="20px" width="45vw" borderColor="grey" borderWidth="1px" marginTop="10px" marginLeft="20px" marginRight="20px" marginBottom="80px" display="block" height="900px">
                            <Text fontSize="20px" fontWeight="500">Get proposal :</Text>
                            <TableContainer mt="1rem">
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Proposals</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {proposals ? (
                                            proposals.map((oneProposal, index) => {
                                                    return (
                                                        
                                                        <Tr key={index}>
                                                            <Td>{index}</Td>
                                                            <Td>{oneProposal.toString()}</Td>
                                                        </Tr>
                                                    )
                                                })
                                        ) : (
                                            <Tr>
                                                <Td>
                                                    <Text>Nothing</Text>
                                                </Td>
                                            </Tr>
                                        )}
                                </Tbody>
                                </Table>
                            </TableContainer>
                            <Button colorScheme="green" display="block" marginTop="10px" onClick={() => getProposal()}>Get</Button>

                        </Flex>


                    </Flex>
            </Grid> 
        </Flex>


        
    )
}
