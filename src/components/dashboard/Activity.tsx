import { Box, Flex, Heading } from "@chakra-ui/react";
import ReactSpeedometer from "react-d3-speedometer"
import WhiteButton from "../design/WhiteButton";

export default function Activity () {
    return <Flex p={"1rem"} flexDir={'column'} gap={'0.5rem'}>
        <Heading fontSize={"2xl"}>Activity </Heading>
        <Box width={'100%'} height={'5rem'} mb = {'0.5rem'}>
            {/* <ReactSpeedometer
                height={6}
                fluidWidth = {true}
                maxSegmentLabels={2}
                customSegmentStops={[500, 777, 1000]}
                segmentColors={['rgba(58, 111, 249, 1)', 'rgba(58, 58, 90, 1)']}
                needleColor={'rgba(100, 207, 246, 1)'}
                minValue={500}
                maxValue={1000}
                value={777}
            /> */}
        </Box>
        <WhiteButton>View All Activity</WhiteButton>
    </Flex>
}


