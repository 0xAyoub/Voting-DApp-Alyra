import { Flex, Heading } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
    return(
        <Flex justifyContent="space-between" margin="20px">
            <Heading>Voting DApp</Heading>
            <ConnectButton/>
        </Flex>
    )
}